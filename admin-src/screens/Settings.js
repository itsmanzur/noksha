import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView } from '../api';

export function Settings({ t }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);
  const [notice, setNotice] = useState('');
  const [capiToken, setCapiToken] = useState('');

  function load() {
    setStatus('loading');
    api('settings').then((data) => {
      setSettings(data);
      setCapiToken('');
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);

  function save(event) {
    event.preventDefault();
    const body = { ...settings };
    if (capiToken.trim() !== '') {
      body.meta_capi_token = capiToken.trim();
    }
    api('settings', { method: 'PUT', body }).then((data) => {
      setSettings(data);
      setCapiToken('');
      setNotice(t('settings.saved'));
      api('onboarding', { method: 'PUT', body: { pixels: true } }).catch(() => {});
    }).catch((err) => setError(err.message));
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {settings ? (
        <form onSubmit={save}>
          <h1>{t('settings.title')}</h1>
          {notice ? <p className="nk-banner is-ok">{notice}</p> : null}
          <label className="nk-field">
            {t('settings.region')}
            <select value="bd" disabled>
              <option value="bd">{t('settings.regionBd')}</option>
              <option value="global">{t('settings.regionGlobal')}</option>
            </select>
          </label>
          <p className="nk-muted">{t('settings.regionHelp')}</p>
          <label className="nk-field">
            {t('settings.language')}
            <select value={settings.default_language} onChange={(event) => setSettings({ ...settings, default_language: event.target.value })}>
              <option value="en">{t('settings.english')}</option>
              <option value="bn">{t('settings.bangla')}</option>
            </select>
          </label>
          <h2>{t('settings.pixels')}</h2>
          <p className="nk-muted">{t('settings.pixelsHelp')}</p>
          <label className="nk-field">{t('settings.meta')}<input value={settings.pixels.meta} onChange={(event) => setSettings({ ...settings, pixels: { ...settings.pixels, meta: event.target.value } })} /></label>
          <label className="nk-field">
            {t('settings.metaCapi')}
            <input type="password" autoComplete="off" placeholder={settings.has_meta_capi_token ? t('settings.metaCapiSet') : t('settings.metaCapiPlaceholder')} value={capiToken} onChange={(event) => setCapiToken(event.target.value)} />
          </label>
          <p className="nk-muted">{t('settings.metaCapiHelp')}</p>
          <label className="nk-field">{t('settings.ga4')}<input value={settings.pixels.ga4} onChange={(event) => setSettings({ ...settings, pixels: { ...settings.pixels, ga4: event.target.value } })} /></label>
          <label className="nk-field">{t('settings.tiktok')}<input value={settings.pixels.tiktok} onChange={(event) => setSettings({ ...settings, pixels: { ...settings.pixels, tiktok: event.target.value } })} /></label>
          <button type="submit" className="nk-btn">{t('common.save')}</button>
        </form>
      ) : null}
    </AsyncView>
  );
}
