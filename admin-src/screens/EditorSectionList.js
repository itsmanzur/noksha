import { useRef, useState } from '@wordpress/element';
import { Button } from '../ui';
import { Icon, IconButton, SECTION_ICONS, summaryOf } from './editorShared';

export function EditorSectionList({
  t,
  page,
  selectedId,
  onOpen,
  onToggle,
  onReorder,
  onAdd,
  onOpenSettings,
}) {
  const dragRef = useRef(-1);
  const [over, setOver] = useState(-1);
  const sections = page.sections;

  return (
    <div className="nk-panel-view nk-editor-sections">
      <div className="nk-panel-head">
        <h2>{t('editor.sections')}</h2>
        <p className="nk-muted">{t('editor.contentHelp')}</p>
      </div>
      <div className="nk-panel-body">
        <button type="button" className="nk-settings-entry" onClick={onOpenSettings}>
          <span className="nk-block-icon"><Icon name="tag" /></span>
          <span className="nk-block-text">
            <strong>{t('editor.pageSettings')}</strong>
            <small>{t('editor.settingsEntryHint')}</small>
          </span>
          <Icon name="chevron" size={16} />
        </button>
        {sections.length === 0 ? <p className="nk-muted">{t('editor.emptyContent')}</p> : null}
        <ol className="nk-blocks">
          {sections.map((item, index) => (
            <li
              key={item.id}
              className={`nk-block nk-section-row${item.hidden ? ' is-hidden' : ''}${over === index ? ' is-over' : ''}${selectedId === item.id ? ' is-active' : ''}`}
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
                  <strong>
                    {t('section.' + item.type)}
                    {item.hidden ? <em className="nk-tag">{t('editor.hiddenTag')}</em> : null}
                  </strong>
                  <small>{summaryOf(item, t)}</small>
                </span>
              </button>
              <span className="nk-block-tools">
                <IconButton icon="up" label={t('editor.up')} disabled={index === 0} onClick={() => onReorder(index, index - 1)} />
                <IconButton icon="down" label={t('editor.down')} disabled={index === sections.length - 1} onClick={() => onReorder(index, index + 1)} />
                <IconButton
                  icon={item.hidden ? 'eyeOff' : 'eye'}
                  label={item.hidden ? t('editor.showSection') : t('editor.hideSection')}
                  onClick={() => onToggle(item.id)}
                />
              </span>
            </li>
          ))}
        </ol>
        <Button variant="secondary" size="sm" className="nk-add-block" onClick={onAdd}>
          {t('editor.add')}
        </Button>
      </div>
    </div>
  );
}