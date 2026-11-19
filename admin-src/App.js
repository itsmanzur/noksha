import { useEffect, useMemo, useState } from '@wordpress/element';
import { api, tokenStyle } from './api';
import { translate } from './i18n';
import { Home } from './screens/Home';
import { Pages } from './screens/Pages';
import { Editor } from './screens/Editor';
import { Orders } from './screens/Orders';
import { Leads } from './screens/Leads';
import { Analytics } from './screens/Analytics';
import { Payments } from './screens/Payments';
import { Brand } from './screens/Brand';
import { Settings } from './screens/Settings';

const NAV = ['home', 'pages', 'orders', 'leads', 'analytics', 'payments', 'brand', 'settings'];

function readRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    name: parts[0] || 'home',
    id: parts[1] ? Number(parts[1]) : 0,
  };
}

export function App() {
  const boot = window.nokshaBoot || { locale: 'en', tokens: { color: {}, font: { sans: 'sans-serif' } }, sandbox: false };
  const [locale, setLocale] = useState(boot.locale === 'bn' ? 'bn' : 'en');
  const [tokens, setTokens] = useState(boot.tokens);
  const [sandbox, setSandbox] = useState(Boolean(boot.sandbox));
  const [route, setRoute] = useState(readRoute);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState([]);
  const t = useMemo(() => (key) => translate(locale, key), [locale]);

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      setMenu(false);
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) {
      window.location.hash = '#/home';
    }
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function go(path) {
    window.location.hash = '#/' + path;
  }

  function switchLocale(next) {
    setLocale(next);
    api('locale', { method: 'POST', body: { locale: next } }).catch(() => {});
  }

  function search(value) {
    setQuery(value);
    if (value && pages.length === 0) {
      api('pages').then((data) => setPages(data.pages || [])).catch(() => {});
    }
  }

  const matches = query.trim()
    ? pages.filter((page) => page.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];
  const section = route.name === 'pages' && route.id ? 'pages' : (NAV.includes(route.name) ? route.name : 'home');

  let screen = <Home t={t} go={go} />;
  if (section === 'pages' && route.id) screen = <Editor t={t} id={route.id} go={go} />;
  else if (section === 'pages') screen = <Pages t={t} go={go} />;
  else if (section === 'orders') screen = <Orders t={t} go={go} orderId={route.id} />;
  else if (section === 'leads') screen = <Leads t={t} />;
  else if (section === 'analytics') screen = <Analytics t={t} />;
  else if (section === 'payments') screen = <Payments t={t} onSandbox={setSandbox} />;
  else if (section === 'brand') screen = <Brand t={t} onPreview={setTokens} />;
  else if (section === 'settings') screen = <Settings t={t} />;

  return (
    <div className={section === 'pages' && route.id ? 'nk-app is-editing' : 'nk-app'} style={tokenStyle(tokens)}>
      {menu ? <button type="button" className="nk-scrim" aria-label={t('top.menu')} onClick={() => setMenu(false)} /> : null}
      <aside className={menu ? 'nk-rail is-open' : 'nk-rail'}>
        <div className="nk-brand"><span className="nk-mark" /> Noksha</div>
        <nav>
          {NAV.map((item) => (
            <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => go(item)}>
              {t('nav.' + item)}
            </button>
          ))}
        </nav>
      </aside>
      <header className="nk-top">
        <button type="button" className="nk-btn-ghost nk-menu" onClick={() => setMenu(true)}>{t('top.menu')}</button>
        <div className="nk-search">
          <input aria-label={t('top.search')} placeholder={t('top.search')} value={query} onChange={(event) => search(event.target.value)} />
          {query ? (
            <ul className="nk-suggest">
              {matches.length === 0 ? <li className="nk-muted">{t('top.searchEmpty')}</li> : matches.map((page) => (
                <li key={page.id}><button type="button" onClick={() => { setQuery(''); go('pages/' + page.id); }}>{page.title}</button></li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="nk-top-tools">
          {sandbox ? <span className="nk-badge">{t('top.sandbox')}</span> : null}
          <div className="nk-seg" role="group" aria-label={t('settings.language')}>
            <button type="button" className={locale === 'en' ? 'is-active' : ''} onClick={() => switchLocale('en')}>EN</button>
            <button type="button" className={locale === 'bn' ? 'is-active' : ''} onClick={() => switchLocale('bn')}>বাংলা</button>
          </div>
        </div>
      </header>
      <main className="nk-main">{screen}</main>
    </div>
  );
}
