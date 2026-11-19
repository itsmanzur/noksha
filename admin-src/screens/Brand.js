import { useEffect, useMemo, useState } from '@wordpress/element';
import { api } from '../api';
import { useToast } from '../providers';
import {
  Button,
  Card,
  Input,
  Select,
  Skeleton,
} from '../ui';

const COLOR_KEYS = ['canvas', 'card', 'text', 'muted', 'border', 'brand', 'brandForeground', 'accent', 'success', 'warning', 'danger'];

function hexToRgb(hex) {
  const raw = String(hex || '').replace('#', '').trim();
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    return [r, g, b];
  }
  if (raw.length !== 6) {
    return null;
  }
  return [parseInt(raw.slice(0, 2), 16), parseInt(raw.slice(2, 4), 16), parseInt(raw.slice(4, 6), 16)];
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }
  const channel = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channel[0] + 0.7152 * channel[1] + 0.0722 * channel[2];
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function Brand({ t, onPreview, locale }) {
  const { success, error: toastError } = useToast();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [presets, setPresets] = useState({});
  const [fonts, setFonts] = useState([]);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setStatus('loading');
    setError('');
    api('brand')
      .then((data) => {
        setPresets(data.presets || {});
        setFonts(data.fonts || []);
        setDraft(data.tokens);
        setSaved(data.tokens);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message || t('common.error'));
        setStatus('error');
      });
  }

  useEffect(load, []);
  useEffect(() => {
    if (draft) {
      onPreview(draft);
    }
  }, [draft, onPreview]);
  useEffect(() => () => {
    if (saved) {
      onPreview(saved);
    }
  }, [saved, onPreview]);

  const contrastOk = useMemo(() => {
    if (!draft?.color) {
      return true;
    }
    const ratio = contrastRatio(draft.color.brand, draft.color.brandForeground);
    return ratio >= 4.5;
  }, [draft]);

  function setColor(key, value) {
    setDraft({ ...draft, preset: 'custom', color: { ...draft.color, [key]: value } });
  }

  function save(event) {
    event.preventDefault();
    setSaving(true);
    api('brand', { method: 'PUT', body: draft })
      .then((data) => {
        setDraft(data.tokens);
        setSaved(data.tokens);
        success(t('brand.saved'));
      })
      .catch((err) => toastError(err.message || t('common.error')))
      .finally(() => setSaving(false));
  }

  if (status === 'error') {
    return (
      <div className="nk-screen">
        <h1>{t('brand.title')}</h1>
        <Card>
          <p>{error}</p>
          <Button onClick={load}>{t('common.retry')}</Button>
        </Card>
      </div>
    );
  }

  if (!draft || status === 'loading') {
    return (
      <div className="nk-screen">
        <h1>{t('brand.title')}</h1>
        <Skeleton height={360} />
      </div>
    );
  }

  const fontOptions = fonts.concat(draft.font.sans).filter((font, index, list) => list.indexOf(font) === index);

  return (
    <form className="nk-screen" onSubmit={save}>
      <header className="nk-screen-header">
        <div>
          <h1>{t('brand.title')}</h1>
          <p className="nk-muted">{t('brand.intro')}</p>
        </div>
        <div className="nk-screen-actions">
          <Button type="button" variant="secondary" onClick={() => presets.ink && setDraft(presets.ink)}>{t('brand.reset')}</Button>
          <Button type="submit" disabled={saving}>{t('brand.save')}</Button>
        </div>
      </header>

      <div className="nk-split-brand">
        <div className="nk-screen" style={{ gap: 16 }}>
          <Card title={t('brand.preset')}>
            <div className="nk-screen-actions">
              {Object.keys(presets).map((name) => (
                <Button
                  key={name}
                  type="button"
                  variant={draft.preset === name ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDraft(presets[name])}
                >
                  {t('brand.' + name)}
                </Button>
              ))}
            </div>
          </Card>

          <Card title={t('brand.colors')}>
            {!contrastOk ? (
              <p className="nk-banner" role="status">{t('brand.contrastWarning')}</p>
            ) : null}
            <div className="nk-grid-cards">
              {COLOR_KEYS.map((key) => (
                <label key={key} className="nk-ui-field">
                  <span className="nk-ui-label">{t('brand.' + key)}</span>
                  <div className="nk-color" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={draft.color[key]}
                      onChange={(event) => setColor(key, event.target.value.toUpperCase())}
                    />
                    <Input
                      value={draft.color[key]}
                      onChange={(event) => setColor(key, event.target.value)}
                      aria-label={t('brand.' + key)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <Select
              label={t('brand.font')}
              value={draft.font.sans}
              onChange={(event) => setDraft({ ...draft, preset: 'custom', font: { sans: event.target.value } })}
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </Select>
            <Select
              label={t('brand.radius')}
              value={draft.radius}
              onChange={(event) => setDraft({ ...draft, preset: 'custom', radius: event.target.value })}
            >
              {['6px', '10px', '16px'].map((radius) => (
                <option key={radius} value={radius}>{radius}</option>
              ))}
            </Select>
          </Card>
        </div>

        <aside>
          <Card title={t('brand.preview')}>
            <div
              className="nk-page-card"
              style={{
                background: draft.color.card,
                color: draft.color.text,
                borderRadius: draft.radius,
                fontFamily: draft.font.sans,
              }}
            >
              <div
                className="nk-page-card-thumb"
                style={{ background: `linear-gradient(135deg, ${draft.color.brand}, ${draft.color.accent})` }}
                aria-hidden="true"
              />
              <strong>{locale === 'bn' ? 'আপনার স্টোর' : 'Your store'}</strong>
              <p className="nk-muted" style={{ color: draft.color.muted, margin: 0 }}>
                {locale === 'bn' ? 'লাইভ ব্র্যান্ড প্রিভিউ' : 'Live brand preview'}
              </p>
              <button
                type="button"
                style={{
                  background: draft.color.brand,
                  color: draft.color.brandForeground,
                  border: 0,
                  borderRadius: draft.radius,
                  padding: '10px 16px',
                  fontWeight: 600,
                  cursor: 'default',
                }}
              >
                {locale === 'bn' ? 'অর্ডার করুন' : 'Order now'}
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </form>
  );
}