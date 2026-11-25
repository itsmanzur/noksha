import { useEffect, useRef, useState } from '@wordpress/element';
import { api, AsyncView, money } from '../api';
import { useConfirm } from '../providers';
import { Modal, Tabs } from '../ui';
import { EditorTopBar } from './EditorTopBar';
import { EditorSectionList } from './EditorSectionList';
import { Icon, IconButton, SECTION_ICONS } from './editorShared';

const TYPES = ['hero', 'benefits', 'product', 'countdown', 'reviews', 'faq', 'guarantee', 'html', 'order_form'];
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
  }, [selectedId, html]);

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
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const frameRect = frame.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    setToolbar({
      id: sectionId,
      top: Math.max(8, nodeRect.top - frameRect.top + 8),
      left: Math.max(8, nodeRect.left - frameRect.left + 8),
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
    setSections((sections) => {
      const formIndex = sections.findIndex((item) => item.type === 'order_form');
      if (formIndex < 0 || type === 'order_form') {
        return sections.concat(created);
      }
      const next = sections.slice();
      next.splice(formIndex, 0, created);
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
  };

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
              <div className={`nk-editor-frame nk-device ${deviceClass}`} style={{ position: 'relative' }}>
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
            <p className="nk-muted">{t('editor.addHelp')}</p>
            <div className="nk-type-grid">
              {TYPES.map((type) => {
                const taken = type === 'order_form' && page.sections.some((item) => item.type === 'order_form');
                return (
                  <button key={type} type="button" className="nk-type" disabled={taken} onClick={() => addSection(type)}>
                    <span className="nk-type-icon"><Icon name={SECTION_ICONS[type]} size={20} /></span>
                    <strong>{t('section.' + type)}</strong>
                    <small>{taken ? t('editor.alreadyAdded') : t('sectionHelp.' + type)}</small>
                  </button>
                );
              })}
            </div>
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

      <Switch
        checked={Boolean(checkout.coupon)}
        label={t('checkout.coupon')}
        onChange={(coupon) => onChange({ ...checkout, coupon })}
      />
      <p className="nk-help">{t('checkout.couponHelp')}</p>
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
