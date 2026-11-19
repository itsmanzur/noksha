export function api(path, options = {}) {
  const boot = window.nokshaBoot || {};
  const method = options.method || 'GET';
  return window.fetch(boot.root + String(path).replace(/^\//, ''), {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': boot.nonce,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.message || 'Request failed');
      error.code = data.code || 'http_error';
      throw error;
    }
    return data;
  });
}

export function money(value) {
  const amount = Number(value) || 0;
  const digits = Math.round(amount) === amount ? 0 : 2;
  return '৳' + amount.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function when(value) {
  if (!value) {
    return '';
  }
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export function tokenStyle(tokens) {
  const color = tokens.color || {};
  return {
    '--noksha-color-canvas': color.canvas,
    '--noksha-color-card': color.card,
    '--noksha-color-text': color.text,
    '--noksha-color-muted': color.muted,
    '--noksha-color-border': color.border,
    '--noksha-color-brand': color.brand,
    '--noksha-color-brand-foreground': color.brandForeground,
    '--noksha-color-accent': color.accent,
    '--noksha-color-success': color.success,
    '--noksha-color-warning': color.warning,
    '--noksha-color-danger': color.danger,
    '--noksha-font-sans': tokens.font ? tokens.font.sans : 'sans-serif',
    '--noksha-radius': tokens.radius,
    '--noksha-shadow': tokens.shadow,
    '--noksha-space': tokens.space || '16px',
  };
}

export function AsyncView({ status, error, t, onRetry, children }) {
  if (status === 'loading') {
    return <p className="nk-muted">{t('common.loading')}</p>;
  }
  if (status === 'error') {
    return (
      <div className="nk-banner" role="alert">
        <p>{error || t('common.error')}</p>
        {onRetry ? <button type="button" className="nk-btn" onClick={onRetry}>{t('common.retry')}</button> : null}
      </div>
    );
  }
  return children;
}
