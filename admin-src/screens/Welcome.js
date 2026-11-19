import { useEffect, useState } from '@wordpress/element';
import { api } from '../api';
import { useToast } from '../providers';
import {
  Button,
  Input,
  Select,
  Stepper,
  Toggle,
} from '../ui';

const STEPS = [
  { id: 'store', labelKey: 'welcome.stepStore' },
  { id: 'payments', labelKey: 'welcome.stepPayments' },
  { id: 'courier', labelKey: 'welcome.stepCourier' },
  { id: 'page', labelKey: 'welcome.stepPage' },
];

export function Welcome({ t, go, locale }) {
  const { error: toastError } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [template, setTemplate] = useState('single');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('settings')
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        toastError(err.message || t('common.error'));
        setLoading(false);
      });
  }, []);

  function skipWizard(dismiss = false) {
    const tasks = [];
    if (dismiss) {
      tasks.push(api('onboarding', { method: 'PUT', body: { dismissed: true } }).catch(() => {}));
    }
    Promise.all(tasks).finally(() => go('home'));
  }

  async function saveSettings(partial) {
    const body = { ...settings, ...partial };
    const data = await api('settings', { method: 'PUT', body });
    setSettings(data);
    return data;
  }

  async function next() {
    setBusy(true);
    try {
      if (step === 0 && settings) {
        await saveSettings({
          default_language: settings.default_language,
          sms: { ...(settings.sms || {}), sender: settings.sms?.sender || '' },
        });
      }
      if (step === 1 && settings) {
        await saveSettings({
          gateways: {
            ...settings.gateways,
            cod: { ...(settings.gateways?.cod || {}), enabled: Boolean(settings.gateways?.cod?.enabled) },
          },
        });
        api('onboarding', { method: 'PUT', body: { payments: true } }).catch(() => {});
      }
      if (step === 3) {
        await api('pages', {
          method: 'POST',
          body: { template, language: settings?.default_language || locale },
        });
        go('home');
        return;
      }
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    } catch (err) {
      toastError(err.message || t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const stepMeta = STEPS.map((item) => ({ id: item.id, label: t(item.labelKey) }));

  let body = null;
  if (loading || !settings) {
    body = <p className="nk-muted">{t('common.loading')}</p>;
  } else if (step === 0) {
    body = (
      <>
        <p className="nk-muted">{t('welcome.storeHelp')}</p>
        <Select
          label={t('settings.language')}
          value={settings.default_language}
          onChange={(e) => setSettings({ ...settings, default_language: e.target.value })}
        >
          <option value="en">{t('settings.english')}</option>
          <option value="bn">{t('settings.bangla')}</option>
        </Select>
        <Input
          label={t('settings.storeName')}
          value={settings.sms?.sender || ''}
          onChange={(e) => setSettings({ ...settings, sms: { ...(settings.sms || {}), sender: e.target.value } })}
        />
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <p className="nk-muted">{t('welcome.codHelp')}</p>
        <Toggle
          label={t('pay.cod')}
          checked={Boolean(settings.gateways?.cod?.enabled)}
          onChange={(v) => setSettings({
            ...settings,
            gateways: { ...settings.gateways, cod: { ...(settings.gateways?.cod || {}), enabled: v } },
          })}
        />
      </>
    );
  } else if (step === 2) {
    body = (
      <>
        <p className="nk-muted">{t('welcome.courierHelp')}</p>
        <p className="nk-muted">{t('payments.couriersHelp')}</p>
      </>
    );
  } else {
    body = (
      <>
        <p className="nk-muted">{t('welcome.pageHelp')}</p>
        <Select label={t('pages.language')} value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="single">{t('pages.single')}</option>
          <option value="lead">{t('pages.lead')}</option>
          <option value="fashion">{t('pages.fashion')}</option>
          <option value="food">{t('pages.food')}</option>
          <option value="health">{t('pages.health')}</option>
          <option value="home">{t('pages.home')}</option>
          <option value="beauty">{t('pages.beauty')}</option>
          <option value="gadget">{t('pages.gadget')}</option>
        </Select>
      </>
    );
  }

  return (
    <div className="nk-welcome">
      <div className="nk-welcome-card">
        <h1 style={{ margin: 0 }}>{t('welcome.title')}</h1>
        <Stepper steps={stepMeta} current={step} />
        {body}
        <div className="nk-screen-actions" style={{ justifyContent: 'space-between' }}>
          <Button type="button" variant="ghost" onClick={() => skipWizard(true)}>{t('welcome.skip')}</Button>
          <div className="nk-screen-actions">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={back} disabled={busy}>{t('welcome.back')}</Button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next} disabled={busy || loading}>
                {step === 2 ? t('welcome.skipStep') : t('welcome.next')}
              </Button>
            ) : (
              <Button type="button" onClick={next} disabled={busy || loading}>{t('welcome.finish')}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}