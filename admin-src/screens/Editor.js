import { useEffect, useRef, useState } from '@wordpress/element';
import { api, AsyncView, money } from '../api';

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
const SECTION_ICONS = {
  hero: 'layout',
  benefits: 'checks',
  product: 'box',
  countdown: 'clock',
  reviews: 'star',
  faq: 'help',
  guarantee: 'shield',
  html: 'code',
  order_form: 'cart',
};
const PREVIEW_CSS = '[data-nk-section]{cursor:pointer;outline:2px solid transparent;outline-offset:-2px;transition:outline-color .15s}'
  + '[data-nk-section]:hover{outline-color:rgba(34,113,177,.45)}'
  + '[data-nk-section].nk-ed-sel{outline-color:#2271B1}';

const ICONS = {
  back: <polyline points="15 18 9 12 15 6" />,
  next: <polyline points="9 18 15 12 9 6" />,
  up: <polyline points="18 15 12 9 6 15" />,
  down: <polyline points="6 9 12 15 18 9" />,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  phone: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  desktop: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
  grip: <><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></>,
  checks: <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  help: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
  card: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  drop: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
};

function Icon({ name, size = 18 }) {
  return (
    <svg className="nk-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

function IconButton({ icon, label, onClick, disabled, danger, active }) {
  return (
    <button type="button" className={`nk-icon-btn${danger ? ' is-danger' : ''}${active ? ' is-active' : ''}`} aria-label={label} title={label} disabled={disabled} onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
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

function summaryOf(section, t) {
  const props = section.props || {};
  const text = section.type === 'html'
    ? String(props.html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : String(props.title || props.eyebrow || props.text || '').trim();
  if (!text) {
    return t('editor.untitled');
  }
  return text.length > 44 ? text.slice(0, 42) + '…' : text;
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
  const [fullscreen, setFullscreen] = useState(false);

  const frameRef = useRef(null);
  const scrollRef = useRef(0);
  const selectedRef = useRef('');
  const requestRef = useRef(0);
  const pageRef = useRef(null);
  const actionsRef = useRef({});
  const autosaveRef = useRef(0);
  const skipHistoryRef = useRef(false);

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
    if (!page) {
      return undefined;
    }
    setPreviewBusy(true);
    const handle = window.setTimeout(() => {
      const request = ++requestRef.current;
      api('preview', { method: 'POST', body: page }).then((data) => {
        if (request !== requestRef.current) {
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
  }, [selectedId]);

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

  function onFrameLoad() {
    const doc = frameDoc();
    if (!doc || !doc.head) {
      return;
    }
    const style = doc.createElement('style');
    style.textContent = PREVIEW_CSS;
    doc.head.appendChild(style);
    doc.addEventListener('click', (event) => {
      const node = event.target && event.target.closest ? event.target.closest('[data-nk-section]') : null;
      if (!node) {
        return;
      }
      event.preventDefault();
      actionsRef.current.pick(node.getAttribute('data-nk-section'));
    }, true);
    doc.addEventListener('submit', (event) => event.preventDefault(), true);
    try {
      frameRef.current.contentWindow.scrollTo(0, scrollRef.current);
    } catch (err) {
      // The preview is same-origin; ignore if the browser blocks it.
    }
    markSelected(selectedRef.current, false);
  }

  function pushHistory(snapshot) {
    if (skipHistoryRef.current || !snapshot) {
      return;
    }
    setHistory((current) => current.concat(JSON.stringify(snapshot)).slice(-30));
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
    setHistory((current) => {
      if (current.length === 0) {
        return current;
      }
      const next = current.slice();
      const raw = next.pop();
      try {
        skipHistoryRef.current = true;
        setPage(JSON.parse(raw));
      } catch (err) {
        // Ignore bad history entries.
      }
      skipHistoryRef.current = false;
      return next;
    });
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

  function removeSection(sectionId) {
    if (!window.confirm(t('editor.removeConfirm'))) {
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

  function leave(path) {
    if (dirty && !window.confirm(t('editor.leaveConfirm'))) {
      return;
    }
    setSaved(JSON.stringify(pageRef.current));
    go(path);
  }

  function removePage() {
    if (!window.confirm(t('pages.deleteConfirm'))) {
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
    pick: (sectionId) => setView({ kind: 'section', id: sectionId, from: 'preview' }),
  };

  const section = page && selectedId ? page.sections.find((item) => item.id === selectedId) : null;
  let stateText = t('editor.allSaved');
  if (saving) stateText = t('editor.saving');
  else if (dirty) stateText = t('editor.unsaved');
  else if (justSaved) stateText = t('editor.saved');

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {page ? (
        <div className={`nk-ed${fullscreen ? ' is-full' : ''}`}>
          <header className="nk-ed-top">
            <button type="button" className="nk-ed-back" onClick={() => leave('pages')}>
              <Icon name="back" /> <span>{t('editor.back')}</span>
            </button>
            <div className="nk-ed-name">
              <input aria-label={t('editor.title')} value={page.title} placeholder={t('editor.title')} onChange={(event) => patch({ title: event.target.value })} />
              <span className={`nk-pill ${liveStatus === 'publish' ? 'is-live' : 'is-draft'}`}>{liveStatus === 'publish' ? t('editor.live') : t('editor.draft')}</span>
            </div>
            <span className={`nk-ed-state${dirty ? ' is-dirty' : ''}`} aria-live="polite">{stateText}</span>
            <div className="nk-ed-actions">
              <button type="button" className="nk-btn-ghost nk-btn-icon" disabled={history.length === 0} title={t('editor.undo')} onClick={undo}>{t('editor.undo')}</button>
              <button type="button" className="nk-btn-ghost nk-btn-icon" title={t('editor.fullscreen')} aria-pressed={fullscreen} onClick={() => setFullscreen((value) => !value)}>{fullscreen ? t('editor.exitFull') : t('editor.fullscreen')}</button>
              <div className="nk-seg nk-ed-device" role="group" aria-label={t('editor.device')}>
                <button type="button" className={device === 'phone' ? 'is-active' : ''} aria-pressed={device === 'phone'} title={t('editor.mobile')} onClick={() => setDevice('phone')}><Icon name="phone" size={16} /><span>{t('editor.mobile')}</span></button>
                <button type="button" className={device === 'desk' ? 'is-active' : ''} aria-pressed={device === 'desk'} title={t('editor.desktop')} onClick={() => setDevice('desk')}><Icon name="desktop" size={16} /><span>{t('editor.desktop')}</span></button>
              </div>
              {page.link && liveStatus === 'publish' ? (
                <a className="nk-btn-ghost nk-btn-icon" href={page.link} target="_blank" rel="noreferrer"><Icon name="external" size={16} /> {t('editor.viewLive')}</a>
              ) : null}
              {liveStatus === 'publish' ? (
                <button type="button" className="nk-btn" disabled={Boolean(saving) || !dirty} title={t('editor.shortcut')} onClick={() => save()}>
                  {saving ? t('editor.saving') : t('editor.update')}
                </button>
              ) : (
                <>
                  <button type="button" className="nk-btn-ghost" disabled={Boolean(saving)} title={t('editor.shortcut')} onClick={() => save('draft')}>
                    {saving === 'save' ? t('editor.saving') : t('editor.saveDraft')}
                  </button>
                  <button type="button" className="nk-btn" disabled={Boolean(saving)} onClick={() => save('publish')}>
                    {saving === 'publish' ? t('editor.saving') : t('editor.publish')}
                  </button>
                </>
              )}
            </div>
          </header>
          {error ? <div className="nk-banner nk-ed-error" role="alert">{error}</div> : null}
          <div className="nk-ed-body">
            <aside className="nk-ed-side">
              {view.kind === 'home' ? (
                <ContentList
                  t={t}
                  page={page}
                  onOpen={(sectionId) => setView({ kind: 'section', id: sectionId })}
                  onToggle={toggleHidden}
                  onReorder={reorder}
                  onAdd={() => setView({ kind: 'add' })}
                  onSettings={(kind) => setView({ kind })}
                />
              ) : null}
              {view.kind === 'add' ? (
                <Panel t={t} title={t('editor.addTitle')} help={t('editor.addHelp')} onBack={() => setView({ kind: 'home' })}>
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
                </Panel>
              ) : null}
              {view.kind === 'section' && section ? (
                <Panel t={t} title={t('section.' + section.type)} help={t('sectionHelp.' + section.type)} icon={SECTION_ICONS[section.type]} onBack={() => setView({ kind: 'home' })}>
                  {section.hidden ? (
                    <p className="nk-note"><Icon name="eyeOff" size={16} /> {t('editor.hiddenNote')}</p>
                  ) : null}
                  <SectionFields key={section.id} t={t} section={section} onChange={(props) => patchSection(section.id, props)} onOpen={(kind) => setView({ kind })} />
                  <div className="nk-panel-foot">
                    <button type="button" className="nk-btn-ghost nk-btn-icon" onClick={() => toggleHidden(section.id)}>
                      <Icon name={section.hidden ? 'eye' : 'eyeOff'} size={16} /> {section.hidden ? t('editor.showSection') : t('editor.hideSection')}
                    </button>
                    <button type="button" className="nk-btn-danger nk-btn-icon" onClick={() => removeSection(section.id)}>
                      <Icon name="trash" size={16} /> {t('editor.deleteSection')}
                    </button>
                  </div>
                </Panel>
              ) : null}
              {view.kind === 'section' && !section ? (
                <Panel t={t} title={t('editor.content')} onBack={() => setView({ kind: 'home' })}>
                  <p className="nk-muted">{t('editor.missingSection')}</p>
                </Panel>
              ) : null}
              {view.kind === 'offer' ? (
                <Panel t={t} title={t('editor.offerTitle')} help={t('offer.helpIntro')} icon="tag" onBack={() => setView({ kind: 'home' })}>
                  <OfferFields t={t} offer={page.offer} onChange={(offer) => patch({ offer })} />
                </Panel>
              ) : null}
              {view.kind === 'checkout' ? (
                <Panel t={t} title={t('editor.checkoutTitle')} icon="card" onBack={() => setView({ kind: 'home' })}>
                  <CheckoutFields t={t} checkout={page.checkout} settings={settings} onChange={(checkout) => patch({ checkout })} onSetup={() => leave('payments')} />
                </Panel>
              ) : null}
              {view.kind === 'page' ? (
                <Panel t={t} title={t('editor.pageTitle')} icon="link" onBack={() => setView({ kind: 'home' })}>
                  <PageFields t={t} page={page} onChange={patch} onDelete={removePage} />
                </Panel>
              ) : null}
              {view.kind === 'colors' ? (
                <Panel t={t} title={t('editor.colorsTitle')} help={t('editor.colorsHelp')} icon="drop" onBack={() => setView({ kind: 'home' })}>
                  <ColorFields t={t} tokens={page.tokens} onChange={(tokens) => patch({ tokens })} />
                </Panel>
              ) : null}
            </aside>
            <section className="nk-ed-stage" aria-label={t('editor.preview')}>
              <div className="nk-ed-stage-bar">
                <span className="nk-muted">{t('editor.previewHint')}</span>
                {previewBusy ? <span className="nk-ed-busy">{t('editor.previewUpdating')}</span> : null}
              </div>
              <div className={`nk-device ${device === 'phone' ? 'is-phone' : 'is-desk'}`}>
                {device === 'desk' ? (
                  <div className="nk-device-bar" aria-hidden="true">
                    <i /><i /><i />
                    <span>{page.link || (window.location.origin + '/offer/' + page.slug + '/')}</span>
                  </div>
                ) : null}
                {previewError ? (
                  <div className="nk-banner">{t('editor.previewFailed')}</div>
                ) : (
                  <iframe ref={frameRef} title={t('editor.preview')} srcDoc={html} onLoad={onFrameLoad} />
                )}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </AsyncView>
  );
}

function Panel({ t, title, help, icon, onBack, children }) {
  return (
    <div className="nk-panel-view">
      <div className="nk-panel-head">
        <button type="button" className="nk-link-back" onClick={onBack}><Icon name="back" size={16} /> {t('editor.backToContent')}</button>
        <h2>{icon ? <span className="nk-head-icon"><Icon name={icon} /></span> : null}{title}</h2>
        {help ? <p className="nk-muted">{help}</p> : null}
      </div>
      <div className="nk-panel-body">{children}</div>
    </div>
  );
}

function ContentList({ t, page, onOpen, onToggle, onReorder, onAdd, onSettings }) {
  const dragRef = useRef(-1);
  const [over, setOver] = useState(-1);
  const sections = page.sections;
  const count = page.checkout.payments.length;
  const custom = Boolean(page.tokens && page.tokens.enabled);

  return (
    <div className="nk-panel-view">
      <div className="nk-panel-head">
        <h2>{t('editor.content')}</h2>
        <p className="nk-muted">{t('editor.contentHelp')}</p>
      </div>
      <div className="nk-panel-body">
        {sections.length === 0 ? <p className="nk-muted">{t('editor.emptyContent')}</p> : null}
        <ol className="nk-blocks">
          {sections.map((item, index) => (
            <li
              key={item.id}
              className={`nk-block${item.hidden ? ' is-hidden' : ''}${over === index ? ' is-over' : ''}`}
              draggable
              onDragStart={(event) => {
                dragRef.current = index;
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(index));
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (over !== index) setOver(index);
              }}
              onDragLeave={() => setOver(-1)}
              onDrop={(event) => {
                event.preventDefault();
                onReorder(dragRef.current, index);
                dragRef.current = -1;
                setOver(-1);
              }}
              onDragEnd={() => {
                dragRef.current = -1;
                setOver(-1);
              }}
            >
              <span className="nk-grip" title={t('editor.dragHint')}><Icon name="grip" size={16} /></span>
              <button type="button" className="nk-block-main" onClick={() => onOpen(item.id)}>
                <span className="nk-block-icon"><Icon name={SECTION_ICONS[item.type]} /></span>
                <span className="nk-block-text">
                  <strong>{t('section.' + item.type)}{item.hidden ? <em className="nk-tag">{t('editor.hiddenTag')}</em> : null}</strong>
                  <small>{summaryOf(item, t)}</small>
                </span>
              </button>
              <span className="nk-block-tools">
                <IconButton icon="up" label={t('editor.up')} disabled={index === 0} onClick={() => onReorder(index, index - 1)} />
                <IconButton icon="down" label={t('editor.down')} disabled={index === sections.length - 1} onClick={() => onReorder(index, index + 1)} />
                <IconButton icon={item.hidden ? 'eyeOff' : 'eye'} label={item.hidden ? t('editor.showSection') : t('editor.hideSection')} onClick={() => onToggle(item.id)} />
              </span>
            </li>
          ))}
        </ol>
        <button type="button" className="nk-add-block" onClick={onAdd}><Icon name="plus" /> {t('editor.add')}</button>

        <h3 className="nk-group-title">{t('editor.settings')}</h3>
        <div className="nk-nav-rows">
          <NavRow icon="tag" title={t('editor.offerTitle')} detail={money(page.offer.price) + ' · ' + t('offer.delivery') + ' ' + money(page.offer.shipping)} onClick={() => onSettings('offer')} />
          <NavRow icon="card" title={t('editor.checkoutTitle')} detail={t('editor.paymentsCount').replace('{n}', String(count))} onClick={() => onSettings('checkout')} />
          <NavRow icon="link" title={t('editor.pageTitle')} detail={'/offer/' + page.slug + '/'} onClick={() => onSettings('page')} />
          <NavRow icon="drop" title={t('editor.colorsTitle')} detail={custom ? t('editor.customColorsOn') : t('editor.brandColors')} onClick={() => onSettings('colors')} />
        </div>
      </div>
    </div>
  );
}

function NavRow({ icon, title, detail, onClick }) {
  return (
    <button type="button" className="nk-nav-row" onClick={onClick}>
      <span className="nk-block-icon"><Icon name={icon} /></span>
      <span className="nk-block-text"><strong>{title}</strong><small>{detail}</small></span>
      <Icon name="next" size={16} />
    </button>
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
      shipping: nextOutside,
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

function PageFields({ t, page, onChange, onDelete }) {
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

  const suffix = page.slug + '/';
  const base = page.link && page.link.endsWith(suffix)
    ? page.link.slice(0, page.link.length - suffix.length)
    : window.location.origin + '/offer/';
  const seo = page.seo || { title: '', description: '', imageUrl: '' };
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
      <TextField label={t('seo.title')} help={t('seo.titleHelp')} value={seo.title} maxLength={70} onChange={(title) => onChange({ seo: { ...seo, title } })} />
      <TextField label={t('seo.description')} help={t('seo.descriptionHelp')} value={seo.description} multiline maxLength={200} onChange={(description) => onChange({ seo: { ...seo, description } })} />
      <ImageField t={t} label={t('seo.image')} value={seo.imageUrl} onChange={(imageUrl) => onChange({ seo: { ...seo, imageUrl } })} />
      <div className="nk-ed-group">
        <h3 className="nk-group-title">{t('ab.title')}</h3>
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
      <div className="nk-danger">
        <h3>{t('editor.danger')}</h3>
        <p className="nk-help">{t('editor.dangerHelp')}</p>
        <button type="button" className="nk-btn-danger nk-btn-icon" onClick={onDelete}><Icon name="trash" size={16} /> {t('pages.delete')}</button>
      </div>
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
