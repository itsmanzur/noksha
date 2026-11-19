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
  { key: 'attention', types: ['hero', 'countdown'] },
  { key: 'trust', types: ['benefits', 'reviews', 'guarantee', 'faq'] },
  { key: 'product', types: ['product', 'order_form'] },
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
const FIELD_KEYS = ['name', 'phone', 'email', 'division', 'district', 'upazila', 'address', 'note'];
const ITEM_LIMITS = { benefits: 6, reviews: 8, faq: 12 };
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
  const [fullscreen, setFullscreen] = useState(false);

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
    return () => document.body.classList.remove('noksha-fullscreen');
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
    setView({ kind: 'home' });
  }

  function patchSection(sectionId, props) {
    setSections((sections) => sections.map((section) => (
      section.id === sectionId ? { ...section, props: { ...section.props, ...props } } : section
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
          />
          {error ? <div className="nk-banner nk-ed-error" role="alert">{error}</div> : null}
          <div className="nk-editor-cols nk-ed-body">
            <aside className="nk-editor-pane nk-ed-side">
              <EditorSectionList
                t={t}
                page={page}
                selectedId={selectedId}
                onOpen={(sectionId) => setView({ kind: 'section', id: sectionId })}
                onToggle={toggleHidden}
                onReorder={reorder}
                onAdd={() => setAddOpen(true)}
              />
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
            <aside className="nk-editor-pane is-inspector nk-ed-side">
              <EditorInspector
                t={t}
                view={view}
                section={section}
                page={page}
                settings={settings}
                settingsTab={settingsTab}
                onSettingsTab={setSettingsTab}
                onBackToSettings={() => setView({ kind: 'home' })}
                onPatch={patch}
                onPatchSection={patchSection}
                onOpenSettings={openSettings}
                onToggleHidden={toggleHidden}
                onRemoveSection={removeSection}
                onRemovePage={removePage}
                onLeave={leave}
              />
            </aside>
          </div>
          <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('editor.addTitle')} size="lg">
            <p className="nk-muted">
              {section && section.type !== 'order_form'
                ? `${t('editor.addAfter')} ${t('section.' + section.type)}`
                : t('editor.addHelp')}
            </p>
            {TYPE_GROUPS.map((group) => (
              <div key={group.key} className="nk-type-group">
                <h3 className="nk-type-group-title">{t('editor.group.' + group.key)}</h3>
                <div className="nk-type-grid">
                  {group.types.map((type) => {
                    const taken = type === 'order_form' && page.sections.some((item) => item.type === 'order_form');
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
  onBackToSettings,
  onPatch,
  onPatchSection,
  onOpenSettings,
  onToggleHidden,
  onRemoveSection,
  onRemovePage,
  onLeave,
}) {
  if (view.kind === 'section' && section) {
    return (
      <div className="nk-panel-view">
        <div className="nk-panel-head">
          <button type="button" className="nk-link-back" onClick={onBackToSettings}>
            <Icon name="back" size={16} /> {t('editor.pageSettings')}
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
          <SectionFields
            key={section.id}
            t={t}
            section={section}
            onChange={(props) => onPatchSection(section.id, props)}
            onOpen={onOpenSettings}
          />
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
          <OfferFields t={t} offer={page.offer} onChange={(offer) => onPatch({ offer })} />
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
      content: <PageMetaFields t={t} page={page} onChange={onPatch} onDelete={onRemovePage} />,
    },
  ];

  return (
    <div className="nk-panel-view nk-editor-inspector">
      <div className="nk-panel-head">
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

function SectionFields({ t, section, onChange, onOpen }) {
  const props = section.props;
  const type = section.type;
  return (
    <div className="nk-form-stack">
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
      {type === 'benefits' || type === 'reviews' || type === 'faq' ? (
        <>
          <TextField label={t('prop.sectionTitle')} value={props.title} onChange={(title) => onChange({ title })} />
          <ItemsEditor t={t} type={type} items={props.items || []} onChange={(items) => onChange({ items })} />
        </>
      ) : null}
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
                  {type === 'benefits' ? (
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

function OfferFields({ t, offer, onChange }) {
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
  return (
    <div className="nk-form-stack">
      <TextField label={t('offer.productName')} value={offer.productName} maxLength={180} onChange={(productName) => onChange({ ...offer, productName })} />
      <div className="nk-two">
        <MoneyField label={t('offer.price')} value={offer.price} onChange={(value) => onChange({ ...offer, price: value })} />
        <MoneyField label={t('offer.compareAt')} help={t('offer.compareHelp')} value={offer.compareAt} onChange={(value) => onChange({ ...offer, compareAt: value })} />
      </div>
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
      <ImageField t={t} label={t('offer.image')} value={offer.imageUrl} onChange={(imageUrl) => onChange({ ...offer, imageUrl })} />
      <div className="nk-ed-group">
        <h3 className="nk-group-title">{t('offer.bumpTitle')}</h3>
        <p className="nk-muted">{t('offer.bumpHelp')}</p>
        <Switch
          checked={Boolean(offer.bump?.enabled)}
          label={t('offer.bumpEnable')}
          onChange={(enabled) => onChange({ ...offer, bump: { ...(offer.bump || {}), enabled } })}
        />
        {offer.bump?.enabled ? (
          <>
            <TextField label={t('offer.bumpName')} value={offer.bump?.name || ''} maxLength={120} onChange={(name) => onChange({ ...offer, bump: { ...(offer.bump || {}), name } })} />
            <MoneyField label={t('offer.bumpPrice')} value={offer.bump?.price || 0} onChange={(value) => onChange({ ...offer, bump: { ...(offer.bump || {}), price: value } })} />
            <Switch
              checked={Boolean(offer.bump?.checkedDefault)}
              label={t('offer.bumpDefault')}
              onChange={(checkedDefault) => onChange({ ...offer, bump: { ...(offer.bump || {}), checkedDefault } })}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function CheckoutFields({ t, checkout, settings, onChange, onSetup }) {
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
          {FIELD_KEYS.map((key) => {
            const field = checkout.fields[key];
            const locked = key === 'name' || key === 'phone';
            return (
              <div key={key} className="nk-row">
                <span className="nk-row-name">
                  {t('field.' + key)}
                  {locked ? <small>{t('checkout.always')}</small> : null}
                </span>
                <Switch checked={field.enabled} disabled={locked} onChange={(enabled) => setField(key, { enabled })} label={<span className="nk-sr">{t('checkout.show')} {t('field.' + key)}</span>} />
                <Switch checked={field.required} disabled={locked || !field.enabled} onChange={(required) => setField(key, { required })} label={<span className="nk-sr">{t('checkout.required')} {t('field.' + key)}</span>} />
              </div>
            );
          })}
        </div>
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
