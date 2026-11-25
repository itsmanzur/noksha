import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { api, AsyncView, money } from '../api';
import { useConfirm } from '../providers';
import { Modal, Tabs } from '../ui';
import { EditorTopBar } from './EditorTopBar';
import { EditorSectionList } from './EditorSectionList';
import { Icon, IconButton, SECTION_ICONS } from './editorShared';

/** Width the page is laid out at in the desktop/tablet preview; the frame is scaled down to fit the stage. */
const VIRTUAL_WIDTH = { desktop: 1100, tablet: 768 };

function previewScale(device, fit) {
  const virtual = VIRTUAL_WIDTH[device];
  if (!virtual || !fit.w) {
    return 1;
  }
  return Math.min(1, Math.max(0.3, (fit.w - 40) / virtual));
}

/** Section picker groups, ordered by what the seller is trying to do. */
const TYPE_GROUPS = [
  { key: 'attention', types: ['hero', 'countdown', 'whatsapp'] },
  { key: 'trust', types: ['benefits', 'reviews', 'guarantee', 'faq', 'compare', 'table', 'text'] },
  { key: 'product', types: ['product', 'bundles', 'gallery', 'video', 'steps', 'order_form'] },
  { key: 'advanced', types: ['html'] },
];

/** Tiny CSS wireframe so sellers can see what a section looks like before adding it. */
function SectionThumb({ type }) {
  return (
    <span className={`nk-thumb nk-thumb-${type}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/** Index where a new section goes: after the selected one, else above the order form. */
function insertIndex(sections, type, selectedId) {
  const formIndex = sections.findIndex((item) => item.type === 'order_form');
  if (type === 'order_form') {
    return sections.length;
  }
  const selectedIndex = selectedId ? sections.findIndex((item) => item.id === selectedId) : -1;
  if (selectedIndex >= 0) {
    const after = selectedIndex + 1;
    return formIndex >= 0 && after > formIndex ? formIndex : after;
  }
  return formIndex >= 0 ? formIndex : sections.length;
}
const HTML_LIMIT = 20000;
const METHODS = ['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
const ITEM_LIMITS = { benefits: 6, reviews: 8, faq: 12, steps: 6 };
const SINGLE_TYPES = ['order_form', 'whatsapp'];
const BULLET_LIMIT = 8;
const COLOR_GROUPS = [
  ['colors.main', ['brand', 'brandForeground', 'accent']],
  ['colors.surface', ['canvas', 'card', 'text', 'muted', 'border']],
  ['colors.status', ['success', 'warning', 'danger']],
];
const PREVIEW_CSS = '[data-nk-section]{cursor:pointer;outline:2px solid transparent;outline-offset:-2px;transition:outline-color .15s}'
  + '[data-nk-section]:hover{outline-color:rgba(34,113,177,.45)}'
  + '[data-nk-section].nk-ed-sel{outline-color:#2271B1}'
  + '[data-nk-prop]{outline:1px dashed transparent;outline-offset:2px;min-width:1ch}'
  + '[data-nk-prop]:hover,[data-nk-prop]:focus{outline-color:rgba(34,113,177,.55);background:rgba(34,113,177,.06)}'
  + '[data-nk-prop][contenteditable="true"]{cursor:text}';

function setByPath(source, path, value) {
  const parts = String(path || '').split('.').filter(Boolean);
  if (parts.length === 0) {
    return source;
  }
  const clone = Array.isArray(source) ? source.slice() : { ...(source || {}) };
  let cursor = clone;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const next = cursor[key];
    const copy = Array.isArray(next) ? next.slice() : { ...(next || {}) };
    cursor[key] = copy;
    cursor = copy;
  }
  cursor[parts[parts.length - 1]] = value;
  return clone;
}

function blankSection(type, t) {
  const props = {
    hero: { eyebrow: '', title: t('section.hero'), subtitle: '', imageUrl: '', buttonLabel: t('editor.orderNow') },
    benefits: { title: t('section.benefits'), items: [{ title: '', text: '' }] },
    product: { title: t('section.product'), text: '', imageUrl: '', bullets: [] },
    countdown: { title: t('section.countdown'), endsAt: '' },
    reviews: { title: t('section.reviews'), items: [{ name: '', text: '', rating: 5 }] },
    faq: { title: t('section.faq'), items: [{ q: '', a: '' }] },
    guarantee: { title: t('section.guarantee'), text: '' },
    html: { html: '' },
    order_form: { title: t('section.order_form'), buttonLabel: t('editor.orderNow') },
    gallery: { title: t('section.gallery'), images: [] },
    video: { title: t('section.video'), url: '', caption: '' },
    steps: {
      title: t('section.steps'),
      items: [{ title: t('steps.s1'), text: '' }, { title: t('steps.s2'), text: '' }, { title: t('steps.s3'), text: '' }],
    },
    compare: {
      title: t('section.compare'),
      usLabel: t('compare.us'),
      themLabel: t('compare.them'),
      rows: [{ label: '', us: '✓', them: '✗' }],
    },
    whatsapp: { number: '', label: '', message: '' },
    bundles: { title: t('section.bundles'), popular: 0, showSingle: true },
    table: { title: t('section.table'), headers: [t('table.size'), t('table.chest'), t('table.length')], rows: [['M', '', ''], ['L', '', '']], note: '' },
    text: { title: '', body: '' },
  };
  return {
    id: 's_' + Math.random().toString(36).slice(2, 10),
    type,
    hidden: false,
    props: props[type],
  };
}

function chooseImage(onPick) {
  if (!window.wp || !window.wp.media) {
    return false;
  }
  const frame = window.wp.media({ title: 'Noksha', multiple: false, library: { type: 'image' } });
  frame.on('select', () => {
    const file = frame.state().get('selection').first().toJSON();
    onPick(file.url || '');
  });
  frame.open();
  return true;
}

function gatewayIssue(method, settings) {
  if (!settings || !settings.gateways) {
    return '';
  }
  const gateway = settings.gateways[method];
  if (!gateway || !gateway.enabled) {
    return 'off';
  }
  if ((method === 'manual_bkash' || method === 'manual_nagad') && !gateway.number) {
    return 'number';
  }
  if (method === 'sslcommerz' && !settings.ssl_ready) {
    return 'ssl';
  }
  return '';
}

export function Editor({ t, id, go }) {
  const confirm = useConfirm();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [page, setPage] = useState(null);
  const [saved, setSaved] = useState('');
  const [liveStatus, setLiveStatus] = useState('draft');
  const [view, setView] = useState({ kind: 'home' });
  const [device, setDevice] = useState('phone');
  const [html, setHtml] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [saving, setSaving] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [settings, setSettings] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [settingsTab, setSettingsTab] = useState('offer');
  const [addOpen, setAddOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Focus mode by default: hides the WP admin menu/bar so the preview gets the full width.
  const [fullscreen, setFullscreen] = useState(true);

  const frameRef = useRef(null);
  const scrollRef = useRef(0);
  const selectedRef = useRef('');
  const requestRef = useRef(0);
  const pageRef = useRef(null);
  const actionsRef = useRef({});
  const autosaveRef = useRef(0);
  const skipHistoryRef = useRef(false);
  const editingRef = useRef(false);
  const [toolbar, setToolbar] = useState(null);
  const deviceRef = useRef(null);
  const fitObserver = useRef(null);
  const [fit, setFit] = useState({ w: 0, h: 0 });
  const fitRef = useCallback((node) => {
    if (fitObserver.current) {
      fitObserver.current.disconnect();
      fitObserver.current = null;
    }
    if (!node || !window.ResizeObserver) {
      return;
    }
    const measure = () => setFit((prev) => (
      prev.w === node.clientWidth && prev.h === node.clientHeight ? prev : { w: node.clientWidth, h: node.clientHeight }
    ));
    fitObserver.current = new window.ResizeObserver(measure);
    fitObserver.current.observe(node);
    measure();
  }, []);

  const dirty = page ? JSON.stringify(page) !== saved : false;
  pageRef.current = page;

  function load() {
    setStatus('loading');
    api('pages/' + id).then((data) => {
      setPage(data);
      setSaved(JSON.stringify(data));
      setLiveStatus(data.status);
      setView({ kind: 'home' });
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, [id]);

  // "My sections" and "My templates".
  const [library, setLibrary] = useState([]);
  useEffect(() => {
    api('library').then((data) => setLibrary(data.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    api('settings').then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (!page || editingRef.current) {
      return undefined;
    }
    setPreviewBusy(true);
    const handle = window.setTimeout(() => {
      if (editingRef.current) {
        setPreviewBusy(false);
        return;
      }
      const request = ++requestRef.current;
      api('preview', { method: 'POST', body: page }).then((data) => {
        if (request !== requestRef.current || editingRef.current) {
          return;
        }
        try {
          const win = frameRef.current && frameRef.current.contentWindow;
          scrollRef.current = win ? win.scrollY || 0 : 0;
        } catch (err) {
          scrollRef.current = 0;
        }
        setHtml(data.html || '');
        setPreviewError(false);
        setPreviewBusy(false);
      }).catch(() => {
        if (request === requestRef.current) {
          setPreviewError(true);
          setPreviewBusy(false);
        }
      });
    }, 350);
    return () => window.clearTimeout(handle);
  }, [page]);

  useEffect(() => {
    if (!dirty) {
      return undefined;
    }
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 's') {
        event.preventDefault();
        actionsRef.current.save();
      }
      if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault();
        actionsRef.current.undo();
      }
      if ((event.ctrlKey || event.metaKey) && (String(event.key).toLowerCase() === 'y' || (String(event.key).toLowerCase() === 'z' && event.shiftKey))) {
        event.preventDefault();
        actionsRef.current.redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!page || !dirty || saving) {
      return undefined;
    }
    const handle = window.setTimeout(() => {
      autosaveRef.current += 1;
      actionsRef.current.save();
    }, 4000);
    return () => window.clearTimeout(handle);
  }, [page, dirty, saving]);

  useEffect(() => {
    document.body.classList.toggle('noksha-fullscreen', fullscreen);
    document.documentElement.classList.toggle('noksha-fullscreen', fullscreen);
    return () => {
      document.body.classList.remove('noksha-fullscreen');
      document.documentElement.classList.remove('noksha-fullscreen');
    };
  }, [fullscreen]);

  const selectedId = view.kind === 'section' ? view.id : '';
  useEffect(() => {
    selectedRef.current = selectedId;
    markSelected(selectedId, view.from !== 'preview');
    placeToolbar(selectedId);
  }, [selectedId, html, device, fit.w, fit.h]);

  function frameDoc() {
    try {
      return frameRef.current ? frameRef.current.contentDocument : null;
    } catch (err) {
      return null;
    }
  }

  function markSelected(sectionId, scroll) {
    const doc = frameDoc();
    if (!doc) {
      return;
    }
    doc.querySelectorAll('.nk-ed-sel').forEach((node) => node.classList.remove('nk-ed-sel'));
    if (!sectionId) {
      return;
    }
    const node = doc.querySelector('[data-nk-section="' + sectionId + '"]');
    if (!node) {
      return;
    }
    node.classList.add('nk-ed-sel');
    if (scroll) {
      // Scroll only the preview iframe — scrollIntoView would also scroll the whole WP admin page.
      const win = doc.defaultView;
      if (win) {
        win.scrollTo({ top: Math.max(0, node.getBoundingClientRect().top + win.scrollY - 12), behavior: 'smooth' });
      }
    }
  }

  function applyPropPath(sectionId, path, value) {
    setPage((current) => {
      if (!current) {
        return current;
      }
      pushHistory(current);
      return {
        ...current,
        sections: current.sections.map((section) => {
          if (section.id !== sectionId) {
            return section;
          }
          return { ...section, props: setByPath(section.props || {}, path, value) };
        }),
      };
    });
  }

  function placeToolbar(sectionId) {
    const doc = frameDoc();
    const frame = frameRef.current;
    if (!doc || !frame || !sectionId) {
      setToolbar(null);
      return;
    }
    const node = doc.querySelector('[data-nk-section="' + sectionId + '"]');
    if (!node) {
      setToolbar(null);
      return;
    }
    // Coordinates are relative to the .nk-device-fit wrapper; the toolbar sits outside the scaled frame.
    const scale = previewScale(device, fit);
    const deviceEl = deviceRef.current;
    const nodeRect = node.getBoundingClientRect();
    const originX = scale < 1 ? (fit.w - VIRTUAL_WIDTH[device] * scale) / 2 : (deviceEl ? deviceEl.offsetLeft : 0);
    const originY = scale < 1 ? 0 : (deviceEl ? deviceEl.offsetTop : 0);
    setToolbar({
      id: sectionId,
      top: Math.min(Math.max(8, originY + (frame.offsetTop + nodeRect.top) * scale + 8), Math.max(8, fit.h - 48)),
      left: Math.max(8, originX + (frame.offsetLeft + nodeRect.left) * scale + 8),
    });
  }

  function onFrameLoad() {
    const doc = frameDoc();
    if (!doc || !doc.head) {
      return;
    }
    const style = doc.createElement('style');
    style.textContent = PREVIEW_CSS;
    doc.head.appendChild(style);
    // Keep the floating toolbar glued to the selected section while the preview scrolls (incl. smooth scroll).
    let scrollFrame = 0;
    doc.addEventListener('scroll', () => {
      if (scrollFrame) {
        return;
      }
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        actionsRef.current.place();
      });
    }, { passive: true });
    doc.addEventListener('click', (event) => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (editable) {
        const sectionNode = editable.closest('[data-nk-section]');
        if (sectionNode) {
          actionsRef.current.pick(sectionNode.getAttribute('data-nk-section'));
        }
        return;
      }
      const node = event.target && event.target.closest ? event.target.closest('[data-nk-section]') : null;
      if (!node) {
        return;
      }
      event.preventDefault();
      actionsRef.current.pick(node.getAttribute('data-nk-section'));
    }, true);
    doc.addEventListener('focusin', (event) => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      editingRef.current = true;
      editable.setAttribute('contenteditable', 'true');
    }, true);
    doc.addEventListener('focusout', (event) => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      const sectionNode = editable.closest('[data-nk-section]');
      const sectionId = sectionNode ? sectionNode.getAttribute('data-nk-section') : '';
      const path = editable.getAttribute('data-nk-prop') || '';
      const value = (editable.textContent || '').trim();
      editable.removeAttribute('contenteditable');
      editingRef.current = false;
      if (sectionId && path) {
        applyPropPath(sectionId, path, value);
      }
    }, true);
    doc.addEventListener('keydown', (event) => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      if (event.key === 'Enter' && editable.tagName !== 'P' && !editable.closest('.nk-lead')) {
        event.preventDefault();
        editable.blur();
      }
    }, true);
    doc.addEventListener('submit', (event) => event.preventDefault(), true);
    try {
      frameRef.current.contentWindow.scrollTo(0, scrollRef.current);
    } catch (err) {
      // The preview is same-origin; ignore if the browser blocks it.
    }
    markSelected(selectedRef.current, false);
    placeToolbar(selectedRef.current);
  }

  function pushHistory(snapshot) {
    if (skipHistoryRef.current || !snapshot) {
      return;
    }
    setHistory((current) => current.concat(JSON.stringify(snapshot)).slice(-30));
    setRedoStack([]);
  }

  // The other-language link is saved by its own request, so it does not make the page "unsaved".
  function setTranslation(translation) {
    setPage((current) => ({ ...current, translation }));
    setSaved((current) => {
      try {
        return JSON.stringify({ ...JSON.parse(current), translation });
      } catch (err) {
        return current;
      }
    });
  }

  function patch(partial) {
    setPage((current) => {
      pushHistory(current);
      return { ...current, ...partial };
    });
  }

  function setSections(next) {
    setPage((current) => {
      pushHistory(current);
      return { ...current, sections: typeof next === 'function' ? next(current.sections) : next };
    });
  }

  function undo() {
    const currentPage = pageRef.current;
    if (!currentPage) {
      return;
    }
    setHistory((current) => {
      if (current.length === 0) {
        return current;
      }
      const next = current.slice();
      const raw = next.pop();
      try {
        skipHistoryRef.current = true;
        setRedoStack((redo) => redo.concat(JSON.stringify(currentPage)).slice(-30));
        setPage(JSON.parse(raw));
      } catch (err) {
        // Ignore bad history entries.
      }
      skipHistoryRef.current = false;
      return next;
    });
  }

  function redo() {
    setRedoStack((current) => {
      if (current.length === 0 || !pageRef.current) {
        return current;
      }
      const next = current.slice();
      const raw = next.pop();
      try {
        skipHistoryRef.current = true;
        setHistory((hist) => hist.concat(JSON.stringify(pageRef.current)).slice(-30));
        setPage(JSON.parse(raw));
      } catch (err) {
        // Ignore bad redo entries.
      }
      skipHistoryRef.current = false;
      return next;
    });
  }

  function openSettings(tab) {
    setSettingsTab(tab);
    setView({ kind: 'settings' });
  }

  function replaceSection(sectionId, next) {
    setSections((sections) => sections.map((item) => (item.id === sectionId ? next : item)));
    setView({ kind: 'section', id: next.id });
  }

  function insertShared(item) {
    const created = { id: 's_' + Math.random().toString(36).slice(2, 10), type: 'shared', hidden: false, props: { ref: item.id, name: item.name }, style: {} };
    const anchorId = selectedRef.current;
    setSections((sections) => {
      const next = sections.slice();
      next.splice(insertIndex(sections, item.type, anchorId), 0, created);
      return next;
    });
    setView({ kind: 'section', id: created.id });
    setAddOpen(false);
  }

  function patchSection(sectionId, props) {
    setSections((sections) => sections.map((section) => (
      section.id === sectionId ? { ...section, props: { ...section.props, ...props } } : section
    )));
  }

  function patchSectionStyle(sectionId, style) {
    setSections((sections) => sections.map((section) => (
      section.id === sectionId ? { ...section, style: { ...(section.style || {}), ...style } } : section
    )));
  }

  function reorder(from, to) {
    if (from === to || from < 0 || to < 0) {
      return;
    }
    setSections((sections) => {
      if (from >= sections.length || to >= sections.length) {
        return sections;
      }
      const next = sections.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function toggleHidden(sectionId) {
    setSections((sections) => sections.map((item) => (item.id === sectionId ? { ...item, hidden: !item.hidden } : item)));
  }

  async function removeSection(sectionId) {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('editor.removeConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (!ok) {
      return;
    }
    setSections((sections) => sections.filter((item) => item.id !== sectionId));
    setView({ kind: 'home' });
  }

  function addSection(type) {
    const created = blankSection(type, t);
    const anchorId = selectedRef.current;
    setSections((sections) => {
      const next = sections.slice();
      next.splice(insertIndex(sections, type, anchorId), 0, created);
      return next;
    });
    setView({ kind: 'section', id: created.id });
    setAddOpen(false);
  }

  function insertSaved(item) {
    const created = { ...item.section, id: 's_' + Math.random().toString(36).slice(2, 10), hidden: false };
    const anchorId = selectedRef.current;
    setSections((sections) => {
      const next = sections.slice();
      next.splice(insertIndex(sections, created.type, anchorId), 0, created);
      return next;
    });
    setView({ kind: 'section', id: created.id });
    setAddOpen(false);
  }

  async function deleteSaved(item) {
    const ok = await confirm({
      title: t('common.confirm'),
      message: (item.kind === 'shared' ? t('shared.deleteConfirm') : t('library.deleteConfirm')).replace('{name}', item.name),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (ok) {
      api('library/' + item.id, { method: 'DELETE' }).then((data) => setLibrary(data.items || [])).catch(() => {});
    }
  }

  function save(nextStatus) {
    const current = pageRef.current;
    if (!current || saving) {
      return;
    }
    const target = nextStatus || current.status;
    const body = { ...current, status: target };
    setSaving(target === 'publish' && liveStatus !== 'publish' ? 'publish' : 'save');
    setError('');
    api('pages/' + current.id, { method: 'PUT', body }).then((data) => {
      const latest = pageRef.current;
      if (JSON.stringify(latest) === JSON.stringify(current)) {
        setPage(data);
        setSaved(JSON.stringify(data));
      } else {
        const merged = { ...latest, status: data.status, link: data.link, slug: data.slug };
        setPage(merged);
        setSaved(JSON.stringify({ ...current, status: data.status, link: data.link, slug: data.slug }));
      }
      setLiveStatus(data.status);
      setSaving('');
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2500);
    }).catch((err) => {
      setError(err.message);
      setSaving('');
    });
  }

  async function leave(path) {
    if (dirty) {
      const ok = await confirm({
        title: t('common.confirm'),
        message: t('editor.leaveConfirm'),
        confirmLabel: t('common.confirm'),
        cancelLabel: t('common.cancel'),
        danger: true,
      });
      if (!ok) {
        return;
      }
    }
    setSaved(JSON.stringify(pageRef.current));
    go(path);
  }

  async function removePage() {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('pages.deleteConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (!ok) {
      return;
    }
    api('pages/' + page.id, { method: 'DELETE' }).then(() => {
      setSaved(JSON.stringify(pageRef.current));
      go('pages');
    }).catch((err) => setError(err.message));
  }

  actionsRef.current = {
    save: () => save(),
    undo,
    redo,
    pick: (sectionId) => setView({ kind: 'section', id: sectionId, from: 'preview' }),
    place: () => placeToolbar(selectedRef.current),
  };

  const scale = previewScale(device, fit);
  const deviceClass = device === 'tablet' ? 'is-tablet' : (device === 'desktop' ? 'is-desktop' : 'is-phone');

  const section = page && selectedId ? page.sections.find((item) => item.id === selectedId) : null;
  let stateText = t('editor.allSaved');
  if (saving) stateText = t('editor.saving');
  else if (dirty) stateText = t('editor.unsaved');
  else if (justSaved) stateText = t('editor.saved');

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {page ? (
        <div className={`nk-editor-shell nk-ed${fullscreen ? ' is-full' : ''}`}>
          <EditorTopBar
            t={t}
            page={page}
            liveStatus={liveStatus}
            dirty={dirty}
            saving={saving}
            stateText={stateText}
            canUndo={history.length > 0}
            canRedo={redoStack.length > 0}
            device={device}
            fullscreen={fullscreen}
            onLeave={leave}
            onTitleChange={(title) => patch({ title })}
            onUndo={undo}
            onRedo={redo}
            onToggleFullscreen={() => setFullscreen((value) => !value)}
            onDevice={setDevice}
            onSave={save}
            onSaveDraft={() => save('draft')}
            onUnpublish={() => save('draft')}
            onHistory={() => setHistoryOpen(true)}
          />
          {historyOpen ? (
            <VersionHistory
              t={t}
              pageId={page.id}
              dirty={dirty}
              live={liveStatus === 'publish'}
              onClose={() => setHistoryOpen(false)}
              onRestored={(data) => {
                setPage(data);
                setSaved(JSON.stringify(data));
                setLiveStatus(data.status);
                setHistory([]);
                setRedoStack([]);
                setView({ kind: 'home' });
              }}
            />
          ) : null}
          {error ? <div className="nk-banner nk-ed-error" role="alert">{error}</div> : null}
          <div className="nk-editor-cols nk-ed-body">
            <aside className="nk-editor-pane nk-ed-side">
              {view.kind === 'home' ? (
                <EditorSectionList
                  t={t}
                  page={page}
                  selectedId={selectedId}
                  onOpen={(sectionId) => setView({ kind: 'section', id: sectionId })}
                  onToggle={toggleHidden}
                  onReorder={reorder}
                  onAdd={() => setAddOpen(true)}
                  onOpenSettings={() => openSettings(settingsTab)}
                />
              ) : (
                <EditorInspector
                  t={t}
                  view={view}
                  section={section}
                  page={page}
                  settings={settings}
                  settingsTab={settingsTab}
                  onSettingsTab={setSettingsTab}
                  onBack={() => setView({ kind: 'home' })}
                  onPatch={patch}
                  onTranslation={setTranslation}
                  onPatchSection={patchSection}
                  onPatchStyle={patchSectionStyle}
                  onOpenSettings={openSettings}
                  onToggleHidden={toggleHidden}
                  onRemoveSection={removeSection}
                  onLibraryChange={setLibrary}
                  library={library}
                  onReplaceSection={replaceSection}
                  onRemovePage={removePage}
                  onLeave={leave}
                />
              )}
            </aside>
            <section className="nk-editor-preview nk-ed-stage" aria-label={t('editor.preview')}>
              <div className="nk-ed-stage-bar">
                <span className="nk-muted">{t('editor.previewHint')}</span>
                {previewBusy ? <span className="nk-ed-busy">{t('editor.previewUpdating')}</span> : null}
              </div>
              <div ref={fitRef} className={`nk-device-fit${scale < 1 ? ' is-scaled' : ''}`}>
              <div
                ref={deviceRef}
                className={`nk-editor-frame nk-device ${deviceClass}`}
                style={scale < 1
                  ? {
                    width: VIRTUAL_WIDTH[device],
                    maxWidth: 'none',
                    height: fit.h / scale,
                    transform: `translateX(-50%) scale(${scale})`,
                  }
                  : undefined}
              >
                {device === 'desktop' ? (
                  <div className="nk-device-bar" aria-hidden="true">
                    <i /><i /><i />
                    <span>{page.link || (window.location.origin + '/offer/' + page.slug + '/')}</span>
                  </div>
                ) : null}
                {previewError ? (
                  <div className="nk-banner">{t('editor.previewFailed')}</div>
                ) : (
                  <iframe ref={frameRef} className="nk-editor-iframe" title={t('editor.preview')} srcDoc={html} onLoad={onFrameLoad} />
                )}
              </div>
                {toolbar && section ? (
                  <div className="nk-canvas-bar" style={{ top: toolbar.top, left: toolbar.left }}>
                    <button type="button" className="nk-btn-ghost" onClick={() => {
                      const index = page.sections.findIndex((item) => item.id === section.id);
                      reorder(index, index - 1);
                    }}>{t('editor.up')}</button>
                    <button type="button" className="nk-btn-ghost" onClick={() => {
                      const index = page.sections.findIndex((item) => item.id === section.id);
                      reorder(index, index + 1);
                    }}>{t('editor.down')}</button>
                    <button type="button" className="nk-btn-ghost" onClick={() => toggleHidden(section.id)}>
                      {section.hidden ? t('editor.showSection') : t('editor.hideSection')}
                    </button>
                    <button type="button" className="nk-btn-ghost" onClick={() => setView({ kind: 'section', id: section.id })}>
                      {t('editor.section')}
                    </button>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
          <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('editor.addTitle')} size="lg">
            <p className="nk-muted">
              {section && section.type !== 'order_form'
                ? `${t('editor.addAfter')} ${t('section.' + section.type)}`
                : t('editor.addHelp')}
            </p>
            {library.some((item) => item.kind === 'shared') ? (
              <div className="nk-type-group">
                <h3 className="nk-type-group-title">{t('shared.group')}</h3>
                <ul className="nk-library-list">
                  {library.filter((item) => item.kind === 'shared').map((item) => (
                    <li key={item.id}>
                      <button type="button" className="nk-library-item" onClick={() => insertShared(item)}>
                        <span className="nk-type-icon"><Icon name="link" size={16} /></span>
                        <strong>{item.name}</strong>
                        <small>{t('section.' + item.type)}</small>
                      </button>
                      <IconButton icon="trash" label={t('shared.delete')} danger onClick={() => deleteSaved(item)} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {library.some((item) => item.kind === 'section') ? (
              <div className="nk-type-group">
                <h3 className="nk-type-group-title">{t('library.mySections')}</h3>
                <ul className="nk-library-list">
                  {library.filter((item) => item.kind === 'section').map((item) => {
                    const taken = SINGLE_TYPES.includes(item.type) && page.sections.some((row) => row.type === item.type);
                    return (
                      <li key={item.id}>
                        <button type="button" className="nk-library-item" disabled={taken} onClick={() => insertSaved(item)}>
                          <span className="nk-type-icon"><Icon name={SECTION_ICONS[item.type] || 'layout'} size={16} /></span>
                          <strong>{item.name}</strong>
                          <small>{taken ? t('editor.alreadyAdded') : t('section.' + item.type)}</small>
                        </button>
                        <IconButton icon="trash" label={t('library.delete')} danger onClick={() => deleteSaved(item)} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            {TYPE_GROUPS.map((group) => (
              <div key={group.key} className="nk-type-group">
                <h3 className="nk-type-group-title">{t('editor.group.' + group.key)}</h3>
                <div className="nk-type-grid">
                  {group.types.map((type) => {
                    const taken = SINGLE_TYPES.includes(type) && page.sections.some((item) => item.type === type);
                    return (
                      <button key={type} type="button" className="nk-type" disabled={taken} onClick={() => addSection(type)}>
                        <SectionThumb type={type} />
                        <span className="nk-type-title">
                          <span className="nk-type-icon"><Icon name={SECTION_ICONS[type]} size={16} /></span>
                          <strong>{t('section.' + type)}</strong>
                        </span>
                        <small>{taken ? t('editor.alreadyAdded') : t('sectionHelp.' + type)}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Modal>
        </div>
      ) : null}
    </AsyncView>
  );
}

function EditorInspector({
  t,
  view,
  section,
  page,
  settings,
  settingsTab,
  onSettingsTab,
  onBack,
  onPatch,
  onTranslation,
  onPatchSection,
  onPatchStyle,
  onOpenSettings,
  onToggleHidden,
  onRemoveSection,
  onRemovePage,
  onLeave,
  onLibraryChange,
  library,
  onReplaceSection,
}) {
  if (view.kind === 'section' && section) {
    return (
      <div className="nk-panel-view">
        <div className="nk-panel-head">
          <button type="button" className="nk-link-back" onClick={onBack}>
            <Icon name="back" size={16} /> {t('editor.sections')}
          </button>
          <h2>
            <span className="nk-head-icon"><Icon name={SECTION_ICONS[section.type]} /></span>
            {t('section.' + section.type)}
          </h2>
          <p className="nk-muted">{t('sectionHelp.' + section.type)}</p>
        </div>
        <div className="nk-panel-body">
          {section.hidden ? (
            <p className="nk-note"><Icon name="eyeOff" size={16} /> {t('editor.hiddenNote')}</p>
          ) : null}
          {section.type === 'shared' ? (
            <SharedBlockFields
              key={section.id}
              t={t}
              section={section}
              page={page}
              library={library || []}
              onOpen={onOpenSettings}
              onLibraryChange={onLibraryChange}
              onRefresh={() => onPatchSection(section.id, { v: Date.now() })}
              onDetach={(copy) => onReplaceSection(section.id, { ...copy, id: section.id, hidden: section.hidden })}
            />
          ) : (
            <>
              <SectionFields
                key={section.id}
                t={t}
                section={section}
                onChange={(props) => onPatchSection(section.id, props)}
                onOpen={onOpenSettings}
                offer={page.offer}
              />
              <StyleFields t={t} section={section} onChange={(style) => onPatchStyle(section.id, style)} />
              <SaveToLibrary
                key={'save-' + section.id}
                t={t}
                label={t('library.saveSection')}
                help={t('library.saveSectionHelp')}
                defaultName={t('section.' + section.type)}
                onSave={(name) => api('library', { method: 'POST', body: { kind: 'section', name, section } }).then((data) => onLibraryChange && onLibraryChange(data.items || []))}
              />
              {section.type !== 'order_form' ? (
                <SaveToLibrary
                  key={'share-' + section.id}
                  t={t}
                  label={t('shared.make')}
                  help={t('shared.makeHelp')}
                  defaultName={t('section.' + section.type)}
                  onSave={(name) => api('library', { method: 'POST', body: { kind: 'shared', name, section } }).then((data) => {
                    if (onLibraryChange) onLibraryChange(data.items || []);
                    onReplaceSection(section.id, { id: section.id, type: 'shared', hidden: section.hidden, props: { ref: data.id, name }, style: {} });
                  })}
                />
              ) : null}
            </>
          )}
          <div className="nk-panel-foot">
            <button type="button" className="nk-btn-ghost nk-btn-icon" onClick={() => onToggleHidden(section.id)}>
              <Icon name={section.hidden ? 'eye' : 'eyeOff'} size={16} /> {section.hidden ? t('editor.showSection') : t('editor.hideSection')}
            </button>
            <button type="button" className="nk-btn-danger nk-btn-icon" onClick={() => onRemoveSection(section.id)}>
              <Icon name="trash" size={16} /> {t('editor.deleteSection')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view.kind === 'section' && !section) {
    return (
      <div className="nk-panel-view">
        <p className="nk-muted">{t('editor.missingSection')}</p>
      </div>
    );
  }

  const settingsTabs = [
    {
      value: 'offer',
      label: t('editor.offerTitle'),
      content: (
        <>
          <p className="nk-muted">{t('offer.helpIntro')}</p>
          <OfferFields
            t={t}
            offer={page.offer}
            onChange={(offer) => onPatch({ offer })}
            afterProduct={<WcSuggestions t={t} page={page} onPatchSection={onPatchSection} />}
          />
        </>
      ),
    },
    {
      value: 'checkout',
      label: t('editor.checkoutTitle'),
      content: <CheckoutFields t={t} checkout={page.checkout} settings={settings} onChange={(checkout) => onPatch({ checkout })} onSetup={() => onLeave('payments')} />,
    },
    {
      value: 'seo',
      label: t('editor.seoTab'),
      content: <PageSeoFields t={t} page={page} onChange={onPatch} />,
    },
    {
      value: 'ab',
      label: t('ab.title'),
      content: <PageAbFields t={t} page={page} onChange={onPatch} />,
    },
    {
      value: 'colors',
      label: t('editor.colorsTitle'),
      content: (
        <>
          <p className="nk-muted">{t('editor.colorsHelp')}</p>
          <ColorFields t={t} tokens={page.tokens} onChange={(tokens) => onPatch({ tokens })} />
        </>
      ),
    },
    {
      value: 'page',
      label: t('editor.pageTitle'),
      content: (
        <>
          <PageMetaFields t={t} page={page} onChange={onPatch} onDelete={onRemovePage} />
          <TranslationFields t={t} page={page} onLinked={onTranslation} onOpen={(id) => onLeave('pages/' + id)} />
          <SaveToLibrary
            t={t}
            label={t('library.savePage')}
            help={t('library.savePageHelp')}
            defaultName={page.title}
            onSave={(name) => api('library', { method: 'POST', body: { kind: 'page', name, pageId: page.id, page: { language: page.language, sections: page.sections, checkout: page.checkout, offer: page.offer, tokens: page.tokens } } }).then((data) => onLibraryChange && onLibraryChange(data.items || []))}
          />
        </>
      ),
    },
  ];

  return (
    <div className="nk-panel-view nk-editor-inspector">
      <div className="nk-panel-head">
        <button type="button" className="nk-link-back" onClick={onBack}>
          <Icon name="back" size={16} /> {t('editor.sections')}
        </button>
        <h2>{t('editor.pageSettings')}</h2>
        <p className="nk-muted">{t('editor.settingsHelp')}</p>
      </div>
      <Tabs tabs={settingsTabs} value={settingsTab} onChange={onSettingsTab} />
    </div>
  );
}

function Field({ label, help, children }) {
  return (
    <div className="nk-ed-field">
      <label>
        <span className="nk-ed-label">{label}</span>
        {children}
      </label>
      {help ? <p className="nk-help">{help}</p> : null}
    </div>
  );
}

function TextField({ label, help, value, onChange, multiline, maxLength = 120, placeholder }) {
  return (
    <Field label={label} help={help}>
      {multiline ? (
        <textarea rows="3" value={value || ''} maxLength={maxLength} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type="text" value={value || ''} maxLength={maxLength} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}

function MoneyField({ label, help, value, onChange }) {
  return (
    <Field label={label} help={help}>
      <span className="nk-money">
        <span aria-hidden="true">৳</span>
        <input type="number" min="0" step="1" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value === '' ? 0 : Math.max(0, Number(event.target.value)))} />
      </span>
    </Field>
  );
}

function ImageField({ t, label, help, value, onChange }) {
  const [paste, setPaste] = useState(false);
  function pick() {
    if (!chooseImage(onChange)) {
      setPaste(true);
    }
  }
  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label">{label}</span>
      {value ? (
        <div className="nk-image">
          <img src={value} alt="" />
          <div className="nk-image-tools">
            <button type="button" className="nk-btn-ghost" onClick={pick}>{t('image.change')}</button>
            <button type="button" className="nk-btn-danger" onClick={() => onChange('')}>{t('image.remove')}</button>
          </div>
        </div>
      ) : (
        <button type="button" className="nk-image-empty" onClick={pick}>
          <Icon name="image" size={22} />
          <span>{t('editor.chooseImage')}</span>
        </button>
      )}
      {paste ? (
        <input type="url" className="nk-image-url" placeholder="https://" value={value || ''} onChange={(event) => onChange(event.target.value)} aria-label={t('image.paste')} />
      ) : (
        <button type="button" className="nk-text-btn" onClick={() => setPaste(true)}>{t('image.paste')}</button>
      )}
      {help ? <p className="nk-help">{help}</p> : null}
    </div>
  );
}

function Switch({ checked, onChange, disabled, label }) {
  return (
    <label className={`nk-switch${disabled ? ' is-disabled' : ''}`}>
      <input type="checkbox" role="switch" checked={Boolean(checked)} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span className="nk-switch-track" aria-hidden="true" />
      {label ? <span className="nk-switch-label">{label}</span> : null}
    </label>
  );
}

function Choice({ label, value, options, onChange }) {
  return (
    <div className="nk-choice" role="radiogroup" aria-label={label}>
      {options.map(([key, text]) => (
        <button key={key} type="button" role="radio" aria-checked={value === key} className={value === key ? 'is-active' : ''} onClick={() => onChange(key)}>{text}</button>
      ))}
    </div>
  );
}

/** Layout variants per section type (first = default). Mirrors Sanitizer::LAYOUTS. */
const STYLE_LAYOUTS = {
  hero: ['split', 'center', 'overlay'],
  benefits: ['cards', 'list', 'numbers'],
  reviews: ['slider', 'grid'],
  product: ['side', 'reverse', 'stacked'],
  gallery: ['slider', 'grid'],
};
const STYLE_BACKGROUNDS = ['none', 'soft', 'warm', 'dark', 'brand', 'gradient'];
const STYLE_SPACINGS = ['compact', 'normal', 'roomy'];
const STYLE_SHOWS = ['all', 'mobile', 'desktop'];
const STYLE_WHENS = ['always', 'sale', 'not_sale', 'in_stock', 'sold_out', 'dates'];
const STYLE_SIZES = ['sm', 'md', 'lg', 'xl'];
const STYLE_SIZE_SCALE = { sm: 0.88, md: 1, lg: 1.15, xl: 1.3 };
const STYLE_RATIOS = ['auto', 'square', '4-3', '16-9', '3-4'];
const STYLE_FITS = ['cover', 'contain'];
const STYLE_ROUNDS = ['none', 'md', 'lg', 'full'];
const STYLE_IMAGE_TYPES = ['hero', 'product', 'gallery'];

/** Approximate heading size in px at phone and desktop widths, for the size hint. */
function headingRange(type, size) {
  const scale = STYLE_SIZE_SCALE[size] || 1;
  const [low, high] = type === 'hero' ? [28, 52] : [22, 32];
  return Math.round(low * scale) + '–' + Math.round(high * scale) + 'px';
}

/** Look & feel: layout variant, background band and spacing for one section. */
/**
 * Other language: link this page to the same page in Bangla or English. Both
 * pages then show a language switch. "Make the copy" creates the other page.
 */
function TranslationFields({ t, page, onLinked, onOpen }) {
  const confirm = useConfirm();
  const other = page.translation || null;
  const otherLang = page.language === 'bn' ? 'en' : 'bn';
  const [pages, setPages] = useState(null);
  const [pick, setPick] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (other) {
      return;
    }
    api('pages?per_page=100').then((data) => setPages((data.pages || []).filter((row) => row.id !== page.id && row.language === otherLang))).catch(() => setPages([]));
  }, [page.id, other ? other.id : 0, otherLang]);

  function run(request) {
    setBusy(true);
    setMessage('');
    return request
      .catch((err) => {
        setMessage(err.message || t('common.error'));
        return null;
      })
      .then((data) => {
        setBusy(false);
        return data;
      });
  }

  async function makeCopy() {
    const ok = await confirm({
      title: t('translation.copy.' + otherLang),
      message: t('translation.copyConfirm'),
      confirmLabel: t('translation.copy.' + otherLang),
      cancelLabel: t('common.cancel'),
    });
    if (!ok) {
      return;
    }
    const data = await run(api('pages/' + page.id + '/translation/copy', { method: 'POST' }));
    if (data) {
      onLinked(data.translation);
      setMessage(t('translation.copied'));
    }
  }

  async function link(id) {
    const data = await run(api('pages/' + page.id + '/translation', { method: 'POST', body: { pageId: id } }));
    if (data) {
      onLinked(data.translation);
    }
  }

  return (
    <div className="nk-translation">
      <h3 className="nk-group-title">{t('translation.title')}</h3>
      <p className="nk-help">{t('translation.help')}</p>
      {other ? (
        <div className="nk-translation-linked">
          <p>
            <strong>{t('translation.lang.' + other.language)}:</strong> {other.title}
            {other.status !== 'publish' ? <span className="nk-muted"> ({t('translation.draft')})</span> : null}
          </p>
          <div className="nk-library-actions">
            <button type="button" className="nk-btn-ghost" onClick={() => onOpen(other.id)}>{t('translation.open')}</button>
            <button type="button" className="nk-btn-ghost" disabled={busy} onClick={() => link(0)}>{t('translation.unlink')}</button>
          </div>
        </div>
      ) : (
        <>
          <button type="button" className="nk-btn" disabled={busy} onClick={makeCopy}>{t('translation.copy.' + otherLang)}</button>
          {pages && pages.length ? (
            <div className="nk-translation-pick">
              <label className="nk-field">
                <span>{t('translation.pick.' + otherLang)}</span>
                <select value={pick} onChange={(event) => setPick(event.target.value)}>
                  <option value="">—</option>
                  {pages.map((row) => <option key={row.id} value={row.id}>{row.title}</option>)}
                </select>
              </label>
              <button type="button" className="nk-btn-ghost" disabled={busy || !pick} onClick={() => link(Number(pick))}>{t('translation.link')}</button>
            </div>
          ) : null}
        </>
      )}
      {message ? <p className="nk-muted" role="status">{message}</p> : null}
    </div>
  );
}

/**
 * Version history: earlier states of the page, newest first, each with a Restore button.
 */
function VersionHistory({ t, pageId, dirty, live, onClose, onRestored }) {
  const confirm = useConfirm();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(0);
  useEffect(() => {
    api('pages/' + pageId + '/versions').then((data) => setRows(data.versions || [])).catch((err) => setError(err.message || t('common.error')));
  }, [pageId]);

  async function restore(row) {
    const ok = await confirm({
      title: t('versions.restore'),
      message: [t('versions.confirm'), live ? t('versions.confirmLive') : '', dirty ? t('versions.confirmDirty') : ''].filter(Boolean).join(' '),
      confirmLabel: t('versions.restore'),
      cancelLabel: t('common.cancel'),
    });
    if (!ok) {
      return;
    }
    setBusy(row.id);
    setError('');
    api('pages/' + pageId + '/versions/' + row.id + '/restore', { method: 'POST' })
      .then((data) => {
        setRows(data.versions || []);
        onRestored(data.page);
        onClose();
      })
      .catch((err) => setError(err.message || t('common.error')))
      .then(() => setBusy(0));
  }

  return (
    <Modal open onClose={onClose} title={t('versions.title')} size="md">
      <p className="nk-muted">{t('versions.help')}</p>
      {error ? <p className="nk-banner" role="alert">{error}</p> : null}
      {rows === null && !error ? <p className="nk-muted">{t('common.loading')}</p> : null}
      {rows && rows.length === 0 ? <p className="nk-muted">{t('versions.none')}</p> : null}
      {rows && rows.length ? (
        <ul className="nk-version-list">
          {rows.map((row) => (
            <li key={row.id} className="nk-version-row">
              <div>
                <strong>{new Date(row.time).toLocaleString()}</strong>
                <small>
                  {t('versions.reason.' + row.reason)}
                  {row.user ? ' · ' + row.user : ''}
                  {' · ' + t('versions.sections').replace('{n}', String(row.sections))}
                </small>
              </div>
              <button type="button" className="nk-btn-ghost" disabled={busy !== 0} onClick={() => restore(row)}>
                {busy === row.id ? t('common.loading') : t('versions.restore')}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Modal>
  );
}

/**
 * Table: column headings and rows of short text. The first column reads as the row's name.
 */
function TableFields({ t, props, onChange }) {
  const headers = Array.isArray(props.headers) && props.headers.length ? props.headers : [''];
  const rows = Array.isArray(props.rows) ? props.rows : [];
  const width = headers.length;
  const setHeader = (i, value) => onChange({ headers: headers.map((h, j) => (j === i ? value : h)) });
  const setCell = (r, c, value) => onChange({ rows: rows.map((row, i) => (i === r ? headers.map((_, j) => (j === c ? value : row[j] || '')) : row)) });
  return (
    <div className="nk-table-edit">
      <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
      <div className="nk-table-grid" style={{ gridTemplateColumns: 'repeat(' + width + ', minmax(70px, 1fr)) 32px' }}>
        {headers.map((header, i) => (
          <input key={'h' + i} className="nk-table-head" aria-label={t('table.heading').replace('{n}', String(i + 1))} value={header} maxLength={60} onChange={(event) => setHeader(i, event.target.value)} />
        ))}
        <span />
        {rows.map((row, r) => (
          <div key={'r' + r} className="nk-table-row-edit" style={{ display: 'contents' }}>
            {headers.map((_, c) => (
              <input key={c} aria-label={t('table.cell').replace('{row}', String(r + 1)).replace('{col}', String(c + 1))} value={row[c] || ''} maxLength={80} onChange={(event) => setCell(r, c, event.target.value)} />
            ))}
            <IconButton icon="trash" label={t('table.removeRow')} onClick={() => onChange({ rows: rows.filter((__, i) => i !== r) })} />
          </div>
        ))}
      </div>
      <div className="nk-library-actions">
        {rows.length < 20 ? <button type="button" className="nk-btn-ghost" onClick={() => onChange({ rows: rows.concat([headers.map(() => '')]) })}>{t('table.addRow')}</button> : null}
        {width < 6 ? <button type="button" className="nk-btn-ghost" onClick={() => onChange({ headers: headers.concat(''), rows: rows.map((row) => row.concat('')) })}>{t('table.addColumn')}</button> : null}
        {width > 1 ? <button type="button" className="nk-btn-ghost" onClick={() => onChange({ headers: headers.slice(0, -1), rows: rows.map((row) => row.slice(0, width - 1)) })}>{t('table.removeColumn')}</button> : null}
      </div>
      <TextField label={t('table.note')} value={props.note} multiline maxLength={300} onChange={(note) => onChange({ note })} />
    </div>
  );
}

/**
 * Formatted text: bold, italic, lists, links and a small heading. The page keeps
 * only these (the server removes anything else).
 */
function RichTextField({ t, value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);
  const run = (command, arg) => {
    if (ref.current) {
      ref.current.focus();
    }
    document.execCommand(command, false, arg);
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };
  const link = () => {
    const url = window.prompt(t('rich.linkPrompt'), 'https://');
    if (url) {
      run('createLink', url);
    }
  };
  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label" id="nk-rich-label">{t('rich.body')}</span>
      <div className="nk-rich-toolbar" role="toolbar" aria-label={t('rich.body')}>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('bold')} aria-label={t('rich.bold')}><strong>B</strong></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('italic')} aria-label={t('rich.italic')}><em>I</em></button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('insertUnorderedList')} aria-label={t('rich.list')}>• —</button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('insertOrderedList')} aria-label={t('rich.numbers')}>1.</button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => run('formatBlock', 'h3')} aria-label={t('rich.heading')}>H</button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={link} aria-label={t('rich.link')}>🔗</button>
      </div>
      <div
        ref={ref}
        className="nk-rich-input"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={t('rich.body')}
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
      <p className="nk-help">{t('rich.help')}</p>
    </div>
  );
}

/**
 * A shared block on this page: edit the library copy, then save it for every
 * page that shows it. "Make it this page's own" turns it back into a normal section.
 */
function SharedBlockFields({ t, section, page, library, onOpen, onLibraryChange, onRefresh, onDetach }) {
  const item = library.find((row) => row.id === (section.props || {}).ref && row.kind === 'shared');
  const [draft, setDraft] = useState(item ? item.section : null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setDraft(item ? item.section : null);
  }, [item ? item.id : '']);

  if (!item || !draft) {
    return <p className="nk-banner" role="alert">{t('shared.missing')}</p>;
  }

  function save() {
    setSaving(true);
    api('library/' + item.id, { method: 'PUT', body: { section: draft } })
      .then((data) => {
        if (onLibraryChange) onLibraryChange(data.items || []);
        setMessage(t('shared.saved').replace('{n}', String(data.pages || 0)));
        onRefresh();
      })
      .catch((err) => setMessage(err.message || t('common.error')))
      .then(() => setSaving(false));
  }

  return (
    <div className="nk-shared-block">
      <p className="nk-note"><Icon name="link" size={16} /> {t('shared.note').replace('{name}', item.name)}</p>
      <SectionFields
        t={t}
        section={draft}
        onChange={(props) => setDraft((current) => ({ ...current, props: { ...current.props, ...props } }))}
        onOpen={onOpen}
        offer={page.offer}
      />
      <StyleFields t={t} section={draft} onChange={(style) => setDraft((current) => ({ ...current, style: { ...(current.style || {}), ...style } }))} />
      <div className="nk-library-actions">
        <button type="button" className="nk-btn" disabled={saving} onClick={save}>{t('shared.save')}</button>
        <button type="button" className="nk-btn-ghost" onClick={() => onDetach(draft)}>{t('shared.detach')}</button>
      </div>
      {message ? <p className="nk-muted" role="status">{message}</p> : null}
    </div>
  );
}

/**
 * "Save to my sections" / "Save as my template": a name, then save.
 */
function SaveToLibrary({ t, label, help, defaultName, onSave }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName || '');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  function submit() {
    setState('saving');
    Promise.resolve(onSave(name.trim()))
      .then(() => { setState('saved'); setOpen(false); setMessage(t('library.saved')); })
      .catch((err) => { setState('idle'); setMessage(err.message || t('common.error')); });
  }
  return (
    <div className="nk-library-save">
      {open ? (
        <>
          <label className="nk-field">
            <span>{t('library.name')}</span>
            <input type="text" value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
          </label>
          <div className="nk-library-actions">
            <button type="button" className="nk-btn" disabled={!name.trim() || state === 'saving'} onClick={submit}>{t('library.save')}</button>
            <button type="button" className="nk-btn-ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</button>
          </div>
        </>
      ) : (
        <button type="button" className="nk-btn-ghost nk-btn-icon" onClick={() => { setOpen(true); setMessage(''); setName(defaultName || ''); }}>
          <Icon name="plus" size={16} /> {label}
        </button>
      )}
      {help ? <p className="nk-help">{help}</p> : null}
      {message ? <p className="nk-muted" role="status">{message}</p> : null}
    </div>
  );
}

function StyleFields({ t, section, onChange }) {
  if (SINGLE_TYPES.includes(section.type)) {
    return null;
  }
  const style = section.style || {};
  const layouts = STYLE_LAYOUTS[section.type] || [];
  const layout = layouts.includes(style.layout) ? style.layout : layouts[0];
  const bg = STYLE_BACKGROUNDS.includes(style.bg) ? style.bg : 'none';
  const space = STYLE_SPACINGS.includes(style.space) ? style.space : 'normal';
  const size = STYLE_SIZES.includes(style.size) ? style.size : 'md';
  const ratio = STYLE_RATIOS.includes(style.ratio) ? style.ratio : 'auto';
  const fit = STYLE_FITS.includes(style.fit) ? style.fit : 'cover';
  const round = STYLE_ROUNDS.includes(style.round) ? style.round : 'md';
  const show = STYLE_SHOWS.includes(style.show) ? style.show : 'all';
  const when = STYLE_WHENS.includes(style.when) ? style.when : 'always';
  const hasImage = STYLE_IMAGE_TYPES.includes(section.type);
  return (
    <div className="nk-style-box">
      <h3 className="nk-group-title">{t('look.title')}</h3>
      {layouts.length > 1 ? (
        <Field label={t('look.layout')}>
          <Choice label={t('look.layout')} value={layout} options={layouts.map((key) => [key, t('look.layout.' + key)])} onChange={(value) => onChange({ layout: value })} />
        </Field>
      ) : null}
      <Field label={t('look.background')}>
        <div className="nk-swatches" role="radiogroup" aria-label={t('look.background')}>
          {STYLE_BACKGROUNDS.map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={bg === key}
              title={t('look.bg.' + key)}
              className={`nk-swatch nk-swatch-${key}${bg === key ? ' is-active' : ''}`}
              onClick={() => onChange({ bg: key })}
            >
              <span className="nk-sr">{t('look.bg.' + key)}</span>
            </button>
          ))}
        </div>
      </Field>
      <Field label={t('look.show')} help={t('look.showHelp')}>
        <Choice label={t('look.show')} value={show} options={STYLE_SHOWS.map((key) => [key, t('look.show.' + key)])} onChange={(value) => onChange({ show: value })} />
      </Field>
      <label className="nk-field">
        <span>{t('look.when')}</span>
        <select value={when} onChange={(event) => onChange({ when: event.target.value })}>
          {STYLE_WHENS.map((key) => <option key={key} value={key}>{t('look.when.' + key)}</option>)}
        </select>
      </label>
      {when === 'dates' ? (
        <div className="nk-when-dates">
          <label className="nk-field">
            <span>{t('look.from')}</span>
            <input type="datetime-local" value={style.from || ''} onChange={(event) => onChange({ from: event.target.value })} />
          </label>
          <label className="nk-field">
            <span>{t('look.to')}</span>
            <input type="datetime-local" value={style.to || ''} onChange={(event) => onChange({ to: event.target.value })} />
          </label>
        </div>
      ) : null}
      {when !== 'always' ? <p className="nk-help">{t('look.whenHelp')}</p> : null}
      <Field label={t('look.spacing')}>
        <Choice label={t('look.spacing')} value={space} options={STYLE_SPACINGS.map((key) => [key, t('look.space.' + key)])} onChange={(value) => onChange({ space: value })} />
      </Field>
      <Field label={t('look.textSize')} help={t('look.textSizeHint').replace('{range}', headingRange(section.type, size))}>
        <Choice label={t('look.textSize')} value={size} options={STYLE_SIZES.map((key) => [key, t('look.size.' + key)])} onChange={(value) => onChange({ size: value })} />
      </Field>
      {hasImage ? (
        <>
          <h3 className="nk-group-title">{t('look.image')}</h3>
          <Field label={t('look.ratio')}>
            <Choice label={t('look.ratio')} value={ratio} options={STYLE_RATIOS.map((key) => [key, t('look.ratio.' + key)])} onChange={(value) => onChange({ ratio: value })} />
          </Field>
          <Field label={t('look.fit')}>
            <Choice label={t('look.fit')} value={fit} options={STYLE_FITS.map((key) => [key, t('look.fit.' + key)])} onChange={(value) => onChange({ fit: value })} />
          </Field>
          <Field label={t('look.round')}>
            <Choice label={t('look.round')} value={round} options={STYLE_ROUNDS.map((key) => [key, t('look.round.' + key)])} onChange={(value) => onChange({ round: value })} />
          </Field>
        </>
      ) : null}
    </div>
  );
}

function SectionFields({ t, section, onChange, onOpen, offer }) {
  const props = section.props;
  const type = section.type;
  return (
    <div className="nk-form-stack">
      {type === 'table' ? <TableFields t={t} props={props} onChange={onChange} /> : null}
      {type === 'text' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <RichTextField t={t} value={props.body || ''} onChange={(body) => onChange({ body })} />
        </>
      ) : null}
      {type === 'bundles' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <Switch checked={props.showSingle !== false} label={t('bundles.showSingle')} onChange={(showSingle) => onChange({ showSingle })} />
          <label className="nk-field">
            <span>{t('bundles.popular')}</span>
            <select value={props.popular || 0} onChange={(event) => onChange({ popular: Number(event.target.value) })}>
              <option value={0}>{t('bundles.popularNone')}</option>
              {[1].concat(((offer && offer.tiers) || []).map((tier) => Number(tier.qty))).map((qty) => (
                <option key={qty} value={qty}>{t('bundles.pieces').replace('{n}', String(qty))}</option>
              ))}
            </select>
          </label>
          <p className="nk-help">{t('bundles.help')}</p>
          <button type="button" className="nk-jump" onClick={() => onOpen('offer')}>{t('bundles.editSteps')}</button>
        </>
      ) : null}
      {type !== 'html' && type !== 'whatsapp' ? <p className="nk-help nk-token-help">{t('tokens.help')}</p> : null}
      {type === 'hero' ? (
        <>
          <TextField label={t('prop.eyebrow')} help={t('help.eyebrow')} value={props.eyebrow} onChange={(eyebrow) => onChange({ eyebrow })} />
          <TextField label={t('prop.title')} value={props.title} maxLength={180} onChange={(title) => onChange({ title })} />
          <TextField label={t('prop.subtitle')} value={props.subtitle} multiline maxLength={800} onChange={(subtitle) => onChange({ subtitle })} />
          <TextField label={t('prop.button')} help={t('help.button')} value={props.buttonLabel} maxLength={40} onChange={(buttonLabel) => onChange({ buttonLabel })} />
          <ImageField t={t} label={t('prop.image')} value={props.imageUrl} onChange={(imageUrl) => onChange({ imageUrl })} />
        </>
      ) : null}
      {type === 'product' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <TextField label={t('prop.text')} value={props.text} multiline maxLength={800} onChange={(text) => onChange({ text })} />
          <ImageField t={t} label={t('prop.image')} value={props.imageUrl} onChange={(imageUrl) => onChange({ imageUrl })} />
          <BulletsEditor t={t} bullets={props.bullets || []} onChange={(bullets) => onChange({ bullets })} />
          <button type="button" className="nk-jump" onClick={() => onOpen('offer')}>
            <Icon name="tag" size={16} /> <span>{t('help.productPrice')}</span> <Icon name="next" size={16} />
          </button>
        </>
      ) : null}
      {type === 'countdown' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <Field label={t('prop.endsAt')} help={t('help.endsAt')}>
            <input type="datetime-local" value={props.endsAt || ''} onChange={(event) => onChange({ endsAt: event.target.value })} />
          </Field>
        </>
      ) : null}
      {type === 'guarantee' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <TextField label={t('prop.text')} value={props.text} multiline maxLength={800} onChange={(text) => onChange({ text })} />
        </>
      ) : null}
      {type === 'order_form' ? (
        <>
          <TextField label={t('prop.title')} value={props.title} onChange={(title) => onChange({ title })} />
          <TextField label={t('prop.button')} value={props.buttonLabel} maxLength={40} onChange={(buttonLabel) => onChange({ buttonLabel })} />
          <button type="button" className="nk-jump" onClick={() => onOpen('checkout')}>
            <Icon name="card" size={16} /> <span>{t('help.orderForm')}</span> <Icon name="next" size={16} />
          </button>
        </>
      ) : null}
      {type === 'gallery' ? (
        <>
          <TextField label={t('prop.sectionTitle')} value={props.title} onChange={(title) => onChange({ title })} />
          <GalleryEditor t={t} images={props.images || []} onChange={(images) => onChange({ images })} />
        </>
      ) : null}
      {type === 'video' ? (
        <>
          <TextField label={t('prop.sectionTitle')} value={props.title} onChange={(title) => onChange({ title })} />
          <TextField label={t('prop.videoUrl')} help={t('help.videoUrl')} value={props.url} maxLength={300} onChange={(url) => onChange({ url })} />
          <TextField label={t('prop.caption')} value={props.caption} maxLength={160} onChange={(caption) => onChange({ caption })} />
        </>
      ) : null}
      {type === 'compare' ? (
        <>
          <TextField label={t('prop.sectionTitle')} value={props.title} onChange={(title) => onChange({ title })} />
          <div className="nk-two">
            <TextField label={t('prop.usLabel')} value={props.usLabel} maxLength={40} onChange={(usLabel) => onChange({ usLabel })} />
            <TextField label={t('prop.themLabel')} value={props.themLabel} maxLength={40} onChange={(themLabel) => onChange({ themLabel })} />
          </div>
          <CompareEditor t={t} rows={props.rows || []} onChange={(rows) => onChange({ rows })} />
        </>
      ) : null}
      {type === 'whatsapp' ? (
        <>
          <TextField label={t('prop.waNumber')} help={t('help.waNumber')} value={props.number} maxLength={20} onChange={(number) => onChange({ number })} />
          <TextField label={t('prop.waLabel')} value={props.label} maxLength={40} onChange={(label) => onChange({ label })} />
          <TextField label={t('prop.waMessage')} help={t('help.waMessage')} value={props.message} multiline maxLength={200} onChange={(message) => onChange({ message })} />
        </>
      ) : null}
      {type === 'html' ? (
        <Field label={t('prop.html')} help={t('help.htmlSafe')}>
          <textarea
            className="nk-code"
            rows="14"
            spellCheck="false"
            dir="ltr"
            value={props.html || ''}
            maxLength={HTML_LIMIT}
            placeholder={'<div style="text-align:center">\n  <h2>…</h2>\n</div>'}
            onChange={(event) => onChange({ html: event.target.value })}
          />
        </Field>
      ) : null}
      {type === 'benefits' || type === 'reviews' || type === 'faq' || type === 'steps' ? (
        <>
          <TextField label={t('prop.sectionTitle')} value={props.title} onChange={(title) => onChange({ title })} />
          <ItemsEditor t={t} type={type} items={props.items || []} onChange={(items) => onChange({ items })} />
        </>
      ) : null}
    </div>
  );
}

function GalleryEditor({ t, images, onChange }) {
  const limit = 8;
  function add() {
    if (!chooseImage((url) => onChange(images.concat({ url, alt: '' })))) {
      const url = window.prompt('https://');
      if (url) {
        onChange(images.concat({ url, alt: '' }));
      }
    }
  }
  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label">{t('prop.photos')}</span>
      <div className="nk-photo-grid">
        {images.map((image, index) => (
          <div key={index} className="nk-photo-cell">
            <img src={image.url} alt="" />
            <IconButton icon="trash" danger label={t('editor.remove')} onClick={() => onChange(images.filter((_, i) => i !== index))} />
          </div>
        ))}
      </div>
      {images.length < limit ? (
        <button type="button" className="nk-add-row" onClick={add}><Icon name="plus" size={16} /> {t('prop.addPhoto')}</button>
      ) : (
        <p className="nk-help">{t('items.limit').replace('{n}', String(limit))}</p>
      )}
    </div>
  );
}

function CompareEditor({ t, rows, onChange }) {
  const limit = 8;
  function update(index, partial) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }
  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label">{t('prop.rows')}</span>
      <div className="nk-items">
        {rows.map((row, index) => (
          <div key={index} className="nk-item is-open">
            <div className="nk-item-body">
              <TextField label={t('prop.feature')} value={row.label} maxLength={80} onChange={(label) => update(index, { label })} />
              <div className="nk-two">
                <TextField label={t('prop.us')} value={row.us} maxLength={30} onChange={(us) => update(index, { us })} />
                <TextField label={t('prop.them')} value={row.them} maxLength={30} onChange={(them) => update(index, { them })} />
              </div>
              <button type="button" className="nk-text-btn" onClick={() => onChange(rows.filter((_, i) => i !== index))}>{t('editor.remove')}</button>
            </div>
          </div>
        ))}
      </div>
      {rows.length < limit ? (
        <button type="button" className="nk-add-row" onClick={() => onChange(rows.concat({ label: '', us: '✓', them: '✗' }))}><Icon name="plus" size={16} /> {t('prop.addRow')}</button>
      ) : (
        <p className="nk-help">{t('items.limit').replace('{n}', String(limit))}</p>
      )}
    </div>
  );
}

function BulletsEditor({ t, bullets, onChange }) {
  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label">{t('prop.bullets')}</span>
      <div className="nk-bullets">
        {bullets.map((bullet, index) => (
          <div key={index} className="nk-bullet">
            <input type="text" value={bullet} maxLength={160} aria-label={t('prop.bullets') + ' ' + (index + 1)} onChange={(event) => onChange(bullets.map((row, i) => (i === index ? event.target.value : row)))} />
            <IconButton icon="trash" danger label={t('editor.remove')} onClick={() => onChange(bullets.filter((_, i) => i !== index))} />
          </div>
        ))}
      </div>
      {bullets.length < BULLET_LIMIT ? (
        <button type="button" className="nk-add-row" onClick={() => onChange(bullets.concat(''))}><Icon name="plus" size={16} /> {t('prop.addBullet')}</button>
      ) : null}
    </div>
  );
}

function Stars({ t, value, onChange }) {
  return (
    <div className="nk-stars" role="radiogroup" aria-label={t('prop.rating')}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={String(star)} className={star <= value ? 'is-on' : ''} onClick={() => onChange(star)}>
          <Icon name="star" size={20} />
        </button>
      ))}
    </div>
  );
}

function ItemsEditor({ t, type, items, onChange }) {
  const [open, setOpen] = useState(items.length === 1 ? 0 : -1);
  const limit = ITEM_LIMITS[type] || 6;
  const shape = type === 'reviews' ? { name: '', text: '', rating: 5 } : (type === 'faq' ? { q: '', a: '' } : { title: '', text: '' });

  function update(index, partial) {
    onChange(items.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }

  function move(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    const copy = items.slice();
    const [row] = copy.splice(index, 1);
    copy.splice(next, 0, row);
    onChange(copy);
    setOpen(next);
  }

  return (
    <div className="nk-ed-field">
      <span className="nk-ed-label">{t('items.title.' + type)}</span>
      <div className="nk-items">
        {items.map((item, index) => {
          const isOpen = open === index;
          const label = item.title || item.name || item.q || t('editor.untitled');
          return (
            <div key={index} className={`nk-item${isOpen ? ' is-open' : ''}`}>
              <div className="nk-item-head">
                <button type="button" className="nk-item-toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
                  <span className="nk-item-num">{index + 1}</span>
                  <span className="nk-item-label">{label}</span>
                  <Icon name={isOpen ? 'up' : 'down'} size={16} />
                </button>
                <IconButton icon="up" label={t('editor.up')} disabled={index === 0} onClick={() => move(index, -1)} />
                <IconButton icon="down" label={t('editor.down')} disabled={index === items.length - 1} onClick={() => move(index, 1)} />
                <IconButton icon="trash" danger label={t('editor.remove')} onClick={() => {
                  onChange(items.filter((_, i) => i !== index));
                  setOpen(-1);
                }} />
              </div>
              {isOpen ? (
                <div className="nk-item-body">
                  {type === 'benefits' || type === 'steps' ? (
                    <>
                      <TextField label={t('prop.itemTitle')} value={item.title} onChange={(title) => update(index, { title })} />
                      <TextField label={t('prop.itemText')} value={item.text} multiline maxLength={800} onChange={(text) => update(index, { text })} />
                    </>
                  ) : null}
                  {type === 'reviews' ? (
                    <>
                      <TextField label={t('prop.name')} value={item.name} onChange={(name) => update(index, { name })} />
                      <TextField label={t('prop.review')} value={item.text} multiline maxLength={800} onChange={(text) => update(index, { text })} />
                      <div className="nk-ed-field">
                        <span className="nk-ed-label">{t('prop.rating')}</span>
                        <Stars t={t} value={Number(item.rating) || 5} onChange={(rating) => update(index, { rating })} />
                      </div>
                    </>
                  ) : null}
                  {type === 'faq' ? (
                    <>
                      <TextField label={t('prop.question')} value={item.q} onChange={(q) => update(index, { q })} />
                      <TextField label={t('prop.answer')} value={item.a} multiline maxLength={800} onChange={(a) => update(index, { a })} />
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {items.length < limit ? (
        <button type="button" className="nk-add-row" onClick={() => {
          onChange(items.concat({ ...shape }));
          setOpen(items.length);
        }}><Icon name="plus" size={16} /> {t('items.add.' + type)}</button>
      ) : (
        <p className="nk-help">{t('items.limit').replace('{n}', String(limit))}</p>
      )}
    </div>
  );
}

/**
 * Picks a WooCommerce product. Only ids are saved; name, price, image and
 * stock shown here are read live from WooCommerce and cannot be edited.
 */
function WcSearchList({ t, selectedId, simpleOnly, onPick }) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState({ status: 'loading', active: true, products: [] });

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setState((prev) => ({ ...prev, status: 'loading' }));
      api('wc-products?q=' + encodeURIComponent(query) + (simpleOnly ? '&simple=1' : ''))
        .then((data) => {
          if (!cancelled) setState({ status: 'ready', active: data.active !== false, products: data.products || [] });
        })
        .catch(() => {
          if (!cancelled) setState({ status: 'error', active: true, products: [] });
        });
    }, query ? 250 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, simpleOnly]);

  if (state.status !== 'loading' && !state.active) {
    return <p className="nk-banner" role="alert">{t('offer.wcInactive')}</p>;
  }

  return (
    <>
      <label className="nk-field">
        <span>{t('offer.wcSearch')}</span>
        <input type="search" value={query} placeholder={t('offer.wcSearchPlaceholder')} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {state.status === 'error' ? <p className="nk-banner" role="alert">{t('common.error')}</p> : null}
      {state.status === 'ready' && state.products.length === 0 ? <p className="nk-muted">{t('offer.wcNone')}</p> : null}
      <ul className="nk-wc-results">
        {state.products.map((product) => (
          <li key={product.id}>
            <button type="button" className="nk-wc-result" onClick={() => { onPick(product); setQuery(''); }} aria-pressed={product.id === selectedId}>
              {product.imageUrl ? <img src={product.imageUrl} alt="" width="40" height="40" /> : <span className="nk-wc-noimg" />}
              <span>
                <strong>{product.name}</strong>
                <small>{product.priceHtml}{product.sku ? ' · ' + product.sku : ''}{product.type === 'variable' ? ' · ' + t('offer.wcVariable') : ''}{product.inStock ? '' : ' · ' + t('offer.wcOut')}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function WcProductPicker({ t, offer, onChange }) {
  function pick(product) {
    onChange({
      ...offer,
      source: 'woocommerce',
      productId: product.id,
      variationId: 0,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      wc: null,
    });
  }

  const wc = offer.wc || null;
  const selected = offer.productId > 0;
  return (
    <div className="nk-wc-picker">
      {selected ? (
        <div className="nk-wc-selected">
          {offer.imageUrl ? <img src={offer.imageUrl} alt="" width="56" height="56" /> : null}
          <div>
            <strong>{offer.productName || '#' + offer.productId}</strong>
            <div className="nk-muted">
              {money(offer.price)}
              {offer.compareAt > offer.price ? <s> {money(offer.compareAt)}</s> : null}
              {wc && wc.stock != null ? ' · ' + t('offer.wcStock').replace('{n}', String(wc.stock)) : ''}
            </div>
            {wc && wc.available === false ? (
              <em className="nk-tag is-warn">{t('offer.wcUnavailable')}</em>
            ) : null}
            {wc && wc.variations && wc.variations.length ? (
              <div className="nk-muted">{t('offer.wcVariations').replace('{n}', String(wc.variations.length))}</div>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="nk-muted">{t('offer.wcPick')}</p>
      )}
      <p className="nk-help">{t('offer.wcLive')}</p>
      <WcSearchList t={t} selectedId={offer.productId} onPick={pick} />
    </div>
  );
}

/**
 * Page content suggested from the store product: headline, description, key
 * points, benefits and real reviews. Nothing changes until a button is pressed,
 * and "fill empty" never replaces text that is already there.
 */
function WcSuggestions({ t, page, onPatchSection }) {
  const confirm = useConfirm();
  const productId = page.offer ? page.offer.productId : 0;
  const [state, setState] = useState({ status: 'idle', data: null });
  const [used, setUsed] = useState({});

  useEffect(() => {
    if (!(productId > 0)) {
      setState({ status: 'idle', data: null });
      return undefined;
    }
    let cancelled = false;
    setState({ status: 'loading', data: null });
    setUsed({});
    api('wc-products/' + productId + '/suggestions')
      .then((data) => { if (!cancelled) setState({ status: 'ready', data }); })
      .catch(() => { if (!cancelled) setState({ status: 'error', data: null }); });
    return () => { cancelled = true; };
  }, [productId]);

  if (!(productId > 0) || state.status === 'idle') {
    return null;
  }
  if (state.status === 'loading') {
    return <p className="nk-muted">{t('common.loading')}</p>;
  }
  if (state.status === 'error' || !state.data) {
    return <p className="nk-banner" role="alert">{t('common.error')}</p>;
  }

  const d = state.data;
  const find = (type) => (page.sections || []).find((section) => section.type === type);
  const hero = find('hero');
  const info = find('product');
  const benefits = find('benefits');
  const reviews = find('reviews');
  const mark = (key) => setUsed((current) => ({ ...current, [key]: true }));

  function use(key, section, props) {
    if (!section) return;
    onPatchSection(section.id, props);
    mark(key);
  }

  function fillEmpty() {
    if (hero && !hero.props.subtitle && d.hero.subtitle) use('subtitle', hero, { subtitle: d.hero.subtitle });
    if (info && !info.props.text && d.info.text) use('text', info, { text: d.info.text });
    if (info && !(info.props.bullets || []).length && d.info.bullets.length) use('points', info, { bullets: d.info.bullets });
    if (benefits && !(benefits.props.items || []).length && d.benefits.length) use('benefits', benefits, { items: d.benefits });
    if (reviews && !(reviews.props.items || []).length && d.reviews.length) use('reviews', reviews, { items: d.reviews });
  }

  async function replaceReviews() {
    if (!reviews) return;
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('suggest.replaceConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (ok) use('reviews-all', reviews, { items: d.reviews });
  }

  function addReview(review) {
    if (!reviews) return;
    const current = reviews.props.items || [];
    if (current.length >= 8) return;
    use('review-' + review.id, reviews, { items: current.concat(review) });
  }

  const needs = (type) => t('suggest.noSection').replace('{section}', t('section.' + type));
  const Row = ({ id, label, value, section, type, props }) => (
    <li className="nk-suggest-row">
      <div>
        <strong>{label}</strong>
        <p className="nk-muted">{value}</p>
      </div>
      <button type="button" className="nk-btn" disabled={!section || used[id]} title={section ? '' : needs(type)} onClick={() => use(id, section, props)}>
        {used[id] ? t('suggest.used') : t('suggest.use')}
      </button>
    </li>
  );

  const nothing = !d.hero.subtitle && !d.info.text && !d.info.bullets.length && !d.benefits.length && !d.reviews.length;
  return (
    <div className="nk-suggest">
      <h3 className="nk-group-title">{t('suggest.title')}</h3>
      <p className="nk-help">{t('suggest.help')}</p>
      {nothing ? <p className="nk-muted">{t('suggest.none')}</p> : (
        <>
          <button type="button" className="nk-btn" onClick={fillEmpty}>{t('suggest.fillEmpty')}</button>
          <p className="nk-help">{t('suggest.fillEmptyHelp')}</p>
          <ul className="nk-suggest-list">
            <Row id="title" label={t('suggest.headline')} value={d.hero.title} section={hero} type="hero" props={{ title: d.hero.title }} />
            {d.hero.subtitle ? <Row id="subtitle" label={t('suggest.subtitle')} value={d.hero.subtitle} section={hero} type="hero" props={{ subtitle: d.hero.subtitle }} /> : null}
            {d.info.text ? <Row id="text" label={t('suggest.description')} value={d.info.text} section={info} type="product" props={{ text: d.info.text }} /> : null}
            {d.info.bullets.length ? <Row id="points" label={t('suggest.points')} value={d.info.bullets.join(' · ')} section={info} type="product" props={{ bullets: d.info.bullets }} /> : null}
            {d.benefits.length ? <Row id="benefits" label={t('suggest.benefits')} value={d.benefits.map((item) => item.title).join(' · ')} section={benefits} type="benefits" props={{ items: d.benefits }} /> : null}
          </ul>
          {d.reviews.length ? (
            <>
              <h4 className="nk-group-title">{t('suggest.reviews')}</h4>
              <ul className="nk-suggest-list">
                {d.reviews.map((review) => (
                  <li key={review.id} className="nk-suggest-row">
                    <div>
                      <strong>{'★'.repeat(review.rating)} {review.name}{review.verified ? ' · ' + t('suggest.verified') : ''}</strong>
                      <p className="nk-muted">{review.text}</p>
                    </div>
                    <button type="button" className="nk-btn" disabled={!reviews || used['review-' + review.id]} title={reviews ? '' : needs('reviews')} onClick={() => addReview(review)}>
                      {used['review-' + review.id] ? t('suggest.used') : t('suggest.add')}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="nk-btn" disabled={!reviews} onClick={replaceReviews}>{t('suggest.replaceReviews')}</button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * One paid add-on beside the order summary. A page can have up to three.
 */
function BumpFields({ t, index, bump, isWc, onChange, onRemove }) {
  const bumpIsWc = isWc && bump.source === 'woocommerce';
  return (
    <div className="nk-bump-edit">
      {index > 0 || onRemove ? (
        <div className="nk-bump-edit-head">
          <strong>{t('offer.bumpNumber').replace('{n}', String(index + 1))}</strong>
          {onRemove ? <IconButton icon="trash" label={t('offer.bumpRemove')} onClick={onRemove} /> : null}
        </div>
      ) : null}
      <Switch
        checked={Boolean(bump.enabled)}
        label={t('offer.bumpEnable')}
        onChange={(enabled) => onChange({ ...bump, enabled })}
      />
      {bump.enabled ? (
        <>
          {isWc ? (
            <fieldset className="nk-source">
              <legend>{t('offer.source')}</legend>
              <label>
                <input type="radio" name={'nk-bump-source-' + index} checked={!bumpIsWc} onChange={() => onChange({ ...bump, source: 'custom', productId: 0 })} />
                {' '}{t('offer.sourceCustom')}
              </label>
              <label>
                <input type="radio" name={'nk-bump-source-' + index} checked={bumpIsWc} onChange={() => onChange({ ...bump, source: 'woocommerce' })} />
                {' '}{t('offer.sourceWc')}
              </label>
            </fieldset>
          ) : null}
          {bumpIsWc ? (
            <div className="nk-wc-picker">
              {bump.productId > 0 ? (
                <div className="nk-wc-selected">
                  {bump.imageUrl ? <img src={bump.imageUrl} alt="" width="56" height="56" /> : null}
                  <div>
                    <strong>{bump.name || '#' + bump.productId}</strong>
                    <div className="nk-muted">{money(bump.price || 0)}</div>
                  </div>
                </div>
              ) : <p className="nk-muted">{t('offer.wcPick')}</p>}
              <p className="nk-help">{t('offer.bumpWcHelp')}</p>
              <WcSearchList
                t={t}
                simpleOnly
                selectedId={bump.productId}
                onPick={(product) => onChange({ ...bump, source: 'woocommerce', productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || '' })}
              />
            </div>
          ) : (
            <>
              <TextField label={t('offer.bumpName')} value={bump.name || ''} maxLength={120} onChange={(name) => onChange({ ...bump, name })} />
              <MoneyField label={t('offer.bumpPrice')} value={bump.price || 0} onChange={(value) => onChange({ ...bump, price: value })} />
            </>
          )}
          <Switch
            checked={Boolean(bump.checkedDefault)}
            label={t('offer.bumpDefault')}
            onChange={(checkedDefault) => onChange({ ...bump, checkedDefault })}
          />
        </>
      ) : null}
    </div>
  );
}

function OfferFields({ t, offer, onChange, afterProduct }) {
  const price = Number(offer.price) || 0;
  const compare = Number(offer.compareAt) || 0;
  const inside = Number(offer.shippingInside != null ? offer.shippingInside : offer.shipping) || 0;
  const outside = Number(offer.shippingOutside != null ? offer.shippingOutside : offer.shipping) || 0;
  const off = compare > price && price > 0 ? Math.round((1 - price / compare) * 100) : 0;
  function setShipping(partial) {
    const nextInside = partial.shippingInside != null ? partial.shippingInside : inside;
    const nextOutside = partial.shippingOutside != null ? partial.shippingOutside : outside;
    onChange({
      ...offer,
      ...partial,
      shippingInside: nextInside,
      shippingOutside: nextOutside,
      shippingDefault: nextOutside,
      shipping: nextOutside,
      shippingZones: [
        { id: 'inside_dhaka', label: 'Inside Dhaka', price: nextInside, districtIds: ['47'], upazilaIds: [] },
        { id: 'outside_dhaka', label: 'Outside Dhaka', price: nextOutside, districtIds: [], upazilaIds: [] },
      ],
    });
  }
  const isWc = offer.source === 'woocommerce';
  const tiers = Array.isArray(offer.tiers) ? offer.tiers : [];
  function setTier(index, partial) {
    onChange({ ...offer, tiers: tiers.map((tier, i) => (i === index ? { ...tier, ...partial } : tier)) });
  }
  // Add-ons: a list (up to 3). Older pages have one in offer.bump.
  const bumps = Array.isArray(offer.bumps) && offer.bumps.length ? offer.bumps : [offer.bump || { enabled: false }];
  function setBumps(list) {
    onChange({ ...offer, bumps: list, bump: list[0] });
  }
  return (
    <div className="nk-form-stack">
      <fieldset className="nk-source">
        <legend>{t('offer.source')}</legend>
        <label>
          <input type="radio" name="nk-offer-source" checked={!isWc} onChange={() => onChange({ ...offer, source: 'custom', productId: 0, variationId: 0 })} />
          {' '}{t('offer.sourceCustom')}
        </label>
        <label>
          <input type="radio" name="nk-offer-source" checked={isWc} onChange={() => onChange({ ...offer, source: 'woocommerce' })} />
          {' '}{t('offer.sourceWc')}
        </label>
      </fieldset>
      {isWc ? (
        <>
          <WcProductPicker t={t} offer={offer} onChange={onChange} />
          <Switch checked={offer.gallery !== false} label={t('offer.gallery')} onChange={(gallery) => onChange({ ...offer, gallery })} />
          <Switch checked={Boolean(offer.stockHint)} label={t('offer.stockHint')} onChange={(stockHint) => onChange({ ...offer, stockHint })} />
          {offer.stockHint ? (
            <label className="nk-field">
              <span>{t('offer.stockHintMax')}</span>
              <input type="number" min="1" max="50" value={offer.stockHintMax || 10} onChange={(event) => onChange({ ...offer, stockHintMax: Math.max(1, Math.min(50, Number(event.target.value) || 10)) })} />
            </label>
          ) : null}
          <p className="nk-help">{t('offer.stockHintHelp')}</p>
          {afterProduct}
        </>
      ) : (
        <>
          <TextField label={t('offer.productName')} value={offer.productName} maxLength={180} onChange={(productName) => onChange({ ...offer, productName })} />
          <div className="nk-two">
            <MoneyField label={t('offer.price')} value={offer.price} onChange={(value) => onChange({ ...offer, price: value })} />
            <MoneyField label={t('offer.compareAt')} help={t('offer.compareHelp')} value={offer.compareAt} onChange={(value) => onChange({ ...offer, compareAt: value })} />
          </div>
        </>
      )}
      <div className="nk-ed-group">
        <h3 className="nk-group-title">{t('offer.tiersTitle')}</h3>
        <p className="nk-muted">{t('offer.tiersHelp')}</p>
        {tiers.map((tier, index) => (
          <div className="nk-tier-edit" key={index}>
            <label className="nk-field">
              <span>{t('offer.tierQty')}</span>
              <input type="number" min="2" max="10" value={tier.qty} onChange={(event) => setTier(index, { qty: Math.max(2, Math.min(10, Number(event.target.value) || 2)) })} />
            </label>
            <MoneyField label={t('offer.tierDiscount')} value={tier.discount} onChange={(value) => setTier(index, { discount: value })} />
            <IconButton icon="trash" label={t('offer.tierRemove')} onClick={() => onChange({ ...offer, tiers: tiers.filter((_, i) => i !== index) })} />
            <small className="nk-help">{t('offer.tierPays').replace('{n}', String(tier.qty)).replace('{total}', money(Math.max(0, price * tier.qty - (Number(tier.discount) || 0))))}</small>
          </div>
        ))}
        {tiers.length < 4 ? (
          <button type="button" className="nk-add-row" onClick={() => onChange({ ...offer, tiers: tiers.concat({ qty: Math.min(10, (tiers.length ? Number(tiers[tiers.length - 1].qty) : 1) + 1), discount: 0 }) })}>
            <Icon name="plus" size={16} /> {t('offer.tierAdd')}
          </button>
        ) : null}
      </div>
      {isWc ? (
        <label className="nk-field">
          <span>{t('offer.shippingSource')}</span>
          <select value={offer.shippingSource || 'noksha'} onChange={(event) => onChange({ ...offer, shippingSource: event.target.value })}>
            <option value="noksha">{t('offer.shippingSourceNoksha')}</option>
            <option value="woocommerce">{t('offer.shippingSourceWc')}</option>
            <option value="auto">{t('offer.shippingSourceAuto')}</option>
          </select>
          <small className="nk-help">{t('offer.shippingSourceHelp')}</small>
        </label>
      ) : null}
      <div className="nk-two">
        <MoneyField label={t('offer.shippingInside')} help={t('offer.shippingInsideHelp')} value={inside} onChange={(value) => setShipping({ shippingInside: value })} />
        <MoneyField label={t('offer.shippingOutside')} help={t('offer.shippingOutsideHelp')} value={outside} onChange={(value) => setShipping({ shippingOutside: value })} />
      </div>
      <div className="nk-total">
        <div>
          <span className="nk-muted">{t('offer.customerPays')}</span>
          <strong>{money(price + inside)} / {money(price + outside)}</strong>
        </div>
        <small>
          {t('offer.shippingZones').replace('{inside}', money(inside)).replace('{outside}', money(outside))}
          {off > 0 ? <em className="nk-tag is-ok">{t('offer.off').replace('{n}', String(off))}</em> : null}
        </small>
      </div>
      {isWc ? null : (
        <ImageField t={t} label={t('offer.image')} value={offer.imageUrl} onChange={(imageUrl) => onChange({ ...offer, imageUrl })} />
      )}
      <div className="nk-ed-group">
        <h3 className="nk-group-title">{t('offer.bumpTitle')}</h3>
        <p className="nk-muted">{t('offer.bumpHelp')}</p>
        {bumps.map((bump, index) => (
          <BumpFields
            key={index}
            t={t}
            index={index}
            bump={bump}
            isWc={isWc}
            onChange={(next) => setBumps(bumps.map((item, i) => (i === index ? next : item)))}
            onRemove={bumps.length > 1 ? () => setBumps(bumps.filter((_, i) => i !== index)) : null}
          />
        ))}
        {bumps.length < 3 && bumps.every((item) => item.enabled) ? (
          <button type="button" className="nk-add-row" onClick={() => setBumps(bumps.concat({ enabled: true, source: 'custom', productId: 0, name: '', price: 0, imageUrl: '', checkedDefault: false }))}>
            <Icon name="plus" size={16} /> {t('offer.bumpAdd')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CheckoutFields({ t, checkout, settings, onChange, onSetup }) {
  const customs = Array.isArray(checkout.customFields) ? checkout.customFields : [];
  const order = Array.isArray(checkout.fieldOrder) && checkout.fieldOrder.length
    ? checkout.fieldOrder
    : ['name', 'phone', 'email', 'area', 'address', 'note'].concat(customs.map((item) => item.id));
  function move(key, direction) {
    const from = order.indexOf(key);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= order.length) return;
    const next = order.slice();
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange({ ...checkout, fieldOrder: next });
  }
  function setCustom(id, partial) {
    onChange({ ...checkout, customFields: customs.map((item) => (item.id === id ? { ...item, ...partial } : item)) });
  }
  function addCustom() {
    const id = 'c_' + Math.random().toString(36).slice(2, 8);
    onChange({
      ...checkout,
      customFields: customs.concat({ id, label: t('checkout.customNew'), type: 'text', options: [], required: false }),
      fieldOrder: order.concat(id),
    });
  }
  function removeCustom(id) {
    onChange({ ...checkout, customFields: customs.filter((item) => item.id !== id), fieldOrder: order.filter((key) => key !== id) });
  }
  function setField(key, partial) {
    const field = checkout.fields[key];
    const next = { ...field, ...partial };
    if (!next.enabled) next.required = false;
    onChange({ ...checkout, fields: { ...checkout.fields, [key]: next } });
  }

  function togglePayment(method, on) {
    const payments = on ? checkout.payments.concat(method) : checkout.payments.filter((item) => item !== method);
    onChange({ ...checkout, payments: payments.length ? payments : ['cod'] });
  }

  function movePayment(method, direction) {
    const index = checkout.payments.indexOf(method);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= checkout.payments.length) return;
    const payments = checkout.payments.slice();
    const [item] = payments.splice(index, 1);
    payments.splice(next, 0, item);
    onChange({ ...checkout, payments });
  }

  const ordered = checkout.payments.concat(METHODS.filter((method) => !checkout.payments.includes(method)));

  return (
    <div className="nk-form-stack">
      <div className="nk-group">
        <h3>{t('checkout.fields')}</h3>
        <p className="nk-help">{t('checkout.fieldsHelp')}</p>
        <div className="nk-rows">
          <div className="nk-row nk-row-head" aria-hidden="true">
            <span />
            <span>{t('checkout.show')}</span>
            <span>{t('checkout.required')}</span>
          </div>
          {order.map((key, index) => {
            const arrows = (
              <span className="nk-move">
                <IconButton icon="up" label={t('checkout.moveUp')} disabled={index === 0} onClick={() => move(key, -1)} />
                <IconButton icon="down" label={t('checkout.moveDown')} disabled={index === order.length - 1} onClick={() => move(key, 1)} />
              </span>
            );
            const custom = customs.find((item) => item.id === key);
            if (custom) {
              return (
                <div key={key} className="nk-row nk-row-custom">
                  <span className="nk-row-name">
                    <input type="text" aria-label={t('checkout.customLabel')} value={custom.label} maxLength={60} onChange={(event) => setCustom(key, { label: event.target.value })} />
                    <select aria-label={t('checkout.customType')} value={custom.type} onChange={(event) => setCustom(key, { type: event.target.value })}>
                      {['text', 'textarea', 'select', 'date'].map((type) => <option key={type} value={type}>{t('checkout.type.' + type)}</option>)}
                    </select>
                    {custom.type === 'select' ? (
                      <textarea aria-label={t('checkout.customOptions')} placeholder={t('checkout.customOptions')} rows={3} value={(custom.options || []).join('\n')} onChange={(event) => setCustom(key, { options: event.target.value.split('\n') })} />
                    ) : null}
                    <span className="nk-row-tools">
                      {arrows}
                      <IconButton icon="trash" label={t('checkout.customRemove')} danger onClick={() => removeCustom(key)} />
                    </span>
                  </span>
                  <span className="nk-muted">{t('checkout.always')}</span>
                  <Switch checked={Boolean(custom.required)} onChange={(required) => setCustom(key, { required })} label={<span className="nk-sr">{t('checkout.required')} {custom.label}</span>} />
                </div>
              );
            }
            const parts = key === 'area' ? ['division', 'district', 'upazila'] : [key];
            return (
              <div key={key} className={key === 'area' ? 'nk-row-group' : ''}>
                {key === 'area' ? <div className="nk-row-group-head"><strong>{t('checkout.area')}</strong>{arrows}</div> : null}
                {parts.map((part) => {
                  const field = checkout.fields[part];
                  const locked = part === 'name' || part === 'phone';
                  return (
                    <div key={part} className="nk-row">
                      <span className="nk-row-name">
                        {t('field.' + part)}
                        {locked ? <small>{t('checkout.always')}</small> : null}
                        <input type="text" aria-label={t('checkout.labelFor').replace('{field}', t('field.' + part))} placeholder={t('checkout.labelPlaceholder')} value={field.label || ''} maxLength={60} onChange={(event) => setField(part, { label: event.target.value })} />
                        {key !== 'area' ? <span className="nk-row-tools">{arrows}</span> : null}
                      </span>
                      <Switch checked={field.enabled} disabled={locked} onChange={(enabled) => setField(part, { enabled })} label={<span className="nk-sr">{t('checkout.show')} {t('field.' + part)}</span>} />
                      <Switch checked={field.required} disabled={locked || !field.enabled} onChange={(required) => setField(part, { required })} label={<span className="nk-sr">{t('checkout.required')} {t('field.' + part)}</span>} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {customs.length < 5 ? (
          <button type="button" className="nk-add-row" onClick={addCustom}>
            <Icon name="plus" size={16} /> {t('checkout.customAdd')}
          </button>
        ) : null}
      </div>

      <div className="nk-group">
        <h3>{t('checkout.payments')}</h3>
        <p className="nk-help">{t('checkout.paymentsHelp')}</p>
        <div className="nk-pay-list">
          {ordered.map((method) => {
            const on = checkout.payments.includes(method);
            const index = checkout.payments.indexOf(method);
            const issue = on ? gatewayIssue(method, settings) : '';
            return (
              <div key={method} className={`nk-pay-row${on ? ' is-on' : ''}`}>
                <Switch checked={on} onChange={(value) => togglePayment(method, value)} label={<strong>{t('pay.' + method)}</strong>} />
                {on && index === 0 ? <em className="nk-tag">{t('checkout.default')}</em> : null}
                {on ? (
                  <span className="nk-pay-tools">
                    <IconButton icon="up" label={t('editor.up')} disabled={index === 0} onClick={() => movePayment(method, -1)} />
                    <IconButton icon="down" label={t('editor.down')} disabled={index === checkout.payments.length - 1} onClick={() => movePayment(method, 1)} />
                  </span>
                ) : null}
                {issue ? (
                  <p className="nk-pay-issue">
                    <Icon name="alert" size={14} /> {t('checkout.notReady')}{' '}
                    <button type="button" className="nk-text-btn" onClick={onSetup}>{t('checkout.setup')}</button>
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="nk-group">
        <h3>{t('checkout.summary')}</h3>
        <Choice label={t('checkout.summary')} value={checkout.summaryPosition} onChange={(summaryPosition) => onChange({ ...checkout, summaryPosition })} options={[
          ['left', t('checkout.left')],
          ['right', t('checkout.right')],
          ['bottom', t('checkout.bottom')],
        ]} />
      </div>

      <div className="nk-group">
        <h3>{t('checkout.trust')}</h3>
        <p className="nk-help">{t('checkout.trustHelp')}</p>
        <div className="nk-chips">
          {['secure', 'cod', 'delivery'].map((badge) => {
            const on = checkout.trustBadges.includes(badge);
            return (
              <button key={badge} type="button" aria-pressed={on} className={`nk-chip-toggle${on ? ' is-on' : ''}`} onClick={() => onChange({
                ...checkout,
                trustBadges: on ? checkout.trustBadges.filter((item) => item !== badge) : checkout.trustBadges.concat(badge),
              })}>{t('trust.' + badge)}</button>
            );
          })}
        </div>
      </div>

      <Switch
        checked={Boolean(checkout.coupon)}
        label={t('checkout.coupon')}
        onChange={(coupon) => onChange({ ...checkout, coupon })}
      />
      <p className="nk-help">{t('checkout.couponHelp')}</p>
      <Switch
        checked={Boolean(checkout.multiStep)}
        label={t('checkout.multiStep')}
        onChange={(multiStep) => onChange({ ...checkout, multiStep })}
      />
      <p className="nk-help">{t('checkout.multiStepHelp')}</p>
      <TextField label={t('checkout.note')} help={t('checkout.noteHelp')} value={checkout.deliveryNote} multiline maxLength={300} onChange={(deliveryNote) => onChange({ ...checkout, deliveryNote })} />
    </div>
  );
}

function PageMetaFields({ t, page, onChange, onDelete }) {
  const suffix = page.slug + '/';
  const base = page.link && page.link.endsWith(suffix)
    ? page.link.slice(0, page.link.length - suffix.length)
    : window.location.origin + '/offer/';
  return (
    <div className="nk-form-stack">
      <Field label={t('editor.slug')} help={t('editor.slugHelp')}>
        <span className="nk-slug">
          <span className="nk-slug-base">{base.replace(/^https?:\/\//, '')}</span>
          <input type="text" value={page.slug} onChange={(event) => onChange({ slug: event.target.value.replace(/\s+/g, '-').toLowerCase() })} />
        </span>
      </Field>
      <div className="nk-ed-field">
        <span className="nk-ed-label">{t('editor.language')}</span>
        <Choice label={t('editor.language')} value={page.language} onChange={(language) => onChange({ language })} options={[
          ['bn', t('settings.bangla')],
          ['en', t('settings.english')],
        ]} />
        <p className="nk-help">{t('editor.languageHelp')}</p>
      </div>
      <div className="nk-ed-field">
        <span className="nk-ed-label">{t('editor.motion')}</span>
        <Choice label={t('editor.motion')} value={page.motion === 'lively' ? 'lively' : 'simple'} onChange={(motion) => onChange({ motion })} options={[
          ['simple', t('editor.motion.simple')],
          ['lively', t('editor.motion.lively')],
        ]} />
        <p className="nk-help">{t('editor.motionHelp')}</p>
      </div>
      <div className="nk-ed-field">
        <span className="nk-ed-label">{t('editor.status')}</span>
        <Choice label={t('editor.status')} value={page.status} onChange={(value) => onChange({ status: value })} options={[
          ['draft', t('pages.draft')],
          ['publish', t('pages.published')],
        ]} />
        <p className="nk-help">{t('editor.statusHelp')}</p>
      </div>
      <div className="nk-danger">
        <h3>{t('editor.danger')}</h3>
        <p className="nk-help">{t('editor.dangerHelp')}</p>
        <button type="button" className="nk-btn-danger nk-btn-icon" onClick={onDelete}><Icon name="trash" size={16} /> {t('pages.delete')}</button>
      </div>
    </div>
  );
}

function PageSeoFields({ t, page, onChange }) {
  const seo = page.seo || { title: '', description: '', imageUrl: '' };
  return (
    <div className="nk-form-stack">
      <TextField label={t('seo.title')} help={t('seo.titleHelp')} value={seo.title} maxLength={70} onChange={(title) => onChange({ seo: { ...seo, title } })} />
      <TextField label={t('seo.description')} help={t('seo.descriptionHelp')} value={seo.description} multiline maxLength={200} onChange={(description) => onChange({ seo: { ...seo, description } })} />
      <ImageField t={t} label={t('seo.image')} value={seo.imageUrl} onChange={(imageUrl) => onChange({ seo: { ...seo, imageUrl } })} />
    </div>
  );
}

function PageAbFields({ t, page, onChange }) {
  const ab = page.ab || { enabled: false, split: 50, sections: [] };
  function setAb(partial) {
    onChange({ ab: { ...ab, ...partial } });
  }
  function copyVariantB() {
    const clone = (page.sections || [])
      .filter((section) => section.type !== 'order_form')
      .map((section) => ({
        ...section,
        id: 'ab_' + Math.random().toString(36).slice(2, 10),
        props: { ...(section.props || {}) },
      }));
    setAb({ enabled: true, sections: clone });
  }
  return (
    <div className="nk-form-stack">
      <p className="nk-muted">{t('ab.help')}</p>
      <Switch checked={Boolean(ab.enabled)} label={t('ab.enable')} onChange={(enabled) => setAb({ enabled })} />
      {ab.enabled ? (
        <>
          <Field label={t('ab.split')} help={t('ab.splitHelp')}>
            <input type="number" min="10" max="90" value={ab.split || 50} onChange={(event) => setAb({ split: Number(event.target.value) || 50 })} />
          </Field>
          <p className="nk-muted">{t('ab.sections').replace('{n}', String((ab.sections || []).length))}</p>
          <button type="button" className="nk-btn-ghost" onClick={copyVariantB}>{t('ab.copy')}</button>
        </>
      ) : null}
    </div>
  );
}

function ColorFields({ t, tokens, onChange }) {
  const brand = (window.nokshaBoot && window.nokshaBoot.tokens && window.nokshaBoot.tokens.color) || {};
  const on = Boolean(tokens && tokens.enabled);
  const colors = on ? tokens.color || {} : brand;

  function setColor(key, value) {
    onChange({ enabled: true, color: { ...colors, [key]: value.toUpperCase() } });
  }

  return (
    <div className="nk-form-stack">
      <Switch checked={on} label={t('editor.customColors')} onChange={(value) => onChange(value ? { enabled: true, color: { ...brand, ...((tokens && tokens.color) || {}) } } : null)} />
      {on ? (
        <>
          {COLOR_GROUPS.map(([groupKey, keys]) => (
            <div key={groupKey} className="nk-group">
              <h3>{t(groupKey)}</h3>
              <div className="nk-colors">
                {keys.map((key) => (
                  <label key={key} className="nk-color-row">
                    <input type="color" value={colors[key] || '#000000'} onChange={(event) => setColor(key, event.target.value)} />
                    <span>
                      <strong>{t('brand.' + key)}</strong>
                      <small>{colors[key]}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="nk-btn-ghost" onClick={() => onChange({ enabled: true, color: { ...brand } })}>{t('editor.resetColors')}</button>
        </>
      ) : (
        <div className="nk-swatches" aria-hidden="true">
          {['brand', 'accent', 'canvas', 'text'].map((key) => <i key={key} style={{ background: brand[key] }} />)}
        </div>
      )}
    </div>
  );
}
