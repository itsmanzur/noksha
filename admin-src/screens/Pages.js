import { useEffect, useState } from '@wordpress/element';
import { api, AsyncView } from '../api';

const TEMPLATES = [
  ['single', 'pages.single', 'pages.singleBody'],
  ['beauty', 'pages.beauty', 'pages.beautyBody'],
  ['gadget', 'pages.gadget', 'pages.gadgetBody'],
  ['lead', 'pages.lead', 'pages.leadBody'],
  ['festival', 'pages.festival', 'pages.festivalBody'],
];

export function Pages({ t, go }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [pages, setPages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [busy, setBusy] = useState(false);

  function load() {
    setStatus('loading');
    api('pages').then((data) => {
      setPages(data.pages || []);
      setStatus('ready');
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
    });
  }

  useEffect(load, []);

  function create(template) {
    setBusy(true);
    api('pages', { method: 'POST', body: { template, language } }).then((page) => {
      go('pages/' + page.id);
    }).catch((err) => {
      setError(err.message);
      setStatus('error');
      setBusy(false);
    });
  }

  return (
    <AsyncView status={status} error={error} t={t} onRetry={load}>
      <div className="nk-toolbar">
        <h1>{t('pages.title')}</h1>
        <label className="nk-inline">
          {t('pages.language')}
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="en">{t('settings.english')}</option>
            <option value="bn">{t('settings.bangla')}</option>
          </select>
        </label>
      </div>
      {pages.length === 0 ? (
        <div className="nk-empty">
          <h2>{t('pages.emptyTitle')}</h2>
          <p className="nk-lead">{t('pages.emptyBody')}</p>
          <div className="nk-templates">
            {TEMPLATES.map(([id, title, body]) => (
              <button key={id} type="button" className="nk-template" disabled={busy} onClick={() => create(id)}>
                <strong>{t(title)}</strong>
                <span>{t(body)}</span>
                <em className="nk-btn">{t('pages.new')}</em>
              </button>
            ))}
          </div>
          <p><button type="button" className="nk-btn-ghost" disabled={busy} onClick={() => create('blank')}>{t('pages.blank')}</button></p>
        </div>
      ) : (
        <>
          <div className="nk-templates" style={{ marginBottom: 16 }}>
            {TEMPLATES.map(([id, title]) => (
              <button key={id} type="button" className="nk-btn-ghost" disabled={busy} onClick={() => create(id)}>{t(title)}</button>
            ))}
            <button type="button" className="nk-btn-ghost" disabled={busy} onClick={() => create('blank')}>{t('pages.blank')}</button>
          </div>
          <div className="nk-card">
            <table className="nk-table">
              <thead>
                <tr>
                  <th>{t('pages.name')}</th>
                  <th>{t('pages.status')}</th>
                  <th>{t('pages.visits')}</th>
                  <th>{t('pages.orders')}</th>
                  <th>{t('pages.conversion')}</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td><button type="button" className="link" onClick={() => go('pages/' + page.id)}>{page.title}</button></td>
                    <td>{page.status === 'publish' ? t('pages.published') : t('pages.draft')}</td>
                    <td>{page.visits}</td>
                    <td>{page.orders}</td>
                    <td>{page.conversion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AsyncView>
  );
}
