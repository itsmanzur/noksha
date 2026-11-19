import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView, money } from '../api';

export function Home({ t, go }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [onboarding, setOnboarding] = useState(null);

  function load() {
    setStatus('loading');
    Promise.all([
      api('analytics?range=14'),
      api('onboarding').catch(() => null),
    ]).then(([report, board]) => {
      setData(report);
      setOnboarding(board);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);
  const today = data ? data.today : null;
  const max = data ? Math.max(1, ...data.series.map((day) => day.revenue)) : 1;
  const showBoard = onboarding && !onboarding.dismissed && !(onboarding.payments && onboarding.test_order && onboarding.pixels);

  function dismiss() {
    api('onboarding', { method: 'PUT', body: { dismissed: true } }).then(setOnboarding).catch(() => {});
  }

  function mark(step) {
    api('onboarding', { method: 'PUT', body: { [step]: true } }).then(setOnboarding).catch(() => {});
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      {showBoard ? (
        <div className="nk-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ marginTop: 0 }}>{t('onboarding.title')}</h2>
              <p className="nk-muted">{t('onboarding.help')}</p>
            </div>
            <button type="button" className="nk-btn-ghost" onClick={dismiss}>{t('onboarding.dismiss')}</button>
          </div>
          <ol className="nk-onboard">
            <li className={onboarding.payments ? 'is-done' : ''}>
              <strong>{t('onboarding.payments')}</strong>
              <p>{t('onboarding.paymentsHelp')}</p>
              <button type="button" className="nk-btn" onClick={() => { mark('payments'); go('payments'); }}>{t('onboarding.openPayments')}</button>
            </li>
            <li className={onboarding.test_order ? 'is-done' : ''}>
              <strong>{t('onboarding.testOrder')}</strong>
              <p>{t('onboarding.testOrderHelp')}</p>
              <button type="button" className="nk-btn" onClick={() => go('pages')}>{t('onboarding.openPages')}</button>
            </li>
            <li className={onboarding.pixels ? 'is-done' : ''}>
              <strong>{t('onboarding.pixels')}</strong>
              <p>{t('onboarding.pixelsHelp')}</p>
              <button type="button" className="nk-btn" onClick={() => go('settings')}>{t('onboarding.openSettings')}</button>
            </li>
          </ol>
        </div>
      ) : null}
      {today ? (
        <>
          <div className="nk-stats">
            <div className="nk-stat"><span>{t('home.todayOrders')}</span><strong>{today.orders}</strong></div>
            <div className="nk-stat"><span>{t('home.revenue')}</span><strong>{money(today.revenue)}</strong></div>
            <div className="nk-stat"><span>{t('home.conversion')}</span><strong>{today.conversion}%</strong></div>
            <div className="nk-stat"><span>{t('home.codShare')}</span><strong>{today.codShare}%</strong></div>
          </div>
          <div className="nk-card">
            <h2>{t('home.chart')}</h2>
            <div className="nk-bars">
              {data.series.map((day) => (
                <i key={day.date} title={`${day.date} ${money(day.revenue)}`} style={{ height: `${Math.max(2, (day.revenue / max) * 100)}%` }} />
              ))}
            </div>
          </div>
          <div className="nk-split" style={{ marginTop: 12 }}>
            <div className="nk-card">
              <h2>{t('home.recent')}</h2>
              {data.recentOrders.length === 0 ? <p className="nk-muted">{t('home.emptyOrders')}</p> : (
                <table className="nk-table">
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td><button type="button" className="link" onClick={() => go('orders/' + order.id)}>{order.number}</button></td>
                        <td>{order.name}</td>
                        <td>{money(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="nk-card">
              <h2>{t('home.topPages')}</h2>
              {data.topPages.length === 0 ? <p className="nk-muted">{t('home.emptyPages')}</p> : (
                <table className="nk-table">
                  <tbody>
                    {data.topPages.map((page) => (
                      <tr key={page.id}>
                        <td><button type="button" className="link" onClick={() => go('pages/' + page.id)}>{page.title}</button></td>
                        <td>{money(page.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : null}
    </AsyncView>
  );
}
