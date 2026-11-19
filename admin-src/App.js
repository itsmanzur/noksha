import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import {
  Home as HomeIcon,
  FileText,
  ShoppingBag,
  Users,
  BarChart3,
  CreditCard,
  Palette,
  Settings as SettingsIcon,
  Search,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { api, tokenStyle } from './api';
import { translate } from './i18n';
import { formatNumber } from './format';
import { AppProviders, useToast } from './providers';
import { ErrorBoundary } from './ErrorBoundary';
import { Button, IconButton, Tooltip } from './ui';
import { Home } from './screens/Home';
import { Pages } from './screens/Pages';
import { Editor } from './screens/Editor';
import { Orders } from './screens/Orders';
import { Leads } from './screens/Leads';
import { Analytics } from './screens/Analytics';
import { Payments } from './screens/Payments';
import { Brand } from './screens/Brand';
import { Settings } from './screens/Settings';
import { Welcome } from './screens/Welcome';
import { UiKit } from './screens/UiKit';

const NAV_GROUPS = [
  {
    id: 'sell',
    labelKey: 'nav.groupSell',
    items: [
      { id: 'home', icon: HomeIcon },
      { id: 'pages', icon: FileText },
      { id: 'orders', icon: ShoppingBag, badge: 'needsCall' },
      { id: 'leads', icon: Users, badge: 'leadsToday' },
    ],
  },
  {
    id: 'grow',
    labelKey: 'nav.groupGrow',
    items: [{ id: 'analytics', icon: BarChart3 }],
  },
  {
    id: 'setup',
    labelKey: 'nav.groupSetup',
    items: [
      { id: 'payments', icon: CreditCard },
      { id: 'brand', icon: Palette },
      { id: 'settings', icon: SettingsIcon },
    ],
  },
];

const MOBILE_TABS = ['home', 'pages', 'orders', 'leads', 'settings'];

function readRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    name: parts[0] || 'home',
    id: parts[1] ? Number(parts[1]) : 0,
  };
}

function resolveTheme(pref) {
  if (pref === 'light' || pref === 'dark') {
    return pref;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function CommandPalette({ open, onClose, t, go, locale }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setItems([]);
      setActive(0);
      return undefined;
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const q = query.trim();
    if (q.length < 1) {
      setItems([]);
      return undefined;
    }
    let cancelled = false;
    Promise.all([
      api('pages?per_page=20&page=1').catch(() => ({ pages: [] })),
      api('orders?search=' + encodeURIComponent(q) + '&per_page=10&page=1').catch(() => ({ orders: [] })),
    ]).then(([pagesData, ordersData]) => {
      if (cancelled) return;
      const pages = (pagesData.pages || [])
        .filter((page) => String(page.title || '').toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6)
        .map((page) => ({
          id: 'p-' + page.id,
          title: page.title,
          meta: t('nav.pages'),
          path: 'pages/' + page.id,
        }));
      const orders = (ordersData.orders || []).slice(0, 6).map((order) => ({
        id: 'o-' + order.id,
        title: order.number + ' · ' + order.name,
        meta: order.phone,
        path: 'orders/' + order.id,
      }));
      setItems([...orders, ...pages]);
      setActive(0);
    });
    return () => {
      cancelled = true;
    };
  }, [query, open, t]);

  if (!open) {
    return null;
  }

  return (
    <div className="nk-cmd-overlay" role="dialog" aria-modal="true" aria-label={t('top.search')} onClick={onClose}>
      <div className="nk-cmd" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          value={query}
          placeholder={t('top.searchWide')}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActive((i) => Math.min(i + 1, Math.max(0, items.length - 1)));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            } else if (event.key === 'Enter' && items[active]) {
              go(items[active].path);
              onClose();
            }
          }}
        />
        <ul className="nk-cmd-list">
          {query && items.length === 0 ? <li className="nk-muted" style={{ padding: 12 }}>{t('top.searchEmpty')}</li> : null}
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={index === active ? 'nk-cmd-item is-active' : 'nk-cmd-item'}
                onMouseEnter={() => setActive(index)}
                onClick={() => {
                  go(item.path);
                  onClose();
                }}
              >
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ShellApp() {
  const boot = window.nokshaBoot || {
    locale: 'en',
    tokens: { color: {}, font: { sans: 'sans-serif' } },
    sandbox: false,
    theme: 'system',
    counts: { needsCall: 0, leadsToday: 0 },
    storeName: 'Noksha',
    user: '',
    userInitial: 'N',
    debug: false,
  };
  const [locale, setLocale] = useState(boot.locale === 'bn' ? 'bn' : 'en');
  const [tokens, setTokens] = useState(boot.tokens);
  const [sandbox, setSandbox] = useState(Boolean(boot.sandbox));
  const [route, setRoute] = useState(readRoute);
  const [menu, setMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(() => window.localStorage.getItem('noksha_rail') === '1');
  const [themePref, setThemePref] = useState(boot.theme || 'system');
  const [theme, setTheme] = useState(() => resolveTheme(boot.theme || 'system'));
  const [counts, setCounts] = useState(boot.counts || { needsCall: 0, leadsToday: 0 });
  const [palette, setPalette] = useState(false);
  const [offline, setOffline] = useState(!window.navigator.onLine);
  const [restError, setRestError] = useState('');
  const { toast, success } = useToast();
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

  useEffect(() => {
    const apply = () => setTheme(resolveTheme(themePref));
    apply();
    if (themePref !== 'system') {
      return undefined;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [themePref]);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    api('shell')
      .then((data) => setCounts({
        needsCall: Number(data.needsCall) || 0,
        leadsToday: Number(data.leadsToday) || 0,
      }))
      .catch(() => {});
    const timer = window.setInterval(() => {
      api('shell')
        .then((data) => setCounts({
          needsCall: Number(data.needsCall) || 0,
          leadsToday: Number(data.leadsToday) || 0,
        }))
        .catch((error) => setRestError(error.message || t('common.error')));
    }, 60000);
    return () => window.clearInterval(timer);
  }, [t]);

  const go = useCallback((path) => {
    window.location.hash = '#/' + path;
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api('onboarding').catch(() => ({ dismissed: true })),
      api('pages').catch(() => ({ pages: [{}] })),
    ]).then(([board, pagesData]) => {
      if (cancelled) {
        return;
      }
      const noPages = !((pagesData.pages || []).length);
      const current = readRoute();
      if (!board.dismissed && noPages && current.name !== 'welcome' && !(current.name === 'pages' && current.id)) {
        go('welcome');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [go]);

  function switchLocale(next) {
    setLocale(next);
    api('locale', { method: 'POST', body: { locale: next } }).catch(() => {});
  }

  function cycleTheme() {
    const order = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themePref) + 1) % order.length];
    setThemePref(next);
    api('prefs', { method: 'PUT', body: { theme: next } }).catch(() => {});
    success(t('shell.theme.' + next));
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem('noksha_rail', next ? '1' : '0');
  }

  const section = route.name === 'ui-kit' && boot.debug
    ? 'ui-kit'
    : route.name === 'welcome'
      ? 'welcome'
      : (route.name === 'pages' && route.id ? 'pages' : (
        NAV_GROUPS.some((g) => g.items.some((i) => i.id === route.name)) ? route.name : 'home'
      ));

  let screen = <Home t={t} go={go} locale={locale} />;
  if (section === 'ui-kit') screen = <UiKit t={t} locale={locale} />;
  else if (section === 'pages' && route.id) screen = <Editor t={t} id={route.id} go={go} locale={locale} />;
  else if (section === 'pages') screen = <Pages t={t} go={go} locale={locale} />;
  else if (section === 'orders') screen = <Orders t={t} go={go} orderId={route.id} locale={locale} />;
  else if (section === 'leads') screen = <Leads t={t} locale={locale} />;
  else if (section === 'analytics') screen = <Analytics t={t} locale={locale} />;
  else if (section === 'payments') screen = <Payments t={t} onSandbox={setSandbox} locale={locale} />;
  else if (section === 'brand') screen = <Brand t={t} onPreview={setTokens} locale={locale} />;
  else if (section === 'settings') screen = <Settings t={t} locale={locale} />;
  else if (section === 'welcome') screen = <Welcome t={t} go={go} locale={locale} />;

  const editing = section === 'pages' && route.id;
  const ThemeIcon = themePref === 'dark' ? Moon : (themePref === 'light' ? Sun : Monitor);
  const badgeFor = (key) => {
    if (!key) return null;
    const value = Number(counts[key]) || 0;
    if (value <= 0) return null;
    return <span className="nk-nav-badge">{formatNumber(value, locale)}</span>;
  };

  const className = [
    'nk-app',
    editing ? 'is-editing' : '',
    collapsed ? 'is-collapsed' : '',
    menu ? 'menu-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={tokenStyle(tokens)}
      data-theme={theme}
      data-lang={locale}
      lang={locale}
    >
      {menu ? <button type="button" className="nk-scrim" aria-label={t('top.menu')} onClick={() => setMenu(false)} /> : null}

      <aside className="nk-rail" aria-label={t('shell.nav')}>
        <div className="nk-brand-block">
          <span className="nk-mark" aria-hidden="true">N</span>
          <div className="nk-brand-copy">
            <strong>Noksha</strong>
            <span>{boot.storeName || 'Noksha'}</span>
          </div>
        </div>
        <nav>
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="nk-nav-group">
              <div className="nk-nav-label">{t(group.labelKey)}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={section === item.id ? 'nk-nav-item is-active' : 'nk-nav-item'}
                    onClick={() => go(item.id)}
                    title={t('nav.' + item.id)}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    <span className="nk-nav-text">{t('nav.' + item.id)}</span>
                    {badgeFor(item.badge)}
                  </button>
                );
              })}
            </div>
          ))}
          {boot.debug ? (
            <div className="nk-nav-group">
              <div className="nk-nav-label">Dev</div>
              <button
                type="button"
                className={section === 'ui-kit' ? 'nk-nav-item is-active' : 'nk-nav-item'}
                onClick={() => go('ui-kit')}
              >
                <Palette size={18} />
                <span className="nk-nav-text">{t('nav.uikit')}</span>
              </button>
            </div>
          ) : null}
        </nav>
        <div className="nk-rail-foot">
          <IconButton
            aria-label={collapsed ? t('shell.expand') : t('shell.collapse')}
            onClick={toggleCollapsed}
            icon={collapsed ? PanelLeft : PanelLeftClose}
          />
        </div>
      </aside>

      <header className="nk-top">
        <Button variant="ghost" size="sm" className="nk-menu" onClick={() => setMenu(true)}>{t('top.menu')}</Button>
        <button type="button" className="nk-search-trigger" onClick={() => setPalette(true)}>
          <Search size={16} />
          <span>{t('top.searchWide')}</span>
          <kbd>Ctrl K</kbd>
        </button>
        <div className="nk-top-tools">
          <button
            type="button"
            className={sandbox ? 'nk-mode-pill is-sandbox' : 'nk-mode-pill'}
            onClick={() => go('payments')}
          >
            {sandbox ? t('top.sandbox') : t('top.live')}
          </button>
          <div className="nk-seg" role="group" aria-label={t('settings.language')}>
            <button type="button" className={locale === 'en' ? 'is-active' : ''} onClick={() => switchLocale('en')}>EN</button>
            <button type="button" className={locale === 'bn' ? 'is-active' : ''} onClick={() => switchLocale('bn')}>বাংলা</button>
          </div>
          <Tooltip content={t('shell.theme.' + themePref)}>
            <IconButton aria-label={t('shell.theme.' + themePref)} onClick={cycleTheme} icon={ThemeIcon} />
          </Tooltip>
          <Tooltip content={t('shell.help')}>
            <IconButton
              aria-label={t('shell.help')}
              icon={HelpCircle}
              onClick={() => toast({ message: t('shell.helpBody') })}
            />
          </Tooltip>
          <span className="nk-avatar" title={boot.user || ''}>{boot.userInitial || 'N'}</span>
        </div>
      </header>

      <main className="nk-main">
        {(offline || restError) ? (
          <div className="nk-banner-bar" role="alert">
            <span>{offline ? t('shell.offline') : restError}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setRestError('');
                api('shell')
                  .then((data) => setCounts({
                    needsCall: Number(data.needsCall) || 0,
                    leadsToday: Number(data.leadsToday) || 0,
                  }))
                  .catch((error) => setRestError(error.message || t('common.error')));
              }}
            >
              {t('common.retry')}
            </Button>
          </div>
        ) : null}
        <ErrorBoundary t={t}>
          {screen}
        </ErrorBoundary>
      </main>

      <nav className="nk-mobile-tabs" aria-label={t('shell.nav')}>
        {MOBILE_TABS.map((id) => {
          const Icon = ({
            home: HomeIcon,
            pages: FileText,
            orders: ShoppingBag,
            leads: Users,
            settings: SettingsIcon,
          })[id];
          return (
            <button key={id} type="button" className={section === id ? 'is-active' : ''} onClick={() => go(id)}>
              <Icon size={18} />
              <span>{t('nav.' + id)}</span>
            </button>
          );
        })}
      </nav>

      <CommandPalette open={palette} onClose={() => setPalette(false)} t={t} go={go} locale={locale} />
    </div>
  );
}

export function App() {
  return (
    <AppProviders>
      <ShellApp />
    </AppProviders>
  );
}
