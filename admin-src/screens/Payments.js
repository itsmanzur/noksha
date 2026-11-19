import { useEffect, useMemo, useState } from '@wordpress/element';
import {
  Badge,
  Button,
  Card,
  CopyField,
  Drawer,
  Input,
  SecretField,
  Select,
  Skeleton,
  Textarea,
  Toggle,
} from '../ui';
import { api } from '../api';
import { useToast } from '../providers';

const GATEWAYS = ['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
const COURIERS = ['steadfast', 'pathao', 'redx'];
const PROVIDERS = [...GATEWAYS, ...COURIERS];

function generateSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let secret = '';
  for (let i = 0; i < 32; i += 1) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}

export function Payments({ t, onSandbox, locale }) {
  void locale;
  const { success } = useToast();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);
  const [password, setPassword] = useState('');
  const [smsKey, setSmsKey] = useState('');
  const [courierSecrets, setCourierSecrets] = useState({});
  const [drawerId, setDrawerId] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    setStatus('loading');
    api('settings')
      .then((data) => {
        setSettings(data);
        setStatus('ready');
      })
      .catch((err) => {
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

  function providerLabel(id) {
    if (COURIERS.includes(id)) return t('courier.' + id);
    return t('pay.' + id);
  }

  function providerStatus(id) {
    if (!settings) return 'off';
    const isCourier = COURIERS.includes(id);
    const enabled = isCourier
      ? Boolean(settings.couriers?.[id]?.enabled)
      : Boolean(settings.gateways?.[id]?.enabled);
    if (!enabled) return 'off';
    if (id === 'cod') return 'ready';
    if (id === 'sslcommerz') {
      return settings.ssl_ready && settings.sslcommerz_store_id ? 'ready' : 'needs';
    }
    if (id === 'manual_bkash') {
      return settings.walletVerify?.bkash || settings.has_bkash_api ? 'ready' : 'needs';
    }
    if (id === 'manual_nagad') {
      return settings.walletVerify?.nagad || settings.has_nagad_api ? 'ready' : 'needs';
    }
    if (settings.shipping?.couriers?.[id]?.ready) return 'ready';
    return 'needs';
  }

  function statusLabel(code) {
    if (code === 'ready') return t('payments.statusReady');
    if (code === 'needs') return t('payments.statusNeedsKeys');
    return t('payments.statusOff');
  }

  function save(event) {
    event?.preventDefault?.();
    if (!settings) return;
    setSaving(true);
    setError('');
    const body = {
      ...settings,
      sslcommerz_store_passwd: password,
      sms_api_key: smsKey,
      ...courierSecrets,
    };
    api('settings', { method: 'PUT', body })
      .then((data) => {
        setSettings(data);
        setPassword('');
        setSmsKey('');
        setCourierSecrets({});
        setDrawerId('');
        success(t('payments.saved'));
        onSandbox(Boolean(data.sandbox));
      })
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  }

  const sslOn = settings && settings.gateways?.sslcommerz?.enabled;
  const sslMissing = sslOn && !settings.ssl_ready && password === '';

  const drawerTitle = drawerId ? providerLabel(drawerId) : '';

  const drawerBody = useMemo(() => {
    if (!settings || !drawerId) return null;
    if (drawerId === 'cod') {
      return <p className="nk-muted">{t('payments.codHelp')}</p>;
    }
    if (drawerId === 'manual_bkash' || drawerId === 'manual_nagad') {
      const gw = settings.gateways[drawerId];
      return (
        <div className="nk-detail-stack">
          <Input
            label={t('payments.number')}
            value={gw.number || ''}
            onChange={(e) => patchGateway(drawerId, { number: e.target.value })}
          />
          <Textarea
            label={t('payments.instructions')}
            rows={3}
            value={gw.instructions || ''}
            onChange={(e) => patchGateway(drawerId, { instructions: e.target.value })}
          />
          <Toggle
            checked={Boolean(gw.auto_verify)}
            onChange={(checked) => patchGateway(drawerId, { auto_verify: checked })}
            label={t('payments.autoVerify')}
          />
          <p className="nk-muted">{t('payments.autoVerifyHelp')}</p>
          <Card padding={false}>
            <p className="nk-muted" style={{ padding: 12, margin: 0 }}>{t('payments.autoVerifyNote')}</p>
          </Card>
          {drawerId === 'manual_bkash' ? (
            <>
              <SecretField
                label={t('payments.bkashAppKey')}
                value={courierSecrets.bkash_app_key || ''}
                onChange={(v) => setCourierSecrets({ ...courierSecrets, bkash_app_key: v })}
                saved={settings.has_bkash_api}
              />
              <SecretField
                label={t('payments.bkashAppSecret')}
                value={courierSecrets.bkash_app_secret || ''}
                onChange={(v) => setCourierSecrets({ ...courierSecrets, bkash_app_secret: v })}
                saved={false}
              />
              <SecretField
                label={t('payments.bkashUser')}
                value={courierSecrets.bkash_username || ''}
                onChange={(v) => setCourierSecrets({ ...courierSecrets, bkash_username: v })}
                saved={false}
              />
              <SecretField
                label={t('payments.bkashPass')}
                value={courierSecrets.bkash_password || ''}
                onChange={(v) => setCourierSecrets({ ...courierSecrets, bkash_password: v })}
                saved={false}
              />
              {settings.walletVerify?.bkash ? <Badge>{t('payments.walletReady')}</Badge> : null}
            </>
          ) : (
            <>
              <SecretField
                label={t('payments.nagadMerchant')}
                value={courierSecrets.nagad_merchant_id || ''}
                onChange={(v) => setCourierSecrets({ ...courierSecrets, nagad_merchant_id: v })}
                saved={settings.has_nagad_api}
              />
              <Input
                label={t('payments.nagadVerifyUrl')}
                value={courierSecrets.nagad_verify_url || ''}
                onChange={(e) => setCourierSecrets({ ...courierSecrets, nagad_verify_url: e.target.value })}
              />
              {settings.walletVerify?.nagad ? <Badge>{t('payments.walletReady')}</Badge> : null}
            </>
          )}
        </div>
      );
    }
    if (drawerId === 'sslcommerz') {
      return (
        <div className="nk-detail-stack">
          <Input
            label={t('payments.storeId')}
            value={settings.sslcommerz_store_id || ''}
            onChange={(e) => setSettings({ ...settings, sslcommerz_store_id: e.target.value })}
          />
          <SecretField
            label={t('payments.password')}
            value={password}
            onChange={setPassword}
            saved={settings.ssl_ready}
          />
          <p className="nk-muted">{t('payments.passwordHelp')}</p>
          {sslMissing ? <p className="nk-muted">{t('payments.missing')}</p> : null}
        </div>
      );
    }
    if (drawerId === 'steadfast') {
      return (
        <div className="nk-detail-stack">
          <SecretField
            label={t('payments.apiKey')}
            value={courierSecrets.steadfast_api_key || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, steadfast_api_key: v })}
            saved={settings.shipping?.couriers?.steadfast?.has_keys}
          />
          <SecretField
            label={t('payments.secretKey')}
            value={courierSecrets.steadfast_secret_key || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, steadfast_secret_key: v })}
            saved={false}
          />
        </div>
      );
    }
    if (drawerId === 'pathao') {
      return (
        <div className="nk-detail-stack">
          <Input
            label={t('payments.storeId')}
            value={settings.couriers?.pathao?.store_id || ''}
            onChange={(e) => patchCourier('pathao', { store_id: e.target.value })}
          />
          <SecretField
            label="Client ID"
            value={courierSecrets.pathao_client_id || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, pathao_client_id: v })}
            saved={false}
          />
          <SecretField
            label="Client secret"
            value={courierSecrets.pathao_client_secret || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, pathao_client_secret: v })}
            saved={false}
          />
          <Input
            label="Username"
            value={courierSecrets.pathao_username || ''}
            onChange={(e) => setCourierSecrets({ ...courierSecrets, pathao_username: e.target.value })}
          />
          <SecretField
            label="Password"
            value={courierSecrets.pathao_password || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, pathao_password: v })}
            saved={false}
          />
        </div>
      );
    }
    if (drawerId === 'redx') {
      return (
        <div className="nk-detail-stack">
          <Input
            label={t('payments.storeId')}
            value={settings.couriers?.redx?.store_id || ''}
            onChange={(e) => patchCourier('redx', { store_id: e.target.value })}
          />
          <SecretField
            label={t('payments.apiKey')}
            value={courierSecrets.redx_api_key || ''}
            onChange={(v) => setCourierSecrets({ ...courierSecrets, redx_api_key: v })}
            saved={settings.shipping?.couriers?.redx?.has_keys}
          />
        </div>
      );
    }
    return null;
  }, [settings, drawerId, password, courierSecrets, sslMissing, t]);

  if (status === 'loading' && !settings) {
    return (
      <div className="nk-screen">
        <Skeleton height={48} />
        <p className="nk-muted">{t('common.loading')}</p>
      </div>
    );
  }

  if (status === 'error' && !settings) {
    return (
      <Card>
        <p className="nk-muted">{error || t('common.error')}</p>
        <Button onClick={load}>{t('common.retry')}</Button>
      </Card>
    );
  }

  if (!settings) return null;

  return (
    <form className="nk-screen" onSubmit={save}>
      <header className="nk-screen-header">
        <div>
          <h1>{t('payments.title')}</h1>
          <p className="nk-muted">{t('payments.intro')}</p>
        </div>
        <div className="nk-screen-actions">
          <Toggle
            checked={Boolean(settings.sandbox)}
            onChange={(checked) => {
              setSettings({ ...settings, sandbox: checked });
              onSandbox(checked);
            }}
            label={settings.sandbox ? t('payments.sandboxMode') : t('payments.live')}
          />
        </div>
      </header>

      {!settings.sandbox ? (
        <Card>
          <p className="nk-muted" style={{ margin: 0 }}>{t('payments.liveWarning')}</p>
        </Card>
      ) : (
        <p className="nk-muted">{t('payments.sandboxHelp')}</p>
      )}

      {error ? (
        <Card>
          <p className="nk-muted">{error}</p>
        </Card>
      ) : null}

      <h2 style={{ margin: 0 }}>{t('payments.providers')}</h2>
      <div className="nk-provider-grid">
        {PROVIDERS.map((id) => {
          const isCourier = COURIERS.includes(id);
          const enabled = isCourier
            ? Boolean(settings.couriers?.[id]?.enabled)
            : Boolean(settings.gateways?.[id]?.enabled);
          const chip = providerStatus(id);
          return (
            <div key={id} className="nk-provider-card">
              <div className="nk-provider-head">
                <strong>{providerLabel(id)}</strong>
                <Badge>{statusLabel(chip)}</Badge>
              </div>
              <Toggle
                checked={enabled}
                onChange={(checked) => {
                  if (isCourier) patchCourier(id, { enabled: checked });
                  else patchGateway(id, { enabled: checked });
                }}
                label={t('payments.enabled')}
              />
              <Button type="button" variant="secondary" size="sm" onClick={() => setDrawerId(id)}>
                {t('payments.configure')}
              </Button>
            </div>
          );
        })}
      </div>

      <Card title={t('payments.webhooks')}>
        <p className="nk-muted">{t('payments.webhooksHelp')}</p>
        <p className="nk-muted">{t('payments.webhookHeader')}</p>
        <SecretField
          label={t('payments.webhookSecret')}
          value={courierSecrets.courier_webhook_secret || ''}
          onChange={(v) => setCourierSecrets({ ...courierSecrets, courier_webhook_secret: v })}
          saved={settings.has_courier_webhook_secret}
        />
        <Button type="button" variant="ghost" onClick={() => setCourierSecrets({ ...courierSecrets, courier_webhook_secret: generateSecret() })}>
          {t('payments.generateSecret')}
        </Button>
        {(settings.webhookUrls ? Object.entries(settings.webhookUrls) : []).map(([id, url]) => (
          <CopyField key={id} label={t('courier.' + id)} value={url} />
        ))}
      </Card>

      <Card title={t('payments.smsBlock')}>
        <p className="nk-muted">{t('payments.smsHelp')}</p>
        <Toggle
          checked={Boolean(settings.sms?.enabled)}
          onChange={(checked) => setSettings({ ...settings, sms: { ...(settings.sms || {}), enabled: checked } })}
          label={t('payments.smsEnabled')}
        />
        <Input
          label={t('payments.smsSender')}
          value={settings.sms?.sender || ''}
          onChange={(e) => setSettings({ ...settings, sms: { ...(settings.sms || {}), sender: e.target.value } })}
        />
        <SecretField
          label={t('payments.smsKey')}
          value={smsKey}
          onChange={setSmsKey}
          saved={settings.has_sms_key}
        />
        <Select
          label={t('payments.otpMode')}
          value={settings.sms?.otp_mode || 'risk'}
          onChange={(e) => setSettings({ ...settings, sms: { ...(settings.sms || {}), otp_mode: e.target.value } })}
        >
          <option value="off">{t('payments.otpOff')}</option>
          <option value="risk">{t('payments.otpRisk')}</option>
          <option value="always">{t('payments.otpAlways')}</option>
        </Select>
        <p className="nk-muted">{t('payments.otpHelp')}</p>
      </Card>

      <div className="nk-sticky-save">
        <Button type="submit" loading={saving}>
          {t('common.save')}
        </Button>
      </div>

      <Drawer
        open={Boolean(drawerId)}
        onClose={() => setDrawerId('')}
        title={drawerTitle}
        width={420}
      >
        {drawerBody}
        <div className="nk-screen-actions" style={{ marginTop: 16 }}>
          <Button type="submit" loading={saving}>
            {t('common.save')}
          </Button>
        </div>
      </Drawer>
    </form>
  );
}