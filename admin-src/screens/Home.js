import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import {
  Badge,
  Button,
  Card,
  DateRangePicker,
  EmptyState,
  Skeleton,
  StatCard,
  StatusPill,
  Table,
} from '../ui';
import { api } from '../api';
import { formatMoney, formatNumber } from '../format';
import '../styles/screens.css';

const CHECKLIST_STEPS = [
  { key: 'payments', titleKey: 'onboarding.payments', helpKey: 'onboarding.paymentsHelp', actionKey: 'onboarding.openPayments', route: 'payments', mark: 'payments' },
  { key: 'test_order', titleKey: 'onboarding.testOrder', helpKey: 'onboarding.testOrderHelp', actionKey: 'onboarding.openPages', route: 'pages' },
  { key: 'pixels', titleKey: 'onboarding.pixels', helpKey: 'onboarding.pixelsHelp', actionKey: 'onboarding.openSettings', route: 'settings', mark: 'pixels' },
  { key: 'courier', titleKey: 'onboarding.courier', helpKey: 'onboarding.courierHelp', actionKey: 'onboarding.openCouriers', route: 'payments' },
];

function greetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greetingMorning';
  if (hour < 17) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

function rangeDaysFromPicker(picker) {
  const preset = picker?.preset || '7d';
  if (preset === 'today') return 1;
  if (preset === '30d') return 30;
  return 7;
}

function weightedReturnRate(byPage) {
  const rows = byPage || [];
  let weighted = 0;
  let total = 0;
  rows.forEach((row) => {
    const placed = Number(row.placed) || 0;
    if (placed < 1) return;
    weighted += (Number(row.returnRate) || 0) * placed;
    total += placed;
  });
  return total > 0 ? weighted / total : 0;
}

function ComboChart({ series, avgOrderValue, t }) {
  if (!series?.length) {
    return <p className="nk-muted">{t('home.emptyChart')}</p>;
  }
  const width = 640;
  const height = 220;
  const pad = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const points = series.map((day) => ({
    ...day,
    orders: day.orders != null
      ? Number(day.orders)
      : (avgOrderValue > 0 ? Math.round((Number(day.revenue) || 0) / avgOrderValue) : 0),
    revenue: Number(day.revenue) || 0,
  }));
  const maxOrders = Math.max(1, ...points.map((p) => p.orders));
  const maxRevenue = Math.max(1, ...points.map((p) => p.revenue));
  const barW = innerW / Math.max(points.length, 1);
  const linePts = points
    .map((p, i) => {
      const x = pad.left + i * barW + barW / 2;
      const y = pad.top + innerH - (p.revenue / maxRevenue) * innerH;
      return `${x},${y}`;
    })
    .join(' ');

  const labelEvery = Math.max(1, Math.ceil(points.length / 7));

  return (
    <svg className="nk-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t('home.chart')}>
      <line
        x1={pad.left}
        y1={pad.top + innerH}
        x2={pad.left + innerW}
        y2={pad.top + innerH}
        stroke="var(--nk-border)"
        strokeWidth="1"
      />
      {points.map((p, i) => {
        const h = (p.orders / maxOrders) * innerH;
        const x = pad.left + i * barW + barW * 0.15;
        const y = pad.top + innerH - h;
        return (
          <rect
            key={p.date}
            x={x}
            y={y}
            width={barW * 0.7}
            height={Math.max(2, h)}
            rx="3"
            fill="var(--nk-brand-subtle)"
            opacity="0.9"
          />
        );
      })}
      <polyline
        fill="none"
        stroke="var(--nk-brand)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={linePts}
      />
      {points.map((p, i) => {
        const x = pad.left + i * barW + barW / 2;
        const y = pad.top + innerH - (p.revenue / maxRevenue) * innerH;
        return <circle key={`dot-${p.date}`} cx={x} cy={y} r="3.5" fill="var(--nk-brand)" />;
      })}
      {points.map((p, i) => {
        if (i % labelEvery !== 0 && i !== points.length - 1) {
          return null;
        }
        const x = pad.left + i * barW + barW / 2;
        const label = String(p.date || '').slice(5);
        return (
          <text
            key={`label-${p.date}`}
            x={x}
            y={height - 8}
            textAnchor="middle"
            fill="var(--nk-text-muted)"
            fontSize="10"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function Home({ t, go, locale }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [shell, setShell] = useState({ needsCall: 0, leadsToday: 0 });
  const [range, setRange] = useState({ preset: '7d' });

  const userName = (window.nokshaBoot && window.nokshaBoot.user) || 'there';

  const load = useCallback(() => {
    setStatus('loading');
    const days = rangeDaysFromPicker(range);
    Promise.all([
      api(`analytics?range=${days}`),
      api('onboarding').catch(() => null),
      api('settings').catch(() => null),
      api('shell').catch(() => ({ needsCall: 0, leadsToday: 0 })),
    ])
      .then(([report, board, settings, shellData]) => {
        setData(report);
        setOnboarding(board);
        setShippingAvailable(((settings?.shipping?.available) || []).length > 0);
        setShell({
          needsCall: Number(shellData?.needsCall) || 0,
          leadsToday: Number(shellData?.leadsToday) || 0,
        });
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const courierDone = Boolean(onboarding?.courier) || shippingAvailable;

  const checklistState = useMemo(() => {
    if (!onboarding) return [];
    return CHECKLIST_STEPS.map((step) => ({
      ...step,
      done: step.key === 'courier' ? courierDone : Boolean(onboarding[step.key]),
    }));
  }, [onboarding, courierDone]);

  const doneCount = checklistState.filter((s) => s.done).length;
  const allDone = doneCount >= CHECKLIST_STEPS.length;
  const showChecklist = onboarding && !onboarding.dismissed && !allDone;

  const funnel = data?.funnel || null;
  const today = data?.today || null;
  const usingToday = range?.preset === 'today';
  const kpi = usingToday && today ? today : funnel;
  const deltas = usingToday ? (data?.todayDeltas || {}) : (data?.deltas || {});
  const rangeDays = rangeDaysFromPicker(range);

  const returnRate = weightedReturnRate(data?.byPage);
  const codUnsettled = Number(data?.codOpen?.unsettled ?? data?.codReconcile?.unsettled) || 0;
  const avgOrderValue = funnel && funnel.orders > 0 ? funnel.revenue / funnel.orders : 0;

  const sparkRevenue = (data?.series || []).map((d) => Number(d.revenue) || 0);
  const ordersLabel = usingToday ? t('home.todayOrders') : t('home.orders');
  const chartTitle = usingToday
    ? t('home.chartToday')
    : t('home.chart').replace('{days}', String(rangeDays));

  function dismissChecklist() {
    api('onboarding', { method: 'PUT', body: { dismissed: true } })
      .then(setOnboarding)
      .catch(() => {});
  }

  function markStep(step) {
    api('onboarding', { method: 'PUT', body: { [step]: true } })
      .then(setOnboarding)
      .catch(() => {});
  }

  const datePresets = useMemo(
    () => [
      { id: 'today', label: t('home.rangeToday') },
      { id: '7d', label: t('home.range7d') },
      { id: '30d', label: t('home.range30d') },
    ],
    [t],
  );

  if (status === 'loading' && !data) {
    return (
      <div className="nk-screen">
        <Skeleton height={40} />
        <div className="nk-kpi-row">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height={96} />
          ))}
        </div>
        <Skeleton height={240} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Card>
        <p className="nk-muted">{error || t('common.error')}</p>
        <Button onClick={load}>{t('common.retry')}</Button>
      </Card>
    );
  }

  return (
    <div className="nk-screen">
      <header className="nk-screen-header">
        <div>
          <h1>
            {t(greetingKey())},{' '}
            <span className="nk-muted" style={{ fontWeight: 500 }}>
              {userName}
            </span>
          </h1>
        </div>
        <DateRangePicker value={range} onChange={setRange} presets={datePresets} />
      </header>

      {showChecklist ? (
        <Card
          title={t('onboarding.title')}
          actions={
            <Button variant="ghost" size="sm" onClick={dismissChecklist}>
              {t('onboarding.dismiss')}
            </Button>
          }
        >
          <p className="nk-muted">{t('onboarding.fourSteps')}</p>
          <p className="nk-muted" style={{ marginTop: 0 }}>
            {t('home.checklistProgress')
              .replace('{done}', String(doneCount))
              .replace('{total}', String(CHECKLIST_STEPS.length))}
          </p>
          <div className="nk-progress" aria-hidden="true">
            <span style={{ width: `${(doneCount / CHECKLIST_STEPS.length) * 100}%` }} />
          </div>
          <ol className="nk-checklist" style={{ listStyle: 'none', margin: '16px 0 0', padding: 0 }}>
            {checklistState.map((step) => (
              <li key={step.key} className={['nk-checklist-item', step.done ? 'is-done' : ''].filter(Boolean).join(' ')}>
                <div style={{ flex: 1 }}>
                  <strong>{t(step.titleKey)}</strong>
                  {!step.done ? <p className="nk-muted" style={{ margin: '4px 0 8px' }}>{t(step.helpKey)}</p> : null}
                  {!step.done ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (step.mark) markStep(step.mark);
                        go(step.route);
                      }}
                    >
                      {t(step.actionKey)}
                    </Button>
                  ) : (
                    <Badge>{t('home.stepDone')}</Badge>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      <div className="nk-kpi-row">
        <StatCard
          label={ordersLabel}
          value={formatNumber(kpi?.orders ?? 0, locale)}
          delta={deltas.orders}
          sparkline={sparkRevenue}
        />
        <StatCard
          label={t('home.revenue')}
          value={formatMoney(kpi?.revenue ?? 0, locale)}
          delta={deltas.revenue}
          sparkline={sparkRevenue}
        />
        <StatCard
          label={t('home.conversion')}
          value={
            kpi?.conversion == null
              ? t('home.notEnoughData')
              : `${formatNumber(kpi.conversion, locale)}%`
          }
          delta={kpi?.conversion == null ? undefined : deltas.conversion}
        />
        <StatCard
          label={t('home.needsCall')}
          value={formatNumber(shell.needsCall, locale)}
        />
        <StatCard
          label={t('home.returnRate')}
          value={`${formatNumber(returnRate.toFixed(1), locale)}%`}
        />
        <StatCard
          label={t('home.codCollect')}
          value={formatMoney(codUnsettled, locale)}
        />
      </div>

      {(shell.needsCall > 0 || shell.leadsToday > 0 || codUnsettled > 0) ? (
        <Card title={t('home.actionNeeded')}>
          <div className="nk-action-needed">
            {shell.needsCall > 0 ? (
              <button type="button" onClick={() => go('orders')}>
                <span className="nk-muted">{t('home.actionOrdersHelp')}</span>
                <strong>{formatNumber(shell.needsCall, locale)}</strong>
              </button>
            ) : null}
            {shell.leadsToday > 0 ? (
              <button type="button" onClick={() => go('leads')}>
                <span className="nk-muted">{t('home.actionLeadsHelp')}</span>
                <strong>{formatNumber(shell.leadsToday, locale)}</strong>
              </button>
            ) : null}
            {codUnsettled > 0 ? (
              <button type="button" onClick={() => go('orders')}>
                <span className="nk-muted">{t('home.actionCodHelp')}</span>
                <strong>{formatMoney(codUnsettled, locale)}</strong>
              </button>
            ) : null}
          </div>
        </Card>
      ) : null}

      <Card title={chartTitle}>
        <p className="nk-muted" style={{ marginTop: 0 }}>
          {t('home.chartLegend')}
        </p>
        <ComboChart series={data?.series || []} avgOrderValue={avgOrderValue} t={t} />
      </Card>

      <div className="nk-split-2">
        <Card title={t('home.recent')}>
          {(data?.recentOrders || []).length === 0 ? (
            <EmptyState title={t('home.emptyOrders')} />
          ) : (
            <Table
              columns={[
                { key: 'number', label: '#' },
                { key: 'name', label: t('field.name') },
                { key: 'total', label: t('orders.total') },
                { key: 'status', label: t('pages.status') },
              ]}
              rows={(data.recentOrders || []).map((order) => ({
                id: order.id,
                number: (
                  <Button variant="ghost" size="sm" onClick={() => go('orders/' + order.id)}>
                    {order.number}
                  </Button>
                ),
                name: order.name,
                total: formatMoney(order.total, locale),
                status: (
                  <StatusPill status={order.status} label={t('status.' + order.status)} />
                ),
              }))}
              onSort={undefined}
            />
          )}
        </Card>
        <Card title={t('home.topPages')}>
          {(data?.topPages || []).length === 0 ? (
            <EmptyState title={t('home.emptyPages')} />
          ) : (
            <Table
              columns={[
                { key: 'title', label: t('pages.name') },
                { key: 'orders', label: t('pages.orders') },
                { key: 'revenue', label: t('home.revenue') },
              ]}
              rows={(data.topPages || []).map((page) => ({
                id: page.id,
                title: (
                  <Button variant="ghost" size="sm" onClick={() => go('pages/' + page.id)}>
                    {page.title}
                  </Button>
                ),
                orders: formatNumber(page.orders, locale),
                revenue: formatMoney(page.revenue, locale),
              }))}
            />
          )}
        </Card>
      </div>
    </div>
  );
}