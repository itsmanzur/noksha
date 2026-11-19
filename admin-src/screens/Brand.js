import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView } from '../api';

const COLOR_KEYS = ['canvas', 'card', 'text', 'muted', 'border', 'brand', 'brandForeground', 'accent', 'success', 'warning', 'danger'];

export function Brand({ t, onPreview }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [presets, setPresets] = useState({});
  const [fonts, setFonts] = useState([]);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(null);
  const [notice, setNotice] = useState('');

  function load() {
    setStatus('loading');
    api('brand').then((data) => {
      setPresets(data.presets || {});
      setFonts(data.fonts || []);
      setDraft(data.tokens);
      setSaved(data.tokens);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);
  useEffect(() => {
    if (draft) onPreview(draft);
  }, [draft]);
  useEffect(() => () => {
    if (saved) onPreview(saved);
  }, [saved]);

  function setColor(key, value) {
    setDraft({ ...draft, preset: 'custom', color: { ...draft.color, [key]: value } });
  }

  function save(event) {
    event.preventDefault();
    api('brand', { method: 'PUT', body: draft }).then((data) => {
      setDraft(data.tokens);
      setSaved(data.tokens);
      setNotice(t('brand.saved'));
    }).catch((err) => setError(err.message));
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {draft ? (
        <form onSubmit={save}>
          <h1>{t('brand.title')}</h1>
          <p className="nk-lead">{t('brand.intro')}</p>
          {notice ? <p className="nk-banner is-ok">{notice}</p> : null}
          <div className="nk-swatches" aria-hidden="true">
            <i style={{ background: draft.color.brand }} />
            <i style={{ background: draft.color.accent }} />
            <i style={{ background: draft.color.canvas }} />
            <i style={{ background: draft.color.text }} />
          </div>
          <div className="nk-seg">
            {Object.keys(presets).map((name) => (
              <button key={name} type="button" className={draft.preset === name ? 'is-active' : ''} onClick={() => setDraft(presets[name])}>{t('brand.' + name)}</button>
            ))}
          </div>
          <h2>{t('brand.colors')}</h2>
          {COLOR_KEYS.map((key) => (
            <label key={key} className="nk-field">
              {t('brand.' + key)}
              <span className="nk-color">
                <input type="color" value={draft.color[key]} onChange={(event) => setColor(key, event.target.value.toUpperCase())} />
                <input value={draft.color[key]} onChange={(event) => setColor(key, event.target.value)} />
              </span>
            </label>
          ))}
          <label className="nk-field">
            {t('brand.font')}
            <select value={draft.font.sans} onChange={(event) => setDraft({ ...draft, preset: 'custom', font: { sans: event.target.value } })}>
              {fonts.concat(draft.font.sans).filter((font, index, list) => list.indexOf(font) === index).map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </label>
          <label className="nk-field">
            {t('brand.radius')}
            <select value={draft.radius} onChange={(event) => setDraft({ ...draft, preset: 'custom', radius: event.target.value })}>
              {['6px', '10px', '16px'].map((radius) => <option key={radius} value={radius}>{radius}</option>)}
            </select>
          </label>
          <div className="nk-row-actions">
            <button type="submit" className="nk-btn">{t('brand.save')}</button>
            <button type="button" className="nk-btn-ghost" onClick={() => setDraft(presets.ink)}>{t('brand.reset')}</button>
          </div>
        </form>
      ) : null}
    </AsyncView>
  );
}
