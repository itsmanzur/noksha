import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView, money } from '../api';

export function Analytics({ t }) {
  const [range, setRange] = useState(7);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  function load(next = range) {
    setStatus('loading');
    api('analytics?range=' + next).then((report) => {
      setData(report);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(() => { load(7); }, []);
  const funnel = data ? data.funnel : null;
  const max = funnel ? Math.max(funnel.visits, funnel.checkouts, funnel.orders, 1) : 1;

  return (
    <div>
      <div className="nk-toolbar">
        <h1>{t('analytics.title')}</h1>
        <div className="nk-seg">
          {[7, 30].map((days) => (
            <button key={days} type="button" className={range === days ? 'is-active' : ''} onClick={() => { setRange(days); load(days); }}>{t(days === 7 ? 'analytics.days7' : 'analytics.days30')}</button>
          ))}
        </div>
      </div>
      <AsyncView status={status} error={error} t={t} onRetry={() => load()}>
        {funnel ? (
          <>
            <div className="nk-stats">
              <div className="nk-stat"><span>{t('analytics.visits')}</span><strong>{funnel.visits}</strong></div>
              <div className="nk-stat"><span>{t('analytics.checkouts')}</span><strong>{funnel.checkouts}</strong></div>
              <div className="nk-stat"><span>{t('analytics.orders')}</span><strong>{funnel.orders}</strong></div>
              <div className="nk-stat"><span>{t('analytics.revenue')}</span><strong>{money(funnel.revenue)}</strong></div>
            </div>
            <div className="nk-card">
              <h2>{t('analytics.funnel')}</h2>
              <div className="nk-funnel">
                {[
                  ['analytics.visits', funnel.visits],
                  ['analytics.checkouts', funnel.checkouts],
                  ['analytics.orders', funnel.orders],
                ].map(([key, value]) => (
                  <div key={key}><span>{t(key)}</span><i style={{ width: `${Math.max(4, (value / max) * 100)}%` }} /><strong>{value}</strong></div>
                ))}
              </div>
              <p>{t('analytics.conversion')}: {funnel.conversion}% · {t('analytics.cod')}: {funnel.cod} · {t('analytics.prepaid')}: {funnel.prepaid}</p>
            </div>
            <div className="nk-card" style={{ marginTop: 12 }}>
              <h2>{t('analytics.ab')}</h2>
              <table className="nk-table">
                <thead>
                  <tr>
                    <th>{t('analytics.variant')}</th>
                    <th>{t('analytics.visits')}</th>
                    <th>{t('analytics.orders')}</th>
                    <th>{t('analytics.conversion')}</th>
                  </tr>
                </thead>
                <tbody>
                  {['a', 'b'].map((key) => {
                    const row = (data.ab && data.ab[key]) || { visits: 0, orders: 0 };
                    const rate = row.visits > 0 ? ((row.orders / row.visits) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={key}>
                        <td>{key.toUpperCase()}</td>
                        <td>{row.visits}</td>
                        <td>{row.orders}</td>
                        <td>{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {data.codReconcile ? (
              <div className="nk-card" style={{ marginTop: 12 }}>
                <h2>{t('analytics.codReconcile')}</h2>
                <div className="nk-stats">
                  <div className="nk-stat"><span>{t('analytics.codExpected')}</span><strong>{money(data.codReconcile.expected)}</strong></div>
                  <div className="nk-stat"><span>{t('analytics.codReceived')}</span><strong>{money(data.codReconcile.received)}</strong></div>
                  <div className="nk-stat"><span>{t('analytics.codUnsettled')}</span><strong>{money(data.codReconcile.unsettled)}</strong></div>
                  <div className="nk-stat"><span>{t('analytics.codOpen')}</span><strong>{data.codReconcile.open}</strong></div>
                </div>
              </div>
            ) : null}
            {(data.byDistrict || []).length > 0 ? (
              <div className="nk-card" style={{ marginTop: 12 }}>
                <h2>{t('analytics.byDistrict')}</h2>
                <table className="nk-table">
                  <thead>
                    <tr>
                      <th>{t('analytics.area')}</th>
                      <th>{t('analytics.placed')}</th>
                      <th>{t('analytics.confirmRate')}</th>
                      <th>{t('analytics.returnRate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byDistrict.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.placed}</td>
                        <td>{row.confirmRate}%</td>
                        <td>{row.returnRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {(data.byPage || []).length > 0 ? (
              <div className="nk-card" style={{ marginTop: 12 }}>
                <h2>{t('analytics.byPage')}</h2>
                <table className="nk-table">
                  <thead>
                    <tr>
                      <th>{t('pages.name')}</th>
                      <th>{t('analytics.placed')}</th>
                      <th>{t('analytics.confirmRate')}</th>
                      <th>{t('analytics.returnRate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byPage.map((row) => (
                      <tr key={row.id}>
                        <td>{row.title}</td>
                        <td>{row.placed}</td>
                        <td>{row.confirmRate}%</td>
                        <td>{row.returnRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <div className="nk-card" style={{ marginTop: 12 }}>
              <h2>{t('analytics.top')}</h2>
              {data.topPages.length === 0 ? <p className="nk-muted">{t('home.emptyPages')}</p> : (
                <table className="nk-table">
                  <tbody>
                    {data.topPages.map((page) => (
                      <tr key={page.id}>
                        <td>{page.title}</td>
                        <td>{page.visits} {t('analytics.visits')}</td>
                        <td>{page.orders}</td>
                        <td>{money(page.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : null}
      </AsyncView>
    </div>
  );
}
