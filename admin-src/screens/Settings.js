import { useEffect, useMemo, useState } from '@wordpress/element';
import { api } from '../api';
import { useToast } from '../providers';
import {
  Button,
  Card,
  Input,
  RadioCards,
  SecretField,
  Select,
  Skeleton,
  Textarea,
  Toggle,
} from '../ui';

const SMS_EVENTS = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const TABS = [
  { id: 'general', labelKey: 'settings.tabGeneral' },
  { id: 'tracking', labelKey: 'settings.tabTracking' },
  { id: 'sms', labelKey: 'settings.tabSms' },
  { id: 'fraud', labelKey: 'settings.tabFraud' },
  { id: 'advanced', labelKey: 'settings.tabAdvanced' },
];

function snapshot(settings, capiToken, smsKey, bnDigits) {
  return JSON.stringify({ settings, capiToken, smsKey, bnDigits });
}

function pixelsConfigured(pixels) {
  if (!pixels) {
    return false;
  }
  return Boolean((pixels.meta || '').trim() || (pixels.ga4 || '').trim() || (pixels.tiktok || '').trim());
}

export function Settings({ t, locale }) {
  const { success, error: toastError } = useToast();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);
  const [baseline, setBaseline] = useState('');
  const [tab, setTab] = useState('general');
  const [capiToken, setCapiToken] = useState('');
  const [smsKey, setSmsKey] = useState('');
  const [bnDigits, setBnDigits] = useState(() => window.localStorage.getItem('noksha_bn_digits') === '1');
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testing, setTesting] = useState(false);

  function sendTest() {
    if (testing || testPhone.trim() === '') {
      return;
    }
    setTesting(true);
    api('sms/test', { method: 'POST', body: { phone: testPhone.trim() } })
      .then((result) => {
        if (result.ok) {
          success(t('sms.testSent'));
        } else {
          toastError(`${t('sms.testFailed')} ${result.body || result.error || ''}`.trim());
        }
      })
      .catch((err) => toastError(err.message || t('common.error')))
      .finally(() => setTesting(false));
  }

  function load() {
    setStatus('loading');
    setError('');
    api('settings')
      .then((data) => {
        setSettings(data);
        setCapiToken('');
        setSmsKey('');
        const digits = window.localStorage.getItem('noksha_bn_digits') === '1';
        setBnDigits(digits);
        setBaseline(snapshot(data, '', '', digits));
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message || t('common.error'));
        setStatus('error');
      });
  }

  useEffect(load, []);

  const dirty = useMemo(() => {
    if (!settings) {
      return false;
    }
    return snapshot(settings, capiToken, smsKey, bnDigits) !== baseline;
  }, [settings, capiToken, smsKey, bnDigits, baseline]);

  function patch(partial) {
    setSettings({ ...settings, ...partial });
  }

  function discard() {
    if (!baseline) {
      return;
    }
    try {
      const parsed = JSON.parse(baseline);
      setSettings(parsed.settings);
      setCapiToken(parsed.capiToken || '');
      setSmsKey(parsed.smsKey || '');
      setBnDigits(Boolean(parsed.bnDigits));
    } catch {
      load();
    }
  }

  function save(event) {
    event?.preventDefault?.();
    if (!settings || saving) {
      return;
    }
    setSaving(true);
    const body = { ...settings };
    if (capiToken.trim() !== '') {
      body.meta_capi_token = capiToken.trim();
    }
    if (smsKey.trim() !== '') {
      body.sms_api_key = smsKey.trim();
    }
    api('settings', { method: 'PUT', body })
      .then((data) => {
        setSettings(data);
        setCapiToken('');
        setSmsKey('');
        window.localStorage.setItem('noksha_bn_digits', bnDigits ? '1' : '0');
        const nextBaseline = snapshot(data, '', '', bnDigits);
        setBaseline(nextBaseline);
        success(t('settings.saved'));
        if (pixelsConfigured(data.pixels)) {
          api('onboarding', { method: 'PUT', body: { pixels: true } }).catch(() => {});
        }
      })
      .catch((err) => toastError(err.message || t('common.error')))
      .finally(() => setSaving(false));
  }

  if (status === 'error') {
    return (
      <div className="nk-screen">
        <h1>{t('settings.title')}</h1>
        <Card>
          <p>{error}</p>
          <Button onClick={load}>{t('common.retry')}</Button>
        </Card>
      </div>
    );
  }

  if (!settings || status === 'loading') {
    return (
      <div className="nk-screen">
        <h1>{t('settings.title')}</h1>
        <Skeleton height={320} />
      </div>
    );
  }

  const otpOptions = [
    { value: 'off', label: t('payments.otpOff'), description: t('payments.otpHelp') },
    { value: 'risk', label: t('payments.otpRisk'), description: t('payments.otpHelp') },
    { value: 'always', label: t('payments.otpAlways'), description: t('payments.otpHelp') },
  ];

  let panel = null;
  if (tab === 'general') {
    panel = (
      <Card title={t('settings.tabGeneral')}>
        <Select
          label={t('settings.language')}
          value={settings.default_language}
          onChange={(e) => patch({ default_language: e.target.value })}
        >
          <option value="en">{t('settings.english')}</option>
          <option value="bn">{t('settings.bangla')}</option>
        </Select>
        <Input
          label={t('settings.storeName')}
          help={t('settings.storeNameHelp')}
          value={settings.store_name || ''}
          onChange={(e) => patch({ store_name: e.target.value })}
          placeholder={typeof window !== 'undefined' ? (window.nokshaBoot?.storeName || '') : ''}
        />
        <Toggle
          label={t('settings.bnDigits')}
          help={t('settings.bnDigitsHelp')}
          checked={bnDigits}
          onChange={setBnDigits}
        />
        <p className="nk-muted">{t('settings.regionHelp')}</p>
        <Select label={t('settings.region')} value="bd" disabled>
          <option value="bd">{t('settings.regionBd')}</option>
        </Select>
      </Card>
    );
  } else if (tab === 'tracking') {
    panel = (
      <Card title={t('settings.pixels')}>
        <p className="nk-muted">{t('settings.pixelsHelp')}</p>
        <Input
          label={t('settings.meta')}
          value={settings.pixels?.meta || ''}
          onChange={(e) => patch({ pixels: { ...settings.pixels, meta: e.target.value } })}
        />
        <Input
          label={t('settings.ga4')}
          value={settings.pixels?.ga4 || ''}
          onChange={(e) => patch({ pixels: { ...settings.pixels, ga4: e.target.value } })}
        />
        <Input
          label={t('settings.tiktok')}
          value={settings.pixels?.tiktok || ''}
          onChange={(e) => patch({ pixels: { ...settings.pixels, tiktok: e.target.value } })}
        />
        <Input
          label={t('settings.metaTest')}
          help={t('settings.metaTestHelp')}
          value={settings.pixels?.meta_test || ''}
          onChange={(e) => patch({ pixels: { ...settings.pixels, meta_test: e.target.value } })}
        />
        <SecretField
          label={t('settings.metaCapi')}
          help={t('settings.metaCapiHelp')}
          saved={Boolean(settings.has_meta_capi_token)}
          savedLabel={t('settings.metaCapiSet')}
          placeholder={t('settings.metaCapiPlaceholder')}
          lockedByConstant={Boolean(settings.locked_by_constant?.meta_capi_token)}
          value={capiToken}
          onChange={setCapiToken}
        />
      </Card>
    );
  } else if (tab === 'sms') {
    panel = (
      <Card title={t('payments.sms')}>
        <p className="nk-muted">{t('payments.smsHelp')}</p>
        <Toggle
          label={t('payments.smsEnabled')}
          checked={Boolean(settings.sms?.enabled)}
          onChange={(v) => patch({ sms: { ...(settings.sms || {}), enabled: v } })}
        />
        <Input
          label={t('payments.smsSender')}
          value={settings.sms?.sender || ''}
          onChange={(e) => patch({ sms: { ...(settings.sms || {}), sender: e.target.value } })}
        />
        <SecretField
          label={t('payments.smsKey')}
          saved={Boolean(settings.has_sms_key)}
          savedLabel={t('payments.secretSet')}
          lockedByConstant={Boolean(settings.locked_by_constant?.sms_api_key)}
          value={smsKey}
          onChange={setSmsKey}
        />
        <RadioCards
          legend={t('payments.otpMode')}
          value={settings.sms?.otp_mode || 'risk'}
          onChange={(v) => patch({ sms: { ...(settings.sms || {}), otp_mode: v } })}
          options={otpOptions}
        />
        <Input
          type="number"
          label={t('settings.otpTtl')}
          value={String(settings.sms?.otp_ttl ?? 300)}
          onChange={(e) => patch({ sms: { ...(settings.sms || {}), otp_ttl: Number(e.target.value) || 300 } })}
        />
        <h3 style={{ margin: '20px 0 4px' }}>{t('sms.testTitle')}</h3>
        <p className="nk-muted" style={{ margin: 0 }}>{t('sms.testHelp')}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
          <Input
            label={t('sms.testPhone')}
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />
          <Button type="button" variant="secondary" onClick={sendTest} disabled={testing || testPhone.trim() === ''}>
            {t('sms.testSend')}
          </Button>
        </div>
        <h3 style={{ margin: '24px 0 4px' }}>{t('sms.eventsTitle')}</h3>
        <p className="nk-muted" style={{ margin: 0 }}>{t('sms.eventsHelp')}</p>
        {SMS_EVENTS.map((event) => {
          const row = settings.sms?.events?.[event] || {};
          const defaults = settings.sms_defaults?.[event] || {};
          const setRow = (partial) => patch({
            sms: {
              ...(settings.sms || {}),
              events: { ...(settings.sms?.events || {}), [event]: { ...row, ...partial } },
            },
          });
          return (
            <div key={event} style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--nk-border)' }}>
              <Toggle
                label={t(`sms.event.${event}`)}
                help={event === 'cancelled' ? t('sms.cancelledHelp') : undefined}
                checked={Boolean(row.enabled)}
                onChange={(v) => setRow({ enabled: v })}
              />
              <Textarea
                label={t('sms.textEn')}
                rows={2}
                maxLength={320}
                value={row.en || ''}
                placeholder={defaults.en || ''}
                onChange={(e) => setRow({ en: e.target.value })}
              />
              <Textarea
                label={t('sms.textBn')}
                rows={2}
                maxLength={320}
                value={row.bn || ''}
                placeholder={defaults.bn || ''}
                onChange={(e) => setRow({ bn: e.target.value })}
              />
            </div>
          );
        })}
      </Card>
    );
  } else if (tab === 'fraud') {
    panel = (
      <Card title={t('settings.tabFraud')}>
        <p className="nk-muted">{t('settings.fraudHelp')}</p>
      </Card>
    );
  } else {
    panel = (
      <Card title={t('settings.tabAdvanced')}>
        <p className="nk-muted">{t('settings.advancedHelp')}</p>
        <div className="nk-screen-actions">
          <Button variant="secondary" onClick={() => { window.location.hash = '#/payments'; }}>{t('nav.payments')}</Button>
          <Button variant="secondary" onClick={() => { window.location.hash = '#/brand'; }}>{t('nav.brand')}</Button>
        </div>
      </Card>
    );
  }

  return (
    <form className="nk-screen" onSubmit={save}>
      <header className="nk-screen-header">
        <h1>{t('settings.title')}</h1>
      </header>
      <div className="nk-settings-layout">
        <nav className="nk-settings-nav" aria-label={t('settings.title')}>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'is-active' : ''}
              onClick={() => setTab(item.id)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
        <div>{panel}</div>
      </div>
      {dirty ? (
        <div className="nk-sticky-save">
          <span className="nk-muted">{t('settings.unsaved')}</span>
          <Button type="button" variant="secondary" onClick={discard}>{t('settings.discard')}</Button>
          <Button type="submit" disabled={saving}>{saving ? t('editor.saving') : t('common.save')}</Button>
        </div>
      ) : null}
    </form>
  );
}