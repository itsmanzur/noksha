import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView, when } from '../api';

export function Leads({ t }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  function load() {
    setStatus('loading');
    Promise.all([api('leads'), api('blacklist')]).then(([leadData, list]) => {
      setLeads(leadData.leads || []);
      setBlacklist(list.phones || []);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);

  function addBlacklist(event) {
    event.preventDefault();
    api('blacklist', { method: 'POST', body: { phone, note } }).then((data) => {
      setBlacklist(data.phones || []);
      setPhone('');
      setNote('');
    }).catch((err) => setError(err.message));
  }

  function removeBlacklist(value) {
    api('blacklist', { method: 'DELETE', body: { phone: value } }).then((data) => {
      setBlacklist(data.phones || []);
    }).catch((err) => setError(err.message));
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      <h1>{t('leads.title')}</h1>
      <p className="nk-lead">{t('leads.help')}</p>
      <div className="nk-card" style={{ marginBottom: 16 }}>
        <h2>{t('leads.incomplete')}</h2>
        {leads.length === 0 ? <p className="nk-muted">{t('leads.empty')}</p> : (
          <table className="nk-table">
            <thead>
              <tr>
                <th>{t('orders.phone')}</th>
                <th>{t('field.name')}</th>
                <th>{t('orders.when')}</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.phone}</td>
                  <td>{lead.name || '—'}</td>
                  <td>{when(lead.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="nk-card">
        <h2>{t('leads.blacklist')}</h2>
        <p className="nk-muted">{t('leads.blacklistHelp')}</p>
        <form className="nk-toolbar" onSubmit={addBlacklist}>
          <input placeholder={t('orders.phone')} value={phone} onChange={(event) => setPhone(event.target.value)} required />
          <input placeholder={t('leads.note')} value={note} onChange={(event) => setNote(event.target.value)} />
          <button type="submit" className="nk-btn">{t('leads.add')}</button>
        </form>
        {blacklist.length === 0 ? <p className="nk-muted">{t('leads.blacklistEmpty')}</p> : (
          <ul>
            {blacklist.map((row) => (
              <li key={row.phone} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <strong>{row.phone}</strong>
                <span className="nk-muted">{row.note}</span>
                <button type="button" className="nk-btn-ghost" onClick={() => removeBlacklist(row.phone)}>{t('leads.remove')}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AsyncView>
  );
}
