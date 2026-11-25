import { useEffect, useRef, useState } from '@wordpress/element';
import { Badge, Button } from '../ui';

function Icon({ size = 18, children }) {
  return (
    <svg className="nk-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const BAR_ICONS = {
  phone: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  tablet: <><rect x="4" y="3" width="16" height="18" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></>,
  desktop: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
  chevron: <polyline points="6 9 12 15 18 9" />,
};

export function EditorTopBar({
  t,
  page,
  liveStatus,
  dirty,
  saving,
  stateText,
  canUndo,
  canRedo,
  device,
  fullscreen,
  onLeave,
  onTitleChange,
  onUndo,
  onRedo,
  onToggleFullscreen,
  onDevice,
  onSave,
  onSaveDraft,
  onUnpublish,
  onHistory,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    function onDocClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  const slugPath = '/offer/' + (page?.slug || '') + '/';

  const publishLabel = liveStatus === 'publish'
    ? (saving ? t('editor.saving') : t('editor.update'))
    : (saving === 'publish' ? t('editor.saving') : t('editor.publish'));

  function runPublish() {
    setMenuOpen(false);
    if (liveStatus === 'publish') {
      onSave();
    } else {
      onSave('publish');
    }
  }

  return (
    <header className="nk-editor-top nk-ed-top">
      <button type="button" className="nk-ed-back" onClick={() => onLeave('pages')}>
        <Icon size={16}><polyline points="15 18 9 12 15 6" /></Icon>
        <span>{t('editor.back')}</span>
      </button>

      <div className="nk-ed-name nk-editor-title-block">
        <input
          className="nk-editor-title-input"
          aria-label={t('editor.title')}
          value={page.title}
          placeholder={t('editor.title')}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <span className="nk-editor-slug nk-muted" title={t('editor.slug')}>{slugPath}</span>
      </div>

      <Badge variant={dirty ? 'danger' : 'brand'} className={`nk-editor-save-badge${dirty ? ' is-dirty' : ''}`}>{stateText}</Badge>

      <div className="nk-ed-actions nk-editor-top-actions">
        <Button variant="ghost" size="sm" disabled={!canUndo} title={t('editor.undo')} onClick={onUndo}>
          {t('editor.undo')}
        </Button>
        <Button variant="ghost" size="sm" disabled={!canRedo} title={t('editor.redo')} onClick={onRedo}>
          {t('editor.redo')}
        </Button>
        <Button variant="ghost" size="sm" title={t('editor.fullscreen')} aria-pressed={fullscreen} onClick={onToggleFullscreen}>
          {fullscreen ? t('editor.exitFull') : t('editor.fullscreen')}
        </Button>

        <div className="nk-seg nk-ed-device nk-phone-actions" role="group" aria-label={t('editor.device')}>
          {[
            ['phone', 'mobile', 'phone'],
            ['tablet', 'tablet', 'tablet'],
            ['desktop', 'desktop', 'desktop'],
          ].map(([key, labelKey, iconKey]) => (
            <button
              key={key}
              type="button"
              className={device === key ? 'is-active' : ''}
              aria-pressed={device === key}
              title={t('editor.' + labelKey)}
              onClick={() => onDevice(key)}
            >
              <Icon size={16}>{BAR_ICONS[iconKey]}</Icon>
              <span>{t('editor.' + labelKey)}</span>
            </button>
          ))}
        </div>

        {page.link && liveStatus === 'publish' ? (
          <a className="nk-btn-ghost nk-btn-icon" href={page.link} target="_blank" rel="noreferrer">
            <Icon size={16}>{BAR_ICONS.external}</Icon>
            {t('editor.viewLive')}
          </a>
        ) : null}

        <div className="nk-editor-publish-split" ref={menuRef}>
          <Button
            variant="primary"
            size="sm"
            loading={Boolean(saving)}
            disabled={Boolean(saving) || (liveStatus === 'publish' && !dirty)}
            title={t('editor.shortcut')}
            onClick={runPublish}
          >
            {publishLabel}
          </Button>
          <button
            type="button"
            className="nk-editor-publish-menu-btn"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            title={t('editor.publishMenu')}
            disabled={Boolean(saving)}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon size={16}>{BAR_ICONS.chevron}</Icon>
          </button>
          {menuOpen ? (
            <div className="nk-editor-publish-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onSaveDraft(); }}>
                {t('editor.saveDraft')}
              </button>
              {onHistory ? (
                <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onHistory(); }}>
                  {t('versions.open')}
                </button>
              ) : null}
              {liveStatus === 'publish' ? (
                <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onUnpublish(); }}>
                  {t('editor.unpublish')}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}