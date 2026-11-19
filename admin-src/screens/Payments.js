import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView } from '../api';

export function Payments({ t, onSandbox }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);
  const [password, setPassword] = useState('');
  const [smsKey, setSmsKey] = useState('');
  const [courierSecrets, setCourierSecrets] = useState({});
  const [notice, setNotice] = useState('');

  function load() {
    setStatus('loading');
    api('settings').then((data) => {
      setSettings(data);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);

  function patchGateway(id, partial) {
    setSettings({
      ...settings,
      gateways: {
        ...settings.gateways,
        [id]: { ...settings.gateways[id], ...partial },
      },
    });
  }

  function patchCourier(id, partial) {
    setSettings({
      ...settings,
      couriers: {
        ...settings.couriers,
        [id]: { ...(settings.couriers?.[id] || {}), ...partial },
      },
    });
  }

  function save(event) {
    event.preventDefault();
    setNotice('');
    const body = {
      ...settings,
      sslcommerz_store_passwd: password,
      sms_api_key: smsKey,
      ...courierSecrets,
    };
    api('settings', {
      method: 'PUT',
      body,
    }).then((data) => {
      setSettings(data);
      setPassword('');
      setSmsKey('');
      setCourierSecrets({});
      setNotice(t('payments.saved'));
      onSandbox(Boolean(data.sandbox));
    }).catch((err) => setError(err.message));
  }

  const sslOn = settings && settings.gateways.sslcommerz.enabled;
  const sslMissing = sslOn && !settings.ssl_ready && password === '';

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {settings ? (
        <form onSubmit={save}>
          <h1>{t('payments.title')}</h1>
          <p className="nk-lead">{t('payments.intro')}</p>
          {notice ? <p className="nk-banner is-ok">{notice}</p> : null}
          {error ? <p className="nk-banner">{error}</p> : null}
          <label className="nk-check">
            <input type="checkbox" checked={settings.sandbox} onChange={(event) => setSettings({ ...settings, sandbox: event.target.checked })} />
            {t('payments.sandbox')}
          </label>
          <p className="nk-muted">{t('payments.sandboxHelp')}</p>
          {['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'].map((id) => (
            <div key={id} className="nk-card" style={{ marginBottom: 12 }}>
              <h2>{t('pay.' + id)}</h2>
              <label className="nk-check">
                <input type="checkbox" checked={settings.gateways[id].enabled} onChange={(event) => patchGateway(id, { enabled: event.target.checked })} />
                {t('payments.enabled')}
              </label>
              {id === 'manual_bkash' || id === 'manual_nagad' ? (
                <>
                  <label className="nk-field">{t('payments.number')}<input value={settings.gateways[id].number || ''} onChange={(event) => patchGateway(id, { number: event.target.value })} /></label>
                  <label className="nk-field">{t('payments.instructions')}<textarea rows="3" value={settings.gateways[id].instructions || ''} onChange={(event) => patchGateway(id, { instructions: event.target.value })} /></label>
                </>
              ) : null}
              {id === 'sslcommerz' ? (
                <>
                  <label className="nk-field">{t('payments.storeId')}<input value={settings.sslcommerz_store_id || ''} onChange={(event) => setSettings({ ...settings, sslcommerz_store_id: event.target.value })} /></label>
                  <label className="nk-field">{t('payments.password')}<input type="password" value={password} autoComplete="new-password" onChange={(event) => setPassword(event.target.value)} /></label>
                  <p className="nk-muted">{t('payments.passwordHelp')}</p>
                  {sslMissing ? <p className="nk-banner">{t('payments.missing')}</p> : null}
                </>
              ) : null}
            </div>
          ))}
          <h2>{t('payments.sms')}</h2>
          <p className="nk-muted">{t('payments.smsHelp')}</p>
          <label className="nk-check">
            <input type="checkbox" checked={Boolean(settings.sms?.enabled)} onChange={(event) => setSettings({ ...settings, sms: { ...(settings.sms || {}), enabled: event.target.checked } })} />
            {t('payments.smsEnabled')}
          </label>
          <label className="nk-field">{t('payments.smsSender')}<input value={settings.sms?.sender || ''} onChange={(event) => setSettings({ ...settings, sms: { ...(settings.sms || {}), sender: event.target.value } })} /></label>
          <label className="nk-field">{t('payments.smsKey')}<input type="password" value={smsKey} placeholder={settings.has_sms_key ? t('payments.secretSet') : ''} onChange={(event) => setSmsKey(event.target.value)} /></label>
          <label className="nk-field">
            {t('payments.otpMode')}
            <select value={settings.sms?.otp_mode || 'risk'} onChange={(event) => setSettings({ ...settings, sms: { ...(settings.sms || {}), otp_mode: event.target.value } })}>
              <option value="off">{t('payments.otpOff')}</option>
              <option value="risk">{t('payments.otpRisk')}</option>
              <option value="always">{t('payments.otpAlways')}</option>
            </select>
          </label>
          <p className="nk-muted">{t('payments.otpHelp')}</p>

          <h2>{t('payments.couriers')}</h2>
          <p className="nk-muted">{t('payments.couriersHelp')}</p>
          {['steadfast', 'pathao', 'redx'].map((id) => (
            <div key={id} className="nk-card" style={{ marginBottom: 12 }}>
              <h2>{t('courier.' + id)}</h2>
              <label className="nk-check">
                <input type="checkbox" checked={Boolean(settings.couriers?.[id]?.enabled)} onChange={(event) => patchCourier(id, { enabled: event.target.checked })} />
                {t('payments.enabled')}
              </label>
              {id === 'steadfast' ? (
                <>
                  <label className="nk-field">{t('payments.apiKey')}<input type="password" value={courierSecrets.steadfast_api_key || ''} placeholder={settings.shipping?.couriers?.steadfast?.has_keys ? t('payments.secretSet') : ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, steadfast_api_key: event.target.value })} /></label>
                  <label className="nk-field">{t('payments.secretKey')}<input type="password" value={courierSecrets.steadfast_secret_key || ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, steadfast_secret_key: event.target.value })} /></label>
                </>
              ) : null}
              {id === 'pathao' ? (
                <>
                  <label className="nk-field">{t('payments.storeId')}<input value={settings.couriers?.pathao?.store_id || ''} onChange={(event) => patchCourier('pathao', { store_id: event.target.value })} /></label>
                  <label className="nk-field">Client ID<input type="password" value={courierSecrets.pathao_client_id || ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, pathao_client_id: event.target.value })} /></label>
                  <label className="nk-field">Client secret<input type="password" value={courierSecrets.pathao_client_secret || ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, pathao_client_secret: event.target.value })} /></label>
                  <label className="nk-field">Username<input value={courierSecrets.pathao_username || ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, pathao_username: event.target.value })} /></label>
                  <label className="nk-field">Password<input type="password" value={courierSecrets.pathao_password || ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, pathao_password: event.target.value })} /></label>
                </>
              ) : null}
              {id === 'redx' ? (
                <>
                  <label className="nk-field">{t('payments.storeId')}<input value={settings.couriers?.redx?.store_id || ''} onChange={(event) => patchCourier('redx', { store_id: event.target.value })} /></label>
                  <label className="nk-field">{t('payments.apiKey')}<input type="password" value={courierSecrets.redx_api_key || ''} placeholder={settings.shipping?.couriers?.redx?.has_keys ? t('payments.secretSet') : ''} onChange={(event) => setCourierSecrets({ ...courierSecrets, redx_api_key: event.target.value })} /></label>
                </>
              ) : null}
              {settings.shipping?.couriers?.[id]?.ready ? <p className="nk-banner is-ok">{t('payments.courierReady')}</p> : <p className="nk-muted">{t('payments.courierNeedKeys')}</p>}
            </div>
          ))}
          <button type="submit" className="nk-btn">{t('common.save')}</button>
        </form>
      ) : null}
    </AsyncView>
  );
}
