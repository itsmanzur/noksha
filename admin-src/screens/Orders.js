import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView, money, when } from '../api';

const STATUSES = ['pending', 'awaiting_payment', 'confirmed', 'paid', 'shipped', 'delivered', 'returned', 'cancelled'];

export function Orders({ t, go, orderId }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [note, setNote] = useState('');
  const [selected, setSelected] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('confirmed');
  const [collect, setCollect] = useState('');
  const [courier, setCourier] = useState('steadfast');
  const [shipping, setShipping] = useState(null);

  function load(nextSearch = search, nextFilter = filter) {
    setStatus('loading');
    const query = new URLSearchParams();
    if (nextSearch) query.set('search', nextSearch);
    if (nextFilter) query.set('status', nextFilter);
    api('orders?' + query.toString()).then((data) => {
      setRows(data.orders || []);
      setSelected([]);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(() => {
    load('', '');
    api('settings').then((data) => {
      setShipping(data.shipping || null);
      const first = (data.shipping?.available || [])[0];
      if (first) setCourier(first);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!orderId) {
      setDetail(null);
      return;
    }
    api('orders/' + orderId).then((data) => {
      setDetail(data);
      setCollect(String(data.collectAmount != null ? data.collectAmount : data.total));
    }).catch((err) => setError(err.message));
  }, [orderId]);

  function updateStatus(next) {
    api('orders/' + detail.id, { method: 'PUT', body: { status: next } }).then((data) => {
      setDetail(data);
      load();
    }).catch((err) => setError(err.message));
  }

  function saveCollect() {
    api('orders/' + detail.id, { method: 'PUT', body: { collect_amount: Number(collect) } }).then((data) => {
      setDetail(data);
      setNote(t('orders.collectSaved'));
    }).catch((err) => setError(err.message));
  }

  function confirmTrx() {
    api('orders/' + detail.id + '/confirm-trx', {
      method: 'POST',
      body: { collect_amount: Number(collect) },
    }).then((data) => {
      setDetail(data);
      setCollect(String(data.collectAmount));
      setNote(t('orders.confirmed'));
      load();
    }).catch((err) => setError(err.message));
  }

  function rejectTrx() {
    if (!window.confirm(t('orders.rejectConfirm'))) {
      return;
    }
    api('orders/' + detail.id + '/reject-trx', { method: 'POST', body: {} }).then((data) => {
      setDetail(data);
      setNote(t('orders.rejected'));
      load();
    }).catch((err) => setError(err.message));
  }

  function shipOrder() {
    api('orders/' + detail.id + '/ship', { method: 'POST', body: { courier } }).then((data) => {
      setDetail(data);
      setNote(t('orders.shipped'));
      load();
    }).catch((err) => setError(err.message));
  }

  function printSlip() {
    api('orders/' + detail.id + '/print').then((data) => {
      const win = window.open('', '_blank');
      if (!win) {
        return;
      }
      win.document.write(data.html || '');
      win.document.close();
    }).catch((err) => setError(err.message));
  }

  function blacklistPhone() {
    if (!window.confirm(t('orders.blacklistConfirm'))) {
      return;
    }
    api('blacklist', { method: 'POST', body: { phone: detail.phone, note: detail.number } }).then(() => {
      setNote(t('orders.blacklisted'));
    }).catch((err) => setError(err.message));
  }

  function settleCod() {
    api('orders/' + detail.id + '/settle-cod', {
      method: 'POST',
      body: { received: Number(collect) },
    }).then((data) => {
      setDetail(data);
      setCollect(String(data.codReceived != null ? data.codReceived : data.collectAmount));
      setNote(t('orders.codSettled'));
      load();
    }).catch((err) => setError(err.message));
  }

  function toggle(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.concat(id)));
  }

  function toggleAll() {
    if (selected.length === rows.length) {
      setSelected([]);
      return;
    }
    setSelected(rows.map((row) => row.id));
  }

  function runBulk() {
    if (selected.length === 0) {
      return;
    }
    api('orders/bulk', { method: 'POST', body: { ids: selected, status: bulkStatus } }).then(() => {
      setNote(t('orders.bulkDone').replace('{n}', String(selected.length)));
      load();
    }).catch((err) => setError(err.message));
  }

  function exportCsv() {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (filter) query.set('status', filter);
    api('orders/export?' + query.toString()).then((data) => {
      const blob = new window.Blob([data.csv || ''], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename || 'noksha-orders.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => setError(err.message));
  }

  if (orderId && detail) {
    const attr = detail.attribution || {};
    const attrBits = [
      attr.utm_source && `utm_source=${attr.utm_source}`,
      attr.utm_medium && `utm_medium=${attr.utm_medium}`,
      attr.utm_campaign && `utm_campaign=${attr.utm_campaign}`,
      attr.fbclid && 'fbclid',
      attr.ttclid && 'ttclid',
      attr.gclid && 'gclid',
    ].filter(Boolean);
    return (
      <div>
        <button type="button" className="nk-btn-ghost" onClick={() => go('orders')}>{t('orders.back')}</button>
        {note ? <p className="nk-banner is-ok">{note}</p> : null}
        {error ? <p className="nk-banner">{error}</p> : null}
        <h1>{detail.number}</h1>
        <p>{detail.name} · {detail.phone} <span className={detail.risk === 'review' ? 'nk-chip is-review' : 'nk-chip is-ok'}>{detail.risk === 'review' ? t('orders.riskReview') : t('orders.riskOk')}</span>{detail.variant ? <span className="nk-chip">A/B {String(detail.variant).toUpperCase()}</span> : null}{detail.otpVerified ? <span className="nk-chip is-ok">{t('orders.otpOk')}</span> : null}</p>
        <label className="nk-field">
          {t('pages.status')}
          <select value={detail.status} onChange={(event) => updateStatus(event.target.value)}>
            {STATUSES.map((item) => <option key={item} value={item}>{t('status.' + item)}</option>)}
          </select>
        </label>
        <p>{t('orders.method')}: {t('pay.' + detail.method)} · {t('orders.total')}: {money(detail.total)}</p>
        {detail.fraud ? <p>{t('orders.fraud')}: <span className={detail.fraud.label === 'block' ? 'nk-chip is-review' : (detail.fraud.label === 'review' ? 'nk-chip is-review' : 'nk-chip is-ok')}>{detail.fraud.label} ({detail.fraud.score})</span></p> : null}
        {detail.trxId ? <p>{t('orders.trx')}: {detail.trxId}{detail.trxVerified ? <span className="nk-chip is-ok"> {t('orders.trxVerified')}</span> : null}</p> : null}
        {detail.trackingCode ? <p>{t('orders.tracking')}: {detail.trackingCode} ({detail.courier})</p> : null}
        <label className="nk-field">
          {t('orders.collect')}
          <input type="number" min="0" step="0.01" value={collect} onChange={(event) => setCollect(event.target.value)} />
        </label>
        <p className="nk-muted">{t('orders.collectHelp')}</p>
        <div className="nk-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button type="button" className="nk-btn-ghost" onClick={saveCollect}>{t('orders.saveCollect')}</button>
          <button type="button" className="nk-btn-ghost" onClick={printSlip}>{t('orders.print')}</button>
          <button type="button" className="nk-btn-ghost" onClick={blacklistPhone}>{t('orders.blacklist')}</button>
          {(detail.method === 'manual_bkash' || detail.method === 'manual_nagad') && detail.trxId && !detail.trxVerified ? (
            <>
              <button type="button" className="nk-btn" onClick={confirmTrx}>{t('orders.confirmTrx')}</button>
              <button type="button" className="nk-btn-ghost" onClick={rejectTrx}>{t('orders.rejectTrx')}</button>
            </>
          ) : null}
          {detail.method === 'cod' && !detail.codSettled ? (
            <button type="button" className="nk-btn" onClick={settleCod}>{t('orders.settleCod')}</button>
          ) : null}
          {detail.method === 'cod' && detail.codSettled ? (
            <span className="nk-chip is-ok">{t('orders.codSettled')}{detail.codReceived != null ? ` · ${money(detail.codReceived)}` : ''}</span>
          ) : null}
        </div>
        {(shipping?.available || []).length > 0 && detail.status !== 'shipped' && detail.status !== 'delivered' && detail.status !== 'cancelled' ? (
          <div className="nk-toolbar" style={{ marginBottom: 12 }}>
            <select value={courier} onChange={(event) => setCourier(event.target.value)}>
              {(shipping.available || []).map((id) => <option key={id} value={id}>{t('courier.' + id)}</option>)}
            </select>
            <button type="button" className="nk-btn" onClick={shipOrder}>{t('orders.bookCourier')}</button>
          </div>
        ) : null}
        {attrBits.length ? <p>{t('orders.source')}: {attrBits.join(' · ')}</p> : null}
        <h2>{t('orders.address')}</h2>
        <p>{[detail.address, detail.upazila, detail.district, detail.division].filter(Boolean).join(', ') || '—'}</p>
        <h2>{t('orders.items')}</h2>
        <ul>{(detail.items || []).map((item, index) => <li key={index}>{item.qty} × {item.name} · {money(item.price)}</li>)}</ul>
        {detail.note ? <p>{t('orders.note')}: {detail.note}</p> : null}
      </div>
    );
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={() => load()}>
      <h1>{t('orders.title')}</h1>
      {note ? <p className="nk-banner is-ok">{note}</p> : null}
      <form className="nk-toolbar" onSubmit={(event) => { event.preventDefault(); load(); }}>
        <input aria-label={t('orders.search')} placeholder={t('orders.search')} value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={filter} onChange={(event) => { setFilter(event.target.value); load(search, event.target.value); }}>
          <option value="">{t('orders.all')}</option>
          {STATUSES.map((item) => <option key={item} value={item}>{t('status.' + item)}</option>)}
        </select>
        <button type="submit" className="nk-btn">{t('top.search')}</button>
        <button type="button" className="nk-btn-ghost" onClick={exportCsv}>{t('orders.export')}</button>
      </form>
      {rows.length > 0 ? (
        <div className="nk-toolbar" style={{ marginTop: 8 }}>
          <select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)}>
            {STATUSES.map((item) => <option key={item} value={item}>{t('status.' + item)}</option>)}
          </select>
          <button type="button" className="nk-btn" disabled={selected.length === 0} onClick={runBulk}>{t('orders.bulk').replace('{n}', String(selected.length))}</button>
        </div>
      ) : null}
      {rows.length === 0 ? <p className="nk-muted">{t('orders.empty')}</p> : (
        <div className="nk-card">
          <table className="nk-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.length === rows.length && rows.length > 0} onChange={toggleAll} aria-label={t('orders.selectAll')} /></th>
                <th>{t('orders.title')}</th>
                <th>{t('field.name')}</th>
                <th>{t('orders.phone')}</th>
                <th>{t('orders.method')}</th>
                <th>{t('orders.total')}</th>
                <th>{t('pages.status')}</th>
                <th>{t('orders.when')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id}>
                  <td><input type="checkbox" checked={selected.includes(order.id)} onChange={() => toggle(order.id)} aria-label={order.number} /></td>
                  <td><button type="button" className="link" onClick={() => go('orders/' + order.id)}>{order.number}</button></td>
                  <td>{order.name}</td>
                  <td>{order.phone} <span className={order.risk === 'review' ? 'nk-chip is-review' : 'nk-chip is-ok'}>{order.risk === 'review' ? t('orders.riskReview') : t('orders.riskOk')}</span></td>
                  <td>{t('pay.' + order.method)}{order.trxId ? <div>{order.trxId}</div> : null}</td>
                  <td>{money(order.total)}</td>
                  <td>{t('status.' + order.status)}</td>
                  <td>{when(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AsyncView>
  );
}
