import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { api, money } from '../api';
import { formatNumber, formatMoney } from '../format';
import {
  Button,
  Card,
  DateRangePicker,
  EmptyState,
  Skeleton,
  StatCard,
  Table,
} from '../ui';

const RANGE_PRESETS = [
  { id: '7d', days: 7, labelKey: 'analytics.days7' },
  { id: '14d', days: 14, labelKey: 'analytics.days14' },
  { id: '30d', days: 30, labelKey: 'analytics.days30' },
];

function funnelExtras(data) {
  const funnel = data?.funnel || {};
  const byPage = data?.byPage || [];
  const confirmed = Number(funnel.confirmed);
  const delivered = Number(funnel.delivered);
  const summedConfirmed = byPage.reduce((sum, row) => sum + (Number(row.confirmed) || 0), 0);
  return {
    confirmed: Number.isFinite(confirmed) && confirmed > 0 ? confirmed : summedConfirmed,
    delivered: Number.isFinite(delivered) ? delivered : 0,
  };
}

export function Analytics({ t, locale }) {
  const [range, setRange] = useState(7);
  const [rangePreset, setRangePreset] = useState('7d');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const load = useCallback((days = range) => {
    setStatus('loading');
    setError('');
    api(`analytics?range=${days}`)
      .then((report) => {
        setData(report);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message || t('common.error'));
        setStatus('error');
      });
  }, [range, t]);

  useEffect(() => {
    load(7);
  }, []);

  const funnel = data?.funnel;
  const extras = useMemo(() => (data ? funnelExtras(data) : { confirmed: 0, delivered: 0 }), [data]);

  const funnelSteps = useMemo(() => {
    if (!funnel) {
      return [];
    }
    return [
      { key: 'visits', label: t('analytics.visits'), value: funnel.visits || 0 },
      { key: 'checkouts', label: t('analytics.checkouts'), value: funnel.checkouts || 0 },
      { key: 'orders', label: t('analytics.orders'), value: funnel.orders || 0 },
      { key: 'confirmed', label: t('analytics.confirmed'), value: extras.confirmed },
      { key: 'delivered', label: t('analytics.delivered'), value: extras.delivered },
    ];
  }, [funnel, extras, t]);

  const maxFunnel = Math.max(1, ...funnelSteps.map((step) => step.value));

  const datePresets = useMemo(
    () => RANGE_PRESETS.map((p) => ({ id: p.id, label: t(p.labelKey) })),
    [t],
  );

  function onRangePick(next) {
    const preset = next?.preset || rangePreset;
    const match = RANGE_PRESETS.find((p) => p.id === preset);
    if (match) {
      setRange(match.days);
      setRangePreset(match.id);
      load(match.days);
    }
  }

  const series = data?.series || [];
  const seriesMax = Math.max(1, ...series.map((day) => day.revenue));

  if (status === 'error') {
    return (
      <div className="nk-screen">
        <header className="nk-screen-header">
          <h1>{t('analytics.title')}</h1>
        </header>
        <EmptyState
          title={t('common.error')}
          description={error}
          action={<Button onClick={() => load()}>{t('common.retry')}</Button>}
        />
      </div>
    );
  }

  return (
    <div className="nk-screen">
      <header className="nk-screen-header">
        <h1>{t('analytics.title')}</h1>
        <div className="nk-screen-actions">
          <DateRangePicker
            presets={datePresets}
            value={{ preset: rangePreset }}
            onChange={onRangePick}
          />
        </div>
      </header>

      {status === 'loading' && !data ? (
        <div className="nk-kpi-row">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={72} />
          ))}
        </div>
      ) : null}

      {funnel ? (
        <>
          <div className="nk-kpi-row">
            <StatCard label={t('analytics.visits')} value={formatNumber(funnel.visits, locale)} />
            <StatCard label={t('analytics.checkouts')} value={formatNumber(funnel.checkouts, locale)} />
            <StatCard label={t('analytics.orders')} value={formatNumber(funnel.orders, locale)} />
            <StatCard label={t('analytics.revenue')} value={formatMoney(funnel.revenue, locale)} />
          </div>

          <Card title={t('analytics.funnel')}>
            <div className="nk-funnel">
              {funnelSteps.map((step) => (
                <div key={step.key} className="nk-funnel-step">
                  <span>{step.label}</span>
                  <div className="nk-funnel-bar">
                    <span style={{ width: `${Math.max(4, (step.value / maxFunnel) * 100)}%` }} />
                  </div>
                  <strong>{formatNumber(step.value, locale)}</strong>
                </div>
              ))}
            </div>
            <p className="nk-muted">
              {t('analytics.conversion')}:{' '}
              {funnel.conversion == null
                ? t('home.notEnoughData')
                : `${formatNumber(funnel.conversion, locale)}%`}
              {' · '}
              {t('analytics.cod')}: {formatNumber(funnel.cod, locale)}
              {' · '}
              {t('analytics.prepaid')}: {formatNumber(funnel.prepaid, locale)}
            </p>
          </Card>

          <Card title={t('home.chart')}>
            {status === 'loading' ? (
              <Skeleton height={220} />
            ) : series.length === 0 ? (
              <p className="nk-muted">{t('home.emptyPages')}</p>
            ) : (
              <div className="nk-bars" style={{ height: 220, alignItems: 'flex-end' }}>
                {series.map((day) => (
                  <i
                    key={day.date}
                    title={`${day.date} ${money(day.revenue)}`}
                    style={{ height: `${Math.max(2, (day.revenue / seriesMax) * 100)}%`, flex: 1 }}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card title={t('analytics.ab')}>
            {status === 'loading' ? (
              <Skeleton height={120} />
            ) : (
              <Table
                columns={[
                  { key: 'variant', label: t('analytics.variant') },
                  { key: 'visits', label: t('analytics.visits'), render: (row) => formatNumber(row.visits, locale) },
                  { key: 'orders', label: t('analytics.orders'), render: (row) => formatNumber(row.orders, locale) },
                  {
                    key: 'conversion',
                    label: t('analytics.conversion'),
                    render: (row) => `${formatNumber(row.rate, locale)}%`,
                  },
                ]}
                rows={['a', 'b'].map((key) => {
                  const row = (data.ab && data.ab[key]) || { visits: 0, orders: 0 };
                  const rate = row.visits > 0 ? ((row.orders / row.visits) * 100).toFixed(1) : '0.0';
                  return { variant: key.toUpperCase(), visits: row.visits, orders: row.orders, rate };
                })}
                rowKey={(row) => row.variant}
                emptyTitle={t('uikit.empty')}
              />
            )}
          </Card>

          {data.codReconcile ? (
            <Card title={t('analytics.codReconcile')}>
              <div className="nk-kpi-row">
                <StatCard label={t('analytics.codExpected')} value={formatMoney(data.codReconcile.expected, locale)} />
                <StatCard label={t('analytics.codReceived')} value={formatMoney(data.codReconcile.received, locale)} />
                <StatCard label={t('analytics.codUnsettled')} value={formatMoney(data.codReconcile.unsettled, locale)} />
                <StatCard label={t('analytics.codOpen')} value={formatNumber(data.codReconcile.open, locale)} />
              </div>
            </Card>
          ) : null}

          {(data.byDistrict || []).length > 0 ? (
            <Card title={t('analytics.byDistrict')}>
              <Table
                columns={[
                  { key: 'label', label: t('analytics.area') },
                  { key: 'placed', label: t('analytics.placed'), render: (row) => formatNumber(row.placed, locale) },
                  { key: 'confirmRate', label: t('analytics.confirmRate'), render: (row) => `${formatNumber(row.confirmRate, locale)}%` },
                  { key: 'returnRate', label: t('analytics.returnRate'), render: (row) => `${formatNumber(row.returnRate, locale)}%` },
                ]}
                rows={data.byDistrict}
                rowKey={(row) => row.label}
              />
            </Card>
          ) : null}

          {(data.byProduct || []).length > 0 ? (
            <Card title={t('analytics.byProduct')}>
              <Table
                columns={[
                  {
                    key: 'name',
                    label: t('analytics.product'),
                    render: (row) => (
                      <span>
                        {row.name}
                        {row.options && row.options.length ? (
                          <small className="nk-muted" style={{ display: 'block' }}>
                            {row.options.map((option) => option.label + ': ' + formatNumber(option.units, locale)).join(' · ')}
                          </small>
                        ) : null}
                      </span>
                    ),
                  },
                  { key: 'orders', label: t('analytics.orders'), render: (row) => formatNumber(row.orders, locale) },
                  { key: 'units', label: t('analytics.pieces'), render: (row) => formatNumber(row.units, locale) },
                  { key: 'revenue', label: t('analytics.sales'), render: (row) => formatMoney(row.revenue, locale) },
                  { key: 'addonUnits', label: t('analytics.asAddon'), render: (row) => formatNumber(row.addonUnits, locale) },
                  { key: 'visits', label: t('analytics.visits'), render: (row) => formatNumber(row.visits, locale) },
                  {
                    key: 'conversion',
                    label: t('analytics.conversion'),
                    render: (row) => (row.conversion == null ? '—' : `${formatNumber(row.conversion, locale)}%`),
                  },
                ]}
                rows={data.byProduct}
                rowKey={(row) => row.key}
              />
              <p className="nk-help">{t('analytics.byProductHelp')}</p>
            </Card>
          ) : null}

          {(data.byPage || []).length > 0 ? (
            <Card title={t('analytics.byPage')}>
              <Table
                columns={[
                  { key: 'title', label: t('pages.name') },
                  { key: 'placed', label: t('analytics.placed'), render: (row) => formatNumber(row.placed, locale) },
                  { key: 'confirmRate', label: t('analytics.confirmRate'), render: (row) => `${formatNumber(row.confirmRate, locale)}%` },
                  { key: 'returnRate', label: t('analytics.returnRate'), render: (row) => `${formatNumber(row.returnRate, locale)}%` },
                ]}
                rows={data.byPage}
                rowKey={(row) => row.id}
              />
            </Card>
          ) : null}

          <Card title={t('analytics.top')}>
            <Table
              loading={status === 'loading'}
              emptyTitle={t('home.emptyPages')}
              columns={[
                { key: 'title', label: t('pages.name') },
                { key: 'visits', label: t('analytics.visits'), render: (row) => formatNumber(row.visits, locale) },
                { key: 'orders', label: t('analytics.orders'), render: (row) => formatNumber(row.orders, locale) },
                { key: 'revenue', label: t('analytics.revenue'), render: (row) => formatMoney(row.revenue, locale) },
              ]}
              rows={data.topPages || []}
              rowKey={(row) => row.id}
            />
          </Card>
        </>
      ) : status === 'loading' ? (
        <Skeleton height={240} />
      ) : null}
    </div>
  );
}