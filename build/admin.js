/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./admin-src/App.js"
/*!**************************!*\
  !*** ./admin-src/App.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chart-column.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/house.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/panel-left.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/credit-card.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/monitor.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/moon.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/palette.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/search.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sun.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./api */ "./admin-src/api.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./i18n */ "./admin-src/i18n.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./format */ "./admin-src/format.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./providers */ "./admin-src/providers.js");
/* harmony import */ var _ErrorBoundary__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ErrorBoundary */ "./admin-src/ErrorBoundary.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./ui */ "./admin-src/ui/index.js");
/* harmony import */ var _screens_Home__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./screens/Home */ "./admin-src/screens/Home.js");
/* harmony import */ var _screens_Pages__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./screens/Pages */ "./admin-src/screens/Pages.js");
/* harmony import */ var _screens_Editor__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./screens/Editor */ "./admin-src/screens/Editor.js");
/* harmony import */ var _screens_Orders__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./screens/Orders */ "./admin-src/screens/Orders.js");
/* harmony import */ var _screens_Leads__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./screens/Leads */ "./admin-src/screens/Leads.js");
/* harmony import */ var _screens_Analytics__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./screens/Analytics */ "./admin-src/screens/Analytics.js");
/* harmony import */ var _screens_Payments__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./screens/Payments */ "./admin-src/screens/Payments.js");
/* harmony import */ var _screens_Brand__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./screens/Brand */ "./admin-src/screens/Brand.js");
/* harmony import */ var _screens_Settings__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./screens/Settings */ "./admin-src/screens/Settings.js");
/* harmony import */ var _screens_Welcome__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./screens/Welcome */ "./admin-src/screens/Welcome.js");
/* harmony import */ var _screens_UiKit__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./screens/UiKit */ "./admin-src/screens/UiKit.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__);




















const NAV_GROUPS = [{
  id: 'sell',
  labelKey: 'nav.groupSell',
  items: [{
    id: 'home',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"]
  }, {
    id: 'pages',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"]
  }, {
    id: 'orders',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"],
    badge: 'needsCall'
  }, {
    id: 'leads',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"],
    badge: 'leadsToday'
  }]
}, {
  id: 'grow',
  labelKey: 'nav.groupGrow',
  items: [{
    id: 'analytics',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"]
  }]
}, {
  id: 'setup',
  labelKey: 'nav.groupSetup',
  items: [{
    id: 'payments',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"]
  }, {
    id: 'brand',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"]
  }, {
    id: 'settings',
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"]
  }]
}];
const MOBILE_TABS = ['home', 'pages', 'orders', 'leads', 'settings'];
function readRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return {
    name: parts[0] || 'home',
    id: parts[1] ? Number(parts[1]) : 0
  };
}
function resolveTheme(pref) {
  if (pref === 'light' || pref === 'dark') {
    return pref;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function CommandPalette({
  open,
  onClose,
  t,
  go,
  locale
}) {
  const [query, setQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [active, setActive] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!open) {
      setQuery('');
      setItems([]);
      setActive(0);
      return undefined;
    }
    const onKey = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!open) {
      return undefined;
    }
    const q = query.trim();
    if (q.length < 1) {
      setItems([]);
      return undefined;
    }
    let cancelled = false;
    Promise.all([(0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('pages?per_page=20&page=1').catch(() => ({
      pages: []
    })), (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('orders?search=' + encodeURIComponent(q) + '&per_page=10&page=1').catch(() => ({
      orders: []
    }))]).then(([pagesData, ordersData]) => {
      if (cancelled) return;
      const pages = (pagesData.pages || []).filter(page => String(page.title || '').toLowerCase().includes(q.toLowerCase())).slice(0, 6).map(page => ({
        id: 'p-' + page.id,
        title: page.title,
        meta: t('nav.pages'),
        path: 'pages/' + page.id
      }));
      const orders = (ordersData.orders || []).slice(0, 6).map(order => ({
        id: 'o-' + order.id,
        title: order.number + ' · ' + order.name,
        meta: order.phone,
        path: 'orders/' + order.id
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("div", {
    className: "nk-cmd-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": t('top.search'),
    onClick: onClose,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
      className: "nk-cmd",
      onClick: event => event.stopPropagation(),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("input", {
        autoFocus: true,
        value: query,
        placeholder: t('top.searchWide'),
        onChange: event => setQuery(event.target.value),
        onKeyDown: event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActive(i => Math.min(i + 1, Math.max(0, items.length - 1)));
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive(i => Math.max(0, i - 1));
          } else if (event.key === 'Enter' && items[active]) {
            go(items[active].path);
            onClose();
          }
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("ul", {
        className: "nk-cmd-list",
        children: [query && items.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("li", {
          className: "nk-muted",
          style: {
            padding: 12
          },
          children: t('top.searchEmpty')
        }) : null, items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("li", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("button", {
            type: "button",
            className: index === active ? 'nk-cmd-item is-active' : 'nk-cmd-item',
            onMouseEnter: () => setActive(index),
            onClick: () => {
              go(item.path);
              onClose();
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("strong", {
              children: item.title
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("small", {
              children: item.meta
            })]
          })
        }, item.id))]
      })]
    })
  });
}
function ShellApp() {
  const boot = window.nokshaBoot || {
    locale: 'en',
    tokens: {
      color: {},
      font: {
        sans: 'sans-serif'
      }
    },
    sandbox: false,
    theme: 'system',
    counts: {
      needsCall: 0,
      leadsToday: 0
    },
    storeName: 'Noksha',
    user: '',
    userInitial: 'N',
    debug: false
  };
  const [locale, setLocale] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(boot.locale === 'bn' ? 'bn' : 'en');
  const [tokens, setTokens] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(boot.tokens);
  const [sandbox, setSandbox] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(Boolean(boot.sandbox));
  const [route, setRoute] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(readRoute);
  const [menu, setMenu] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [collapsed, setCollapsed] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => window.localStorage.getItem('noksha_rail') === '1');
  const [themePref, setThemePref] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(boot.theme || 'system');
  const [theme, setTheme] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => resolveTheme(boot.theme || 'system'));
  const [counts, setCounts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(boot.counts || {
    needsCall: 0,
    leadsToday: 0
  });
  const [palette, setPalette] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [offline, setOffline] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(!window.navigator.onLine);
  const [restError, setRestError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    toast,
    success
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_19__.useToast)();
  const t = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => key => (0,_i18n__WEBPACK_IMPORTED_MODULE_17__.translate)(locale, key), [locale]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('shell').then(data => setCounts({
      needsCall: Number(data.needsCall) || 0,
      leadsToday: Number(data.leadsToday) || 0
    })).catch(() => {});
    const timer = window.setInterval(() => {
      (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('shell').then(data => setCounts({
        needsCall: Number(data.needsCall) || 0,
        leadsToday: Number(data.leadsToday) || 0
      })).catch(error => setRestError(error.message || t('common.error')));
    }, 60000);
    return () => window.clearInterval(timer);
  }, [t]);
  const go = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(path => {
    window.location.hash = '#/' + path;
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let cancelled = false;
    Promise.all([(0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('onboarding').catch(() => ({
      dismissed: true
    })), (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('pages').catch(() => ({
      pages: [{}]
    }))]).then(([board, pagesData]) => {
      if (cancelled) {
        return;
      }
      const noPages = !(pagesData.pages || []).length;
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
    (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('locale', {
      method: 'POST',
      body: {
        locale: next
      }
    }).catch(() => {});
  }
  function cycleTheme() {
    const order = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themePref) + 1) % order.length];
    setThemePref(next);
    (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('prefs', {
      method: 'PUT',
      body: {
        theme: next
      }
    }).catch(() => {});
    success(t('shell.theme.' + next));
  }
  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem('noksha_rail', next ? '1' : '0');
  }
  const section = route.name === 'ui-kit' && boot.debug ? 'ui-kit' : route.name === 'welcome' ? 'welcome' : route.name === 'pages' && route.id ? 'pages' : NAV_GROUPS.some(g => g.items.some(i => i.id === route.name)) ? route.name : 'home';
  let screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Home__WEBPACK_IMPORTED_MODULE_22__.Home, {
    t: t,
    go: go,
    locale: locale
  });
  if (section === 'ui-kit') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_UiKit__WEBPACK_IMPORTED_MODULE_32__.UiKit, {
    t: t,
    locale: locale
  });else if (section === 'pages' && route.id) screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Editor__WEBPACK_IMPORTED_MODULE_24__.Editor, {
    t: t,
    id: route.id,
    go: go,
    locale: locale
  });else if (section === 'pages') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Pages__WEBPACK_IMPORTED_MODULE_23__.Pages, {
    t: t,
    go: go,
    locale: locale
  });else if (section === 'orders') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Orders__WEBPACK_IMPORTED_MODULE_25__.Orders, {
    t: t,
    go: go,
    orderId: route.id,
    locale: locale
  });else if (section === 'leads') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Leads__WEBPACK_IMPORTED_MODULE_26__.Leads, {
    t: t,
    locale: locale
  });else if (section === 'analytics') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Analytics__WEBPACK_IMPORTED_MODULE_27__.Analytics, {
    t: t,
    locale: locale
  });else if (section === 'payments') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Payments__WEBPACK_IMPORTED_MODULE_28__.Payments, {
    t: t,
    onSandbox: setSandbox,
    locale: locale
  });else if (section === 'brand') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Brand__WEBPACK_IMPORTED_MODULE_29__.Brand, {
    t: t,
    onPreview: setTokens,
    locale: locale
  });else if (section === 'settings') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Settings__WEBPACK_IMPORTED_MODULE_30__.Settings, {
    t: t,
    locale: locale
  });else if (section === 'welcome') screen = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_screens_Welcome__WEBPACK_IMPORTED_MODULE_31__.Welcome, {
    t: t,
    go: go,
    locale: locale
  });
  const editing = section === 'pages' && route.id;
  const ThemeIcon = themePref === 'dark' ? lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"] : themePref === 'light' ? lucide_react__WEBPACK_IMPORTED_MODULE_14__["default"] : lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"];
  const badgeFor = key => {
    if (!key) return null;
    const value = Number(counts[key]) || 0;
    if (value <= 0) return null;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
      className: "nk-nav-badge",
      children: (0,_format__WEBPACK_IMPORTED_MODULE_18__.formatNumber)(value, locale)
    });
  };
  const className = ['nk-app', editing ? 'is-editing' : '', collapsed ? 'is-collapsed' : '', menu ? 'menu-open' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
    className: className,
    style: (0,_api__WEBPACK_IMPORTED_MODULE_16__.tokenStyle)(tokens),
    "data-theme": theme,
    "data-lang": locale,
    lang: locale,
    children: [menu ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("button", {
      type: "button",
      className: "nk-scrim",
      "aria-label": t('top.menu'),
      onClick: () => setMenu(false)
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("aside", {
      className: "nk-rail",
      "aria-label": t('shell.nav'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
        className: "nk-brand-block",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
          className: "nk-mark",
          "aria-hidden": "true",
          children: "N"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
          className: "nk-brand-copy",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("strong", {
            children: "Noksha"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
            children: boot.storeName || 'Noksha'
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("nav", {
        children: [NAV_GROUPS.map(group => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
          className: "nk-nav-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("div", {
            className: "nk-nav-label",
            children: t(group.labelKey)
          }), group.items.map(item => {
            const Icon = item.icon;
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("button", {
              type: "button",
              className: section === item.id ? 'nk-nav-item is-active' : 'nk-nav-item',
              onClick: () => go(item.id),
              title: t('nav.' + item.id),
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(Icon, {
                size: 18,
                strokeWidth: 1.75
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
                className: "nk-nav-text",
                children: t('nav.' + item.id)
              }), badgeFor(item.badge)]
            }, item.id);
          })]
        }, group.id)), boot.debug ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
          className: "nk-nav-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("div", {
            className: "nk-nav-label",
            children: "Dev"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("button", {
            type: "button",
            className: section === 'ui-kit' ? 'nk-nav-item is-active' : 'nk-nav-item',
            onClick: () => go('ui-kit'),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], {
              size: 18
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
              className: "nk-nav-text",
              children: t('nav.uikit')
            })]
          })]
        }) : null]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("div", {
        className: "nk-rail-foot",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.IconButton, {
          "aria-label": collapsed ? t('shell.expand') : t('shell.collapse'),
          onClick: toggleCollapsed,
          icon: collapsed ? lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"] : lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("header", {
      className: "nk-top",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.Button, {
        variant: "ghost",
        size: "sm",
        className: "nk-menu",
        onClick: () => setMenu(true),
        children: t('top.menu')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("button", {
        type: "button",
        className: "nk-search-trigger",
        onClick: () => setPalette(true),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], {
          size: 16
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
          children: t('top.searchWide')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("kbd", {
          children: "Ctrl K"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
        className: "nk-top-tools",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("button", {
          type: "button",
          className: sandbox ? 'nk-mode-pill is-sandbox' : 'nk-mode-pill',
          onClick: () => go('payments'),
          children: sandbox ? t('top.sandbox') : t('top.live')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
          className: "nk-seg",
          role: "group",
          "aria-label": t('settings.language'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("button", {
            type: "button",
            className: locale === 'en' ? 'is-active' : '',
            onClick: () => switchLocale('en'),
            children: "EN"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("button", {
            type: "button",
            className: locale === 'bn' ? 'is-active' : '',
            onClick: () => switchLocale('bn'),
            children: "\u09AC\u09BE\u0982\u09B2\u09BE"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.Tooltip, {
          content: t('shell.theme.' + themePref),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.IconButton, {
            "aria-label": t('shell.theme.' + themePref),
            onClick: cycleTheme,
            icon: ThemeIcon
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.Tooltip, {
          content: t('shell.help'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.IconButton, {
            "aria-label": t('shell.help'),
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
            onClick: () => toast({
              message: t('shell.helpBody')
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
          className: "nk-avatar",
          title: boot.user || '',
          children: boot.userInitial || 'N'
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("main", {
      className: "nk-main",
      children: [offline || restError ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("div", {
        className: "nk-banner-bar",
        role: "alert",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
          children: offline ? t('shell.offline') : restError
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_21__.Button, {
          variant: "secondary",
          size: "sm",
          onClick: () => {
            setRestError('');
            (0,_api__WEBPACK_IMPORTED_MODULE_16__.api)('shell').then(data => setCounts({
              needsCall: Number(data.needsCall) || 0,
              leadsToday: Number(data.leadsToday) || 0
            })).catch(error => setRestError(error.message || t('common.error')));
          },
          children: t('common.retry')
        })]
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_ErrorBoundary__WEBPACK_IMPORTED_MODULE_20__.ErrorBoundary, {
        t: t,
        children: screen
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("nav", {
      className: "nk-mobile-tabs",
      "aria-label": t('shell.nav'),
      children: MOBILE_TABS.map(id => {
        const Icon = {
          home: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
          pages: lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"],
          orders: lucide_react__WEBPACK_IMPORTED_MODULE_13__["default"],
          leads: lucide_react__WEBPACK_IMPORTED_MODULE_15__["default"],
          settings: lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"]
        }[id];
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsxs)("button", {
          type: "button",
          className: section === id ? 'is-active' : '',
          onClick: () => go(id),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(Icon, {
            size: 18
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)("span", {
            children: t('nav.' + id)
          })]
        }, id);
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(CommandPalette, {
      open: palette,
      onClose: () => setPalette(false),
      t: t,
      go: go,
      locale: locale
    })]
  });
}
function App() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(_providers__WEBPACK_IMPORTED_MODULE_19__.AppProviders, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_33__.jsx)(ShellApp, {})
  });
}

/***/ },

/***/ "./admin-src/ErrorBoundary.js"
/*!************************************!*\
  !*** ./admin-src/ErrorBoundary.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorBoundary: () => (/* binding */ ErrorBoundary)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



class ErrorBoundary extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  render() {
    if (this.state.error) {
      const t = this.props.t || (key => key);
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "nk-banner-bar",
        role: "alert",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("strong", {
            children: t('shell.errorTitle')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            children: this.state.error.message || t('common.error')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          size: "sm",
          onClick: () => {
            this.setState({
              error: null
            });
            window.location.reload();
          },
          children: t('common.retry')
        })]
      });
    }
    return this.props.children;
  }
}

/***/ },

/***/ "./admin-src/api.js"
/*!**************************!*\
  !*** ./admin-src/api.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncView: () => (/* binding */ AsyncView),
/* harmony export */   api: () => (/* binding */ api),
/* harmony export */   money: () => (/* binding */ money),
/* harmony export */   tokenStyle: () => (/* binding */ tokenStyle),
/* harmony export */   when: () => (/* binding */ when)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function api(path, options = {}) {
  const boot = window.nokshaBoot || {};
  const method = options.method || 'GET';
  return window.fetch(boot.root + String(path).replace(/^\//, ''), {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': boot.nonce
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  }).then(async res => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.message || 'Request failed');
      error.code = data.code || 'http_error';
      throw error;
    }
    return data;
  });
}
function money(value) {
  const amount = Number(value) || 0;
  const digits = Math.round(amount) === amount ? 0 : 2;
  return '৳' + amount.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
function when(value) {
  if (!value) {
    return '';
  }
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}
function tokenStyle(tokens) {
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
    '--noksha-space': tokens.space || '16px'
  };
}
function AsyncView({
  status,
  error,
  t,
  onRetry,
  children
}) {
  if (status === 'loading') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "nk-muted",
      children: t('common.loading')
    });
  }
  if (status === 'error') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      className: "nk-banner",
      role: "alert",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
        children: error || t('common.error')
      }), onRetry ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
        type: "button",
        className: "nk-btn",
        onClick: onRetry,
        children: t('common.retry')
      }) : null]
    });
  }
  return children;
}

/***/ },

/***/ "./admin-src/format.js"
/*!*****************************!*\
  !*** ./admin-src/format.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   formatRelative: () => (/* binding */ formatRelative),
/* harmony export */   toBanglaDigits: () => (/* binding */ toBanglaDigits)
/* harmony export */ });
const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBanglaDigits(str) {
  return String(str).replace(/\d/g, d => BN[Number(d)]);
}
function formatNumber(n, locale) {
  const num = Number(n);
  if (Number.isNaN(num)) {
    return locale === 'bn' ? toBanglaDigits(String(n)) : String(n);
  }
  const formatted = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US').format(num);
  return locale === 'bn' ? toBanglaDigits(formatted) : formatted;
}
function formatMoney(amount, locale) {
  const value = formatNumber(amount, locale);
  return `৳${value}`;
}
function relativeValue(date) {
  const ms = (date instanceof Date ? date : new Date(date)).getTime();
  if (Number.isNaN(ms)) {
    return null;
  }
  const diffSec = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) {
    return {
      value: diffSec,
      unit: 'second'
    };
  }
  if (abs < 3600) {
    return {
      value: Math.round(diffSec / 60),
      unit: 'minute'
    };
  }
  if (abs < 86400) {
    return {
      value: Math.round(diffSec / 3600),
      unit: 'hour'
    };
  }
  if (abs < 2592000) {
    return {
      value: Math.round(diffSec / 86400),
      unit: 'day'
    };
  }
  if (abs < 31536000) {
    return {
      value: Math.round(diffSec / 2592000),
      unit: 'month'
    };
  }
  return {
    value: Math.round(diffSec / 31536000),
    unit: 'year'
  };
}
function formatRelative(date, locale) {
  const rel = relativeValue(date);
  if (!rel) {
    return '';
  }
  const tag = locale === 'bn' ? 'bn' : 'en';
  const out = new Intl.RelativeTimeFormat(tag, {
    numeric: 'auto'
  }).format(rel.value, rel.unit);
  return locale === 'bn' ? toBanglaDigits(out) : out;
}

/***/ },

/***/ "./admin-src/i18n.js"
/*!***************************!*\
  !*** ./admin-src/i18n.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   translate: () => (/* binding */ translate)
/* harmony export */ });
const en = {
  'nav.home': 'Home',
  'nav.pages': 'Pages',
  'nav.orders': 'Orders',
  'nav.analytics': 'Analytics',
  'nav.payments': 'Payments & couriers',
  'nav.brand': 'Brand',
  'nav.settings': 'Settings',
  'nav.groupSell': 'Sell',
  'nav.groupGrow': 'Grow',
  'nav.groupSetup': 'Setup',
  'nav.uikit': 'UI kit',
  'top.search': 'Search pages',
  'top.searchWide': 'Search pages, orders, phone…',
  'top.searchEmpty': 'No matching page',
  'top.sandbox': 'Sandbox',
  'top.live': 'Live',
  'top.menu': 'Menu',
  'shell.nav': 'Main navigation',
  'shell.collapse': 'Collapse sidebar',
  'shell.expand': 'Expand sidebar',
  'shell.help': 'Help',
  'shell.helpBody': 'Use Ctrl+K to search. COD orders start as Needs call.',
  'shell.offline': 'You are offline. Changes may not save.',
  'shell.errorTitle': 'Something broke in the app',
  'shell.theme.system': 'Theme: System',
  'shell.theme.light': 'Theme: Light',
  'shell.theme.dark': 'Theme: Dark',
  'uikit.title': 'UI kit',
  'uikit.help': 'Debug-only gallery of design-system components.',
  'uikit.empty': 'Nothing here yet',
  'uikit.emptyBody': 'Empty states should invite the next action.',
  'uikit.toast': 'Toast ready',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'home.todayOrders': "Today's orders",
  'home.orders': 'Orders',
  'home.revenue': 'Revenue',
  'home.conversion': 'Conversion',
  'home.notEnoughData': 'Not enough data',
  'home.codShare': 'Cash on delivery',
  'orders.searchAction': 'Search',
  'orders.allTime': 'All time',
  'orders.customRange': 'Custom',
  'settings.storeName': 'Store name',
  'settings.storeNameHelp': 'Shown on packing slips and SMS sign-off. Defaults to the site title.',
  'home.chart': 'Revenue, last {days} days',
  'home.chartToday': "Today's revenue",
  'home.recent': 'Recent orders',
  'home.topPages': 'Pages selling',
  'home.emptyOrders': 'No orders yet. Publish a page and share the link.',
  'home.emptyPages': 'No page has a sale in this range.',
  'home.open': 'Open',
  'home.greetingMorning': 'Good morning',
  'home.greetingAfternoon': 'Good afternoon',
  'home.greetingEvening': 'Good evening',
  'home.rangeToday': 'Today',
  'home.range7d': '7 days',
  'home.range30d': '30 days',
  'home.needsCall': 'Needs call',
  'home.returnRate': 'Return rate',
  'home.codCollect': 'COD to collect',
  'home.actionNeeded': 'Action needed',
  'home.actionOrdersHelp': 'Orders waiting for your call',
  'home.actionLeadsHelp': 'Leads captured today',
  'home.actionCodHelp': 'Unsettled COD',
  'home.checklistProgress': '{done} of {total} complete',
  'home.stepDone': 'Done',
  'home.chartLegend': 'Bars: orders · Line: revenue',
  'home.emptyChart': 'No chart data for this range.',
  'pages.title': 'Pages',
  'pages.new': 'New page',
  'pages.emptyTitle': 'Create the first landing page',
  'pages.emptyBody': 'Start from a template. You can rewrite every line.',
  'pages.single': 'Single product',
  'pages.singleBody': 'One offer, reviews, and an order form.',
  'pages.lead': 'Lead',
  'pages.leadBody': 'Name and phone, for a call back.',
  'pages.festival': 'Festival offer',
  'pages.festivalBody': 'A countdown and a sale price.',
  'pages.blank': 'Blank page',
  'pages.name': 'Name',
  'pages.status': 'Status',
  'pages.visits': 'Visits',
  'pages.orders': 'Orders',
  'pages.conversion': 'Conversion',
  'pages.draft': 'Draft',
  'pages.published': 'Published',
  'pages.delete': 'Delete',
  'pages.deleteConfirm': 'Delete this page? Orders already placed stay in the list.',
  'pages.language': 'Template language',
  'editor.back': 'All pages',
  'editor.save': 'Save',
  'editor.saving': 'Saving',
  'editor.saved': 'Saved',
  'editor.publish': 'Publish',
  'editor.view': 'View',
  'editor.mobile': 'Phone',
  'editor.tablet': 'Tablet',
  'editor.desktop': 'Desktop',
  'editor.redo': 'Redo',
  'editor.unpublish': 'Unpublish',
  'editor.publishMenu': 'More publish options',
  'editor.pageSettings': 'Page settings',
  'editor.settingsHelp': 'Offer, checkout, SEO, and other page-wide options.',
  'editor.seoTab': 'SEO',
  'editor.sections': 'Sections',
  'editor.add': 'Add section',
  'editor.hide': 'Hide',
  'editor.show': 'Show',
  'editor.up': 'Move up',
  'editor.down': 'Move down',
  'editor.remove': 'Remove',
  'editor.removeConfirm': 'Delete this section?',
  'editor.section': 'Section',
  'editor.offer': 'Offer',
  'editor.checkout': 'Checkout',
  'editor.page': 'Page',
  'editor.title': 'Page title',
  'editor.slug': 'Page link',
  'editor.slugHelp': 'Use English letters, numbers and dashes.',
  'editor.language': 'Form language',
  'editor.languageHelp': 'This changes labels on the form. The words you wrote stay as they are.',
  'editor.motion': 'Page feel',
  'editor.motion.simple': 'Simple',
  'editor.motion.lively': 'Lively',
  'editor.motionHelp': 'Lively adds soft entrance effects, hover lifts and a pulsing order button. Turns itself off for visitors who prefer reduced motion. Scroll effects show on the live page, not in this preview.',
  'editor.status': 'Visibility',
  'editor.statusHelp': 'Draft pages are only visible to you. The change applies when you save.',
  'editor.customColors': 'Custom colors on this page',
  'editor.previewFailed': 'The preview could not be built.',
  'editor.chooseImage': 'Choose image',
  'editor.saveDraft': 'Save draft',
  'editor.update': 'Update page',
  'editor.unsaved': 'Unsaved changes',
  'editor.allSaved': 'All changes saved',
  'editor.live': 'Live',
  'editor.draft': 'Draft',
  'editor.viewLive': 'View live',
  'editor.device': 'Preview size',
  'editor.shortcut': 'Ctrl + S',
  'editor.leaveConfirm': 'You have unsaved changes. Leave without saving?',
  'editor.content': 'Page content',
  'editor.contentHelp': 'Click a block to edit it, or click it in the preview. Drag to change the order.',
  'editor.emptyContent': 'This page has no sections yet. Add one to start.',
  'editor.addTitle': 'Add a section',
  'editor.addHelp': 'New sections go above the order form. You can move them later.',
  'editor.addAfter': 'The new section goes right after:',
  'look.title': 'Look & feel',
  'look.layout': 'Layout',
  'look.background': 'Background',
  'look.spacing': 'Spacing',
  'look.layout.split': 'Side by side',
  'look.layout.center': 'Centered',
  'look.layout.overlay': 'Over image',
  'look.layout.cards': 'Cards',
  'look.layout.list': 'List',
  'look.layout.numbers': 'Numbered',
  'look.layout.slider': 'Slider',
  'look.layout.grid': 'Grid',
  'look.layout.side': 'Image left',
  'look.layout.reverse': 'Image right',
  'look.layout.stacked': 'Stacked',
  'look.bg.none': 'None',
  'look.bg.soft': 'Soft tint',
  'look.bg.warm': 'Warm',
  'look.bg.dark': 'Dark',
  'look.bg.brand': 'Brand color',
  'look.bg.gradient': 'Gradient',
  'look.space.compact': 'Tight',
  'look.space.normal': 'Normal',
  'look.space.roomy': 'Roomy',
  'look.textSize': 'Text size',
  'look.textSizeHint': 'Heading ≈ {range} (phone → desktop)',
  'look.size.sm': 'Small',
  'look.size.md': 'Normal',
  'look.size.lg': 'Large',
  'look.size.xl': 'Extra large',
  'look.image': 'Image',
  'look.ratio': 'Shape',
  'look.ratio.auto': 'Original',
  'look.ratio.square': 'Square',
  'look.ratio.4-3': '4:3',
  'look.ratio.16-9': '16:9',
  'look.ratio.3-4': 'Tall 3:4',
  'look.fit': 'Fit',
  'look.fit.cover': 'Fill & crop',
  'look.fit.contain': 'Show all',
  'look.round': 'Corners',
  'look.round.none': 'Square',
  'look.round.md': 'Soft',
  'look.round.lg': 'Round',
  'look.round.full': 'Circle',
  'editor.settingsEntryHint': 'Price, checkout, SEO, colors, link',
  'editor.group.attention': 'Grab attention',
  'editor.group.trust': 'Build trust',
  'editor.group.product': 'Product & order',
  'editor.group.advanced': 'Advanced',
  'editor.alreadyAdded': 'Already on this page',
  'editor.settings': 'Page settings',
  'editor.offerTitle': 'Product & price',
  'editor.checkoutTitle': 'Order form & payment',
  'editor.pageTitle': 'Link & language',
  'editor.colorsTitle': 'Colors',
  'editor.colorsHelp': 'When this is off, the page uses your Brand colors.',
  'editor.brandColors': 'Using brand colors',
  'editor.customColorsOn': 'Custom colors',
  'editor.resetColors': 'Reset to brand colors',
  'editor.paymentsCount': '{n} payment options',
  'editor.backToContent': 'Page content',
  'editor.untitled': 'Untitled',
  'editor.hiddenTag': 'Hidden',
  'editor.hiddenNote': 'This section is hidden. Customers will not see it.',
  'editor.hideSection': 'Hide from page',
  'editor.showSection': 'Show on page',
  'editor.deleteSection': 'Delete section',
  'editor.missingSection': 'This section was removed.',
  'editor.preview': 'Preview',
  'editor.previewHint': 'Click a block to select. Click text to edit inline.',
  'editor.previewUpdating': 'Updating…',
  'editor.dragHint': 'Drag to reorder',
  'editor.orderNow': 'Order now',
  'editor.danger': 'Delete this page',
  'editor.dangerHelp': 'The page and its link go away. Orders already placed stay.',
  'sectionHelp.hero': 'Big headline and button at the top of the page.',
  'sectionHelp.benefits': 'Short reasons to buy, shown as cards.',
  'sectionHelp.product': 'Product photo, description and price.',
  'sectionHelp.countdown': 'A timer that runs until the offer ends.',
  'sectionHelp.reviews': 'What customers said about the product.',
  'sectionHelp.faq': 'Questions buyers often ask, with answers.',
  'sectionHelp.guarantee': 'Your promise on returns or exchange.',
  'sectionHelp.html': 'Paste your own HTML code — video embeds, maps, custom design.',
  'help.htmlFull': 'Write or paste HTML. Scripts are always removed. Trusted iframes (YouTube, Vimeo, Google Maps) are kept.',
  'help.htmlSafe': 'Write or paste HTML. Scripts are removed. YouTube, Vimeo and Google Maps embeds are kept; other iframes are stripped.',
  'sectionHelp.order_form': 'Where customers place the order. One per page.',
  'help.eyebrow': 'Optional. For example: Free delivery inside Dhaka.',
  'help.button': 'The button takes visitors to the order form.',
  'help.productPrice': 'Price and delivery charge are set in Product & price',
  'help.endsAt': 'The timer stops at zero when this time is reached.',
  'help.orderForm': 'Choose form fields and payment options',
  'items.title.benefits': 'Benefits',
  'items.title.reviews': 'Reviews',
  'items.title.faq': 'Questions',
  'items.add.benefits': 'Add benefit',
  'items.add.reviews': 'Add review',
  'items.add.faq': 'Add question',
  'items.limit': 'Up to {n} items.',
  'image.change': 'Change',
  'image.remove': 'Remove',
  'image.paste': 'Or paste an image link',
  'colors.main': 'Main',
  'colors.surface': 'Background and text',
  'colors.status': 'Messages',
  'offer.productName': 'Product name',
  'offer.price': 'Selling price',
  'offer.compareAt': 'Old price',
  'offer.compareHelp': 'Shown crossed out. Use 0 to hide it.',
  'offer.shipping': 'Delivery charge',
  'offer.shippingHelp': 'Use 0 for free delivery.',
  'offer.shippingInside': 'Inside Dhaka',
  'offer.shippingOutside': 'Outside Dhaka',
  'offer.shippingInsideHelp': 'Charged when the customer picks Dhaka district.',
  'offer.shippingOutsideHelp': 'Charged for every other district.',
  'offer.shippingZones': 'Dhaka {inside} · Outside {outside}',
  'offer.image': 'Product image',
  'offer.bumpTitle': 'Order bump',
  'offer.bumpHelp': 'Optional add-on shown next to the order summary.',
  'offer.bumpEnable': 'Show bump offer',
  'offer.bumpName': 'Bump name',
  'offer.bumpPrice': 'Bump price',
  'offer.bumpDefault': 'Checked by default',
  'ab.title': 'A/B test',
  'ab.help': 'Serve a second content variant to part of visitors. Order form stays shared.',
  'ab.enable': 'Enable A/B test',
  'ab.split': 'Traffic to B (%)',
  'ab.splitHelp': 'Between 10 and 90. A gets the rest.',
  'ab.sections': 'Variant B has {n} sections',
  'ab.copy': 'Copy current page into B',
  'offer.helpIntro': 'This price is used in the order form and the order total.',
  'offer.customerPays': 'Customer pays',
  'offer.delivery': 'delivery',
  'offer.free': 'free delivery',
  'offer.off': '{n}% off',
  'checkout.fields': 'Customer details',
  'checkout.fieldsHelp': 'Choose what to ask. Fewer fields usually mean more orders.',
  'checkout.show': 'Show',
  'checkout.always': 'Always asked',
  'checkout.required': 'Required',
  'checkout.payments': 'Payment options',
  'checkout.paymentsHelp': 'Turn on what you accept. The first one is selected for the customer.',
  'checkout.notReady': 'Not set up yet.',
  'checkout.setup': 'Set up in Payments',
  'checkout.default': 'Selected first',
  'checkout.summary': 'Order summary position',
  'checkout.trust': 'Trust badges',
  'checkout.trustHelp': 'Small badges shown under the form.',
  'checkout.note': 'Delivery note',
  'checkout.noteHelp': 'For example: Inside Dhaka 24 hours, outside Dhaka 2–4 days.',
  'checkout.left': 'Left',
  'checkout.right': 'Right',
  'checkout.bottom': 'Below',
  'field.name': 'Name',
  'field.phone': 'Phone',
  'field.email': 'Email',
  'field.division': 'Division',
  'field.district': 'District',
  'field.upazila': 'Upazila / Thana',
  'field.address': 'Address',
  'field.note': 'Note',
  'prop.eyebrow': 'Small text above the headline',
  'prop.title': 'Headline',
  'prop.sectionTitle': 'Section heading',
  'prop.html': 'HTML code',
  'prop.subtitle': 'Supporting text',
  'prop.button': 'Button text',
  'prop.image': 'Image',
  'prop.text': 'Text',
  'prop.endsAt': 'Offer ends at',
  'prop.bullets': 'Key points',
  'prop.addBullet': 'Add point',
  'prop.itemTitle': 'Title',
  'prop.itemText': 'Description',
  'prop.question': 'Question',
  'prop.answer': 'Answer',
  'prop.name': 'Name',
  'prop.review': 'What they said',
  'prop.rating': 'Rating',
  'prop.addItem': 'Add item',
  'section.hero': 'Top banner',
  'section.benefits': 'Benefits',
  'section.product': 'Product',
  'section.countdown': 'Countdown',
  'section.reviews': 'Reviews',
  'section.faq': 'FAQ',
  'section.guarantee': 'Guarantee',
  'section.html': 'Custom HTML',
  'section.gallery': 'Photo gallery',
  'section.video': 'Video',
  'section.steps': 'How it works',
  'section.compare': 'Comparison',
  'section.whatsapp': 'WhatsApp button',
  'sectionHelp.gallery': 'A row of photos visitors can swipe, or a grid.',
  'sectionHelp.video': 'A YouTube or Vimeo video that loads only when tapped.',
  'sectionHelp.steps': 'Simple numbered steps, like how to order or use.',
  'sectionHelp.compare': 'Your product against others, row by row.',
  'sectionHelp.whatsapp': 'A floating button that opens a WhatsApp chat. One per page.',
  'steps.s1': 'Choose your product',
  'steps.s2': 'Fill in the order form',
  'steps.s3': 'Pay on delivery',
  'compare.us': 'Our product',
  'compare.them': 'Others',
  'items.title.steps': 'Steps',
  'items.add.steps': 'Add step',
  'prop.photos': 'Photos',
  'prop.addPhoto': 'Add photo',
  'prop.videoUrl': 'Video link',
  'help.videoUrl': 'Paste a YouTube or Vimeo link.',
  'prop.caption': 'Caption',
  'prop.usLabel': 'Your column',
  'prop.themLabel': 'Other column',
  'prop.rows': 'Rows',
  'prop.feature': 'Feature',
  'prop.us': 'Yours',
  'prop.them': 'Others',
  'prop.addRow': 'Add row',
  'prop.waNumber': 'WhatsApp number',
  'editor.waSiteNumber': 'Uses the site WhatsApp number',
  'help.waNumber': 'With country code, for example 8801XXXXXXXXX. A number starting with 01 gets 88 added. Leave blank to use the WhatsApp number from Settings; with neither, the button stays hidden.',
  'prop.waLabel': 'Button text',
  'prop.waMessage': 'First message',
  'help.waMessage': 'Optional. Appears pre-filled when the visitor opens the chat.',
  'section.order_form': 'Order form',
  'orders.title': 'Orders',
  'orders.empty': 'No orders match this filter.',
  'orders.search': 'Search name, phone, or TrxID',
  'orders.all': 'All statuses',
  'orders.phone': 'Phone',
  'orders.method': 'Payment',
  'orders.total': 'Total',
  'orders.when': 'When',
  'orders.riskOk': 'OK',
  'orders.riskReview': 'Review',
  'orders.address': 'Address',
  'orders.items': 'Items',
  'orders.note': 'Note',
  'orders.confirmTrx': 'Mark payment received',
  'orders.rejectTrx': 'Reject TrxID',
  'orders.rejectConfirm': 'Reject this TrxID and cancel the order?',
  'orders.rejected': 'TrxID rejected. Order cancelled.',
  'orders.trxVerified': 'Verified',
  'orders.collect': 'Amount to collect',
  'orders.collectHelp': 'After an advance payment, lower this to what COD should still collect.',
  'orders.collectCourier': 'Courier will collect {amount}',
  'orders.settleCod': 'Mark COD received',
  'orders.codSettled': 'COD settled',
  'orders.otpOk': 'OTP verified',
  'orders.saveCollect': 'Save collect amount',
  'orders.collectSaved': 'Collect amount saved.',
  'orders.export': 'Export CSV',
  'orders.bulk': 'Update {n} selected',
  'orders.bulkDone': 'Updated {n} orders.',
  'orders.selectAll': 'Select all',
  'orders.source': 'Ad source',
  'onboarding.title': 'Launch checklist',
  'onboarding.help': 'Three steps so a landing page can take real orders.',
  'onboarding.dismiss': 'Hide',
  'onboarding.payments': '1. Turn on payments',
  'onboarding.paymentsHelp': 'Enable COD or add a bKash / Nagad number.',
  'onboarding.openPayments': 'Open Payments',
  'onboarding.testOrder': '2. Place a test order',
  'onboarding.testOrderHelp': 'Publish a page and submit one COD order yourself.',
  'onboarding.openPages': 'Open Pages',
  'onboarding.pixels': '3. Add ad pixels',
  'onboarding.pixelsHelp': 'Meta, TikTok or GA4 so Purchase events can be tracked.',
  'onboarding.openSettings': 'Open Settings',
  'onboarding.courier': '4. Set up delivery',
  'onboarding.courierHelp': 'Turn on a courier so you can book parcels from orders.',
  'onboarding.openCouriers': 'Open Payments',
  'onboarding.fourSteps': 'Four steps so a landing page can take real orders.',
  'pages.search': 'Search pages',
  'pages.filterAll': 'All',
  'pages.filterLive': 'Live',
  'pages.filterDraft': 'Draft',
  'pages.viewGrid': 'Grid view',
  'pages.viewTable': 'Table view',
  'pages.viewMode': 'View mode',
  'pages.edit': 'Edit',
  'pages.view': 'View live',
  'pages.copyLink': 'Copy link',
  'pages.copied': 'Link copied',
  'pages.noLiveLink': 'Publish the page to get a live link.',
  'pages.duplicate': 'Duplicate',
  'pages.duplicated': 'Page duplicated',
  'pages.deleted': 'Page deleted',
  'pages.createModal': 'New page',
  'pages.templatePick': 'Template',
  'pages.pageTitle': 'Page title',
  'pages.pageTitlePlaceholder': 'Summer offer',
  'pages.more': 'More actions',
  'pages.pageOf': 'Page {page} of {total}',
  'pages.prev': 'Previous',
  'pages.next': 'Next',
  'payments.live': 'Live mode',
  'payments.liveWarning': 'Customers see real payment hosts and couriers. Double-check keys before taking orders.',
  'payments.sandboxMode': 'Sandbox mode',
  'payments.configure': 'Configure',
  'payments.statusReady': 'Ready',
  'payments.statusNeedsKeys': 'Needs keys',
  'payments.statusOff': 'Off',
  'payments.providers': 'Payments & delivery',
  'payments.smsBlock': 'SMS notifications',
  'payments.codHelp': 'Cash on delivery needs no API keys. Turn it on and customers can pay when the parcel arrives.',
  'orders.confirmed': 'Marked paid.',
  'orders.back': 'All orders',
  'orders.trx': 'TrxID',
  'status.pending': 'Needs call',
  'status.awaiting_payment': 'Awaiting payment',
  'status.confirmed': 'Confirmed',
  'status.no_answer': 'No answer',
  'status.fake': 'Fake',
  'status.paid': 'Paid',
  'status.shipped': 'Shipped',
  'status.delivered': 'Delivered',
  'status.returned': 'Returned',
  'status.cancelled': 'Cancelled',
  'pay.cod': 'Cash on delivery',
  'pay.manual_bkash': 'bKash',
  'pay.manual_nagad': 'Nagad',
  'pay.sslcommerz': 'SSLCommerz',
  'analytics.title': 'Analytics',
  'analytics.days7': '7 days',
  'analytics.days14': '14 days',
  'analytics.days30': '30 days',
  'analytics.confirmed': 'Confirmed',
  'analytics.delivered': 'Delivered',
  'analytics.series': 'Daily revenue',
  'analytics.visits': 'Visits',
  'analytics.checkouts': 'Checkout started',
  'analytics.orders': 'Orders',
  'analytics.revenue': 'Revenue',
  'analytics.conversion': 'Conversion',
  'analytics.cod': 'Cash on delivery',
  'analytics.prepaid': 'Prepaid',
  'analytics.funnel': 'From visit to order',
  'analytics.ab': 'A/B split',
  'analytics.variant': 'Variant',
  'analytics.codReconcile': 'COD reconcile',
  'analytics.codExpected': 'Expected',
  'analytics.codReceived': 'Received',
  'analytics.codUnsettled': 'Unsettled',
  'analytics.codOpen': 'Open COD',
  'analytics.top': 'Top pages',
  'payments.title': 'Payments',
  'payments.intro': 'Customers pay you directly. Noksha does not hold the money.',
  'payments.sandbox': 'Sandbox',
  'payments.sandboxHelp': 'SSLCommerz uses the sandbox host while this is on.',
  'payments.enabled': 'Enabled',
  'payments.number': 'Wallet number',
  'payments.instructions': 'Instructions',
  'payments.storeId': 'Store ID',
  'payments.password': 'Store password',
  'payments.passwordHelp': 'Leave blank to keep the saved password. It is never shown again.',
  'payments.missing': 'Add the store ID and store password before customers can pay with SSLCommerz.',
  'payments.saved': 'Payment settings saved.',
  'brand.title': 'Brand',
  'brand.intro': 'These tokens color the dashboard and every landing page.',
  'brand.preset': 'Preset',
  'brand.ink': 'Ink',
  'brand.eid': 'Eid',
  'brand.minimal': 'Minimal',
  'brand.colors': 'Colors',
  'brand.font': 'Font',
  'brand.radius': 'Corners',
  'brand.save': 'Save brand',
  'brand.saved': 'Brand saved.',
  'brand.reset': 'Reset',
  'brand.canvas': 'Canvas',
  'brand.card': 'Card',
  'brand.text': 'Text',
  'brand.muted': 'Muted text',
  'brand.border': 'Border',
  'brand.brand': 'Brand',
  'brand.brandForeground': 'Button text',
  'brand.accent': 'Accent',
  'brand.success': 'Success',
  'brand.warning': 'Warning',
  'brand.danger': 'Danger',
  'brand.contrastWarning': 'Brand button text may be hard to read on this brand color. Aim for higher contrast.',
  'brand.preview': 'Live preview',
  'welcome.title': 'Set up your store',
  'welcome.skip': 'Skip for now',
  'welcome.next': 'Continue',
  'welcome.back': 'Back',
  'welcome.finish': 'Create page & finish',
  'welcome.skipStep': 'Skip step',
  'welcome.stepStore': 'Store basics',
  'welcome.stepPayments': 'Payments',
  'welcome.stepCourier': 'Courier',
  'welcome.stepPage': 'First page',
  'welcome.storeHelp': 'Choose admin language and how your store appears in SMS.',
  'welcome.codHelp': 'Cash on delivery is the fastest way to start taking orders.',
  'welcome.courierHelp': 'You can connect Pathao, Steadfast, or RedX later in Payments.',
  'welcome.pageHelp': 'Pick a template. You can edit every word after this.',
  'settings.title': 'Settings',
  'settings.region': 'Region',
  'settings.regionBd': 'Bangladesh',
  'settings.regionGlobal': 'International, later',
  'settings.regionHelp': 'Addresses, phone rules, and taka stay on the Bangladesh pack.',
  'settings.language': 'Default admin language',
  'settings.pixels': 'Pixels',
  'settings.meta': 'Meta Pixel ID',
  'settings.ga4': 'Google Analytics 4 ID',
  'settings.tiktok': 'TikTok Pixel ID',
  'settings.pixelsHelp': 'ViewContent, InitiateCheckout and Purchase fire automatically on offer pages.',
  'settings.metaTest': 'Meta test event code',
  'settings.metaTestHelp': 'Optional. Copy it from the Test Events tab in Events Manager. While set, Purchase events are sent as tests and the result is written to the order note. Clear it before going live.',
  'settings.metaCapi': 'Meta Conversions API token',
  'settings.metaCapiHelp': 'Optional. Sends server-side Purchase events with the same event ID as the browser pixel.',
  'settings.metaCapiPlaceholder': 'Paste access token',
  'settings.metaCapiSet': 'Token saved — paste a new one to replace',
  'settings.saved': 'Settings saved.',
  'settings.tabGeneral': 'General',
  'settings.tabTracking': 'Tracking',
  'settings.tabSms': 'SMS & OTP',
  'settings.tabFraud': 'Fraud',
  'settings.tabAdvanced': 'Advanced',
  'settings.storeName': 'Store name',
  'settings.storeHelp': 'Shown in SMS sender ID and the sidebar.',
  'settings.bnDigits': 'Bangla digits in admin',
  'settings.bnDigitsHelp': 'Saved in this browser only.',
  'settings.fraudHelp': 'Fraud scoring runs on orders automatically. Block repeat offenders from Leads → Blacklist.',
  'settings.advancedHelp': 'Payments, couriers, and wallet APIs live under Payments. Brand colors are in Brand.',
  'settings.discard': 'Discard',
  'settings.unsaved': 'Unsaved changes',
  'settings.otpTtl': 'OTP expiry (seconds)',
  'nav.leads': 'Leads',
  'leads.title': 'Leads & fraud',
  'leads.help': 'Incomplete checkouts and blocked phone numbers.',
  'leads.incomplete': 'Incomplete checkouts',
  'leads.empty': 'No incomplete checkouts yet.',
  'leads.blacklist': 'Phone blacklist',
  'leads.blacklistHelp': 'Blacklisted numbers cannot place new orders.',
  'leads.blacklistEmpty': 'No numbers blocked.',
  'leads.note': 'Note',
  'leads.add': 'Block phone',
  'leads.remove': 'Remove',
  'editor.undo': 'Undo',
  'editor.fullscreen': 'Fullscreen',
  'editor.exitFull': 'Exit',
  'seo.title': 'SEO title',
  'seo.titleHelp': 'Shown in Google and Facebook shares. Leave blank to use the page title.',
  'seo.description': 'SEO description',
  'seo.descriptionHelp': 'One or two short sentences for search and ads.',
  'seo.image': 'Share image',
  'orders.print': 'Print slip',
  'orders.blacklist': 'Blacklist phone',
  'orders.blacklistConfirm': 'Block this phone from ordering again?',
  'orders.blacklisted': 'Phone added to the blacklist.',
  'orders.bookCourier': 'Book courier',
  'orders.shipped': 'Courier booked. Order marked shipped.',
  'orders.tracking': 'Tracking',
  'orders.fraud': 'Fraud score',
  'payments.sms': 'SMS',
  'payments.smsHelp': 'Send Bangla SMS when an order is placed or shipped (BulkSMSBD API key).',
  'payments.smsEnabled': 'Send SMS',
  'payments.smsSender': 'Sender ID',
  'payments.smsKey': 'SMS API key',
  'payments.otpMode': 'Checkout OTP',
  'payments.otpOff': 'Off',
  'payments.otpRisk': 'Only higher-risk phones',
  'payments.otpAlways': 'Always (when SMS ready)',
  'payments.otpHelp': 'Risk mode asks for OTP when the same phone ordered twice in 7 days.',
  'payments.autoVerify': 'Auto-verify TrxID via API',
  'payments.autoVerifyHelp': 'Uses merchant search APIs when credentials are set. Manual confirm still works.',
  'payments.autoVerifyNote': 'Auto-verify works only for bKash Merchant/PGW payments. Personal “Send Money” TrxIDs must be confirmed manually.',
  'payments.bkashAppKey': 'bKash app key',
  'payments.bkashAppSecret': 'bKash app secret',
  'payments.bkashUser': 'bKash username',
  'payments.bkashPass': 'bKash password',
  'payments.nagadMerchant': 'Nagad merchant ID',
  'payments.nagadVerifyUrl': 'Nagad verify URL',
  'payments.walletReady': 'Wallet API ready',
  'payments.webhooks': 'Courier webhooks',
  'payments.webhooksHelp': 'Paste these URLs in Steadfast / Pathao / RedX. Secret is required — send header X-Noksha-Webhook-Secret.',
  'payments.webhookSecret': 'Webhook secret',
  'payments.generateSecret': 'Generate secret',
  'payments.webhookHeader': 'Header: X-Noksha-Webhook-Secret',
  'orders.verifyTrx': 'Verify via API',
  'orders.verifyOk': 'TrxID verified by API',
  'orders.verifyPending': 'API did not confirm this TrxID yet',
  'orders.tab.all': 'All',
  'orders.tab.needsCall': 'Needs call',
  'orders.tab.cancelledFake': 'Cancelled / Fake',
  'orders.orderNumber': 'Order #',
  'orders.customer': 'Customer',
  'orders.courier': 'Courier',
  'orders.risk': 'Risk',
  'orders.payment': 'Payment',
  'orders.confirmOrder': 'Confirm order',
  'orders.noAnswer': 'No answer',
  'orders.markFake': 'Mark fake',
  'orders.cancelOrder': 'Cancel order',
  'orders.cancelConfirm': 'Cancel this order?',
  'orders.notes': 'Notes',
  'orders.notesEmpty': 'No staff notes yet.',
  'orders.addNote': 'Add note',
  'orders.noteSaved': 'Note added.',
  'orders.customerSaved': 'Customer details saved.',
  'orders.addressSaved': 'Address saved.',
  'orders.openFull': 'Open full page',
  'orders.perPage': 'Per page',
  'orders.pageOf': 'Page {page} of {total} · {count} orders',
  'orders.selected': '{n} selected',
  'orders.bulkConfirm': 'Confirm',
  'orders.bulkBar': 'Bulk actions',
  'orders.bulkStatus': 'Change status',
  'orders.filterRisk': 'Risk',
  'orders.filterRiskAll': 'All risk',
  'orders.filterPaymentAll': 'All payments',
  'orders.attribution': 'Attribution',
  'orders.subtotal': 'Subtotal',
  'orders.shipping': 'Shipping',
  'orders.email': 'Email',
  'orders.viewOrder': 'Order detail',
  'orders.call': 'Call',
  'orders.statusUpdated': 'Status updated.',
  'orders.exportDone': 'Export started.',
  'orders.prev': 'Previous',
  'orders.next': 'Next',
  'common.close': 'Close',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'analytics.byDistrict': 'Confirm / return by district',
  'analytics.byPage': 'Confirm / return by page',
  'analytics.area': 'Area',
  'analytics.placed': 'Placed',
  'analytics.confirmRate': 'Confirm rate',
  'analytics.returnRate': 'Return rate',
  'payments.couriers': 'Couriers',
  'payments.couriersHelp': 'Book Pathao, Steadfast or RedX from the order screen when keys are ready.',
  'payments.apiKey': 'API key',
  'payments.secretKey': 'Secret key',
  'payments.secretSet': 'Saved — paste a new value to replace',
  'payments.courierReady': 'Ready to book',
  'payments.courierNeedKeys': 'Turn on and add keys to book parcels.',
  'courier.steadfast': 'Steadfast',
  'courier.pathao': 'Pathao',
  'courier.redx': 'RedX',
  'pages.beauty': 'Skincare',
  'pages.beautyBody': 'Serum, cream or other skincare page with steps and a comparison',
  'pages.fashion': 'Fashion',
  'pages.fashionBody': 'Clothing page with a photo grid, size questions and exchange promise',
  'pages.food': 'Food & grocery',
  'pages.foodBody': 'Honey, ghee, dates: numbered reasons, a video slot and a comparison',
  'pages.health': 'Wellness',
  'pages.healthBody': 'Herbal or daily wellness product, calm layout with how-to-use steps',
  'pages.home': 'Home & kitchen',
  'pages.homeBody': 'Household product with a video, countdown, photo slider and WhatsApp button',
  'pages.gadget': 'Gadget',
  'pages.gadgetBody': 'Earbuds / accessory offer page',
  'settings.english': 'English',
  'settings.bangla': 'বাংলা',
  'common.loading': 'Loading…',
  'common.error': 'Could not load this screen.',
  'common.retry': 'Try again',
  'common.save': 'Save',
  'common.saved': 'Saved',
  'trust.secure': 'Secure checkout',
  'trust.cod': 'Cash on delivery',
  'trust.delivery': 'Nationwide delivery'
};
const bn = {
  'nav.home': 'হোম',
  'nav.pages': 'পেইজ',
  'nav.orders': 'অর্ডার',
  'nav.analytics': 'অ্যানালিটিক্স',
  'nav.payments': 'পেমেন্ট ও কুরিয়ার',
  'nav.brand': 'ব্র্যান্ড',
  'nav.settings': 'সেটিংস',
  'nav.groupSell': 'বিক্রি',
  'nav.groupGrow': 'গ্রোথ',
  'nav.groupSetup': 'সেটআপ',
  'nav.uikit': 'UI কিট',
  'top.search': 'পেইজ খুঁজুন',
  'top.searchWide': 'পেইজ, অর্ডার, ফোন খুঁজুন…',
  'top.searchEmpty': 'মিলছে না',
  'top.sandbox': 'স্যান্ডবক্স',
  'top.live': 'লাইভ',
  'top.menu': 'মেনু',
  'shell.nav': 'মেইন নেভিগেশন',
  'shell.collapse': 'সাইডবার ভাঁজ',
  'shell.expand': 'সাইডবার খুলুন',
  'shell.help': 'সাহায্য',
  'shell.helpBody': 'খোঁজার জন্য Ctrl+K। COD অর্ডার শুরু হয় “কল করতে হবে” স্ট্যাটাসে।',
  'shell.offline': 'আপনি অফলাইন। পরিবর্তন সেভ নাও হতে পারে।',
  'shell.errorTitle': 'অ্যাপে সমস্যা হয়েছে',
  'shell.theme.system': 'থিম: সিস্টেম',
  'shell.theme.light': 'থিম: লাইট',
  'shell.theme.dark': 'থিম: ডার্ক',
  'uikit.title': 'UI কিট',
  'uikit.help': 'শুধু ডিবাগ মোডে ডিজাইন সিস্টেমের গ্যালারি।',
  'uikit.empty': 'এখনও কিছু নেই',
  'uikit.emptyBody': 'খালি স্টেটে পরের কাজটা দেখানো উচিত।',
  'uikit.toast': 'টোস্ট প্রস্তুত',
  'common.cancel': 'বাতিল',
  'common.confirm': 'নিশ্চিত',
  'home.todayOrders': 'আজকের অর্ডার',
  'home.orders': 'অর্ডার',
  'home.revenue': 'রেভিনিউ',
  'home.conversion': 'কনভার্সন',
  'home.notEnoughData': 'পর্যাপ্ত ডেটা নেই',
  'home.codShare': 'ক্যাশ অন ডেলিভারি',
  'orders.searchAction': 'খুঁজুন',
  'orders.allTime': 'সব সময়',
  'orders.customRange': 'কাস্টম',
  'settings.storeName': 'স্টোরের নাম',
  'settings.storeNameHelp': 'প্যাকিং স্লিপ ও SMS সাইন-অফে দেখাবে। খালি থাকলে সাইটের নাম।',
  'home.chart': 'রেভিনিউ, শেষ {days} দিন',
  'home.chartToday': 'আজকের রেভিনিউ',
  'home.recent': 'সাম্প্রতিক অর্ডার',
  'home.topPages': 'যে পেইজ বিক্রি করছে',
  'home.emptyOrders': 'এখনও অর্ডার নেই। পেইজ প্রকাশ করে লিংক দিন।',
  'home.emptyPages': 'এই সময়ে কোনো পেইজে বিক্রি নেই।',
  'home.open': 'খুলুন',
  'home.greetingMorning': 'সুপ্রভাত',
  'home.greetingAfternoon': 'শুভ অপরাহ্ন',
  'home.greetingEvening': 'শুভ সন্ধ্যা',
  'home.rangeToday': 'আজ',
  'home.range7d': '৭ দিন',
  'home.range30d': '৩০ দিন',
  'home.needsCall': 'কল দরকার',
  'home.returnRate': 'রিটার্ন রেট',
  'home.codCollect': 'COD আদায় বাকি',
  'home.actionNeeded': 'এখন যা করতে হবে',
  'home.actionOrdersHelp': 'কলের জন্য অপেক্ষা',
  'home.actionLeadsHelp': 'আজকের লিড',
  'home.actionCodHelp': 'আদায় না হওয়া COD',
  'home.checklistProgress': '{total}-এর {done} সম্পন্ন',
  'home.stepDone': 'হয়ে গেছে',
  'home.chartLegend': 'বার: অর্ডার · লাইন: রেভিনিউ',
  'home.emptyChart': 'এই সময়ে চার্ট ডেটা নেই।',
  'pages.title': 'পেইজ',
  'pages.new': 'নতুন পেইজ',
  'pages.emptyTitle': 'প্রথম ল্যান্ডিং পেইজ বানান',
  'pages.emptyBody': 'একটি টেমপ্লেট থেকে শুরু করুন। প্রতিটি লাইন বদলানো যাবে।',
  'pages.single': 'এক পণ্য',
  'pages.singleBody': 'একটি অফার, রিভিউ, আর অর্ডার ফর্ম।',
  'pages.lead': 'লিড',
  'pages.leadBody': 'নাম ও ফোন, পরে কল করার জন্য।',
  'pages.festival': 'উৎসব অফার',
  'pages.festivalBody': 'কাউন্টডাউন আর ছাড়ের দাম।',
  'pages.blank': 'খালি পেইজ',
  'pages.name': 'নাম',
  'pages.status': 'স্ট্যাটাস',
  'pages.visits': 'ভিজিট',
  'pages.orders': 'অর্ডার',
  'pages.conversion': 'কনভার্সন',
  'pages.draft': 'খসড়া',
  'pages.published': 'প্রকাশিত',
  'pages.delete': 'মুছুন',
  'pages.deleteConfirm': 'পেইজটি মুছবেন? আগের অর্ডার তালিকায় থাকবে।',
  'pages.language': 'টেমপ্লেটের ভাষা',
  'editor.back': 'সব পেইজ',
  'editor.save': 'সেভ',
  'editor.saving': 'সেভ হচ্ছে',
  'editor.saved': 'সেভ হয়েছে',
  'editor.publish': 'প্রকাশ',
  'editor.view': 'দেখুন',
  'editor.mobile': 'ফোন',
  'editor.tablet': 'ট্যাবলেট',
  'editor.desktop': 'ডেস্কটপ',
  'editor.redo': 'রিডু',
  'editor.unpublish': 'অপ্রকাশিত',
  'editor.publishMenu': 'আরো প্রকাশ অপশন',
  'editor.pageSettings': 'পেইজ সেটিংস',
  'editor.settingsHelp': 'অফার, চেকআউট, SEO ও অন্যান্য পেইজ-ভিত্তিক অপশন।',
  'editor.seoTab': 'SEO',
  'editor.sections': 'সেকশন',
  'editor.add': 'সেকশন যোগ',
  'editor.hide': 'লুকান',
  'editor.show': 'দেখান',
  'editor.up': 'উপরে',
  'editor.down': 'নিচে',
  'editor.remove': 'সরান',
  'editor.removeConfirm': 'এই সেকশনটি মুছবেন?',
  'editor.section': 'সেকশন',
  'editor.offer': 'অফার',
  'editor.checkout': 'চেকআউট',
  'editor.page': 'পেইজ',
  'editor.title': 'পেইজের নাম',
  'editor.slug': 'পেইজের লিংক',
  'editor.language': 'ফর্মের ভাষা',
  'editor.languageHelp': 'এতে ফর্মের লেবেল বদলায়। আপনার লেখা কপি একই থাকে।',
  'editor.motion': 'পেইজের ধরন',
  'editor.motion.simple': 'সিম্পল',
  'editor.motion.lively': 'প্রাণবন্ত',
  'editor.motionHelp': 'প্রাণবন্ত হলে নরম এন্ট্রান্স ইফেক্ট, হোভারে উঠে আসা কার্ড ও স্পন্দিত অর্ডার বাটন যোগ হয়। যারা কম মোশন পছন্দ করেন তাদের জন্য নিজে থেকে বন্ধ থাকে। স্ক্রল ইফেক্ট লাইভ পেইজে দেখা যায়, এই প্রিভিউতে নয়।',
  'editor.status': 'কে দেখতে পাবে',
  'editor.customColors': 'এই পেইজের নিজস্ব রং',
  'editor.previewFailed': 'প্রিভিউ বানানো যায়নি।',
  'editor.chooseImage': 'ছবি বেছে নিন',
  'editor.slugHelp': 'ইংরেজি অক্ষর, সংখ্যা আর ড্যাশ (-) ব্যবহার করুন।',
  'editor.statusHelp': 'খসড়া পেইজ শুধু আপনি দেখতে পান। সেভ করলে বদলটা কার্যকর হবে।',
  'editor.saveDraft': 'খসড়া সেভ',
  'editor.update': 'পেইজ আপডেট',
  'editor.unsaved': 'সেভ করা হয়নি',
  'editor.allSaved': 'সব সেভ আছে',
  'editor.live': 'লাইভ',
  'editor.draft': 'খসড়া',
  'editor.viewLive': 'লাইভ দেখুন',
  'editor.device': 'প্রিভিউয়ের মাপ',
  'editor.shortcut': 'Ctrl + S',
  'editor.leaveConfirm': 'সেভ না করা পরিবর্তন আছে। সেভ না করেই বের হবেন?',
  'editor.content': 'পেইজের কনটেন্ট',
  'editor.contentHelp': 'এডিট করতে ব্লকে বা প্রিভিউতে সরাসরি ক্লিক করুন। ক্রম বদলাতে টেনে সরান।',
  'editor.emptyContent': 'এই পেইজে এখনো কোনো সেকশন নেই। একটা যোগ করে শুরু করুন।',
  'editor.addTitle': 'সেকশন যোগ করুন',
  'editor.addHelp': 'নতুন সেকশন অর্ডার ফর্মের উপরে বসবে। পরে সরাতে পারবেন।',
  'editor.addAfter': 'নতুন সেকশন ঠিক এর পরে বসবে:',
  'look.title': 'চেহারা',
  'look.layout': 'সাজানো',
  'look.background': 'ব্যাকগ্রাউন্ড',
  'look.spacing': 'ফাঁক',
  'look.layout.split': 'পাশাপাশি',
  'look.layout.center': 'মাঝখানে',
  'look.layout.overlay': 'ছবির উপরে',
  'look.layout.cards': 'কার্ড',
  'look.layout.list': 'তালিকা',
  'look.layout.numbers': 'ক্রমিক সংখ্যা',
  'look.layout.slider': 'স্লাইডার',
  'look.layout.grid': 'গ্রিড',
  'look.layout.side': 'ছবি বামে',
  'look.layout.reverse': 'ছবি ডানে',
  'look.layout.stacked': 'উপর-নিচে',
  'look.bg.none': 'নেই',
  'look.bg.soft': 'হালকা রং',
  'look.bg.warm': 'উষ্ণ',
  'look.bg.dark': 'গাঢ়',
  'look.bg.brand': 'ব্র্যান্ডের রং',
  'look.bg.gradient': 'গ্রেডিয়েন্ট',
  'look.space.compact': 'কম',
  'look.space.normal': 'স্বাভাবিক',
  'look.space.roomy': 'বেশি',
  'look.textSize': 'লেখার সাইজ',
  'look.textSizeHint': 'হেডিং ≈ {range} (ফোন → ডেস্কটপ)',
  'look.size.sm': 'ছোট',
  'look.size.md': 'স্বাভাবিক',
  'look.size.lg': 'বড়',
  'look.size.xl': 'অনেক বড়',
  'look.image': 'ছবি',
  'look.ratio': 'আকার',
  'look.ratio.auto': 'আসল',
  'look.ratio.square': 'চৌকো',
  'look.ratio.4-3': '৪:৩',
  'look.ratio.16-9': '১৬:৯',
  'look.ratio.3-4': 'লম্বা ৩:৪',
  'look.fit': 'ফিট',
  'look.fit.cover': 'ভরাট (কাটা)',
  'look.fit.contain': 'পুরোটা দেখাও',
  'look.round': 'কোণ',
  'look.round.none': 'সোজা',
  'look.round.md': 'নরম',
  'look.round.lg': 'গোল',
  'look.round.full': 'বৃত্ত',
  'editor.settingsEntryHint': 'দাম, চেকআউট, SEO, রঙ, লিংক',
  'editor.group.attention': 'দৃষ্টি আকর্ষণ',
  'editor.group.trust': 'বিশ্বাস গড়ুন',
  'editor.group.product': 'পণ্য ও অর্ডার',
  'editor.group.advanced': 'অ্যাডভান্সড',
  'editor.alreadyAdded': 'পেইজে আগে থেকেই আছে',
  'editor.settings': 'পেইজের সেটিংস',
  'editor.offerTitle': 'পণ্য ও দাম',
  'editor.checkoutTitle': 'অর্ডার ফর্ম ও পেমেন্ট',
  'editor.pageTitle': 'লিংক ও ভাষা',
  'editor.colorsTitle': 'রং',
  'editor.colorsHelp': 'বন্ধ থাকলে পেইজে ব্র্যান্ডের রং ব্যবহার হবে।',
  'editor.brandColors': 'ব্র্যান্ডের রং',
  'editor.customColorsOn': 'নিজস্ব রং',
  'editor.resetColors': 'ব্র্যান্ডের রঙে ফেরান',
  'editor.paymentsCount': '{n}টি পেমেন্ট অপশন',
  'editor.backToContent': 'পেইজের কনটেন্ট',
  'editor.untitled': 'শিরোনাম নেই',
  'editor.hiddenTag': 'লুকানো',
  'editor.hiddenNote': 'এই সেকশনটি লুকানো। ক্রেতারা এটা দেখবেন না।',
  'editor.hideSection': 'পেইজে লুকান',
  'editor.showSection': 'পেইজে দেখান',
  'editor.deleteSection': 'সেকশন মুছুন',
  'editor.missingSection': 'এই সেকশনটি আর নেই।',
  'editor.preview': 'প্রিভিউ',
  'editor.previewHint': 'ব্লক সিলেক্ট করতে ক্লিক। টেক্সট ইনলাইন এডিট করতে ক্লিক।',
  'editor.previewUpdating': 'আপডেট হচ্ছে…',
  'editor.dragHint': 'টেনে ক্রম বদলান',
  'editor.orderNow': 'এখনই অর্ডার',
  'editor.danger': 'এই পেইজ মুছুন',
  'editor.dangerHelp': 'পেইজ আর লিংক মুছে যাবে। আগের অর্ডার থেকে যাবে।',
  'sectionHelp.hero': 'পেইজের একদম উপরে বড় শিরোনাম আর বাটন।',
  'sectionHelp.benefits': 'কেন কিনবেন, ছোট ছোট কার্ডে।',
  'sectionHelp.product': 'পণ্যের ছবি, বর্ণনা আর দাম।',
  'sectionHelp.countdown': 'অফার শেষ হওয়া পর্যন্ত চলা টাইমার।',
  'sectionHelp.reviews': 'ক্রেতারা পণ্য নিয়ে কী বলেছেন।',
  'sectionHelp.faq': 'ক্রেতারা সাধারণত যা জানতে চান, উত্তরসহ।',
  'sectionHelp.guarantee': 'ফেরত বা বদলের ব্যাপারে আপনার প্রতিশ্রুতি।',
  'sectionHelp.html': 'নিজের HTML কোড বসান — ভিডিও, ম্যাপ বা নিজের ডিজাইন।',
  'help.htmlFull': 'HTML লিখুন বা পেস্ট করুন। স্ক্রিপ্ট সবসময় বাদ যায়। বিশ্বস্ত iframe (YouTube, Vimeo, Google Map) থাকে।',
  'help.htmlSafe': 'HTML লিখুন বা পেস্ট করুন। স্ক্রিপ্ট বাদ যায়। YouTube, Vimeo আর Google Map এম্বেড থাকে; অন্য iframe সরানো হয়।',
  'sectionHelp.order_form': 'যেখানে ক্রেতা অর্ডার দেন। পেইজে একটাই থাকে।',
  'help.eyebrow': 'না দিলেও চলবে। যেমন: ঢাকায় ফ্রি ডেলিভারি।',
  'help.button': 'বাটনে চাপলে ক্রেতা অর্ডার ফর্মে চলে যাবেন।',
  'help.productPrice': 'দাম আর ডেলিভারি চার্জ “পণ্য ও দাম”-এ ঠিক করুন',
  'help.endsAt': 'এই সময় হলে টাইমার শূন্যে থেমে যাবে।',
  'help.orderForm': 'ফর্মের ঘর আর পেমেন্ট অপশন ঠিক করুন',
  'items.title.benefits': 'সুবিধাগুলো',
  'items.title.reviews': 'রিভিউগুলো',
  'items.title.faq': 'প্রশ্নগুলো',
  'items.add.benefits': 'সুবিধা যোগ করুন',
  'items.add.reviews': 'রিভিউ যোগ করুন',
  'items.add.faq': 'প্রশ্ন যোগ করুন',
  'items.limit': 'সর্বোচ্চ {n}টি।',
  'image.change': 'বদলান',
  'image.remove': 'সরান',
  'image.paste': 'অথবা ছবির লিংক দিন',
  'colors.main': 'প্রধান রং',
  'colors.surface': 'ব্যাকগ্রাউন্ড ও লেখা',
  'colors.status': 'বার্তার রং',
  'offer.compareHelp': 'কেটে দেখানো হবে। না দেখাতে ০ রাখুন।',
  'offer.shippingHelp': 'ফ্রি ডেলিভারির জন্য ০ দিন।',
  'offer.helpIntro': 'এই দামেই অর্ডার ফর্ম আর মোট টাকার হিসাব হয়।',
  'offer.customerPays': 'ক্রেতা দেবেন',
  'offer.delivery': 'ডেলিভারি',
  'offer.free': 'ফ্রি ডেলিভারি',
  'offer.off': '{n}% ছাড়',
  'checkout.fieldsHelp': 'কী কী জানতে চাইবেন বেছে নিন। ঘর কম হলে সাধারণত অর্ডার বেশি হয়।',
  'checkout.show': 'দেখান',
  'checkout.always': 'সবসময় থাকবে',
  'checkout.paymentsHelp': 'যেগুলো নেন চালু করুন। প্রথমটি ক্রেতার জন্য আগে থেকে বাছাই থাকবে।',
  'checkout.notReady': 'এখনো সেটআপ হয়নি।',
  'checkout.setup': 'পেমেন্টে সেটআপ করুন',
  'checkout.default': 'আগে বাছাই',
  'checkout.trustHelp': 'ফর্মের নিচে ছোট ব্যাজ।',
  'checkout.noteHelp': 'যেমন: ঢাকায় ২৪ ঘণ্টা, ঢাকার বাইরে ২–৪ দিন।',
  'offer.productName': 'পণ্যের নাম',
  'offer.price': 'বিক্রয় মূল্য',
  'offer.compareAt': 'আগের দাম',
  'offer.shipping': 'ডেলিভারি চার্জ',
  'offer.shippingInside': 'ঢাকার ভিতরে',
  'offer.shippingOutside': 'ঢাকার বাইরে',
  'offer.shippingInsideHelp': 'জেলা হিসেবে ঢাকা বেছে নিলে এই চার্জ লাগবে।',
  'offer.shippingOutsideHelp': 'অন্য সব জেলায় এই চার্জ লাগবে।',
  'offer.shippingZones': 'ঢাকা {inside} · বাইরে {outside}',
  'offer.image': 'পণ্যের ছবি',
  'offer.bumpTitle': 'অর্ডার বাম্প',
  'offer.bumpHelp': 'অর্ডার সামারির পাশে ঐচ্ছিক অ্যাড-অন দেখাবে।',
  'offer.bumpEnable': 'বাম্প অফার দেখান',
  'offer.bumpName': 'বাম্পের নাম',
  'offer.bumpPrice': 'বাম্পের দাম',
  'offer.bumpDefault': 'ডিফল্টে টিক থাকবে',
  'ab.title': 'A/B টেস্ট',
  'ab.help': 'কিছু ভিজিটরকে দ্বিতীয় কন্টেন্ট ভ্যারিয়েন্ট দেখাবে। অর্ডার ফর্ম একই থাকবে।',
  'ab.enable': 'A/B টেস্ট চালু',
  'ab.split': 'B-তে ট্রাফিক (%)',
  'ab.splitHelp': '১০ থেকে ৯০। বাকিটা A পাবে।',
  'ab.sections': 'ভ্যারিয়েন্ট B-তে {n} সেকশন',
  'ab.copy': 'বর্তমান পেইজ B-তে কপি',
  'checkout.fields': 'ক্রেতার তথ্য',
  'checkout.required': 'আবশ্যক',
  'checkout.payments': 'পেমেন্ট অপশন',
  'checkout.summary': 'অর্ডার সামারি কোথায় থাকবে',
  'checkout.trust': 'ট্রাস্ট ব্যাজ',
  'checkout.note': 'ডেলিভারি নোট',
  'checkout.left': 'বামে',
  'checkout.right': 'ডানে',
  'checkout.bottom': 'নিচে',
  'field.name': 'নাম',
  'field.phone': 'ফোন',
  'field.email': 'ইমেইল',
  'field.division': 'বিভাগ',
  'field.district': 'জেলা',
  'field.upazila': 'উপজেলা / থানা',
  'field.address': 'ঠিকানা',
  'field.note': 'নোট',
  'prop.eyebrow': 'শিরোনামের উপরের ছোট লেখা',
  'prop.title': 'শিরোনাম',
  'prop.sectionTitle': 'সেকশনের শিরোনাম',
  'prop.html': 'HTML কোড',
  'prop.subtitle': 'সাথের লেখা',
  'prop.button': 'বাটনের লেখা',
  'prop.image': 'ছবি',
  'prop.text': 'লেখা',
  'prop.endsAt': 'অফার শেষ হবে',
  'prop.bullets': 'মূল পয়েন্ট',
  'prop.addBullet': 'পয়েন্ট যোগ করুন',
  'prop.itemTitle': 'শিরোনাম',
  'prop.itemText': 'বর্ণনা',
  'prop.question': 'প্রশ্ন',
  'prop.answer': 'উত্তর',
  'prop.name': 'নাম',
  'prop.review': 'কী বলেছেন',
  'prop.rating': 'রেটিং',
  'prop.addItem': 'আইটেম যোগ',
  'section.hero': 'উপরের ব্যানার',
  'section.benefits': 'সুবিধা',
  'section.product': 'পণ্য',
  'section.countdown': 'কাউন্টডাউন',
  'section.reviews': 'রিভিউ',
  'section.faq': 'প্রশ্নোত্তর',
  'section.guarantee': 'গ্যারান্টি',
  'section.html': 'কাস্টম HTML',
  'section.gallery': 'ফটো গ্যালারি',
  'section.video': 'ভিডিও',
  'section.steps': 'কীভাবে কাজ করে',
  'section.compare': 'তুলনা',
  'section.whatsapp': 'WhatsApp বাটন',
  'sectionHelp.gallery': 'স্লাইড করা যায় এমন ছবির সারি, অথবা গ্রিড।',
  'sectionHelp.video': 'YouTube বা Vimeo ভিডিও, ট্যাপ করলে তবেই লোড হয়।',
  'sectionHelp.steps': 'সহজ ক্রমিক ধাপ, যেমন কীভাবে অর্ডার বা ব্যবহার করবেন।',
  'sectionHelp.compare': 'আপনার পণ্য বনাম অন্যদের, লাইন ধরে।',
  'sectionHelp.whatsapp': 'ভেসে থাকা বাটন, চাপলে WhatsApp চ্যাট খোলে। পেইজে একটি।',
  'steps.s1': 'পণ্য বেছে নিন',
  'steps.s2': 'অর্ডার ফর্ম পূরণ করুন',
  'steps.s3': 'হাতে পেয়ে টাকা দিন',
  'compare.us': 'আমাদের পণ্য',
  'compare.them': 'অন্যরা',
  'items.title.steps': 'ধাপগুলো',
  'items.add.steps': 'ধাপ যোগ করুন',
  'prop.photos': 'ছবি',
  'prop.addPhoto': 'ছবি যোগ করুন',
  'prop.videoUrl': 'ভিডিও লিংক',
  'help.videoUrl': 'YouTube বা Vimeo লিংক পেস্ট করুন।',
  'prop.caption': 'ক্যাপশন',
  'prop.usLabel': 'আপনার কলাম',
  'prop.themLabel': 'অন্য কলাম',
  'prop.rows': 'সারি',
  'prop.feature': 'বৈশিষ্ট্য',
  'prop.us': 'আপনার',
  'prop.them': 'অন্যদের',
  'prop.addRow': 'সারি যোগ করুন',
  'prop.waNumber': 'WhatsApp নম্বর',
  'editor.waSiteNumber': 'সাইটের WhatsApp নম্বর ব্যবহার হবে',
  'help.waNumber': 'দেশের কোডসহ, যেমন 8801XXXXXXXXX। 01 দিয়ে শুরু হলে আগে 88 বসে যাবে। ফাঁকা রাখলে সেটিংসের WhatsApp নম্বর ব্যবহার হবে; দুটোই না থাকলে বাটন দেখাবে না।',
  'prop.waLabel': 'বাটনের লেখা',
  'prop.waMessage': 'প্রথম মেসেজ',
  'help.waMessage': 'ঐচ্ছিক। চ্যাট খুললে আগে থেকে লেখা থাকবে।',
  'section.order_form': 'অর্ডার ফর্ম',
  'orders.title': 'অর্ডার',
  'orders.empty': 'এই ফিল্টারে অর্ডার নেই।',
  'orders.search': 'নাম, ফোন, বা TrxID খুঁজুন',
  'orders.all': 'সব স্ট্যাটাস',
  'orders.phone': 'ফোন',
  'orders.method': 'পেমেন্ট',
  'orders.total': 'মোট',
  'orders.when': 'সময়',
  'orders.riskOk': 'ঠিক আছে',
  'orders.riskReview': 'দেখে নিন',
  'orders.address': 'ঠিকানা',
  'orders.items': 'আইটেম',
  'orders.note': 'নোট',
  'orders.confirmTrx': 'পেমেন্ট পেয়েছি',
  'orders.rejectTrx': 'TrxID বাতিল',
  'orders.rejectConfirm': 'এই TrxID বাতিল করে অর্ডার ক্যানসেল করবেন?',
  'orders.rejected': 'TrxID বাতিল। অর্ডার ক্যানসেল হয়েছে।',
  'orders.trxVerified': 'যাচাই হয়েছে',
  'orders.collect': 'কালেক্ট করার টাকা',
  'orders.collectHelp': 'অগ্রিম পেমেন্ট থাকলে COD-তে যেটা বাকি, সেটা এখানে কমিয়ে দিন।',
  'orders.settleCod': 'COD টাকা পেয়েছি',
  'orders.codSettled': 'COD সেটেল',
  'orders.otpOk': 'OTP যাচাই',
  'orders.saveCollect': 'কালেক্ট অ্যামাউন্ট সেভ',
  'orders.collectSaved': 'কালেক্ট অ্যামাউন্ট সেভ হয়েছে।',
  'orders.export': 'CSV এক্সপোর্ট',
  'orders.bulk': '{n}টি আপডেট',
  'orders.bulkDone': '{n}টি অর্ডার আপডেট হয়েছে।',
  'orders.selectAll': 'সব সিলেক্ট',
  'orders.source': 'অ্যাড সোর্স',
  'onboarding.title': 'শুরুর চেকলিস্ট',
  'onboarding.help': 'ল্যান্ডিং পেইজ দিয়ে আসল অর্ডার নিতে তিনটা ধাপ।',
  'onboarding.dismiss': 'লুকান',
  'onboarding.payments': '১. পেমেন্ট চালু করুন',
  'onboarding.paymentsHelp': 'COD চালু রাখুন অথবা বিকাশ/নগদ নম্বর দিন।',
  'onboarding.openPayments': 'পেমেন্টস খুলুন',
  'onboarding.testOrder': '২. একটা টেস্ট অর্ডার দিন',
  'onboarding.testOrderHelp': 'একটা পেইজ পাবলিশ করে নিজে একবার COD অর্ডার দিন।',
  'onboarding.openPages': 'পেইজ খুলুন',
  'onboarding.pixels': '৩. অ্যাড পিক্সেল যোগ করুন',
  'onboarding.pixelsHelp': 'Meta, TikTok বা GA4 দিলে Purchase ইভেন্ট ট্র্যাক হবে।',
  'onboarding.openSettings': 'সেটিংস খুলুন',
  'onboarding.courier': '৪. ডেলিভারি সেটআপ',
  'onboarding.courierHelp': 'কুরিয়ার চালু করলে অর্ডার থেকে পার্সেল বুক করা যায়।',
  'onboarding.openCouriers': 'পেমেন্টস খুলুন',
  'onboarding.fourSteps': 'ল্যান্ডিং পেইজ দিয়ে অর্ডার নিতে চারটা ধাপ।',
  'pages.search': 'পেইজ খুঁজুন',
  'pages.filterAll': 'সব',
  'pages.filterLive': 'লাইভ',
  'pages.filterDraft': 'ড্রাফট',
  'pages.viewGrid': 'গ্রিড',
  'pages.viewTable': 'টেবিল',
  'pages.viewMode': 'ভিউ মোড',
  'pages.edit': 'এডিট',
  'pages.view': 'লাইভ দেখুন',
  'pages.copyLink': 'লিংক কপি',
  'pages.copied': 'লিংক কপি হয়েছে',
  'pages.noLiveLink': 'লাইভ লিংকের জন্য পেইজ পাবলিশ করুন।',
  'pages.duplicate': 'ডুপ্লিকেট',
  'pages.duplicated': 'পেইজ ডুপ্লিকেট হয়েছে',
  'pages.deleted': 'পেইজ মুছে ফেলা হয়েছে',
  'pages.createModal': 'নতুন পেইজ',
  'pages.templatePick': 'টেমপ্লেট',
  'pages.pageTitle': 'পেইজের নাম',
  'pages.pageTitlePlaceholder': 'গ্রীষ্ম অফার',
  'pages.more': 'আরও',
  'pages.pageOf': 'পৃষ্ঠা {page} / {total}',
  'pages.prev': 'আগে',
  'pages.next': 'পরে',
  'payments.live': 'লাইভ মোড',
  'payments.liveWarning': 'কাস্টমার রিয়েল পেমেন্ট ও কুরিয়ার দেখবে। অর্ডার নেওয়ার আগে কীগুলো যাচাই করুন।',
  'payments.sandboxMode': 'স্যান্ডবক্স মোড',
  'payments.configure': 'কনফিগার',
  'payments.statusReady': 'রেডি',
  'payments.statusNeedsKeys': 'কী লাগবে',
  'payments.statusOff': 'বন্ধ',
  'payments.providers': 'পেমেন্ট ও ডেলিভারি',
  'payments.smsBlock': 'SMS নোটিফিকেশন',
  'payments.codHelp': 'COD-এ API কী লাগে না। চালু করলে কাস্টমার পার্সেল পেলে টাকা দেবে।',
  'orders.confirmed': 'পেইড মার্ক হয়েছে।',
  'orders.back': 'সব অর্ডার',
  'orders.trx': 'TrxID',
  'status.pending': 'কল করতে হবে',
  'status.awaiting_payment': 'পেমেন্টের অপেক্ষায়',
  'status.confirmed': 'কনফার্ম',
  'status.no_answer': 'ফোন ধরেনি',
  'status.fake': 'ফেক',
  'status.paid': 'পেইড',
  'status.shipped': 'পাঠানো হয়েছে',
  'status.delivered': 'ডেলিভারি হয়েছে',
  'status.returned': 'ফেরত',
  'status.cancelled': 'বাতিল',
  'pay.cod': 'ক্যাশ অন ডেলিভারি',
  'pay.manual_bkash': 'বিকাশ',
  'pay.manual_nagad': 'নগদ',
  'pay.sslcommerz': 'SSLCommerz',
  'analytics.title': 'অ্যানালিটিক্স',
  'analytics.days7': '৭ দিন',
  'analytics.days14': '১৪ দিন',
  'analytics.days30': '৩০ দিন',
  'analytics.confirmed': 'কনফার্ম',
  'analytics.delivered': 'ডেলিভারি',
  'analytics.series': 'দৈনিক রেভিনিউ',
  'analytics.visits': 'ভিজিট',
  'analytics.checkouts': 'চেকআউট শুরু',
  'analytics.orders': 'অর্ডার',
  'analytics.revenue': 'রেভিনিউ',
  'analytics.conversion': 'কনভার্সন',
  'analytics.cod': 'ক্যাশ অন ডেলিভারি',
  'analytics.prepaid': 'প্রিপেইড',
  'analytics.funnel': 'ভিজিট থেকে অর্ডার',
  'analytics.ab': 'A/B স্প্লিট',
  'analytics.variant': 'ভ্যারিয়েন্ট',
  'analytics.codReconcile': 'COD রিকনসিল',
  'analytics.codExpected': 'প্রত্যাশিত',
  'analytics.codReceived': 'পেয়েছি',
  'analytics.codUnsettled': 'বাকি',
  'analytics.codOpen': 'খোলা COD',
  'analytics.top': 'সেরা পেইজ',
  'payments.title': 'পেমেন্ট',
  'payments.intro': 'টাকা সরাসরি আপনার অ্যাকাউন্টে যায়। Noksha টাকা ধরে রাখে না।',
  'payments.sandbox': 'স্যান্ডবক্স',
  'payments.sandboxHelp': 'এটি চালু থাকলে SSLCommerz স্যান্ডবক্স হোস্ট ব্যবহার করে।',
  'payments.enabled': 'চালু',
  'payments.number': 'ওয়ালেট নম্বর',
  'payments.instructions': 'নির্দেশনা',
  'payments.storeId': 'স্টোর আইডি',
  'payments.password': 'স্টোর পাসওয়ার্ড',
  'payments.passwordHelp': 'আগের পাসওয়ার্ড রাখতে খালি রাখুন। সেটি আর দেখানো হয় না।',
  'payments.missing': 'কাস্টমার SSLCommerz-এ দিতে পারার আগে স্টোর আইডি ও পাসওয়ার্ড দিন।',
  'payments.saved': 'পেমেন্ট সেটিংস সেভ হয়েছে।',
  'brand.title': 'ব্র্যান্ড',
  'brand.intro': 'এই টোকেন ড্যাশবোর্ড ও সব ল্যান্ডিং পেইজের রং ঠিক করে।',
  'brand.preset': 'প্রিসেট',
  'brand.ink': 'ইঙ্ক',
  'brand.eid': 'ঈদ',
  'brand.minimal': 'মিনিমাল',
  'brand.colors': 'রং',
  'brand.font': 'ফন্ট',
  'brand.radius': 'কোণা',
  'brand.save': 'ব্র্যান্ড সেভ',
  'brand.saved': 'ব্র্যান্ড সেভ হয়েছে।',
  'brand.reset': 'রিসেট',
  'brand.canvas': 'ক্যানভাস',
  'brand.card': 'কার্ড',
  'brand.text': 'টেক্সট',
  'brand.muted': 'হালকা টেক্সট',
  'brand.border': 'বর্ডার',
  'brand.brand': 'ব্র্যান্ড',
  'brand.brandForeground': 'বাটনের লেখা',
  'brand.accent': 'অ্যাকসেন্ট',
  'brand.success': 'সফল',
  'brand.warning': 'সতর্কতা',
  'brand.danger': 'বিপদ',
  'brand.contrastWarning': 'এই ব্র্যান্ড রঙে বাটনের লেখা পড়তে কষ্ট হতে পারে। কনট্রাস্ট বাড়ান।',
  'brand.preview': 'লাইভ প্রিভিউ',
  'welcome.title': 'স্টোর সেটআপ',
  'welcome.skip': 'এখনই এড়িয়ে যান',
  'welcome.next': 'এগিয়ে যান',
  'welcome.back': 'পিছনে',
  'welcome.finish': 'পেইজ বানিয়ে শেষ',
  'welcome.skipStep': 'এই ধাপ এড়ান',
  'welcome.stepStore': 'স্টোরের মূল কথা',
  'welcome.stepPayments': 'পেমেন্ট',
  'welcome.stepCourier': 'কুরিয়ার',
  'welcome.stepPage': 'প্রথম পেইজ',
  'welcome.storeHelp': 'অ্যাডমিন ভাষা আর SMS-এ স্টোরের নাম ঠিক করুন।',
  'welcome.codHelp': 'COD দিয়ে দ্রুত অর্ডার নেওয়া শুরু করুন।',
  'welcome.courierHelp': 'Pathao, Steadfast বা RedX পরে পেমেন্ট থেকে যোগ করুন।',
  'welcome.pageHelp': 'একটা টেমপ্লেট বেছে নিন। পরে প্রতিটি লাইন বদলানো যাবে।',
  'settings.title': 'সেটিংস',
  'settings.region': 'অঞ্চল',
  'settings.regionBd': 'বাংলাদেশ',
  'settings.regionGlobal': 'আন্তর্জাতিক, পরে',
  'settings.regionHelp': 'ঠিকানা, ফোনের নিয়ম, আর টাকা বাংলাদেশ প্যাকেই থাকে।',
  'settings.language': 'অ্যাডমিনের ডিফল্ট ভাষা',
  'settings.pixels': 'পিক্সেল',
  'settings.meta': 'Meta Pixel আইডি',
  'settings.ga4': 'Google Analytics 4 আইডি',
  'settings.tiktok': 'TikTok Pixel আইডি',
  'settings.pixelsHelp': 'অফার পেইজে ViewContent, InitiateCheckout আর Purchase নিজে থেকেই ফায়ার হয়।',
  'settings.metaTest': 'Meta টেস্ট ইভেন্ট কোড',
  'settings.metaTestHelp': 'ঐচ্ছিক। Events Manager-এর Test Events ট্যাব থেকে কোড নিন। বসালে Purchase ইভেন্ট টেস্ট হিসেবে যায় আর ফলাফল অর্ডারের নোটে লেখা হয়। লাইভে যাওয়ার আগে কোডটি মুছে দিন।',
  'settings.metaCapi': 'Meta Conversions API টোকেন',
  'settings.metaCapiHelp': 'ঐচ্ছিক। ব্রাউজার পিক্সেলের একই event ID দিয়ে সার্ভার থেকে Purchase পাঠায়।',
  'settings.metaCapiPlaceholder': 'অ্যাক্সেস টোকেন পেস্ট করুন',
  'settings.metaCapiSet': 'টোকেন সেভ আছে — বদলাতে নতুনটা পেস্ট করুন',
  'settings.saved': 'সেটিংস সেভ হয়েছে।',
  'settings.tabGeneral': 'সাধারণ',
  'settings.tabTracking': 'ট্র্যাকিং',
  'settings.tabSms': 'SMS ও OTP',
  'settings.tabFraud': 'ফ্রড',
  'settings.tabAdvanced': 'অ্যাডভান্সড',
  'settings.storeName': 'স্টোরের নাম',
  'settings.storeHelp': 'SMS sender ID আর সাইডবারে দেখাবে।',
  'settings.bnDigits': 'অ্যাডমিনে বাংলা সংখ্যা',
  'settings.bnDigitsHelp': 'শুধু এই ব্রাউজারে সেভ হবে।',
  'settings.fraudHelp': 'অর্ডারে ফ্রড স্কোরিং অটো চলে। বারবার সমস্যার নম্বর লিড → ব্ল্যাকলিস্ট থেকে ব্লক করুন।',
  'settings.advancedHelp': 'পেমেন্ট, কুরিয়ার, ওয়ালেট API “পেমেন্ট”-এ। ব্র্যান্ড রং “ব্র্যান্ড”-এ।',
  'settings.discard': 'বাতিল',
  'settings.unsaved': 'সেভ করা হয়নি',
  'settings.otpTtl': 'OTP মেয়াদ (সেকেন্ড)',
  'nav.leads': 'লিড',
  'leads.title': 'লিড ও ফ্রড',
  'leads.help': 'অসম্পূর্ণ চেকআউট আর ব্লক করা ফোন নম্বর।',
  'leads.incomplete': 'অসম্পূর্ণ চেকআউট',
  'leads.empty': 'এখনো কোনো অসম্পূর্ণ চেকআউট নেই।',
  'leads.blacklist': 'ফোন ব্ল্যাকলিস্ট',
  'leads.blacklistHelp': 'ব্ল্যাকলিস্টে থাকা নম্বর নতুন অর্ডার দিতে পারবে না।',
  'leads.blacklistEmpty': 'কোনো নম্বর ব্লক নেই।',
  'leads.note': 'নোট',
  'leads.add': 'নম্বর ব্লক',
  'leads.remove': 'সরান',
  'leads.tabIncomplete': 'অসম্পূর্ণ চেকআউট',
  'leads.tabBlacklist': 'ব্ল্যাকলিস্ট',
  'leads.pageId': 'পেইজ',
  'leads.date': 'ব্লকের সময়',
  'leads.removeConfirm': 'ব্ল্যাকলিস্ট থেকে নম্বরটি সরাবেন?',
  'leads.added': 'নম্বর ব্লক হয়েছে।',
  'leads.prev': 'আগের',
  'leads.next': 'পরের',
  'editor.undo': 'আনডু',
  'editor.fullscreen': 'ফুলস্ক্রিন',
  'editor.exitFull': 'বেরোন',
  'seo.title': 'SEO শিরোনাম',
  'seo.titleHelp': 'গুগল ও ফেসবুক শেয়ারে দেখাবে। খালি রাখলে পেইজের নাম ব্যবহার হবে।',
  'seo.description': 'SEO বর্ণনা',
  'seo.descriptionHelp': 'সার্চ ও অ্যাডের জন্য এক-দুই লাইনের লেখা।',
  'seo.image': 'শেয়ার ছবি',
  'orders.print': 'স্লিপ প্রিন্ট',
  'orders.blacklist': 'ফোন ব্লক',
  'orders.blacklistConfirm': 'এই ফোন আবার অর্ডার দিতে পারবে না—ব্লক করবেন?',
  'orders.blacklisted': 'ফোন ব্ল্যাকলিস্টে যোগ হয়েছে।',
  'orders.bookCourier': 'কুরিয়ার বুক',
  'orders.shipped': 'কুরিয়ার বুক হয়েছে। স্ট্যাটাস shipped।',
  'orders.tracking': 'ট্র্যাকিং',
  'orders.fraud': 'ফ্রড স্কোর',
  'payments.sms': 'SMS',
  'payments.smsHelp': 'অর্ডার প্লেস বা শিপ হলে বাংলা SMS (BulkSMSBD API key)।',
  'payments.smsEnabled': 'SMS পাঠান',
  'payments.smsSender': 'Sender ID',
  'payments.smsKey': 'SMS API key',
  'payments.otpMode': 'চেকআউট OTP',
  'payments.otpOff': 'বন্ধ',
  'payments.otpRisk': 'শুধু ঝুঁকিপূর্ণ ফোন',
  'payments.otpAlways': 'সবসময় (SMS প্রস্তুত থাকলে)',
  'payments.otpHelp': 'রিস্ক মোডে ৭ দিনে একই ফোনে দুবার অর্ডার হলে OTP চায়।',
  'payments.autoVerify': 'API দিয়ে TrxID অটো-ভেরিফাই',
  'payments.autoVerifyHelp': 'ক্রেডেনশিয়াল থাকলে মার্চেন্ট সার্চ API চালায়। ম্যানুয়াল কনফার্মও কাজ করবে।',
  'payments.autoVerifyNote': 'অটো-ভেরিফাই শুধু bKash Merchant/PGW পেমেন্টে কাজ করে। Personal “Send Money” TrxID ম্যানুয়ালি কনফার্ম করতে হবে।',
  'payments.bkashAppKey': 'bKash app key',
  'payments.bkashAppSecret': 'bKash app secret',
  'payments.bkashUser': 'bKash username',
  'payments.bkashPass': 'bKash password',
  'payments.nagadMerchant': 'Nagad merchant ID',
  'payments.nagadVerifyUrl': 'Nagad verify URL',
  'payments.walletReady': 'ওয়ালেট API প্রস্তুত',
  'payments.webhooks': 'কুরিয়ার ওয়েবহুক',
  'payments.webhooksHelp': 'Steadfast / Pathao / RedX-এ এই URL দিন। সিক্রেট লাগবে — হেডার X-Noksha-Webhook-Secret।',
  'payments.webhookSecret': 'ওয়েবহুক সিক্রেট',
  'payments.generateSecret': 'সিক্রেট বানাও',
  'payments.webhookHeader': 'হেডার: X-Noksha-Webhook-Secret',
  'orders.collectCourier': 'কুরিয়ার কালেক্ট করবে {amount}',
  'orders.verifyTrx': 'API দিয়ে যাচাই',
  'orders.verifyOk': 'API TrxID কনফার্ম করেছে',
  'orders.verifyPending': 'API এখনো এই TrxID কনফার্ম করেনি',
  'orders.tab.all': 'সব',
  'orders.tab.needsCall': 'কল করতে হবে',
  'orders.tab.cancelledFake': 'ক্যানসেল / ফেক',
  'orders.orderNumber': 'অর্ডার #',
  'orders.customer': 'গ্রাহক',
  'orders.courier': 'কুরিয়ার',
  'orders.risk': 'ঝুঁকি',
  'orders.payment': 'পেমেন্ট',
  'orders.confirmOrder': 'অর্ডার কনফার্ম',
  'orders.noAnswer': 'উত্তর নেই',
  'orders.markFake': 'ফেক মার্ক',
  'orders.cancelOrder': 'অর্ডার ক্যানসেল',
  'orders.cancelConfirm': 'এই অর্ডার ক্যানসেল করবেন?',
  'orders.notes': 'নোট',
  'orders.notesEmpty': 'এখনো কোনো স্টাফ নোট নেই।',
  'orders.addNote': 'নোট যোগ',
  'orders.noteSaved': 'নোট যোগ হয়েছে।',
  'orders.customerSaved': 'গ্রাহকের তথ্য সেভ হয়েছে।',
  'orders.addressSaved': 'ঠিকানা সেভ হয়েছে।',
  'orders.openFull': 'পূর্ণ পেজ খুলুন',
  'orders.perPage': 'প্রতি পেজ',
  'orders.pageOf': 'পেজ {page}/{total} · {count} অর্ডার',
  'orders.selected': '{n}টি সিলেক্ট',
  'orders.bulkConfirm': 'কনফার্ম',
  'orders.bulkBar': 'বাল্ক অ্যাকশন',
  'orders.bulkStatus': 'স্ট্যাটাস বদল',
  'orders.filterRisk': 'ঝুঁকি',
  'orders.filterRiskAll': 'সব ঝুঁকি',
  'orders.filterPaymentAll': 'সব পেমেন্ট',
  'orders.attribution': 'অ্যাট্রিবিউশন',
  'orders.subtotal': 'সাবটোটাল',
  'orders.shipping': 'শিপিং',
  'orders.email': 'ইমেইল',
  'orders.viewOrder': 'অর্ডার বিস্তারিত',
  'orders.call': 'কল',
  'orders.statusUpdated': 'স্ট্যাটাস আপডেট হয়েছে।',
  'orders.exportDone': 'এক্সপোর্ট শুরু হয়েছে।',
  'orders.prev': 'আগে',
  'orders.next': 'পরে',
  'common.close': 'বন্ধ',
  'common.copy': 'কপি',
  'common.copied': 'কপি হয়েছে',
  'analytics.byDistrict': 'জেলায় কনফার্ম / রিটার্ন',
  'analytics.byPage': 'পেইজে কনফার্ম / রিটার্ন',
  'analytics.area': 'এলাকা',
  'analytics.placed': 'প্লেসড',
  'analytics.confirmRate': 'কনফার্ম রেট',
  'analytics.returnRate': 'রিটার্ন রেট',
  'payments.couriers': 'কুরিয়ার',
  'payments.couriersHelp': 'কী রেডি থাকলে অর্ডার স্ক্রিন থেকে Pathao/Steadfast/RedX বুক করা যায়।',
  'payments.apiKey': 'API key',
  'payments.secretKey': 'Secret key',
  'payments.secretSet': 'সেভ আছে — বদলাতে নতুন মান দিন',
  'payments.courierReady': 'বুক করার জন্য রেডি',
  'payments.courierNeedKeys': 'চালু করে কী দিলে পার্সেল বুক হবে।',
  'courier.steadfast': 'Steadfast',
  'courier.pathao': 'Pathao',
  'courier.redx': 'RedX',
  'pages.beauty': 'স্কিনকেয়ার',
  'pages.beautyBody': 'সিরাম, ক্রিম বা স্কিনকেয়ার পেইজ, ব্যবহারের ধাপ ও তুলনাসহ',
  'pages.fashion': 'ফ্যাশন',
  'pages.fashionBody': 'পোশাকের পেইজ, ছবির গ্রিড, সাইজের প্রশ্ন ও এক্সচেঞ্জের নিশ্চয়তা',
  'pages.food': 'খাবার ও মুদি',
  'pages.foodBody': 'মধু, ঘি, খেজুর: ক্রমিক কারণ, ভিডিওর জায়গা ও তুলনা',
  'pages.health': 'ওয়েলনেস',
  'pages.healthBody': 'হারবাল বা দৈনন্দিন ওয়েলনেস পণ্য, শান্ত লেআউট ও ব্যবহারের ধাপ',
  'pages.home': 'হোম ও কিচেন',
  'pages.homeBody': 'গৃহস্থালি পণ্য: ভিডিও, কাউন্টডাউন, ছবির স্লাইডার ও WhatsApp বাটন',
  'pages.gadget': 'গ্যাজেট',
  'pages.gadgetBody': 'ইয়ারবাডস/অ্যাকসেসরি অফার পেইজ',
  'settings.english': 'English',
  'settings.bangla': 'বাংলা',
  'common.loading': 'লোড হচ্ছে…',
  'common.error': 'এই স্ক্রিন লোড হয়নি।',
  'common.retry': 'আবার চেষ্টা',
  'common.save': 'সেভ',
  'common.saved': 'সেভ হয়েছে',
  'trust.secure': 'নিরাপদ চেকআউট',
  'trust.cod': 'ক্যাশ অন ডেলিভারি',
  'trust.delivery': 'সারা দেশে ডেলিভারি'
};
function translate(locale, key) {
  const pack = locale === 'bn' ? bn : en;
  return pack[key] || en[key] || key;
}

/***/ },

/***/ "./admin-src/index.js"
/*!****************************!*\
  !*** ./admin-src/index.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App */ "./admin-src/App.js");
/* harmony import */ var _styles_tokens_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/tokens.css */ "./admin-src/styles/tokens.css");
/* harmony import */ var _styles_shell_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/shell.css */ "./admin-src/styles/shell.css");
/* harmony import */ var _styles_screens_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/screens.css */ "./admin-src/styles/screens.css");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui */ "./admin-src/ui/index.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.css */ "./admin-src/style.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const root = document.getElementById('noksha-root');
if (root) {
  const app = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_App__WEBPACK_IMPORTED_MODULE_1__.App, {});
  if (typeof _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot === 'function') {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(root).render(app);
  } else {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)(app, root);
  }
}

/***/ },

/***/ "./admin-src/providers.js"
/*!********************************!*\
  !*** ./admin-src/providers.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppProviders: () => (/* binding */ AppProviders),
/* harmony export */   ConfirmProvider: () => (/* binding */ ConfirmProvider),
/* harmony export */   ToastProvider: () => (/* reexport safe */ _ui_Toast__WEBPACK_IMPORTED_MODULE_2__.ToastProvider),
/* harmony export */   useConfirm: () => (/* binding */ useConfirm),
/* harmony export */   useToast: () => (/* reexport safe */ _ui_Toast__WEBPACK_IMPORTED_MODULE_2__.useToast)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/ConfirmDialog */ "./admin-src/ui/ConfirmDialog.js");
/* harmony import */ var _ui_Toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/Toast */ "./admin-src/ui/Toast.js");



const ConfirmContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
function ConfirmProviderInner({
  children
}) {
  const [state, setState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const resolver = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const confirm = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(options => {
    return new Promise(resolve => {
      resolver.current = resolve;
      setState({
        title: options?.title ?? 'Confirm',
        message: options?.message,
        confirmLabel: options?.confirmLabel ?? 'Confirm',
        cancelLabel: options?.cancelLabel ?? 'Cancel',
        danger: Boolean(options?.danger)
      });
    });
  }, []);
  function finish(value) {
    resolver.current?.(value);
    resolver.current = null;
    setState(null);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ConfirmContext.Provider, {
    value: confirm
  }, children, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_1__.ConfirmDialog, {
    open: !!state,
    title: state?.title,
    message: state?.message,
    confirmLabel: state?.confirmLabel,
    cancelLabel: state?.cancelLabel,
    danger: state?.danger,
    onConfirm: () => finish(true),
    onCancel: () => finish(false)
  }));
}
function useConfirm() {
  const ctx = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return ctx;
}
function ConfirmProvider({
  children
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ConfirmProviderInner, null, children);
}
function AppProviders({
  children
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ui_Toast__WEBPACK_IMPORTED_MODULE_2__.ToastProvider, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ConfirmProvider, null, children));
}


/***/ },

/***/ "./admin-src/screens/Analytics.js"
/*!****************************************!*\
  !*** ./admin-src/screens/Analytics.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Analytics: () => (/* binding */ Analytics)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const RANGE_PRESETS = [{
  id: '7d',
  days: 7,
  labelKey: 'analytics.days7'
}, {
  id: '14d',
  days: 14,
  labelKey: 'analytics.days14'
}, {
  id: '30d',
  days: 30,
  labelKey: 'analytics.days30'
}];
function funnelExtras(data) {
  const funnel = data?.funnel || {};
  const byPage = data?.byPage || [];
  const confirmed = Number(funnel.confirmed);
  const delivered = Number(funnel.delivered);
  const summedConfirmed = byPage.reduce((sum, row) => sum + (Number(row.confirmed) || 0), 0);
  return {
    confirmed: Number.isFinite(confirmed) && confirmed > 0 ? confirmed : summedConfirmed,
    delivered: Number.isFinite(delivered) ? delivered : 0
  };
}
function Analytics({
  t,
  locale
}) {
  const [range, setRange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(7);
  const [rangePreset, setRangePreset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('7d');
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [data, setData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((days = range) => {
    setStatus('loading');
    setError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)(`analytics?range=${days}`).then(report => {
      setData(report);
      setStatus('ready');
    }).catch(err => {
      setError(err.message || t('common.error'));
      setStatus('error');
    });
  }, [range, t]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load(7);
  }, []);
  const funnel = data?.funnel;
  const extras = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => data ? funnelExtras(data) : {
    confirmed: 0,
    delivered: 0
  }, [data]);
  const funnelSteps = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!funnel) {
      return [];
    }
    return [{
      key: 'visits',
      label: t('analytics.visits'),
      value: funnel.visits || 0
    }, {
      key: 'checkouts',
      label: t('analytics.checkouts'),
      value: funnel.checkouts || 0
    }, {
      key: 'orders',
      label: t('analytics.orders'),
      value: funnel.orders || 0
    }, {
      key: 'confirmed',
      label: t('analytics.confirmed'),
      value: extras.confirmed
    }, {
      key: 'delivered',
      label: t('analytics.delivered'),
      value: extras.delivered
    }];
  }, [funnel, extras, t]);
  const maxFunnel = Math.max(1, ...funnelSteps.map(step => step.value));
  const datePresets = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => RANGE_PRESETS.map(p => ({
    id: p.id,
    label: t(p.labelKey)
  })), [t]);
  function onRangePick(next) {
    const preset = next?.preset || rangePreset;
    const match = RANGE_PRESETS.find(p => p.id === preset);
    if (match) {
      setRange(match.days);
      setRangePreset(match.id);
      load(match.days);
    }
  }
  const series = data?.series || [];
  const seriesMax = Math.max(1, ...series.map(day => day.revenue));
  if (status === 'error') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("header", {
        className: "nk-screen-header",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
          children: t('analytics.title')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.EmptyState, {
        title: t('common.error'),
        description: error,
        action: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          onClick: () => load(),
          children: t('common.retry')
        })
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "nk-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('analytics.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "nk-screen-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.DateRangePicker, {
          presets: datePresets,
          value: {
            preset: rangePreset
          },
          onChange: onRangePick
        })
      })]
    }), status === 'loading' && !data ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "nk-kpi-row",
      children: [1, 2, 3, 4].map(i => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
        height: 72
      }, i))
    }) : null, funnel ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-kpi-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
          label: t('analytics.visits'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.visits, locale)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
          label: t('analytics.checkouts'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.checkouts, locale)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
          label: t('analytics.orders'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.orders, locale)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
          label: t('analytics.revenue'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatMoney)(funnel.revenue, locale)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.funnel'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "nk-funnel",
          children: funnelSteps.map(step => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "nk-funnel-step",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              children: step.label
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "nk-funnel-bar",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                style: {
                  width: `${Math.max(4, step.value / maxFunnel * 100)}%`
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(step.value, locale)
            })]
          }, step.key))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("p", {
          className: "nk-muted",
          children: [t('analytics.conversion'), ":", ' ', funnel.conversion == null ? t('home.notEnoughData') : `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.conversion, locale)}%`, ' · ', t('analytics.cod'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.cod, locale), ' · ', t('analytics.prepaid'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(funnel.prepaid, locale)]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('home.chart'),
        children: status === 'loading' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
          height: 220
        }) : series.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('home.emptyPages')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "nk-bars",
          style: {
            height: 220,
            alignItems: 'flex-end'
          },
          children: series.map(day => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("i", {
            title: `${day.date} ${(0,_api__WEBPACK_IMPORTED_MODULE_1__.money)(day.revenue)}`,
            style: {
              height: `${Math.max(2, day.revenue / seriesMax * 100)}%`,
              flex: 1
            }
          }, day.date))
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.ab'),
        children: status === 'loading' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
          height: 120
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Table, {
          columns: [{
            key: 'variant',
            label: t('analytics.variant')
          }, {
            key: 'visits',
            label: t('analytics.visits'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.visits, locale)
          }, {
            key: 'orders',
            label: t('analytics.orders'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.orders, locale)
          }, {
            key: 'conversion',
            label: t('analytics.conversion'),
            render: row => `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.rate, locale)}%`
          }],
          rows: ['a', 'b'].map(key => {
            const row = data.ab && data.ab[key] || {
              visits: 0,
              orders: 0
            };
            const rate = row.visits > 0 ? (row.orders / row.visits * 100).toFixed(1) : '0.0';
            return {
              variant: key.toUpperCase(),
              visits: row.visits,
              orders: row.orders,
              rate
            };
          }),
          rowKey: row => row.variant,
          emptyTitle: t('uikit.empty')
        })
      }), data.codReconcile ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.codReconcile'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "nk-kpi-row",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
            label: t('analytics.codExpected'),
            value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatMoney)(data.codReconcile.expected, locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
            label: t('analytics.codReceived'),
            value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatMoney)(data.codReconcile.received, locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
            label: t('analytics.codUnsettled'),
            value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatMoney)(data.codReconcile.unsettled, locale)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.StatCard, {
            label: t('analytics.codOpen'),
            value: (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(data.codReconcile.open, locale)
          })]
        })
      }) : null, (data.byDistrict || []).length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.byDistrict'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Table, {
          columns: [{
            key: 'label',
            label: t('analytics.area')
          }, {
            key: 'placed',
            label: t('analytics.placed'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.placed, locale)
          }, {
            key: 'confirmRate',
            label: t('analytics.confirmRate'),
            render: row => `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.confirmRate, locale)}%`
          }, {
            key: 'returnRate',
            label: t('analytics.returnRate'),
            render: row => `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.returnRate, locale)}%`
          }],
          rows: data.byDistrict,
          rowKey: row => row.label
        })
      }) : null, (data.byPage || []).length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.byPage'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Table, {
          columns: [{
            key: 'title',
            label: t('pages.name')
          }, {
            key: 'placed',
            label: t('analytics.placed'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.placed, locale)
          }, {
            key: 'confirmRate',
            label: t('analytics.confirmRate'),
            render: row => `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.confirmRate, locale)}%`
          }, {
            key: 'returnRate',
            label: t('analytics.returnRate'),
            render: row => `${(0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.returnRate, locale)}%`
          }],
          rows: data.byPage,
          rowKey: row => row.id
        })
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        title: t('analytics.top'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Table, {
          loading: status === 'loading',
          emptyTitle: t('home.emptyPages'),
          columns: [{
            key: 'title',
            label: t('pages.name')
          }, {
            key: 'visits',
            label: t('analytics.visits'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.visits, locale)
          }, {
            key: 'orders',
            label: t('analytics.orders'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatNumber)(row.orders, locale)
          }, {
            key: 'revenue',
            label: t('analytics.revenue'),
            render: row => (0,_format__WEBPACK_IMPORTED_MODULE_2__.formatMoney)(row.revenue, locale)
          }],
          rows: data.topPages || [],
          rowKey: row => row.id
        })
      })]
    }) : status === 'loading' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
      height: 240
    }) : null]
  });
}

/***/ },

/***/ "./admin-src/screens/Brand.js"
/*!************************************!*\
  !*** ./admin-src/screens/Brand.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Brand: () => (/* binding */ Brand)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const COLOR_KEYS = ['canvas', 'card', 'text', 'muted', 'border', 'brand', 'brandForeground', 'accent', 'success', 'warning', 'danger'];
function hexToRgb(hex) {
  const raw = String(hex || '').replace('#', '').trim();
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    return [r, g, b];
  }
  if (raw.length !== 6) {
    return null;
  }
  return [parseInt(raw.slice(0, 2), 16), parseInt(raw.slice(2, 4), 16), parseInt(raw.slice(4, 6), 16)];
}
function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }
  const channel = rgb.map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channel[0] + 0.7152 * channel[1] + 0.0722 * channel[2];
}
function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}
function Brand({
  t,
  onPreview,
  locale
}) {
  const {
    success,
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_2__.useToast)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [presets, setPresets] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [fonts, setFonts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saved, setSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  function load() {
    setStatus('loading');
    setError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('brand').then(data => {
      setPresets(data.presets || {});
      setFonts(data.fonts || []);
      setDraft(data.tokens);
      setSaved(data.tokens);
      setStatus('ready');
    }).catch(err => {
      setError(err.message || t('common.error'));
      setStatus('error');
    });
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(load, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (draft) {
      onPreview(draft);
    }
  }, [draft, onPreview]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => {
    if (saved) {
      onPreview(saved);
    }
  }, [saved, onPreview]);
  const contrastOk = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!draft?.color) {
      return true;
    }
    const ratio = contrastRatio(draft.color.brand, draft.color.brandForeground);
    return ratio >= 4.5;
  }, [draft]);
  function setColor(key, value) {
    setDraft({
      ...draft,
      preset: 'custom',
      color: {
        ...draft.color,
        [key]: value
      }
    });
  }
  function save(event) {
    event.preventDefault();
    setSaving(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('brand', {
      method: 'PUT',
      body: draft
    }).then(data => {
      setDraft(data.tokens);
      setSaved(data.tokens);
      success(t('brand.saved'));
    }).catch(err => toastError(err.message || t('common.error'))).finally(() => setSaving(false));
  }
  if (status === 'error') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('brand.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          onClick: load,
          children: t('common.retry')
        })]
      })]
    });
  }
  if (!draft || status === 'loading') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('brand.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
        height: 360
      })]
    });
  }
  const fontOptions = fonts.concat(draft.font.sans).filter((font, index, list) => list.indexOf(font) === index);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
    className: "nk-screen",
    onSubmit: save,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
          children: t('brand.title')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('brand.intro')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-screen-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          type: "button",
          variant: "secondary",
          onClick: () => presets.ink && setDraft(presets.ink),
          children: t('brand.reset')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          type: "submit",
          disabled: saving,
          children: t('brand.save')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-split-brand",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-screen",
        style: {
          gap: 16
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
          title: t('brand.preset'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "nk-screen-actions",
            children: Object.keys(presets).map(name => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
              type: "button",
              variant: draft.preset === name ? 'primary' : 'secondary',
              size: "sm",
              onClick: () => setDraft(presets[name]),
              children: t('brand.' + name)
            }, name))
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
          title: t('brand.colors'),
          children: [!contrastOk ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "nk-banner",
            role: "status",
            children: t('brand.contrastWarning')
          }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "nk-grid-cards",
            children: COLOR_KEYS.map(key => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
              className: "nk-ui-field",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "nk-ui-label",
                children: t('brand.' + key)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "nk-color",
                style: {
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                  type: "color",
                  value: draft.color[key],
                  onChange: event => setColor(key, event.target.value.toUpperCase())
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
                  value: draft.color[key],
                  onChange: event => setColor(key, event.target.value),
                  "aria-label": t('brand.' + key)
                })]
              })]
            }, key))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
            label: t('brand.font'),
            value: draft.font.sans,
            onChange: event => setDraft({
              ...draft,
              preset: 'custom',
              font: {
                sans: event.target.value
              }
            }),
            children: fontOptions.map(font => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
              value: font,
              children: font
            }, font))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
            label: t('brand.radius'),
            value: draft.radius,
            onChange: event => setDraft({
              ...draft,
              preset: 'custom',
              radius: event.target.value
            }),
            children: ['6px', '10px', '16px'].map(radius => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
              value: radius,
              children: radius
            }, radius))
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("aside", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
          title: t('brand.preview'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "nk-page-card",
            style: {
              background: draft.color.card,
              color: draft.color.text,
              borderRadius: draft.radius,
              fontFamily: draft.font.sans
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "nk-page-card-thumb",
              style: {
                background: `linear-gradient(135deg, ${draft.color.brand}, ${draft.color.accent})`
              },
              "aria-hidden": "true"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: locale === 'bn' ? 'আপনার স্টোর' : 'Your store'
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              className: "nk-muted",
              style: {
                color: draft.color.muted,
                margin: 0
              },
              children: locale === 'bn' ? 'লাইভ ব্র্যান্ড প্রিভিউ' : 'Live brand preview'
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              type: "button",
              style: {
                background: draft.color.brand,
                color: draft.color.brandForeground,
                border: 0,
                borderRadius: draft.radius,
                padding: '10px 16px',
                fontWeight: 600,
                cursor: 'default'
              },
              children: locale === 'bn' ? 'অর্ডার করুন' : 'Order now'
            })]
          })
        })
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Editor.js"
/*!*************************************!*\
  !*** ./admin-src/screens/Editor.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Editor: () => (/* binding */ Editor)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _EditorTopBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EditorTopBar */ "./admin-src/screens/EditorTopBar.js");
/* harmony import */ var _EditorSectionList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EditorSectionList */ "./admin-src/screens/EditorSectionList.js");
/* harmony import */ var _editorShared__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editorShared */ "./admin-src/screens/editorShared.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








/** Width the page is laid out at in the desktop/tablet preview; the frame is scaled down to fit the stage. */

const VIRTUAL_WIDTH = {
  desktop: 1100,
  tablet: 768
};
function previewScale(device, fit) {
  const virtual = VIRTUAL_WIDTH[device];
  if (!virtual || !fit.w) {
    return 1;
  }
  return Math.min(1, Math.max(0.3, (fit.w - 40) / virtual));
}

/** Section picker groups, ordered by what the seller is trying to do. */
const TYPE_GROUPS = [{
  key: 'attention',
  types: ['hero', 'countdown', 'whatsapp']
}, {
  key: 'trust',
  types: ['benefits', 'reviews', 'guarantee', 'faq', 'compare']
}, {
  key: 'product',
  types: ['product', 'gallery', 'video', 'steps', 'order_form']
}, {
  key: 'advanced',
  types: ['html']
}];

/** Tiny CSS wireframe so sellers can see what a section looks like before adding it. */
function SectionThumb({
  type
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
    className: `nk-thumb nk-thumb-${type}`,
    "aria-hidden": "true",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {})]
  });
}

/** Index where a new section goes: after the selected one, else above the order form. */
function insertIndex(sections, type, selectedId) {
  const formIndex = sections.findIndex(item => item.type === 'order_form');
  if (type === 'order_form') {
    return sections.length;
  }
  const selectedIndex = selectedId ? sections.findIndex(item => item.id === selectedId) : -1;
  if (selectedIndex >= 0) {
    const after = selectedIndex + 1;
    return formIndex >= 0 && after > formIndex ? formIndex : after;
  }
  return formIndex >= 0 ? formIndex : sections.length;
}
const HTML_LIMIT = 20000;
const METHODS = ['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
const FIELD_KEYS = ['name', 'phone', 'email', 'division', 'district', 'upazila', 'address', 'note'];
const ITEM_LIMITS = {
  benefits: 6,
  reviews: 8,
  faq: 12,
  steps: 6
};
const SINGLE_TYPES = ['order_form', 'whatsapp'];
const BULLET_LIMIT = 8;
const COLOR_GROUPS = [['colors.main', ['brand', 'brandForeground', 'accent']], ['colors.surface', ['canvas', 'card', 'text', 'muted', 'border']], ['colors.status', ['success', 'warning', 'danger']]];
const PREVIEW_CSS = '[data-nk-section]{cursor:pointer;outline:2px solid transparent;outline-offset:-2px;transition:outline-color .15s}' + '[data-nk-section]:hover{outline-color:rgba(34,113,177,.45)}' + '[data-nk-section].nk-ed-sel{outline-color:#2271B1}' + '[data-nk-prop]{outline:1px dashed transparent;outline-offset:2px;min-width:1ch}' + '[data-nk-prop]:hover,[data-nk-prop]:focus{outline-color:rgba(34,113,177,.55);background:rgba(34,113,177,.06)}' + '[data-nk-prop][contenteditable="true"]{cursor:text}';
function setByPath(source, path, value) {
  const parts = String(path || '').split('.').filter(Boolean);
  if (parts.length === 0) {
    return source;
  }
  const clone = Array.isArray(source) ? source.slice() : {
    ...(source || {})
  };
  let cursor = clone;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const next = cursor[key];
    const copy = Array.isArray(next) ? next.slice() : {
      ...(next || {})
    };
    cursor[key] = copy;
    cursor = copy;
  }
  cursor[parts[parts.length - 1]] = value;
  return clone;
}
function blankSection(type, t) {
  const props = {
    hero: {
      eyebrow: '',
      title: t('section.hero'),
      subtitle: '',
      imageUrl: '',
      buttonLabel: t('editor.orderNow')
    },
    benefits: {
      title: t('section.benefits'),
      items: [{
        title: '',
        text: ''
      }]
    },
    product: {
      title: t('section.product'),
      text: '',
      imageUrl: '',
      bullets: []
    },
    countdown: {
      title: t('section.countdown'),
      endsAt: ''
    },
    reviews: {
      title: t('section.reviews'),
      items: [{
        name: '',
        text: '',
        rating: 5
      }]
    },
    faq: {
      title: t('section.faq'),
      items: [{
        q: '',
        a: ''
      }]
    },
    guarantee: {
      title: t('section.guarantee'),
      text: ''
    },
    html: {
      html: ''
    },
    order_form: {
      title: t('section.order_form'),
      buttonLabel: t('editor.orderNow')
    },
    gallery: {
      title: t('section.gallery'),
      images: []
    },
    video: {
      title: t('section.video'),
      url: '',
      caption: ''
    },
    steps: {
      title: t('section.steps'),
      items: [{
        title: t('steps.s1'),
        text: ''
      }, {
        title: t('steps.s2'),
        text: ''
      }, {
        title: t('steps.s3'),
        text: ''
      }]
    },
    compare: {
      title: t('section.compare'),
      usLabel: t('compare.us'),
      themLabel: t('compare.them'),
      rows: [{
        label: '',
        us: '✓',
        them: '✗'
      }]
    },
    whatsapp: {
      number: '',
      label: '',
      message: ''
    }
  };
  return {
    id: 's_' + Math.random().toString(36).slice(2, 10),
    type,
    hidden: false,
    props: props[type]
  };
}
function chooseImage(onPick) {
  if (!window.wp || !window.wp.media) {
    return false;
  }
  const frame = window.wp.media({
    title: 'Noksha',
    multiple: false,
    library: {
      type: 'image'
    }
  });
  frame.on('select', () => {
    const file = frame.state().get('selection').first().toJSON();
    onPick(file.url || '');
  });
  frame.open();
  return true;
}
function gatewayIssue(method, settings) {
  if (!settings || !settings.gateways) {
    return '';
  }
  const gateway = settings.gateways[method];
  if (!gateway || !gateway.enabled) {
    return 'off';
  }
  if ((method === 'manual_bkash' || method === 'manual_nagad') && !gateway.number) {
    return 'number';
  }
  if (method === 'sslcommerz' && !settings.ssl_ready) {
    return 'ssl';
  }
  return '';
}
function Editor({
  t,
  id,
  go
}) {
  const confirm = (0,_providers__WEBPACK_IMPORTED_MODULE_2__.useConfirm)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saved, setSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [liveStatus, setLiveStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('draft');
  const [view, setView] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    kind: 'home'
  });
  const [device, setDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('phone');
  const [html, setHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [previewError, setPreviewError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [previewBusy, setPreviewBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [justSaved, setJustSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [history, setHistory] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [redoStack, setRedoStack] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [settingsTab, setSettingsTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('offer');
  const [addOpen, setAddOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  // Focus mode by default: hides the WP admin menu/bar so the preview gets the full width.
  const [fullscreen, setFullscreen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const frameRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const scrollRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const selectedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)('');
  const requestRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const pageRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const actionsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  const autosaveRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const skipHistoryRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const editingRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [toolbar, setToolbar] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const deviceRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const fitObserver = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [fit, setFit] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    w: 0,
    h: 0
  });
  const fitRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(node => {
    if (fitObserver.current) {
      fitObserver.current.disconnect();
      fitObserver.current = null;
    }
    if (!node || !window.ResizeObserver) {
      return;
    }
    const measure = () => setFit(prev => prev.w === node.clientWidth && prev.h === node.clientHeight ? prev : {
      w: node.clientWidth,
      h: node.clientHeight
    });
    fitObserver.current = new window.ResizeObserver(measure);
    fitObserver.current.observe(node);
    measure();
  }, []);
  const dirty = page ? JSON.stringify(page) !== saved : false;
  pageRef.current = page;
  function load() {
    setStatus('loading');
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('pages/' + id).then(data => {
      setPage(data);
      setSaved(JSON.stringify(data));
      setLiveStatus(data.status);
      setView({
        kind: 'home'
      });
      setStatus('ready');
    }).catch(err => {
      setError(err.message);
      setStatus('error');
    });
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(load, [id]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('settings').then(setSettings).catch(() => {});
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!page || editingRef.current) {
      return undefined;
    }
    setPreviewBusy(true);
    const handle = window.setTimeout(() => {
      if (editingRef.current) {
        setPreviewBusy(false);
        return;
      }
      const request = ++requestRef.current;
      (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('preview', {
        method: 'POST',
        body: page
      }).then(data => {
        if (request !== requestRef.current || editingRef.current) {
          return;
        }
        try {
          const win = frameRef.current && frameRef.current.contentWindow;
          scrollRef.current = win ? win.scrollY || 0 : 0;
        } catch (err) {
          scrollRef.current = 0;
        }
        setHtml(data.html || '');
        setPreviewError(false);
        setPreviewBusy(false);
      }).catch(() => {
        if (request === requestRef.current) {
          setPreviewError(true);
          setPreviewBusy(false);
        }
      });
    }, 350);
    return () => window.clearTimeout(handle);
  }, [page]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!dirty) {
      return undefined;
    }
    const warn = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const onKey = event => {
      if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 's') {
        event.preventDefault();
        actionsRef.current.save();
      }
      if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault();
        actionsRef.current.undo();
      }
      if ((event.ctrlKey || event.metaKey) && (String(event.key).toLowerCase() === 'y' || String(event.key).toLowerCase() === 'z' && event.shiftKey)) {
        event.preventDefault();
        actionsRef.current.redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!page || !dirty || saving) {
      return undefined;
    }
    const handle = window.setTimeout(() => {
      autosaveRef.current += 1;
      actionsRef.current.save();
    }, 4000);
    return () => window.clearTimeout(handle);
  }, [page, dirty, saving]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    document.body.classList.toggle('noksha-fullscreen', fullscreen);
    document.documentElement.classList.toggle('noksha-fullscreen', fullscreen);
    return () => {
      document.body.classList.remove('noksha-fullscreen');
      document.documentElement.classList.remove('noksha-fullscreen');
    };
  }, [fullscreen]);
  const selectedId = view.kind === 'section' ? view.id : '';
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    selectedRef.current = selectedId;
    markSelected(selectedId, view.from !== 'preview');
    placeToolbar(selectedId);
  }, [selectedId, html, device, fit.w, fit.h]);
  function frameDoc() {
    try {
      return frameRef.current ? frameRef.current.contentDocument : null;
    } catch (err) {
      return null;
    }
  }
  function markSelected(sectionId, scroll) {
    const doc = frameDoc();
    if (!doc) {
      return;
    }
    doc.querySelectorAll('.nk-ed-sel').forEach(node => node.classList.remove('nk-ed-sel'));
    if (!sectionId) {
      return;
    }
    const node = doc.querySelector('[data-nk-section="' + sectionId + '"]');
    if (!node) {
      return;
    }
    node.classList.add('nk-ed-sel');
    if (scroll) {
      // Scroll only the preview iframe — scrollIntoView would also scroll the whole WP admin page.
      const win = doc.defaultView;
      if (win) {
        win.scrollTo({
          top: Math.max(0, node.getBoundingClientRect().top + win.scrollY - 12),
          behavior: 'smooth'
        });
      }
    }
  }
  function applyPropPath(sectionId, path, value) {
    setPage(current => {
      if (!current) {
        return current;
      }
      pushHistory(current);
      return {
        ...current,
        sections: current.sections.map(section => {
          if (section.id !== sectionId) {
            return section;
          }
          return {
            ...section,
            props: setByPath(section.props || {}, path, value)
          };
        })
      };
    });
  }
  function placeToolbar(sectionId) {
    const doc = frameDoc();
    const frame = frameRef.current;
    if (!doc || !frame || !sectionId) {
      setToolbar(null);
      return;
    }
    const node = doc.querySelector('[data-nk-section="' + sectionId + '"]');
    if (!node) {
      setToolbar(null);
      return;
    }
    // Coordinates are relative to the .nk-device-fit wrapper; the toolbar sits outside the scaled frame.
    const scale = previewScale(device, fit);
    const deviceEl = deviceRef.current;
    const nodeRect = node.getBoundingClientRect();
    const originX = scale < 1 ? (fit.w - VIRTUAL_WIDTH[device] * scale) / 2 : deviceEl ? deviceEl.offsetLeft : 0;
    const originY = scale < 1 ? 0 : deviceEl ? deviceEl.offsetTop : 0;
    setToolbar({
      id: sectionId,
      top: Math.min(Math.max(8, originY + (frame.offsetTop + nodeRect.top) * scale + 8), Math.max(8, fit.h - 48)),
      left: Math.max(8, originX + (frame.offsetLeft + nodeRect.left) * scale + 8)
    });
  }
  function onFrameLoad() {
    const doc = frameDoc();
    if (!doc || !doc.head) {
      return;
    }
    const style = doc.createElement('style');
    style.textContent = PREVIEW_CSS;
    doc.head.appendChild(style);
    // Keep the floating toolbar glued to the selected section while the preview scrolls (incl. smooth scroll).
    let scrollFrame = 0;
    doc.addEventListener('scroll', () => {
      if (scrollFrame) {
        return;
      }
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        actionsRef.current.place();
      });
    }, {
      passive: true
    });
    doc.addEventListener('click', event => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (editable) {
        const sectionNode = editable.closest('[data-nk-section]');
        if (sectionNode) {
          actionsRef.current.pick(sectionNode.getAttribute('data-nk-section'));
        }
        return;
      }
      const node = event.target && event.target.closest ? event.target.closest('[data-nk-section]') : null;
      if (!node) {
        return;
      }
      event.preventDefault();
      actionsRef.current.pick(node.getAttribute('data-nk-section'));
    }, true);
    doc.addEventListener('focusin', event => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      editingRef.current = true;
      editable.setAttribute('contenteditable', 'true');
    }, true);
    doc.addEventListener('focusout', event => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      const sectionNode = editable.closest('[data-nk-section]');
      const sectionId = sectionNode ? sectionNode.getAttribute('data-nk-section') : '';
      const path = editable.getAttribute('data-nk-prop') || '';
      const value = (editable.textContent || '').trim();
      editable.removeAttribute('contenteditable');
      editingRef.current = false;
      if (sectionId && path) {
        applyPropPath(sectionId, path, value);
      }
    }, true);
    doc.addEventListener('keydown', event => {
      const editable = event.target && event.target.closest ? event.target.closest('[data-nk-prop]') : null;
      if (!editable) {
        return;
      }
      if (event.key === 'Enter' && editable.tagName !== 'P' && !editable.closest('.nk-lead')) {
        event.preventDefault();
        editable.blur();
      }
    }, true);
    doc.addEventListener('submit', event => event.preventDefault(), true);
    try {
      frameRef.current.contentWindow.scrollTo(0, scrollRef.current);
    } catch (err) {
      // The preview is same-origin; ignore if the browser blocks it.
    }
    markSelected(selectedRef.current, false);
    placeToolbar(selectedRef.current);
  }
  function pushHistory(snapshot) {
    if (skipHistoryRef.current || !snapshot) {
      return;
    }
    setHistory(current => current.concat(JSON.stringify(snapshot)).slice(-30));
    setRedoStack([]);
  }
  function patch(partial) {
    setPage(current => {
      pushHistory(current);
      return {
        ...current,
        ...partial
      };
    });
  }
  function setSections(next) {
    setPage(current => {
      pushHistory(current);
      return {
        ...current,
        sections: typeof next === 'function' ? next(current.sections) : next
      };
    });
  }
  function undo() {
    const currentPage = pageRef.current;
    if (!currentPage) {
      return;
    }
    setHistory(current => {
      if (current.length === 0) {
        return current;
      }
      const next = current.slice();
      const raw = next.pop();
      try {
        skipHistoryRef.current = true;
        setRedoStack(redo => redo.concat(JSON.stringify(currentPage)).slice(-30));
        setPage(JSON.parse(raw));
      } catch (err) {
        // Ignore bad history entries.
      }
      skipHistoryRef.current = false;
      return next;
    });
  }
  function redo() {
    setRedoStack(current => {
      if (current.length === 0 || !pageRef.current) {
        return current;
      }
      const next = current.slice();
      const raw = next.pop();
      try {
        skipHistoryRef.current = true;
        setHistory(hist => hist.concat(JSON.stringify(pageRef.current)).slice(-30));
        setPage(JSON.parse(raw));
      } catch (err) {
        // Ignore bad redo entries.
      }
      skipHistoryRef.current = false;
      return next;
    });
  }
  function openSettings(tab) {
    setSettingsTab(tab);
    setView({
      kind: 'settings'
    });
  }
  function patchSection(sectionId, props) {
    setSections(sections => sections.map(section => section.id === sectionId ? {
      ...section,
      props: {
        ...section.props,
        ...props
      }
    } : section));
  }
  function patchSectionStyle(sectionId, style) {
    setSections(sections => sections.map(section => section.id === sectionId ? {
      ...section,
      style: {
        ...(section.style || {}),
        ...style
      }
    } : section));
  }
  function reorder(from, to) {
    if (from === to || from < 0 || to < 0) {
      return;
    }
    setSections(sections => {
      if (from >= sections.length || to >= sections.length) {
        return sections;
      }
      const next = sections.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }
  function toggleHidden(sectionId) {
    setSections(sections => sections.map(item => item.id === sectionId ? {
      ...item,
      hidden: !item.hidden
    } : item));
  }
  async function removeSection(sectionId) {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('editor.removeConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    setSections(sections => sections.filter(item => item.id !== sectionId));
    setView({
      kind: 'home'
    });
  }
  function addSection(type) {
    const created = blankSection(type, t);
    const anchorId = selectedRef.current;
    setSections(sections => {
      const next = sections.slice();
      next.splice(insertIndex(sections, type, anchorId), 0, created);
      return next;
    });
    setView({
      kind: 'section',
      id: created.id
    });
    setAddOpen(false);
  }
  function save(nextStatus) {
    const current = pageRef.current;
    if (!current || saving) {
      return;
    }
    const target = nextStatus || current.status;
    const body = {
      ...current,
      status: target
    };
    setSaving(target === 'publish' && liveStatus !== 'publish' ? 'publish' : 'save');
    setError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('pages/' + current.id, {
      method: 'PUT',
      body
    }).then(data => {
      const latest = pageRef.current;
      if (JSON.stringify(latest) === JSON.stringify(current)) {
        setPage(data);
        setSaved(JSON.stringify(data));
      } else {
        const merged = {
          ...latest,
          status: data.status,
          link: data.link,
          slug: data.slug
        };
        setPage(merged);
        setSaved(JSON.stringify({
          ...current,
          status: data.status,
          link: data.link,
          slug: data.slug
        }));
      }
      setLiveStatus(data.status);
      setSaving('');
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2500);
    }).catch(err => {
      setError(err.message);
      setSaving('');
    });
  }
  async function leave(path) {
    if (dirty) {
      const ok = await confirm({
        title: t('common.confirm'),
        message: t('editor.leaveConfirm'),
        confirmLabel: t('common.confirm'),
        cancelLabel: t('common.cancel'),
        danger: true
      });
      if (!ok) {
        return;
      }
    }
    setSaved(JSON.stringify(pageRef.current));
    go(path);
  }
  async function removePage() {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('pages.deleteConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('pages/' + page.id, {
      method: 'DELETE'
    }).then(() => {
      setSaved(JSON.stringify(pageRef.current));
      go('pages');
    }).catch(err => setError(err.message));
  }
  actionsRef.current = {
    save: () => save(),
    undo,
    redo,
    pick: sectionId => setView({
      kind: 'section',
      id: sectionId,
      from: 'preview'
    }),
    place: () => placeToolbar(selectedRef.current)
  };
  const scale = previewScale(device, fit);
  const deviceClass = device === 'tablet' ? 'is-tablet' : device === 'desktop' ? 'is-desktop' : 'is-phone';
  const section = page && selectedId ? page.sections.find(item => item.id === selectedId) : null;
  let stateText = t('editor.allSaved');
  if (saving) stateText = t('editor.saving');else if (dirty) stateText = t('editor.unsaved');else if (justSaved) stateText = t('editor.saved');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_api__WEBPACK_IMPORTED_MODULE_1__.AsyncView, {
    status: status,
    error: error,
    t: t,
    onRetry: load,
    children: page ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: `nk-editor-shell nk-ed${fullscreen ? ' is-full' : ''}`,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_EditorTopBar__WEBPACK_IMPORTED_MODULE_4__.EditorTopBar, {
        t: t,
        page: page,
        liveStatus: liveStatus,
        dirty: dirty,
        saving: saving,
        stateText: stateText,
        canUndo: history.length > 0,
        canRedo: redoStack.length > 0,
        device: device,
        fullscreen: fullscreen,
        onLeave: leave,
        onTitleChange: title => patch({
          title
        }),
        onUndo: undo,
        onRedo: redo,
        onToggleFullscreen: () => setFullscreen(value => !value),
        onDevice: setDevice,
        onSave: save,
        onSaveDraft: () => save('draft'),
        onUnpublish: () => save('draft')
      }), error ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "nk-banner nk-ed-error",
        role: "alert",
        children: error
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-editor-cols nk-ed-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("aside", {
          className: "nk-editor-pane nk-ed-side",
          children: view.kind === 'home' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_EditorSectionList__WEBPACK_IMPORTED_MODULE_5__.EditorSectionList, {
            t: t,
            page: page,
            selectedId: selectedId,
            onOpen: sectionId => setView({
              kind: 'section',
              id: sectionId
            }),
            onToggle: toggleHidden,
            onReorder: reorder,
            onAdd: () => setAddOpen(true),
            onOpenSettings: () => openSettings(settingsTab)
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(EditorInspector, {
            t: t,
            view: view,
            section: section,
            page: page,
            settings: settings,
            settingsTab: settingsTab,
            onSettingsTab: setSettingsTab,
            onBack: () => setView({
              kind: 'home'
            }),
            onPatch: patch,
            onPatchSection: patchSection,
            onPatchStyle: patchSectionStyle,
            onOpenSettings: openSettings,
            onToggleHidden: toggleHidden,
            onRemoveSection: removeSection,
            onRemovePage: removePage,
            onLeave: leave
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("section", {
          className: "nk-editor-preview nk-ed-stage",
          "aria-label": t('editor.preview'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "nk-ed-stage-bar",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "nk-muted",
              children: t('editor.previewHint')
            }), previewBusy ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
              className: "nk-ed-busy",
              children: t('editor.previewUpdating')
            }) : null]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            ref: fitRef,
            className: `nk-device-fit${scale < 1 ? ' is-scaled' : ''}`,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              ref: deviceRef,
              className: `nk-editor-frame nk-device ${deviceClass}`,
              style: scale < 1 ? {
                width: VIRTUAL_WIDTH[device],
                maxWidth: 'none',
                height: fit.h / scale,
                transform: `translateX(-50%) scale(${scale})`
              } : undefined,
              children: [device === 'desktop' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                className: "nk-device-bar",
                "aria-hidden": "true",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                  children: page.link || window.location.origin + '/offer/' + page.slug + '/'
                })]
              }) : null, previewError ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: "nk-banner",
                children: t('editor.previewFailed')
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("iframe", {
                ref: frameRef,
                className: "nk-editor-iframe",
                title: t('editor.preview'),
                srcDoc: html,
                onLoad: onFrameLoad
              })]
            }), toolbar && section ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: "nk-canvas-bar",
              style: {
                top: toolbar.top,
                left: toolbar.left
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                type: "button",
                className: "nk-btn-ghost",
                onClick: () => {
                  const index = page.sections.findIndex(item => item.id === section.id);
                  reorder(index, index - 1);
                },
                children: t('editor.up')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                type: "button",
                className: "nk-btn-ghost",
                onClick: () => {
                  const index = page.sections.findIndex(item => item.id === section.id);
                  reorder(index, index + 1);
                },
                children: t('editor.down')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                type: "button",
                className: "nk-btn-ghost",
                onClick: () => toggleHidden(section.id),
                children: section.hidden ? t('editor.showSection') : t('editor.hideSection')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                type: "button",
                className: "nk-btn-ghost",
                onClick: () => setView({
                  kind: 'section',
                  id: section.id
                }),
                children: t('editor.section')
              })]
            }) : null]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        open: addOpen,
        onClose: () => setAddOpen(false),
        title: t('editor.addTitle'),
        size: "lg",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "nk-muted",
          children: section && section.type !== 'order_form' ? `${t('editor.addAfter')} ${t('section.' + section.type)}` : t('editor.addHelp')
        }), TYPE_GROUPS.map(group => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "nk-type-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
            className: "nk-type-group-title",
            children: t('editor.group.' + group.key)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "nk-type-grid",
            children: group.types.map(type => {
              const taken = SINGLE_TYPES.includes(type) && page.sections.some(item => item.type === type);
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
                type: "button",
                className: "nk-type",
                disabled: taken,
                onClick: () => addSection(type),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(SectionThumb, {
                  type: type
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
                  className: "nk-type-title",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                    className: "nk-type-icon",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
                      name: _editorShared__WEBPACK_IMPORTED_MODULE_6__.SECTION_ICONS[type],
                      size: 16
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
                    children: t('section.' + type)
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("small", {
                  children: taken ? t('editor.alreadyAdded') : t('sectionHelp.' + type)
                })]
              }, type);
            })
          })]
        }, group.key))]
      })]
    }) : null
  });
}
function EditorInspector({
  t,
  view,
  section,
  page,
  settings,
  settingsTab,
  onSettingsTab,
  onBack,
  onPatch,
  onPatchSection,
  onPatchStyle,
  onOpenSettings,
  onToggleHidden,
  onRemoveSection,
  onRemovePage,
  onLeave
}) {
  if (view.kind === 'section' && section) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-panel-view",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-panel-head",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
          type: "button",
          className: "nk-link-back",
          onClick: onBack,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
            name: "back",
            size: 16
          }), " ", t('editor.sections')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("h2", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
            className: "nk-head-icon",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
              name: _editorShared__WEBPACK_IMPORTED_MODULE_6__.SECTION_ICONS[section.type]
            })
          }), t('section.' + section.type)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "nk-muted",
          children: t('sectionHelp.' + section.type)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-panel-body",
        children: [section.hidden ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("p", {
          className: "nk-note",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
            name: "eyeOff",
            size: 16
          }), " ", t('editor.hiddenNote')]
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(SectionFields, {
          t: t,
          section: section,
          onChange: props => onPatchSection(section.id, props),
          onOpen: onOpenSettings
        }, section.id), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(StyleFields, {
          t: t,
          section: section,
          onChange: style => onPatchStyle(section.id, style)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "nk-panel-foot",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
            type: "button",
            className: "nk-btn-ghost nk-btn-icon",
            onClick: () => onToggleHidden(section.id),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
              name: section.hidden ? 'eye' : 'eyeOff',
              size: 16
            }), " ", section.hidden ? t('editor.showSection') : t('editor.hideSection')]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
            type: "button",
            className: "nk-btn-danger nk-btn-icon",
            onClick: () => onRemoveSection(section.id),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
              name: "trash",
              size: 16
            }), " ", t('editor.deleteSection')]
          })]
        })]
      })]
    });
  }
  if (view.kind === 'section' && !section) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-panel-view",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('editor.missingSection')
      })
    });
  }
  const settingsTabs = [{
    value: 'offer',
    label: t('editor.offerTitle'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('offer.helpIntro')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(OfferFields, {
        t: t,
        offer: page.offer,
        onChange: offer => onPatch({
          offer
        })
      })]
    })
  }, {
    value: 'checkout',
    label: t('editor.checkoutTitle'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CheckoutFields, {
      t: t,
      checkout: page.checkout,
      settings: settings,
      onChange: checkout => onPatch({
        checkout
      }),
      onSetup: () => onLeave('payments')
    })
  }, {
    value: 'seo',
    label: t('editor.seoTab'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PageSeoFields, {
      t: t,
      page: page,
      onChange: onPatch
    })
  }, {
    value: 'ab',
    label: t('ab.title'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PageAbFields, {
      t: t,
      page: page,
      onChange: onPatch
    })
  }, {
    value: 'colors',
    label: t('editor.colorsTitle'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('editor.colorsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ColorFields, {
        t: t,
        tokens: page.tokens,
        onChange: tokens => onPatch({
          tokens
        })
      })]
    })
  }, {
    value: 'page',
    label: t('editor.pageTitle'),
    content: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PageMetaFields, {
      t: t,
      page: page,
      onChange: onPatch,
      onDelete: onRemovePage
    })
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-panel-view nk-editor-inspector",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-panel-head",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
        type: "button",
        className: "nk-link-back",
        onClick: onBack,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "back",
          size: 16
        }), " ", t('editor.sections')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h2", {
        children: t('editor.pageSettings')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('editor.settingsHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Tabs, {
      tabs: settingsTabs,
      value: settingsTab,
      onChange: onSettingsTab
    })]
  });
}
function Field({
  label,
  help,
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("label", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "nk-ed-label",
        children: label
      }), children]
    }), help ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-help",
      children: help
    }) : null]
  });
}
function TextField({
  label,
  help,
  value,
  onChange,
  multiline,
  maxLength = 120,
  placeholder
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
    label: label,
    help: help,
    children: multiline ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("textarea", {
      rows: "3",
      value: value || '',
      maxLength: maxLength,
      placeholder: placeholder,
      onChange: event => onChange(event.target.value)
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
      type: "text",
      value: value || '',
      maxLength: maxLength,
      placeholder: placeholder,
      onChange: event => onChange(event.target.value)
    })
  });
}
function MoneyField({
  label,
  help,
  value,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
    label: label,
    help: help,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
      className: "nk-money",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        "aria-hidden": "true",
        children: "\u09F3"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
        type: "number",
        min: "0",
        step: "1",
        inputMode: "decimal",
        value: value,
        onChange: event => onChange(event.target.value === '' ? 0 : Math.max(0, Number(event.target.value)))
      })]
    })
  });
}
function ImageField({
  t,
  label,
  help,
  value,
  onChange
}) {
  const [paste, setPaste] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  function pick() {
    if (!chooseImage(onChange)) {
      setPaste(true);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-ed-label",
      children: label
    }), value ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-image",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
        src: value,
        alt: ""
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-image-tools",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "nk-btn-ghost",
          onClick: pick,
          children: t('image.change')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: "nk-btn-danger",
          onClick: () => onChange(''),
          children: t('image.remove')
        })]
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
      type: "button",
      className: "nk-image-empty",
      onClick: pick,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "image",
        size: 22
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        children: t('editor.chooseImage')
      })]
    }), paste ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
      type: "url",
      className: "nk-image-url",
      placeholder: "https://",
      value: value || '',
      onChange: event => onChange(event.target.value),
      "aria-label": t('image.paste')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
      type: "button",
      className: "nk-text-btn",
      onClick: () => setPaste(true),
      children: t('image.paste')
    }), help ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-help",
      children: help
    }) : null]
  });
}
function Switch({
  checked,
  onChange,
  disabled,
  label
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("label", {
    className: `nk-switch${disabled ? ' is-disabled' : ''}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
      type: "checkbox",
      role: "switch",
      checked: Boolean(checked),
      disabled: disabled,
      onChange: event => onChange(event.target.checked)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-switch-track",
      "aria-hidden": "true"
    }), label ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-switch-label",
      children: label
    }) : null]
  });
}
function Choice({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
    className: "nk-choice",
    role: "radiogroup",
    "aria-label": label,
    children: options.map(([key, text]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
      type: "button",
      role: "radio",
      "aria-checked": value === key,
      className: value === key ? 'is-active' : '',
      onClick: () => onChange(key),
      children: text
    }, key))
  });
}

/** Layout variants per section type (first = default). Mirrors Sanitizer::LAYOUTS. */
const STYLE_LAYOUTS = {
  hero: ['split', 'center', 'overlay'],
  benefits: ['cards', 'list', 'numbers'],
  reviews: ['slider', 'grid'],
  product: ['side', 'reverse', 'stacked'],
  gallery: ['slider', 'grid']
};
const STYLE_BACKGROUNDS = ['none', 'soft', 'warm', 'dark', 'brand', 'gradient'];
const STYLE_SPACINGS = ['compact', 'normal', 'roomy'];
const STYLE_SIZES = ['sm', 'md', 'lg', 'xl'];
const STYLE_SIZE_SCALE = {
  sm: 0.88,
  md: 1,
  lg: 1.15,
  xl: 1.3
};
const STYLE_RATIOS = ['auto', 'square', '4-3', '16-9', '3-4'];
const STYLE_FITS = ['cover', 'contain'];
const STYLE_ROUNDS = ['none', 'md', 'lg', 'full'];
const STYLE_IMAGE_TYPES = ['hero', 'product', 'gallery'];

/** Approximate heading size in px at phone and desktop widths, for the size hint. */
function headingRange(type, size) {
  const scale = STYLE_SIZE_SCALE[size] || 1;
  const [low, high] = type === 'hero' ? [28, 52] : [22, 32];
  return Math.round(low * scale) + '–' + Math.round(high * scale) + 'px';
}

/** Look & feel: layout variant, background band and spacing for one section. */
function StyleFields({
  t,
  section,
  onChange
}) {
  if (SINGLE_TYPES.includes(section.type)) {
    return null;
  }
  const style = section.style || {};
  const layouts = STYLE_LAYOUTS[section.type] || [];
  const layout = layouts.includes(style.layout) ? style.layout : layouts[0];
  const bg = STYLE_BACKGROUNDS.includes(style.bg) ? style.bg : 'none';
  const space = STYLE_SPACINGS.includes(style.space) ? style.space : 'normal';
  const size = STYLE_SIZES.includes(style.size) ? style.size : 'md';
  const ratio = STYLE_RATIOS.includes(style.ratio) ? style.ratio : 'auto';
  const fit = STYLE_FITS.includes(style.fit) ? style.fit : 'cover';
  const round = STYLE_ROUNDS.includes(style.round) ? style.round : 'md';
  const hasImage = STYLE_IMAGE_TYPES.includes(section.type);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-style-box",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
      className: "nk-group-title",
      children: t('look.title')
    }), layouts.length > 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('look.layout'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('look.layout'),
        value: layout,
        options: layouts.map(key => [key, t('look.layout.' + key)]),
        onChange: value => onChange({
          layout: value
        })
      })
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('look.background'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "nk-swatches",
        role: "radiogroup",
        "aria-label": t('look.background'),
        children: STYLE_BACKGROUNDS.map(key => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          role: "radio",
          "aria-checked": bg === key,
          title: t('look.bg.' + key),
          className: `nk-swatch nk-swatch-${key}${bg === key ? ' is-active' : ''}`,
          onClick: () => onChange({
            bg: key
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
            className: "nk-sr",
            children: t('look.bg.' + key)
          })
        }, key))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('look.spacing'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('look.spacing'),
        value: space,
        options: STYLE_SPACINGS.map(key => [key, t('look.space.' + key)]),
        onChange: value => onChange({
          space: value
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('look.textSize'),
      help: t('look.textSizeHint').replace('{range}', headingRange(section.type, size)),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('look.textSize'),
        value: size,
        options: STYLE_SIZES.map(key => [key, t('look.size.' + key)]),
        onChange: value => onChange({
          size: value
        })
      })
    }), hasImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        className: "nk-group-title",
        children: t('look.image')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
        label: t('look.ratio'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
          label: t('look.ratio'),
          value: ratio,
          options: STYLE_RATIOS.map(key => [key, t('look.ratio.' + key)]),
          onChange: value => onChange({
            ratio: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
        label: t('look.fit'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
          label: t('look.fit'),
          value: fit,
          options: STYLE_FITS.map(key => [key, t('look.fit.' + key)]),
          onChange: value => onChange({
            fit: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
        label: t('look.round'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
          label: t('look.round'),
          value: round,
          options: STYLE_ROUNDS.map(key => [key, t('look.round.' + key)]),
          onChange: value => onChange({
            round: value
          })
        })
      })]
    }) : null]
  });
}
function SectionFields({
  t,
  section,
  onChange,
  onOpen
}) {
  const props = section.props;
  const type = section.type;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [type === 'hero' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.eyebrow'),
        help: t('help.eyebrow'),
        value: props.eyebrow,
        onChange: eyebrow => onChange({
          eyebrow
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.title'),
        value: props.title,
        maxLength: 180,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.subtitle'),
        value: props.subtitle,
        multiline: true,
        maxLength: 800,
        onChange: subtitle => onChange({
          subtitle
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.button'),
        help: t('help.button'),
        value: props.buttonLabel,
        maxLength: 40,
        onChange: buttonLabel => onChange({
          buttonLabel
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ImageField, {
        t: t,
        label: t('prop.image'),
        value: props.imageUrl,
        onChange: imageUrl => onChange({
          imageUrl
        })
      })]
    }) : null, type === 'product' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.title'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.text'),
        value: props.text,
        multiline: true,
        maxLength: 800,
        onChange: text => onChange({
          text
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ImageField, {
        t: t,
        label: t('prop.image'),
        value: props.imageUrl,
        onChange: imageUrl => onChange({
          imageUrl
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(BulletsEditor, {
        t: t,
        bullets: props.bullets || [],
        onChange: bullets => onChange({
          bullets
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
        type: "button",
        className: "nk-jump",
        onClick: () => onOpen('offer'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "tag",
          size: 16
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          children: t('help.productPrice')
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "next",
          size: 16
        })]
      })]
    }) : null, type === 'countdown' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.title'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
        label: t('prop.endsAt'),
        help: t('help.endsAt'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
          type: "datetime-local",
          value: props.endsAt || '',
          onChange: event => onChange({
            endsAt: event.target.value
          })
        })
      })]
    }) : null, type === 'guarantee' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.title'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.text'),
        value: props.text,
        multiline: true,
        maxLength: 800,
        onChange: text => onChange({
          text
        })
      })]
    }) : null, type === 'order_form' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.title'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.button'),
        value: props.buttonLabel,
        maxLength: 40,
        onChange: buttonLabel => onChange({
          buttonLabel
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
        type: "button",
        className: "nk-jump",
        onClick: () => onOpen('checkout'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "card",
          size: 16
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          children: t('help.orderForm')
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "next",
          size: 16
        })]
      })]
    }) : null, type === 'gallery' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.sectionTitle'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(GalleryEditor, {
        t: t,
        images: props.images || [],
        onChange: images => onChange({
          images
        })
      })]
    }) : null, type === 'video' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.sectionTitle'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.videoUrl'),
        help: t('help.videoUrl'),
        value: props.url,
        maxLength: 300,
        onChange: url => onChange({
          url
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.caption'),
        value: props.caption,
        maxLength: 160,
        onChange: caption => onChange({
          caption
        })
      })]
    }) : null, type === 'compare' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.sectionTitle'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-two",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
          label: t('prop.usLabel'),
          value: props.usLabel,
          maxLength: 40,
          onChange: usLabel => onChange({
            usLabel
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
          label: t('prop.themLabel'),
          value: props.themLabel,
          maxLength: 40,
          onChange: themLabel => onChange({
            themLabel
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CompareEditor, {
        t: t,
        rows: props.rows || [],
        onChange: rows => onChange({
          rows
        })
      })]
    }) : null, type === 'whatsapp' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.waNumber'),
        help: t('help.waNumber'),
        value: props.number,
        maxLength: 20,
        onChange: number => onChange({
          number
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.waLabel'),
        value: props.label,
        maxLength: 40,
        onChange: label => onChange({
          label
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.waMessage'),
        help: t('help.waMessage'),
        value: props.message,
        multiline: true,
        maxLength: 200,
        onChange: message => onChange({
          message
        })
      })]
    }) : null, type === 'html' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('prop.html'),
      help: t('help.htmlSafe'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("textarea", {
        className: "nk-code",
        rows: "14",
        spellCheck: "false",
        dir: "ltr",
        value: props.html || '',
        maxLength: HTML_LIMIT,
        placeholder: '<div style="text-align:center">\n  <h2>…</h2>\n</div>',
        onChange: event => onChange({
          html: event.target.value
        })
      })
    }) : null, type === 'benefits' || type === 'reviews' || type === 'faq' || type === 'steps' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
        label: t('prop.sectionTitle'),
        value: props.title,
        onChange: title => onChange({
          title
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ItemsEditor, {
        t: t,
        type: type,
        items: props.items || [],
        onChange: items => onChange({
          items
        })
      })]
    }) : null]
  });
}
function GalleryEditor({
  t,
  images,
  onChange
}) {
  const limit = 8;
  function add() {
    if (!chooseImage(url => onChange(images.concat({
      url,
      alt: ''
    })))) {
      const url = window.prompt('https://');
      if (url) {
        onChange(images.concat({
          url,
          alt: ''
        }));
      }
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-ed-label",
      children: t('prop.photos')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-photo-grid",
      children: images.map((image, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-photo-cell",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
          src: image.url,
          alt: ""
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
          icon: "trash",
          danger: true,
          label: t('editor.remove'),
          onClick: () => onChange(images.filter((_, i) => i !== index))
        })]
      }, index))
    }), images.length < limit ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
      type: "button",
      className: "nk-add-row",
      onClick: add,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "plus",
        size: 16
      }), " ", t('prop.addPhoto')]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-help",
      children: t('items.limit').replace('{n}', String(limit))
    })]
  });
}
function CompareEditor({
  t,
  rows,
  onChange
}) {
  const limit = 8;
  function update(index, partial) {
    onChange(rows.map((row, i) => i === index ? {
      ...row,
      ...partial
    } : row));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-ed-label",
      children: t('prop.rows')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-items",
      children: rows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "nk-item is-open",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "nk-item-body",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
            label: t('prop.feature'),
            value: row.label,
            maxLength: 80,
            onChange: label => update(index, {
              label
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "nk-two",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
              label: t('prop.us'),
              value: row.us,
              maxLength: 30,
              onChange: us => update(index, {
                us
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
              label: t('prop.them'),
              value: row.them,
              maxLength: 30,
              onChange: them => update(index, {
                them
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            type: "button",
            className: "nk-text-btn",
            onClick: () => onChange(rows.filter((_, i) => i !== index)),
            children: t('editor.remove')
          })]
        })
      }, index))
    }), rows.length < limit ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
      type: "button",
      className: "nk-add-row",
      onClick: () => onChange(rows.concat({
        label: '',
        us: '✓',
        them: '✗'
      })),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "plus",
        size: 16
      }), " ", t('prop.addRow')]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-help",
      children: t('items.limit').replace('{n}', String(limit))
    })]
  });
}
function BulletsEditor({
  t,
  bullets,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-ed-label",
      children: t('prop.bullets')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-bullets",
      children: bullets.map((bullet, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-bullet",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
          type: "text",
          value: bullet,
          maxLength: 160,
          "aria-label": t('prop.bullets') + ' ' + (index + 1),
          onChange: event => onChange(bullets.map((row, i) => i === index ? event.target.value : row))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
          icon: "trash",
          danger: true,
          label: t('editor.remove'),
          onClick: () => onChange(bullets.filter((_, i) => i !== index))
        })]
      }, index))
    }), bullets.length < BULLET_LIMIT ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
      type: "button",
      className: "nk-add-row",
      onClick: () => onChange(bullets.concat('')),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "plus",
        size: 16
      }), " ", t('prop.addBullet')]
    }) : null]
  });
}
function Stars({
  t,
  value,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
    className: "nk-stars",
    role: "radiogroup",
    "aria-label": t('prop.rating'),
    children: [1, 2, 3, 4, 5].map(star => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
      type: "button",
      role: "radio",
      "aria-checked": value === star,
      "aria-label": String(star),
      className: star <= value ? 'is-on' : '',
      onClick: () => onChange(star),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "star",
        size: 20
      })
    }, star))
  });
}
function ItemsEditor({
  t,
  type,
  items,
  onChange
}) {
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(items.length === 1 ? 0 : -1);
  const limit = ITEM_LIMITS[type] || 6;
  const shape = type === 'reviews' ? {
    name: '',
    text: '',
    rating: 5
  } : type === 'faq' ? {
    q: '',
    a: ''
  } : {
    title: '',
    text: ''
  };
  function update(index, partial) {
    onChange(items.map((row, i) => i === index ? {
      ...row,
      ...partial
    } : row));
  }
  function move(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    const copy = items.slice();
    const [row] = copy.splice(index, 1);
    copy.splice(next, 0, row);
    onChange(copy);
    setOpen(next);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-ed-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "nk-ed-label",
      children: t('items.title.' + type)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-items",
      children: items.map((item, index) => {
        const isOpen = open === index;
        const label = item.title || item.name || item.q || t('editor.untitled');
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: `nk-item${isOpen ? ' is-open' : ''}`,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "nk-item-head",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
              type: "button",
              className: "nk-item-toggle",
              "aria-expanded": isOpen,
              onClick: () => setOpen(isOpen ? -1 : index),
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                className: "nk-item-num",
                children: index + 1
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                className: "nk-item-label",
                children: label
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
                name: isOpen ? 'up' : 'down',
                size: 16
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
              icon: "up",
              label: t('editor.up'),
              disabled: index === 0,
              onClick: () => move(index, -1)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
              icon: "down",
              label: t('editor.down'),
              disabled: index === items.length - 1,
              onClick: () => move(index, 1)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
              icon: "trash",
              danger: true,
              label: t('editor.remove'),
              onClick: () => {
                onChange(items.filter((_, i) => i !== index));
                setOpen(-1);
              }
            })]
          }), isOpen ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "nk-item-body",
            children: [type === 'benefits' || type === 'steps' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.itemTitle'),
                value: item.title,
                onChange: title => update(index, {
                  title
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.itemText'),
                value: item.text,
                multiline: true,
                maxLength: 800,
                onChange: text => update(index, {
                  text
                })
              })]
            }) : null, type === 'reviews' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.name'),
                value: item.name,
                onChange: name => update(index, {
                  name
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.review'),
                value: item.text,
                multiline: true,
                maxLength: 800,
                onChange: text => update(index, {
                  text
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                className: "nk-ed-field",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                  className: "nk-ed-label",
                  children: t('prop.rating')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Stars, {
                  t: t,
                  value: Number(item.rating) || 5,
                  onChange: rating => update(index, {
                    rating
                  })
                })]
              })]
            }) : null, type === 'faq' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.question'),
                value: item.q,
                onChange: q => update(index, {
                  q
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
                label: t('prop.answer'),
                value: item.a,
                multiline: true,
                maxLength: 800,
                onChange: a => update(index, {
                  a
                })
              })]
            }) : null]
          }) : null]
        }, index);
      })
    }), items.length < limit ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
      type: "button",
      className: "nk-add-row",
      onClick: () => {
        onChange(items.concat({
          ...shape
        }));
        setOpen(items.length);
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
        name: "plus",
        size: 16
      }), " ", t('items.add.' + type)]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-help",
      children: t('items.limit').replace('{n}', String(limit))
    })]
  });
}
function OfferFields({
  t,
  offer,
  onChange
}) {
  const price = Number(offer.price) || 0;
  const compare = Number(offer.compareAt) || 0;
  const inside = Number(offer.shippingInside != null ? offer.shippingInside : offer.shipping) || 0;
  const outside = Number(offer.shippingOutside != null ? offer.shippingOutside : offer.shipping) || 0;
  const off = compare > price && price > 0 ? Math.round((1 - price / compare) * 100) : 0;
  function setShipping(partial) {
    const nextInside = partial.shippingInside != null ? partial.shippingInside : inside;
    const nextOutside = partial.shippingOutside != null ? partial.shippingOutside : outside;
    onChange({
      ...offer,
      ...partial,
      shippingInside: nextInside,
      shippingOutside: nextOutside,
      shippingDefault: nextOutside,
      shipping: nextOutside,
      shippingZones: [{
        id: 'inside_dhaka',
        label: 'Inside Dhaka',
        price: nextInside,
        districtIds: ['47'],
        upazilaIds: []
      }, {
        id: 'outside_dhaka',
        label: 'Outside Dhaka',
        price: nextOutside,
        districtIds: [],
        upazilaIds: []
      }]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
      label: t('offer.productName'),
      value: offer.productName,
      maxLength: 180,
      onChange: productName => onChange({
        ...offer,
        productName
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-two",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(MoneyField, {
        label: t('offer.price'),
        value: offer.price,
        onChange: value => onChange({
          ...offer,
          price: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(MoneyField, {
        label: t('offer.compareAt'),
        help: t('offer.compareHelp'),
        value: offer.compareAt,
        onChange: value => onChange({
          ...offer,
          compareAt: value
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-two",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(MoneyField, {
        label: t('offer.shippingInside'),
        help: t('offer.shippingInsideHelp'),
        value: inside,
        onChange: value => setShipping({
          shippingInside: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(MoneyField, {
        label: t('offer.shippingOutside'),
        help: t('offer.shippingOutsideHelp'),
        value: outside,
        onChange: value => setShipping({
          shippingOutside: value
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-total",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "nk-muted",
          children: t('offer.customerPays')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("strong", {
          children: [(0,_api__WEBPACK_IMPORTED_MODULE_1__.money)(price + inside), " / ", (0,_api__WEBPACK_IMPORTED_MODULE_1__.money)(price + outside)]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("small", {
        children: [t('offer.shippingZones').replace('{inside}', (0,_api__WEBPACK_IMPORTED_MODULE_1__.money)(inside)).replace('{outside}', (0,_api__WEBPACK_IMPORTED_MODULE_1__.money)(outside)), off > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("em", {
          className: "nk-tag is-ok",
          children: t('offer.off').replace('{n}', String(off))
        }) : null]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ImageField, {
      t: t,
      label: t('offer.image'),
      value: offer.imageUrl,
      onChange: imageUrl => onChange({
        ...offer,
        imageUrl
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-ed-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        className: "nk-group-title",
        children: t('offer.bumpTitle')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('offer.bumpHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
        checked: Boolean(offer.bump?.enabled),
        label: t('offer.bumpEnable'),
        onChange: enabled => onChange({
          ...offer,
          bump: {
            ...(offer.bump || {}),
            enabled
          }
        })
      }), offer.bump?.enabled ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
          label: t('offer.bumpName'),
          value: offer.bump?.name || '',
          maxLength: 120,
          onChange: name => onChange({
            ...offer,
            bump: {
              ...(offer.bump || {}),
              name
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(MoneyField, {
          label: t('offer.bumpPrice'),
          value: offer.bump?.price || 0,
          onChange: value => onChange({
            ...offer,
            bump: {
              ...(offer.bump || {}),
              price: value
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
          checked: Boolean(offer.bump?.checkedDefault),
          label: t('offer.bumpDefault'),
          onChange: checkedDefault => onChange({
            ...offer,
            bump: {
              ...(offer.bump || {}),
              checkedDefault
            }
          })
        })]
      }) : null]
    })]
  });
}
function CheckoutFields({
  t,
  checkout,
  settings,
  onChange,
  onSetup
}) {
  function setField(key, partial) {
    const field = checkout.fields[key];
    const next = {
      ...field,
      ...partial
    };
    if (!next.enabled) next.required = false;
    onChange({
      ...checkout,
      fields: {
        ...checkout.fields,
        [key]: next
      }
    });
  }
  function togglePayment(method, on) {
    const payments = on ? checkout.payments.concat(method) : checkout.payments.filter(item => item !== method);
    onChange({
      ...checkout,
      payments: payments.length ? payments : ['cod']
    });
  }
  function movePayment(method, direction) {
    const index = checkout.payments.indexOf(method);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= checkout.payments.length) return;
    const payments = checkout.payments.slice();
    const [item] = payments.splice(index, 1);
    payments.splice(next, 0, item);
    onChange({
      ...checkout,
      payments
    });
  }
  const ordered = checkout.payments.concat(METHODS.filter(method => !checkout.payments.includes(method)));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: t('checkout.fields')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('checkout.fieldsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-rows",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "nk-row nk-row-head",
          "aria-hidden": "true",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
            children: t('checkout.show')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
            children: t('checkout.required')
          })]
        }), FIELD_KEYS.map(key => {
          const field = checkout.fields[key];
          const locked = key === 'name' || key === 'phone';
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "nk-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
              className: "nk-row-name",
              children: [t('field.' + key), locked ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("small", {
                children: t('checkout.always')
              }) : null]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
              checked: field.enabled,
              disabled: locked,
              onChange: enabled => setField(key, {
                enabled
              }),
              label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
                className: "nk-sr",
                children: [t('checkout.show'), " ", t('field.' + key)]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
              checked: field.required,
              disabled: locked || !field.enabled,
              onChange: required => setField(key, {
                required
              }),
              label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
                className: "nk-sr",
                children: [t('checkout.required'), " ", t('field.' + key)]
              })
            })]
          }, key);
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: t('checkout.payments')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('checkout.paymentsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "nk-pay-list",
        children: ordered.map(method => {
          const on = checkout.payments.includes(method);
          const index = checkout.payments.indexOf(method);
          const issue = on ? gatewayIssue(method, settings) : '';
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: `nk-pay-row${on ? ' is-on' : ''}`,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
              checked: on,
              onChange: value => togglePayment(method, value),
              label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
                children: t('pay.' + method)
              })
            }), on && index === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("em", {
              className: "nk-tag",
              children: t('checkout.default')
            }) : null, on ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
              className: "nk-pay-tools",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                icon: "up",
                label: t('editor.up'),
                disabled: index === 0,
                onClick: () => movePayment(method, -1)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
                icon: "down",
                label: t('editor.down'),
                disabled: index === checkout.payments.length - 1,
                onClick: () => movePayment(method, 1)
              })]
            }) : null, issue ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("p", {
              className: "nk-pay-issue",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
                name: "alert",
                size: 14
              }), " ", t('checkout.notReady'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
                type: "button",
                className: "nk-text-btn",
                onClick: onSetup,
                children: t('checkout.setup')
              })]
            }) : null]
          }, method);
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: t('checkout.summary')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('checkout.summary'),
        value: checkout.summaryPosition,
        onChange: summaryPosition => onChange({
          ...checkout,
          summaryPosition
        }),
        options: [['left', t('checkout.left')], ['right', t('checkout.right')], ['bottom', t('checkout.bottom')]]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-group",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: t('checkout.trust')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('checkout.trustHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "nk-chips",
        children: ['secure', 'cod', 'delivery'].map(badge => {
          const on = checkout.trustBadges.includes(badge);
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            type: "button",
            "aria-pressed": on,
            className: `nk-chip-toggle${on ? ' is-on' : ''}`,
            onClick: () => onChange({
              ...checkout,
              trustBadges: on ? checkout.trustBadges.filter(item => item !== badge) : checkout.trustBadges.concat(badge)
            }),
            children: t('trust.' + badge)
          }, badge);
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
      label: t('checkout.note'),
      help: t('checkout.noteHelp'),
      value: checkout.deliveryNote,
      multiline: true,
      maxLength: 300,
      onChange: deliveryNote => onChange({
        ...checkout,
        deliveryNote
      })
    })]
  });
}
function PageMetaFields({
  t,
  page,
  onChange,
  onDelete
}) {
  const suffix = page.slug + '/';
  const base = page.link && page.link.endsWith(suffix) ? page.link.slice(0, page.link.length - suffix.length) : window.location.origin + '/offer/';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
      label: t('editor.slug'),
      help: t('editor.slugHelp'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
        className: "nk-slug",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "nk-slug-base",
          children: base.replace(/^https?:\/\//, '')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
          type: "text",
          value: page.slug,
          onChange: event => onChange({
            slug: event.target.value.replace(/\s+/g, '-').toLowerCase()
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-ed-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "nk-ed-label",
        children: t('editor.language')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('editor.language'),
        value: page.language,
        onChange: language => onChange({
          language
        }),
        options: [['bn', t('settings.bangla')], ['en', t('settings.english')]]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('editor.languageHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-ed-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "nk-ed-label",
        children: t('editor.motion')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('editor.motion'),
        value: page.motion === 'lively' ? 'lively' : 'simple',
        onChange: motion => onChange({
          motion
        }),
        options: [['simple', t('editor.motion.simple')], ['lively', t('editor.motion.lively')]]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('editor.motionHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-ed-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "nk-ed-label",
        children: t('editor.status')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Choice, {
        label: t('editor.status'),
        value: page.status,
        onChange: value => onChange({
          status: value
        }),
        options: [['draft', t('pages.draft')], ['publish', t('pages.published')]]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('editor.statusHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "nk-danger",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: t('editor.danger')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-help",
        children: t('editor.dangerHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
        type: "button",
        className: "nk-btn-danger nk-btn-icon",
        onClick: onDelete,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_6__.Icon, {
          name: "trash",
          size: 16
        }), " ", t('pages.delete')]
      })]
    })]
  });
}
function PageSeoFields({
  t,
  page,
  onChange
}) {
  const seo = page.seo || {
    title: '',
    description: '',
    imageUrl: ''
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
      label: t('seo.title'),
      help: t('seo.titleHelp'),
      value: seo.title,
      maxLength: 70,
      onChange: title => onChange({
        seo: {
          ...seo,
          title
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextField, {
      label: t('seo.description'),
      help: t('seo.descriptionHelp'),
      value: seo.description,
      multiline: true,
      maxLength: 200,
      onChange: description => onChange({
        seo: {
          ...seo,
          description
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ImageField, {
      t: t,
      label: t('seo.image'),
      value: seo.imageUrl,
      onChange: imageUrl => onChange({
        seo: {
          ...seo,
          imageUrl
        }
      })
    })]
  });
}
function PageAbFields({
  t,
  page,
  onChange
}) {
  const ab = page.ab || {
    enabled: false,
    split: 50,
    sections: []
  };
  function setAb(partial) {
    onChange({
      ab: {
        ...ab,
        ...partial
      }
    });
  }
  function copyVariantB() {
    const clone = (page.sections || []).filter(section => section.type !== 'order_form').map(section => ({
      ...section,
      id: 'ab_' + Math.random().toString(36).slice(2, 10),
      props: {
        ...(section.props || {})
      }
    }));
    setAb({
      enabled: true,
      sections: clone
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "nk-muted",
      children: t('ab.help')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
      checked: Boolean(ab.enabled),
      label: t('ab.enable'),
      onChange: enabled => setAb({
        enabled
      })
    }), ab.enabled ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Field, {
        label: t('ab.split'),
        help: t('ab.splitHelp'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
          type: "number",
          min: "10",
          max: "90",
          value: ab.split || 50,
          onChange: event => setAb({
            split: Number(event.target.value) || 50
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "nk-muted",
        children: t('ab.sections').replace('{n}', String((ab.sections || []).length))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        type: "button",
        className: "nk-btn-ghost",
        onClick: copyVariantB,
        children: t('ab.copy')
      })]
    }) : null]
  });
}
function ColorFields({
  t,
  tokens,
  onChange
}) {
  const brand = window.nokshaBoot && window.nokshaBoot.tokens && window.nokshaBoot.tokens.color || {};
  const on = Boolean(tokens && tokens.enabled);
  const colors = on ? tokens.color || {} : brand;
  function setColor(key, value) {
    onChange({
      enabled: true,
      color: {
        ...colors,
        [key]: value.toUpperCase()
      }
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "nk-form-stack",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Switch, {
      checked: on,
      label: t('editor.customColors'),
      onChange: value => onChange(value ? {
        enabled: true,
        color: {
          ...brand,
          ...(tokens && tokens.color || {})
        }
      } : null)
    }), on ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
      children: [COLOR_GROUPS.map(([groupKey, keys]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "nk-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
          children: t(groupKey)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "nk-colors",
          children: keys.map(key => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("label", {
            className: "nk-color-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
              type: "color",
              value: colors[key] || '#000000',
              onChange: event => setColor(key, event.target.value)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
                children: t('brand.' + key)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("small", {
                children: colors[key]
              })]
            })]
          }, key))
        })]
      }, groupKey)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        type: "button",
        className: "nk-btn-ghost",
        onClick: () => onChange({
          enabled: true,
          color: {
            ...brand
          }
        }),
        children: t('editor.resetColors')
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "nk-swatches",
      "aria-hidden": "true",
      children: ['brand', 'accent', 'canvas', 'text'].map(key => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("i", {
        style: {
          background: brand[key]
        }
      }, key))
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/EditorSectionList.js"
/*!************************************************!*\
  !*** ./admin-src/screens/EditorSectionList.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditorSectionList: () => (/* binding */ EditorSectionList)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _editorShared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editorShared */ "./admin-src/screens/editorShared.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function EditorSectionList({
  t,
  page,
  selectedId,
  onOpen,
  onToggle,
  onReorder,
  onAdd,
  onOpenSettings
}) {
  const dragRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(-1);
  const [over, setOver] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(-1);
  const sections = page.sections;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "nk-panel-view nk-editor-sections",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "nk-panel-head",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
        children: t('editor.sections')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "nk-muted",
        children: t('editor.contentHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "nk-panel-body",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
        type: "button",
        className: "nk-settings-entry",
        onClick: onOpenSettings,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "nk-block-icon",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.Icon, {
            name: "tag"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
          className: "nk-block-text",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: t('editor.pageSettings')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("small", {
            children: t('editor.settingsEntryHint')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.Icon, {
          name: "chevron",
          size: 16
        })]
      }), sections.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        className: "nk-muted",
        children: t('editor.emptyContent')
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("ol", {
        className: "nk-blocks",
        children: sections.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("li", {
          className: `nk-block nk-section-row${item.hidden ? ' is-hidden' : ''}${over === index ? ' is-over' : ''}${selectedId === item.id ? ' is-active' : ''}`,
          draggable: true,
          onDragStart: event => {
            dragRef.current = index;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', String(index));
          },
          onDragOver: event => {
            event.preventDefault();
            if (over !== index) setOver(index);
          },
          onDragLeave: () => setOver(-1),
          onDrop: event => {
            event.preventDefault();
            onReorder(dragRef.current, index);
            dragRef.current = -1;
            setOver(-1);
          },
          onDragEnd: () => {
            dragRef.current = -1;
            setOver(-1);
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "nk-grip",
            title: t('editor.dragHint'),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.Icon, {
              name: "grip",
              size: 16
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
            type: "button",
            className: "nk-block-main",
            onClick: () => onOpen(item.id),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
              className: "nk-block-icon",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.Icon, {
                name: _editorShared__WEBPACK_IMPORTED_MODULE_2__.SECTION_ICONS[item.type]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
              className: "nk-block-text",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("strong", {
                children: [t('section.' + item.type), item.hidden ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("em", {
                  className: "nk-tag",
                  children: t('editor.hiddenTag')
                }) : null]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("small", {
                children: (0,_editorShared__WEBPACK_IMPORTED_MODULE_2__.summaryOf)(item, t)
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
            className: "nk-block-tools",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
              icon: "up",
              label: t('editor.up'),
              disabled: index === 0,
              onClick: () => onReorder(index, index - 1)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
              icon: "down",
              label: t('editor.down'),
              disabled: index === sections.length - 1,
              onClick: () => onReorder(index, index + 1)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_editorShared__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
              icon: item.hidden ? 'eyeOff' : 'eye',
              label: item.hidden ? t('editor.showSection') : t('editor.hideSection'),
              onClick: () => onToggle(item.id)
            })]
          })]
        }, item.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "secondary",
        size: "sm",
        className: "nk-add-block",
        onClick: onAdd,
        children: t('editor.add')
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/EditorTopBar.js"
/*!*******************************************!*\
  !*** ./admin-src/screens/EditorTopBar.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditorTopBar: () => (/* binding */ EditorTopBar)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function Icon({
  size = 18,
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
    className: "nk-icon",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    children: children
  });
}
const BAR_ICONS = {
  phone: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
      x: "5",
      y: "2",
      width: "14",
      height: "20",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
      x1: "12",
      y1: "18",
      x2: "12.01",
      y2: "18"
    })]
  }),
  tablet: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
      x: "4",
      y: "3",
      width: "16",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
      x1: "12",
      y1: "18",
      x2: "12",
      y2: "18.01"
    })]
  }),
  desktop: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("rect", {
      x: "2",
      y: "3",
      width: "20",
      height: "14",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
      x1: "8",
      y1: "21",
      x2: "16",
      y2: "21"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
      x1: "12",
      y1: "17",
      x2: "12",
      y2: "21"
    })]
  }),
  external: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
      points: "15 3 21 3 21 9"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
      x1: "10",
      y1: "14",
      x2: "21",
      y2: "3"
    })]
  }),
  chevron: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
    points: "6 9 12 15 18 9"
  })
};
function EditorTopBar({
  t,
  page,
  liveStatus,
  dirty,
  saving,
  stateText,
  canUndo,
  canRedo,
  device,
  fullscreen,
  onLeave,
  onTitleChange,
  onUndo,
  onRedo,
  onToggleFullscreen,
  onDevice,
  onSave,
  onSaveDraft,
  onUnpublish
}) {
  const [menuOpen, setMenuOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const menuRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!menuOpen) {
      return undefined;
    }
    function onDocClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);
  const slugPath = '/offer/' + (page?.slug || '') + '/';
  const publishLabel = liveStatus === 'publish' ? saving ? t('editor.saving') : t('editor.update') : saving === 'publish' ? t('editor.saving') : t('editor.publish');
  function runPublish() {
    setMenuOpen(false);
    if (liveStatus === 'publish') {
      onSave();
    } else {
      onSave('publish');
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("header", {
    className: "nk-editor-top nk-ed-top",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
      type: "button",
      className: "nk-ed-back",
      onClick: () => onLeave('pages'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Icon, {
        size: 16,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
          points: "15 18 9 12 15 6"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        children: t('editor.back')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "nk-ed-name nk-editor-title-block",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
        className: "nk-editor-title-input",
        "aria-label": t('editor.title'),
        value: page.title,
        placeholder: t('editor.title'),
        onChange: event => onTitleChange(event.target.value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        className: "nk-editor-slug nk-muted",
        title: t('editor.slug'),
        children: slugPath
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
      variant: dirty ? 'danger' : 'brand',
      className: `nk-editor-save-badge${dirty ? ' is-dirty' : ''}`,
      children: stateText
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "nk-ed-actions nk-editor-top-actions",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "ghost",
        size: "sm",
        disabled: !canUndo,
        title: t('editor.undo'),
        onClick: onUndo,
        children: t('editor.undo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "ghost",
        size: "sm",
        disabled: !canRedo,
        title: t('editor.redo'),
        onClick: onRedo,
        children: t('editor.redo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "ghost",
        size: "sm",
        title: t('editor.fullscreen'),
        "aria-pressed": fullscreen,
        onClick: onToggleFullscreen,
        children: fullscreen ? t('editor.exitFull') : t('editor.fullscreen')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "nk-seg nk-ed-device nk-phone-actions",
        role: "group",
        "aria-label": t('editor.device'),
        children: [['phone', 'mobile', 'phone'], ['tablet', 'tablet', 'tablet'], ['desktop', 'desktop', 'desktop']].map(([key, labelKey, iconKey]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
          type: "button",
          className: device === key ? 'is-active' : '',
          "aria-pressed": device === key,
          title: t('editor.' + labelKey),
          onClick: () => onDevice(key),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Icon, {
            size: 16,
            children: BAR_ICONS[iconKey]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            children: t('editor.' + labelKey)
          })]
        }, key))
      }), page.link && liveStatus === 'publish' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("a", {
        className: "nk-btn-ghost nk-btn-icon",
        href: page.link,
        target: "_blank",
        rel: "noreferrer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Icon, {
          size: 16,
          children: BAR_ICONS.external
        }), t('editor.viewLive')]
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "nk-editor-publish-split",
        ref: menuRef,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "primary",
          size: "sm",
          loading: Boolean(saving),
          disabled: Boolean(saving) || liveStatus === 'publish' && !dirty,
          title: t('editor.shortcut'),
          onClick: runPublish,
          children: publishLabel
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          className: "nk-editor-publish-menu-btn",
          "aria-expanded": menuOpen,
          "aria-haspopup": "true",
          title: t('editor.publishMenu'),
          disabled: Boolean(saving),
          onClick: () => setMenuOpen(open => !open),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Icon, {
            size: 16,
            children: BAR_ICONS.chevron
          })
        }), menuOpen ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "nk-editor-publish-menu",
          role: "menu",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            role: "menuitem",
            onClick: () => {
              setMenuOpen(false);
              onSaveDraft();
            },
            children: t('editor.saveDraft')
          }), liveStatus === 'publish' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            type: "button",
            role: "menuitem",
            onClick: () => {
              setMenuOpen(false);
              onUnpublish();
            },
            children: t('editor.unpublish')
          }) : null]
        }) : null]
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Home.js"
/*!***********************************!*\
  !*** ./admin-src/screens/Home.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Home: () => (/* binding */ Home)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _styles_screens_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/screens.css */ "./admin-src/styles/screens.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const CHECKLIST_STEPS = [{
  key: 'payments',
  titleKey: 'onboarding.payments',
  helpKey: 'onboarding.paymentsHelp',
  actionKey: 'onboarding.openPayments',
  route: 'payments',
  mark: 'payments'
}, {
  key: 'test_order',
  titleKey: 'onboarding.testOrder',
  helpKey: 'onboarding.testOrderHelp',
  actionKey: 'onboarding.openPages',
  route: 'pages'
}, {
  key: 'pixels',
  titleKey: 'onboarding.pixels',
  helpKey: 'onboarding.pixelsHelp',
  actionKey: 'onboarding.openSettings',
  route: 'settings',
  mark: 'pixels'
}, {
  key: 'courier',
  titleKey: 'onboarding.courier',
  helpKey: 'onboarding.courierHelp',
  actionKey: 'onboarding.openCouriers',
  route: 'payments'
}];
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
  rows.forEach(row => {
    const placed = Number(row.placed) || 0;
    if (placed < 1) return;
    weighted += (Number(row.returnRate) || 0) * placed;
    total += placed;
  });
  return total > 0 ? weighted / total : 0;
}
function ComboChart({
  series,
  avgOrderValue,
  t
}) {
  if (!series?.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "nk-muted",
      children: t('home.emptyChart')
    });
  }
  const width = 640;
  const height = 220;
  const pad = {
    top: 16,
    right: 16,
    bottom: 32,
    left: 48
  };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const points = series.map(day => ({
    ...day,
    orders: day.orders != null ? Number(day.orders) : avgOrderValue > 0 ? Math.round((Number(day.revenue) || 0) / avgOrderValue) : 0,
    revenue: Number(day.revenue) || 0
  }));
  const maxOrders = Math.max(1, ...points.map(p => p.orders));
  const maxRevenue = Math.max(1, ...points.map(p => p.revenue));
  const barW = innerW / Math.max(points.length, 1);
  const linePts = points.map((p, i) => {
    const x = pad.left + i * barW + barW / 2;
    const y = pad.top + innerH - p.revenue / maxRevenue * innerH;
    return `${x},${y}`;
  }).join(' ');
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("svg", {
    className: "nk-chart",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": t('home.chart'),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("line", {
      x1: pad.left,
      y1: pad.top + innerH,
      x2: pad.left + innerW,
      y2: pad.top + innerH,
      stroke: "var(--nk-border)",
      strokeWidth: "1"
    }), points.map((p, i) => {
      const h = p.orders / maxOrders * innerH;
      const x = pad.left + i * barW + barW * 0.15;
      const y = pad.top + innerH - h;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("rect", {
        x: x,
        y: y,
        width: barW * 0.7,
        height: Math.max(2, h),
        rx: "3",
        fill: "var(--nk-brand-subtle)",
        opacity: "0.9"
      }, p.date);
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("polyline", {
      fill: "none",
      stroke: "var(--nk-brand)",
      strokeWidth: "2.5",
      strokeLinejoin: "round",
      strokeLinecap: "round",
      points: linePts
    }), points.map((p, i) => {
      const x = pad.left + i * barW + barW / 2;
      const y = pad.top + innerH - p.revenue / maxRevenue * innerH;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("circle", {
        cx: x,
        cy: y,
        r: "3.5",
        fill: "var(--nk-brand)"
      }, `dot-${p.date}`);
    }), points.map((p, i) => {
      if (i % labelEvery !== 0 && i !== points.length - 1) {
        return null;
      }
      const x = pad.left + i * barW + barW / 2;
      const label = String(p.date || '').slice(5);
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("text", {
        x: x,
        y: height - 8,
        textAnchor: "middle",
        fill: "var(--nk-text-muted)",
        fontSize: "10",
        children: label
      }, `label-${p.date}`);
    })]
  });
}
function Home({
  t,
  go,
  locale
}) {
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [data, setData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [onboarding, setOnboarding] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [shippingAvailable, setShippingAvailable] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [shell, setShell] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    needsCall: 0,
    leadsToday: 0
  });
  const [range, setRange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    preset: '7d'
  });
  const userName = window.nokshaBoot && window.nokshaBoot.user || 'there';
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setStatus('loading');
    const days = rangeDaysFromPicker(range);
    Promise.all([(0,_api__WEBPACK_IMPORTED_MODULE_2__.api)(`analytics?range=${days}`), (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('onboarding').catch(() => null), (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('settings').catch(() => null), (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('shell').catch(() => ({
      needsCall: 0,
      leadsToday: 0
    }))]).then(([report, board, settings, shellData]) => {
      setData(report);
      setOnboarding(board);
      setShippingAvailable((settings?.shipping?.available || []).length > 0);
      setShell({
        needsCall: Number(shellData?.needsCall) || 0,
        leadsToday: Number(shellData?.leadsToday) || 0
      });
      setStatus('ready');
    }).catch(err => {
      setError(err.message);
      setStatus('error');
    });
  }, [range]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);
  const courierDone = Boolean(onboarding?.courier) || shippingAvailable;
  const checklistState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!onboarding) return [];
    return CHECKLIST_STEPS.map(step => ({
      ...step,
      done: step.key === 'courier' ? courierDone : Boolean(onboarding[step.key])
    }));
  }, [onboarding, courierDone]);
  const doneCount = checklistState.filter(s => s.done).length;
  const allDone = doneCount >= CHECKLIST_STEPS.length;
  const showChecklist = onboarding && !onboarding.dismissed && !allDone;
  const funnel = data?.funnel || null;
  const today = data?.today || null;
  const usingToday = range?.preset === 'today';
  const kpi = usingToday && today ? today : funnel;
  const deltas = usingToday ? data?.todayDeltas || {} : data?.deltas || {};
  const rangeDays = rangeDaysFromPicker(range);
  const returnRate = weightedReturnRate(data?.byPage);
  const codUnsettled = Number(data?.codOpen?.unsettled ?? data?.codReconcile?.unsettled) || 0;
  const avgOrderValue = funnel && funnel.orders > 0 ? funnel.revenue / funnel.orders : 0;
  const sparkRevenue = (data?.series || []).map(d => Number(d.revenue) || 0);
  const ordersLabel = usingToday ? t('home.todayOrders') : t('home.orders');
  const chartTitle = usingToday ? t('home.chartToday') : t('home.chart').replace('{days}', String(rangeDays));
  function dismissChecklist() {
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('onboarding', {
      method: 'PUT',
      body: {
        dismissed: true
      }
    }).then(setOnboarding).catch(() => {});
  }
  function markStep(step) {
    ;(0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('onboarding', {
      method: 'PUT',
      body: {
        [step]: true
      }
    }).then(setOnboarding).catch(() => {});
  }
  const datePresets = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [{
    id: 'today',
    label: t('home.rangeToday')
  }, {
    id: '7d',
    label: t('home.range7d')
  }, {
    id: '30d',
    label: t('home.range30d')
  }], [t]);
  if (status === 'loading' && !data) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Skeleton, {
        height: 40
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "nk-kpi-row",
        children: [1, 2, 3, 4, 5, 6].map(i => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Skeleton, {
          height: 96
        }, i))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Skeleton, {
        height: 240
      })]
    });
  }
  if (status === 'error') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "nk-muted",
        children: error || t('common.error')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: load,
        children: t('common.retry')
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "nk-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h1", {
          children: [t(greetingKey()), ",", ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "nk-muted",
            style: {
              fontWeight: 500
            },
            children: userName
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.DateRangePicker, {
        value: range,
        onChange: setRange,
        presets: datePresets
      })]
    }), showChecklist ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      title: t('onboarding.title'),
      actions: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "ghost",
        size: "sm",
        onClick: dismissChecklist,
        children: t('onboarding.dismiss')
      }),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "nk-muted",
        children: t('onboarding.fourSteps')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "nk-muted",
        style: {
          marginTop: 0
        },
        children: t('home.checklistProgress').replace('{done}', String(doneCount)).replace('{total}', String(CHECKLIST_STEPS.length))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "nk-progress",
        "aria-hidden": "true",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          style: {
            width: `${doneCount / CHECKLIST_STEPS.length * 100}%`
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("ol", {
        className: "nk-checklist",
        style: {
          listStyle: 'none',
          margin: '16px 0 0',
          padding: 0
        },
        children: checklistState.map(step => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("li", {
          className: ['nk-checklist-item', step.done ? 'is-done' : ''].filter(Boolean).join(' '),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              flex: 1
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
              children: t(step.titleKey)
            }), !step.done ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              className: "nk-muted",
              style: {
                margin: '4px 0 8px'
              },
              children: t(step.helpKey)
            }) : null, !step.done ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "sm",
              variant: "secondary",
              onClick: () => {
                if (step.mark) markStep(step.mark);
                go(step.route);
              },
              children: t(step.actionKey)
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
              children: t('home.stepDone')
            })]
          })
        }, step.key))
      })]
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "nk-kpi-row",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: ordersLabel,
        value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(kpi?.orders ?? 0, locale),
        delta: deltas.orders,
        sparkline: sparkRevenue
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: t('home.revenue'),
        value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(kpi?.revenue ?? 0, locale),
        delta: deltas.revenue,
        sparkline: sparkRevenue
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: t('home.conversion'),
        value: kpi?.conversion == null ? t('home.notEnoughData') : `${(0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(kpi.conversion, locale)}%`,
        delta: kpi?.conversion == null ? undefined : deltas.conversion
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: t('home.needsCall'),
        value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(shell.needsCall, locale)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: t('home.returnRate'),
        value: `${(0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(returnRate.toFixed(1), locale)}%`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
        label: t('home.codCollect'),
        value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(codUnsettled, locale)
      })]
    }), shell.needsCall > 0 || shell.leadsToday > 0 || codUnsettled > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      title: t('home.actionNeeded'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "nk-action-needed",
        children: [shell.needsCall > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("button", {
          type: "button",
          onClick: () => go('orders'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "nk-muted",
            children: t('home.actionOrdersHelp')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(shell.needsCall, locale)
          })]
        }) : null, shell.leadsToday > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("button", {
          type: "button",
          onClick: () => go('leads'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "nk-muted",
            children: t('home.actionLeadsHelp')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(shell.leadsToday, locale)
          })]
        }) : null, codUnsettled > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("button", {
          type: "button",
          onClick: () => go('orders'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "nk-muted",
            children: t('home.actionCodHelp')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(codUnsettled, locale)
          })]
        }) : null]
      })
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      title: chartTitle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        className: "nk-muted",
        style: {
          marginTop: 0
        },
        children: t('home.chartLegend')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(ComboChart, {
        series: data?.series || [],
        avgOrderValue: avgOrderValue,
        t: t
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "nk-split-2",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        title: t('home.recent'),
        children: (data?.recentOrders || []).length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.EmptyState, {
          title: t('home.emptyOrders')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Table, {
          columns: [{
            key: 'number',
            label: '#'
          }, {
            key: 'name',
            label: t('field.name')
          }, {
            key: 'total',
            label: t('orders.total')
          }, {
            key: 'status',
            label: t('pages.status')
          }],
          rows: (data.recentOrders || []).map(order => ({
            id: order.id,
            number: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
              variant: "ghost",
              size: "sm",
              onClick: () => go('orders/' + order.id),
              children: order.number
            }),
            name: order.name,
            total: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(order.total, locale),
            status: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatusPill, {
              status: order.status,
              label: t('status.' + order.status)
            })
          })),
          onSort: undefined
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        title: t('home.topPages'),
        children: (data?.topPages || []).length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.EmptyState, {
          title: t('home.emptyPages')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Table, {
          columns: [{
            key: 'title',
            label: t('pages.name')
          }, {
            key: 'orders',
            label: t('pages.orders')
          }, {
            key: 'revenue',
            label: t('home.revenue')
          }],
          rows: (data.topPages || []).map(page => ({
            id: page.id,
            title: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
              variant: "ghost",
              size: "sm",
              onClick: () => go('pages/' + page.id),
              children: page.title
            }),
            orders: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(page.orders, locale),
            revenue: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(page.revenue, locale)
          }))
        })
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Leads.js"
/*!************************************!*\
  !*** ./admin-src/screens/Leads.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Leads: () => (/* binding */ Leads)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/message-circle.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/phone.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);







const PER_PAGE = 20;
function telHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return `tel:${digits.startsWith('0') ? digits : digits}`;
}
function waHref(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith('0')) {
    digits = `88${digits.slice(1)}`;
  } else if (!digits.startsWith('88')) {
    digits = `88${digits}`;
  }
  return `https://wa.me/${digits}`;
}
function Leads({
  t,
  locale
}) {
  const confirm = (0,_providers__WEBPACK_IMPORTED_MODULE_6__.useConfirm)();
  const {
    success,
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_6__.useToast)();
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('incomplete');
  const [leadsStatus, setLeadsStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [leadsError, setLeadsError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [leads, setLeads] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [total, setTotal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalPages, setTotalPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [blacklistStatus, setBlacklistStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [blacklistError, setBlacklistError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [blacklist, setBlacklist] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [phone, setPhone] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [note, setNote] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [adding, setAdding] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const loadLeads = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((nextPage = page) => {
    setLeadsStatus('loading');
    setLeadsError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.api)(`leads?page=${nextPage}&per_page=${PER_PAGE}`).then(data => {
      setLeads(data.leads || []);
      setTotal(Number(data.total) || 0);
      setPage(Number(data.page) || nextPage);
      setTotalPages(Number(data.totalPages) || 1);
      setLeadsStatus('ready');
    }).catch(err => {
      setLeadsError(err.message || t('common.error'));
      setLeadsStatus('error');
    });
  }, [page, t]);
  const loadBlacklist = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setBlacklistStatus('loading');
    setBlacklistError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.api)('blacklist').then(data => {
      setBlacklist(data.phones || []);
      setBlacklistStatus('ready');
    }).catch(err => {
      setBlacklistError(err.message || t('common.error'));
      setBlacklistStatus('error');
    });
  }, [t]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    loadLeads(1);
    loadBlacklist();
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (tab === 'incomplete') {
      loadLeads(page);
    }
  }, [page, tab]);
  function addBlacklist(event) {
    event.preventDefault();
    if (!phone.trim()) {
      return;
    }
    setAdding(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.api)('blacklist', {
      method: 'POST',
      body: {
        phone: phone.trim(),
        note: note.trim()
      }
    }).then(data => {
      setBlacklist(data.phones || []);
      setPhone('');
      setNote('');
      success(t('leads.added'));
    }).catch(err => toastError(err.message || t('common.error'))).finally(() => setAdding(false));
  }
  async function removeBlacklist(row) {
    const ok = await confirm({
      title: t('leads.remove'),
      message: t('leads.removeConfirm'),
      confirmLabel: t('leads.remove'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_4__.api)('blacklist', {
      method: 'DELETE',
      body: {
        phone: row.phone
      }
    }).then(data => {
      setBlacklist(data.phones || []);
      success(t('common.saved'));
    }).catch(err => toastError(err.message || t('common.error')));
  }
  const incompletePanel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Card, {
    title: t('leads.incomplete'),
    children: leadsStatus === 'error' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.EmptyState, {
      title: t('common.error'),
      description: leadsError,
      action: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
        onClick: () => loadLeads(page),
        children: t('common.retry')
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Table, {
        loading: leadsStatus === 'loading',
        emptyTitle: t('leads.empty'),
        columns: [{
          key: 'name',
          label: t('field.name'),
          render: row => row.name || '—'
        }, {
          key: 'phone',
          label: t('orders.phone'),
          render: row => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "nk-phone-actions",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              children: row.phone
            }), telHref(row.phone) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("a", {
              href: telHref(row.phone),
              className: "nk-ui-link",
              "aria-label": t('orders.phone'),
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
                size: 14
              })
            }) : null, waHref(row.phone) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("a", {
              href: waHref(row.phone),
              target: "_blank",
              rel: "noreferrer",
              className: "nk-ui-link",
              "aria-label": "WhatsApp",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
                size: 14
              })
            }) : null]
          })
        }, {
          key: 'pageId',
          label: t('leads.pageId'),
          render: row => (0,_format__WEBPACK_IMPORTED_MODULE_5__.formatNumber)(row.pageId, locale)
        }, {
          key: 'updatedAt',
          label: t('orders.when'),
          render: row => (0,_format__WEBPACK_IMPORTED_MODULE_5__.formatRelative)(row.updatedAt, locale) || row.updatedAt
        }],
        rows: leads,
        rowKey: row => row.id
      }), totalPages > 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "nk-pager",
        style: {
          marginTop: 16
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
          className: "nk-muted",
          children: [t('leads.page'), " ", (0,_format__WEBPACK_IMPORTED_MODULE_5__.formatNumber)(page, locale), " / ", (0,_format__WEBPACK_IMPORTED_MODULE_5__.formatNumber)(totalPages, locale)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "nk-screen-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
            variant: "secondary",
            size: "sm",
            disabled: page <= 1 || leadsStatus === 'loading',
            onClick: () => setPage(p => Math.max(1, p - 1)),
            children: t('leads.prev')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
            variant: "secondary",
            size: "sm",
            disabled: page >= totalPages || leadsStatus === 'loading',
            onClick: () => setPage(p => p + 1),
            children: t('leads.next')
          })]
        })]
      }) : null]
    })
  });
  const blacklistPanel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    className: "nk-screen",
    style: {
      gap: 16
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_7__.Card, {
      title: t('leads.blacklist'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
        className: "nk-muted",
        style: {
          marginTop: 0
        },
        children: t('leads.blacklistHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("form", {
        className: "nk-filters",
        onSubmit: addBlacklist,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Input, {
          label: t('orders.phone'),
          value: phone,
          onChange: e => setPhone(e.target.value),
          required: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Textarea, {
          label: t('leads.note'),
          value: note,
          onChange: e => setNote(e.target.value),
          rows: 2
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
          type: "submit",
          disabled: adding,
          children: t('leads.add')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Card, {
      children: blacklistStatus === 'error' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.EmptyState, {
        title: t('common.error'),
        description: blacklistError,
        action: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
          onClick: loadBlacklist,
          children: t('common.retry')
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Table, {
        loading: blacklistStatus === 'loading',
        emptyTitle: t('leads.blacklistEmpty'),
        columns: [{
          key: 'phone',
          label: t('orders.phone')
        }, {
          key: 'note',
          label: t('leads.note'),
          render: row => row.note || '—'
        }, {
          key: 'created_at',
          label: t('leads.date'),
          render: row => (0,_format__WEBPACK_IMPORTED_MODULE_5__.formatRelative)(row.created_at, locale) || row.created_at || '—'
        }, {
          key: 'actions',
          label: '',
          render: row => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.IconButton, {
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"],
            variant: "ghost",
            "aria-label": t('leads.remove'),
            onClick: () => removeBlacklist(row)
          })
        }],
        rows: blacklist,
        rowKey: row => row.phone
      })
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    className: "nk-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("header", {
      className: "nk-screen-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h1", {
          children: t('leads.title')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          className: "nk-muted",
          children: t('leads.help')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_7__.Tabs, {
      value: tab,
      onChange: setTab,
      tabs: [{
        value: 'incomplete',
        label: t('leads.tabIncomplete'),
        content: incompletePanel
      }, {
        value: 'blacklist',
        label: t('leads.tabBlacklist'),
        content: blacklistPanel
      }]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/OrderDetail.js"
/*!******************************************!*\
  !*** ./admin-src/screens/OrderDetail.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrderDetail: () => (/* binding */ OrderDetail)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/external-link.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







const WALLET_METHODS = ['manual_bkash', 'manual_nagad'];
function waMeUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  let n = digits;
  if (n.startsWith('0')) {
    n = '880' + n.slice(1);
  } else if (!n.startsWith('880')) {
    n = '880' + n;
  }
  return `https://wa.me/${n}`;
}
function telUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `tel:${digits || phone}`;
}
function OrderDetail({
  t,
  locale,
  go,
  orderId,
  variant = 'page',
  onClose,
  onMutate
}) {
  const confirm = (0,_providers__WEBPACK_IMPORTED_MODULE_4__.useConfirm)();
  const {
    success,
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_4__.useToast)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [detail, setDetail] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [shipping, setShipping] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [courier, setCourier] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('steadfast');
  const [collect, setCollect] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [noteDraft, setNoteDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [customer, setCustomer] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    name: '',
    phone: '',
    email: ''
  });
  const [address, setAddress] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [savingCustomer, setSavingCustomer] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [savingAddress, setSavingAddress] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const reload = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!orderId) {
      return;
    }
    setStatus('loading');
    setError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + orderId).then(data => {
      setDetail(data);
      setCollect(String(data.collectAmount != null ? data.collectAmount : data.total));
      setCustomer({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || ''
      });
      setAddress(data.address || '');
      setStatus('ready');
    }).catch(err => {
      setError(err.message);
      setStatus('error');
    });
  }, [orderId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    reload();
  }, [reload]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('settings').then(data => {
      setShipping(data.shipping || null);
      const first = (data.shipping?.available || [])[0];
      if (first) {
        setCourier(first);
      }
    }).catch(() => {});
  }, []);
  function afterMutation(data, message) {
    setDetail(data);
    setCollect(String(data.collectAmount != null ? data.collectAmount : data.total));
    if (message) {
      success(message);
    }
    onMutate?.();
  }
  function updateStatus(next) {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id, {
      method: 'PUT',
      body: {
        status: next
      }
    }).then(data => afterMutation(data, t('orders.statusUpdated'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function saveCollect() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id, {
      method: 'PUT',
      body: {
        collect_amount: Number(collect)
      }
    }).then(data => afterMutation(data, t('orders.collectSaved'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function saveCustomer(event) {
    event?.preventDefault?.();
    setSavingCustomer(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id, {
      method: 'PUT',
      body: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      }
    }).then(data => afterMutation(data, t('orders.customerSaved'))).catch(err => toastError(err.message)).finally(() => setSavingCustomer(false));
  }
  function saveAddress(event) {
    event?.preventDefault?.();
    setSavingAddress(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id, {
      method: 'PUT',
      body: {
        address
      }
    }).then(data => afterMutation(data, t('orders.addressSaved'))).catch(err => toastError(err.message)).finally(() => setSavingAddress(false));
  }
  function addNote(event) {
    event?.preventDefault?.();
    const text = noteDraft.trim();
    if (!text) {
      return;
    }
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id, {
      method: 'PUT',
      body: {
        note: text
      }
    }).then(data => {
      setNoteDraft('');
      afterMutation(data, t('orders.noteSaved'));
    }).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function confirmTrx() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/confirm-trx', {
      method: 'POST',
      body: {
        collect_amount: Number(collect)
      }
    }).then(data => afterMutation(data, t('orders.confirmed'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  async function rejectTrx() {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('orders.rejectConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/reject-trx', {
      method: 'POST',
      body: {}
    }).then(data => afterMutation(data, t('orders.rejected'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function shipOrder() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/ship', {
      method: 'POST',
      body: {
        courier
      }
    }).then(data => afterMutation(data, t('orders.shipped'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function printSlip() {
    ;(0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/print').then(data => {
      const win = window.open('', '_blank');
      if (!win) {
        return;
      }
      win.document.write(data.html || '');
      win.document.close();
    }).catch(err => toastError(err.message));
  }
  async function blacklistPhone() {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('orders.blacklistConfirm'),
      confirmLabel: t('common.confirm'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('blacklist', {
      method: 'POST',
      body: {
        phone: detail.phone,
        note: detail.number
      }
    }).then(() => success(t('orders.blacklisted'))).catch(err => toastError(err.message));
  }
  function settleCod() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/settle-cod', {
      method: 'POST',
      body: {
        received: Number(collect)
      }
    }).then(data => afterMutation(data, t('orders.codSettled'))).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  function verifyTrx() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('orders/' + detail.id + '/verify-trx', {
      method: 'POST',
      body: {}
    }).then(data => {
      setDetail(data);
      onMutate?.();
      if (data.verify?.verified) {
        success(t('orders.verifyOk'));
        setCollect(String(data.collectAmount != null ? data.collectAmount : collect));
      } else {
        toastError(data.verify?.message || t('orders.verifyPending'));
      }
    }).catch(err => toastError(err.message)).finally(() => setBusy(false));
  }
  async function cancelOrder() {
    const ok = await confirm({
      title: t('common.confirm'),
      message: t('orders.cancelConfirm'),
      confirmLabel: t('orders.cancelOrder'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) {
      return;
    }
    updateStatus('cancelled');
  }
  if (status === 'loading') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "nk-detail-stack",
      "aria-busy": "true",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "nk-muted",
        children: t('common.loading')
      })
    });
  }
  if (status === 'error' || !detail) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "nk-detail-stack",
      role: "alert",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        children: error || t('common.error')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        variant: "secondary",
        onClick: reload,
        children: t('common.retry')
      })]
    });
  }
  const attr = detail.attribution || {};
  const attrBits = [attr.utm_source && `utm_source=${attr.utm_source}`, attr.utm_medium && `utm_medium=${attr.utm_medium}`, attr.utm_campaign && `utm_campaign=${attr.utm_campaign}`, attr.fbclid && 'fbclid', attr.ttclid && 'ttclid', attr.gclid && 'gclid'].filter(Boolean);
  const isWallet = WALLET_METHODS.includes(detail.method);
  const hasTrx = Boolean(detail.trxId);
  const walletPending = isWallet && hasTrx && !detail.trxVerified;
  const canShip = (shipping?.available || []).length > 0 && !['shipped', 'delivered', 'cancelled'].includes(detail.status);
  const statusLabel = key => t('status.' + key);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: ['nk-detail-stack', variant === 'page' ? 'nk-screen' : ''].filter(Boolean).join(' '),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        children: [variant === 'page' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => go('orders'),
          children: t('orders.back')
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
          style: {
            margin: variant === 'page' ? '8px 0 0' : 0
          },
          children: detail.number
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          className: "nk-muted",
          style: {
            margin: '4px 0 0',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.StatusPill, {
            status: detail.status,
            label: statusLabel(detail.status)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
            children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatRelative)(detail.createdAt, locale)
          }), detail.risk === 'review' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
            variant: "warning",
            children: t('orders.riskReview')
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
            variant: "success",
            children: t('orders.riskOk')
          }), detail.variant ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
            children: ["A/B ", String(detail.variant).toUpperCase()]
          }) : null, detail.otpVerified ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
            variant: "success",
            children: t('orders.otpOk')
          }) : null]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-screen-actions",
        children: [variant === 'drawer' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
            variant: "ghost",
            size: "sm",
            onClick: () => go('orders/' + detail.id),
            children: [t('orders.openFull'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
              size: 14,
              style: {
                marginInlineStart: 4
              },
              "aria-hidden": true
            })]
          }), onClose ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
            variant: "secondary",
            size: "sm",
            onClick: onClose,
            children: t('common.close')
          }) : null]
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "ghost",
          size: "sm",
          onClick: printSlip,
          disabled: busy,
          children: t('orders.print')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "ghost",
          size: "sm",
          onClick: blacklistPhone,
          disabled: busy,
          children: t('orders.blacklist')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "danger",
          size: "sm",
          onClick: cancelOrder,
          disabled: busy || detail.status === 'cancelled',
          children: t('orders.cancelOrder')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "nk-action-needed",
      children: [detail.status === 'pending' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          loading: busy,
          onClick: () => updateStatus('confirmed'),
          children: t('orders.confirmOrder')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "secondary",
          loading: busy,
          onClick: () => updateStatus('no_answer'),
          children: t('orders.noAnswer')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "secondary",
          loading: busy,
          onClick: () => updateStatus('fake'),
          children: t('orders.markFake')
        })]
      }) : null, walletPending ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          loading: busy,
          onClick: verifyTrx,
          children: t('orders.verifyTrx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "secondary",
          loading: busy,
          onClick: confirmTrx,
          children: t('orders.confirmTrx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          variant: "ghost",
          loading: busy,
          onClick: rejectTrx,
          children: t('orders.rejectTrx')
        })]
      }) : null, detail.status === 'confirmed' && canShip ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'flex-end',
          gridColumn: '1 / -1'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Select, {
          label: t('orders.courier'),
          value: courier,
          onChange: e => setCourier(e.target.value),
          children: (shipping?.available || []).map(id => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: id,
            children: t('courier.' + id)
          }, id))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          loading: busy,
          onClick: shipOrder,
          children: t('orders.bookCourier')
        })]
      }) : null, detail.status === 'shipped' && detail.trackingCode ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
        className: "nk-muted",
        style: {
          gridColumn: '1 / -1',
          margin: 0
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("strong", {
          children: [t('orders.tracking'), ":"]
        }), " ", detail.trackingCode, detail.courier ? ` · ${t('courier.' + detail.courier) || detail.courier}` : '']
      }) : null, detail.method === 'cod' && !detail.codSettled ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        loading: busy,
        onClick: settleCod,
        children: t('orders.settleCod')
      }) : null, detail.method === 'cod' && detail.codSettled ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
        variant: "success",
        children: [t('orders.codSettled'), detail.codReceived != null ? ` · ${(0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(detail.codReceived, locale)}` : '']
      }) : null]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "nk-split-2",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
        title: t('orders.customer'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
          className: "nk-inline-edit",
          onSubmit: saveCustomer,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
            label: t('field.name'),
            value: customer.name,
            onChange: e => setCustomer(c => ({
              ...c,
              name: e.target.value
            }))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
            label: t('orders.phone'),
            value: customer.phone,
            onChange: e => setCustomer(c => ({
              ...c,
              phone: e.target.value
            }))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "nk-phone-actions",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
              href: telUrl(customer.phone),
              className: "nk-ui-btn is-secondary is-sm",
              children: t('orders.call')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
              href: waMeUrl(customer.phone),
              target: "_blank",
              rel: "noopener noreferrer",
              className: "nk-ui-btn is-secondary is-sm",
              children: "WhatsApp"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
            label: t('orders.email'),
            type: "email",
            value: customer.email,
            onChange: e => setCustomer(c => ({
              ...c,
              email: e.target.value
            }))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
            type: "submit",
            variant: "secondary",
            loading: savingCustomer,
            children: t('common.save')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
        title: t('orders.address'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
          className: "nk-inline-edit",
          onSubmit: saveAddress,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Textarea, {
            label: t('orders.address'),
            value: address,
            onChange: e => setAddress(e.target.value),
            rows: 3
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "nk-muted",
            style: {
              margin: 0
            },
            children: [detail.upazila, detail.district, detail.division].filter(Boolean).join(', ')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
            type: "submit",
            variant: "secondary",
            loading: savingAddress,
            children: t('common.save')
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
      title: t('orders.items'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
        style: {
          margin: 0,
          paddingLeft: '1.1rem'
        },
        children: (detail.items || []).map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
          children: [(0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(item.qty, locale), " \xD7 ", item.name, " \xB7 ", (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(item.price, locale)]
        }, index))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          marginTop: 12,
          display: 'grid',
          gap: 4
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          style: {
            margin: 0
          },
          children: [t('orders.subtotal'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(detail.subtotal, locale)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          style: {
            margin: 0
          },
          children: [t('orders.shipping'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(detail.shipping, locale)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
          style: {
            margin: 0,
            fontWeight: 600
          },
          children: [t('orders.total'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(detail.total, locale)]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("label", {
          className: "nk-inline-edit",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
            label: t('orders.collect'),
            type: "number",
            min: "0",
            step: "0.01",
            value: collect,
            onChange: e => setCollect(e.target.value)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "nk-muted",
            style: {
              margin: 0
            },
            children: t('orders.collectCourier').replace('{amount}', (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(Number(collect) || 0, locale))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
            variant: "secondary",
            size: "sm",
            onClick: saveCollect,
            loading: busy,
            children: t('orders.saveCollect')
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
      title: t('orders.payment'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        style: {
          marginTop: 0
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
          children: t('pay.' + detail.method)
        })
      }), detail.trxId ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.CopyField, {
        label: t('orders.trx'),
        value: detail.trxId,
        copyLabel: t('common.copy'),
        copiedLabel: t('common.copied')
      }) : null, detail.trxVerified ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
        variant: "success",
        children: t('orders.trxVerified')
      }) : hasTrx ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Badge, {
        variant: "warning",
        children: "?"
      }) : null, detail.fraud ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
        className: "nk-muted",
        children: [t('orders.fraud'), ": ", detail.fraud.label, " (", (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatNumber)(detail.fraud.score, locale), ")"]
      }) : null]
    }), attrBits.length ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
      title: t('orders.attribution'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        style: {
          margin: 0
        },
        children: attrBits.join(' · ')
      })
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
      title: t('orders.notes'),
      children: [(detail.notes || []).length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "nk-muted",
        children: t('orders.notesEmpty')
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
        style: {
          margin: 0,
          paddingLeft: 0,
          listStyle: 'none'
        },
        children: detail.notes.map(n => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
          style: {
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: '1px solid var(--nk-border)'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            style: {
              margin: '0 0 4px'
            },
            children: n.note
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("small", {
            className: "nk-muted",
            children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatRelative)(n.createdAt, locale)
          })]
        }, n.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("form", {
        onSubmit: addNote,
        style: {
          marginTop: 12,
          display: 'grid',
          gap: 8
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Textarea, {
          label: t('orders.addNote'),
          value: noteDraft,
          onChange: e => setNoteDraft(e.target.value),
          rows: 2
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
          type: "submit",
          variant: "secondary",
          disabled: !noteDraft.trim(),
          loading: busy,
          children: t('orders.addNote')
        })]
      }), detail.note ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("p", {
        className: "nk-muted",
        style: {
          marginTop: 12
        },
        children: [t('orders.note'), ": ", detail.note]
      }) : null]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Orders.js"
/*!*************************************!*\
  !*** ./admin-src/screens/Orders.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Orders: () => (/* binding */ Orders)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _OrderDetail__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./OrderDetail */ "./admin-src/screens/OrderDetail.js");
/* harmony import */ var _styles_screens_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../styles/screens.css */ "./admin-src/styles/screens.css");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);









const STATUS_TABS = [{
  id: 'all',
  status: ''
}, {
  id: 'pending',
  status: 'pending'
}, {
  id: 'confirmed',
  status: 'confirmed'
}, {
  id: 'awaiting_payment',
  status: 'awaiting_payment'
}, {
  id: 'shipped',
  status: 'shipped'
}, {
  id: 'delivered',
  status: 'delivered'
}, {
  id: 'returned',
  status: 'returned'
}, {
  id: 'cancelled_fake',
  status: 'cancelled_fake'
}];
const BULK_STATUSES = ['pending', 'awaiting_payment', 'confirmed', 'no_answer', 'fake', 'paid', 'shipped', 'delivered', 'returned', 'cancelled'];
const PAYMENT_METHODS = ['', 'cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
function toYmd(d) {
  if (!d) {
    return '';
  }
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) {
    return '';
  }
  const p = n => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}
function waMeUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  let n = digits;
  if (n.startsWith('0')) {
    n = '880' + n.slice(1);
  } else if (!n.startsWith('880')) {
    n = '880' + n;
  }
  return `https://wa.me/${n}`;
}
function telUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `tel:${digits || phone}`;
}
function buildListQuery({
  search,
  tab,
  page,
  perPage,
  from,
  to,
  paymentMethod,
  statusOverride
}) {
  const query = new URLSearchParams();
  if (search) {
    query.set('search', search);
  }
  const status = statusOverride !== undefined ? statusOverride : STATUS_TABS.find(t => t.id === tab)?.status || '';
  if (status && status !== 'cancelled_fake') {
    query.set('status', status);
  }
  query.set('page', String(page));
  query.set('per_page', String(perPage));
  if (from) {
    query.set('from', from);
  }
  if (to) {
    query.set('to', to);
  }
  if (paymentMethod) {
    query.set('payment_method', paymentMethod);
  }
  return query;
}
function Orders({
  t,
  go,
  orderId,
  locale
}) {
  const {
    success,
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_5__.useToast)();
  const [listStatus, setListStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [listError, setListError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [rows, setRows] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [total, setTotal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [totalPages, setTotalPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  const [tabCounts, setTabCounts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [searchDraft, setSearchDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [dateRange, setDateRange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    preset: 'all'
  });
  const [paymentMethod, setPaymentMethod] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [riskFilter, setRiskFilter] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [page, setPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [perPage, setPerPage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(25);
  const [selected, setSelected] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [bulkStatus, setBulkStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('confirmed');
  const [drawerId, setDrawerId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const from = dateRange?.preset === 'all' || !dateRange?.from ? '' : toYmd(dateRange.from);
  const to = dateRange?.preset === 'all' || !dateRange?.to ? '' : toYmd(dateRange.to);
  const filteredRows = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!riskFilter) {
      return rows;
    }
    return rows.filter(row => row.risk === riskFilter);
  }, [rows, riskFilter]);
  const datePresets = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [{
    id: 'all',
    label: t('orders.allTime')
  }, {
    id: 'today',
    label: t('home.rangeToday')
  }, {
    id: '7d',
    label: t('home.range7d')
  }, {
    id: '30d',
    label: t('home.range30d')
  }, {
    id: 'custom',
    label: t('orders.customRange') || 'Custom'
  }], [t]);
  const loadCounts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const q = new URLSearchParams();
    if (search) {
      q.set('search', search);
    }
    if (from) {
      q.set('from', from);
    }
    if (to) {
      q.set('to', to);
    }
    if (paymentMethod) {
      q.set('payment_method', paymentMethod);
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders/counts?' + q.toString()).then(data => {
      const next = {
        ...(data || {})
      };
      next.cancelled_fake = (next.cancelled || 0) + (next.fake || 0);
      setTabCounts(next);
    }).catch(() => {});
  }, [search, from, to, paymentMethod]);
  const loadList = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setListStatus('loading');
    setListError('');
    if (tab === 'cancelled_fake') {
      const q = buildListQuery({
        search,
        tab,
        page,
        perPage,
        from,
        to,
        paymentMethod
      });
      const qCancel = new URLSearchParams(q.toString());
      qCancel.set('status', 'cancelled');
      const qFake = new URLSearchParams(q.toString());
      qFake.set('status', 'fake');
      Promise.all([(0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders?' + qCancel.toString()), (0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders?' + qFake.toString())]).then(([a, b]) => {
        const merged = [...(a.orders || []), ...(b.orders || [])].sort((x, y) => y.id - x.id);
        const slice = merged.slice(0, perPage);
        const combTotal = (a.total || 0) + (b.total || 0);
        setRows(slice);
        setTotal(combTotal);
        setTotalPages(Math.max(1, Math.ceil(combTotal / perPage)));
        setSelected([]);
        setListStatus('ready');
      }).catch(err => {
        setListError(err.message);
        setListStatus('error');
      });
      return;
    }
    const q = buildListQuery({
      search,
      tab,
      page,
      perPage,
      from,
      to,
      paymentMethod
    });
    (0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders?' + q.toString()).then(data => {
      setRows(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setSelected([]);
      setListStatus('ready');
    }).catch(err => {
      setListError(err.message);
      setListStatus('error');
    });
  }, [search, tab, page, perPage, from, to, paymentMethod]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    loadCounts();
  }, [loadCounts]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    loadList();
  }, [loadList]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setPage(1);
  }, [tab, search, from, to, paymentMethod, perPage]);
  function applySearch(event) {
    event?.preventDefault?.();
    setSearch(searchDraft.trim());
  }
  function exportCsv() {
    const q = buildListQuery({
      search,
      tab,
      page: 1,
      perPage: 25,
      from,
      to,
      paymentMethod
    });
    if (tab === 'cancelled_fake') {
      q.delete('status');
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders/export?' + q.toString()).then(data => {
      const blob = new window.Blob([data.csv || ''], {
        type: 'text/csv;charset=utf-8'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename || 'noksha-orders.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      success(t('orders.exportDone'));
    }).catch(err => toastError(err.message));
  }
  function runBulk(status) {
    if (selected.length === 0) {
      return;
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_3__.api)('orders/bulk', {
      method: 'POST',
      body: {
        ids: selected,
        status
      }
    }).then(() => {
      success(t('orders.bulkDone').replace('{n}', String(selected.length)));
      loadList();
      loadCounts();
    }).catch(err => toastError(err.message));
  }
  function openRow(order) {
    setDrawerId(order.id);
  }
  const columns = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [{
    key: 'number',
    label: t('orders.orderNumber'),
    render: order => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
      children: order.number
    })
  }, {
    key: 'customer',
    label: t('orders.customer'),
    render: order => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      onClick: e => e.stopPropagation(),
      role: "presentation",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        children: order.name || '—'
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "nk-phone-actions",
        style: {
          marginTop: 4
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
          href: telUrl(order.phone),
          className: "nk-ui-btn is-ghost is-sm",
          children: order.phone
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
          href: waMeUrl(order.phone),
          target: "_blank",
          rel: "noopener noreferrer",
          className: "nk-ui-btn is-ghost is-sm",
          "aria-label": "WhatsApp",
          children: "WA"
        })]
      })]
    })
  }, {
    key: 'total',
    label: t('orders.total'),
    render: order => (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatMoney)(order.total, locale)
  }, {
    key: 'payment',
    label: t('orders.payment'),
    render: order => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Badge, {
        children: t('pay.' + order.method)
      }), order.trxId ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 4
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "nk-muted",
          style: {
            fontSize: 'var(--nk-text-sm)'
          },
          children: order.trxId
        }), order.trxVerified ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
          size: 14,
          className: "nk-ui-text-success",
          "aria-label": t('orders.trxVerified')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
          size: 14,
          "aria-label": "?"
        })]
      }) : null]
    })
  }, {
    key: 'status',
    label: t('pages.status'),
    render: order => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.StatusPill, {
      status: order.status,
      label: t('status.' + order.status)
    })
  }, {
    key: 'risk',
    label: t('orders.risk'),
    render: order => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Badge, {
      variant: order.risk === 'review' ? 'warning' : 'success',
      children: order.risk === 'review' ? t('orders.riskReview') : t('orders.riskOk')
    })
  }, {
    key: 'courier',
    label: t('orders.courier'),
    render: order => order.trackingCode ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
      children: [order.courier ? t('courier.' + order.courier) || order.courier : '—', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("small", {
        className: "nk-muted",
        children: order.trackingCode
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
      className: "nk-muted",
      children: "\u2014"
    })
  }, {
    key: 'createdAt',
    label: t('orders.when'),
    render: order => (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatRelative)(order.createdAt, locale)
  }], [t, locale]);
  if (orderId) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_OrderDetail__WEBPACK_IMPORTED_MODULE_7__.OrderDetail, {
      t: t,
      locale: locale,
      go: go,
      orderId: orderId,
      variant: "page",
      onMutate: loadCounts
    });
  }
  const tabLabel = id => {
    if (id === 'all') {
      return t('orders.tab.all');
    }
    if (id === 'pending') {
      return t('orders.tab.needsCall');
    }
    if (id === 'cancelled_fake') {
      return t('orders.tab.cancelledFake');
    }
    return t('status.' + id);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "nk-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("h1", {
        children: t('orders.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "nk-screen-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
          variant: "secondary",
          onClick: exportCsv,
          children: t('orders.export')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "nk-ui-tabs",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        role: "tablist",
        className: "nk-ui-tabs-list",
        "aria-label": t('orders.title'),
        children: STATUS_TABS.map(item => {
          const active = tab === item.id;
          const count = tabCounts[item.id === 'all' ? 'all' : item.id === 'cancelled_fake' ? 'cancelled_fake' : item.status];
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
            type: "button",
            role: "tab",
            "aria-selected": active,
            className: 'nk-ui-tab' + (active ? ' is-active' : ''),
            onClick: () => setTab(item.id),
            children: [tabLabel(item.id), count != null ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Badge, {
              variant: active ? 'default' : 'default',
              style: {
                marginInlineStart: 6
              },
              children: (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatNumber)(count, locale)
            }) : null]
          }, item.id);
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("form", {
      className: "nk-filters nk-orders-filters",
      onSubmit: applySearch,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "nk-orders-search",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
          "aria-label": t('orders.search'),
          placeholder: t('orders.search'),
          value: searchDraft,
          onChange: e => setSearchDraft(e.target.value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
          type: "submit",
          variant: "secondary",
          children: t('orders.searchAction')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.DateRangePicker, {
        value: dateRange,
        onChange: next => setDateRange(next?.preset === 'all' ? {
          preset: 'all'
        } : next),
        presets: datePresets
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_6__.Select, {
        "aria-label": t('orders.method'),
        value: paymentMethod,
        onChange: e => setPaymentMethod(e.target.value),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: "",
          children: t('orders.filterPaymentAll')
        }), PAYMENT_METHODS.filter(Boolean).map(m => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: m,
          children: t('pay.' + m)
        }, m))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_6__.Select, {
        "aria-label": t('orders.filterRisk'),
        value: riskFilter,
        onChange: e => setRiskFilter(e.target.value),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: "",
          children: t('orders.filterRiskAll')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: "ok",
          children: t('orders.riskOk')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: "review",
          children: t('orders.riskReview')
        })]
      })]
    }), listStatus === 'error' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "nk-banner",
      role: "alert",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
        children: listError || t('common.error')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        onClick: loadList,
        children: t('common.retry')
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Table, {
      columns: columns,
      rows: filteredRows,
      rowKey: row => row.id,
      loading: listStatus === 'loading',
      emptyTitle: t('orders.empty'),
      selectable: true,
      selectedKeys: selected,
      onSelectionChange: setSelected,
      onRowClick: openRow
    }), listStatus === 'ready' && total > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "nk-pager",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "nk-muted",
        children: t('orders.pageOf').replace('{page}', (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatNumber)(page, locale)).replace('{total}', (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatNumber)(totalPages, locale)).replace('{count}', (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatNumber)(total, locale))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        style: {
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_6__.Select, {
          label: t('orders.perPage'),
          value: String(perPage),
          onChange: e => setPerPage(Number(e.target.value)),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: "25",
            children: "25"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: "50",
            children: "50"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
            value: "100",
            children: "100"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
          variant: "secondary",
          size: "sm",
          disabled: page <= 1,
          onClick: () => setPage(p => Math.max(1, p - 1)),
          children: t('orders.prev')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
          variant: "secondary",
          size: "sm",
          disabled: page >= totalPages,
          onClick: () => setPage(p => p + 1),
          children: t('orders.next')
        })]
      })]
    }) : null, selected.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "nk-bulk-bar",
      role: "region",
      "aria-label": t('orders.bulkBar'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
        children: t('orders.selected').replace('{n}', (0,_format__WEBPACK_IMPORTED_MODULE_4__.formatNumber)(selected.length, locale))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        size: "sm",
        onClick: () => runBulk('confirmed'),
        children: t('orders.bulkConfirm')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        size: "sm",
        variant: "secondary",
        onClick: () => runBulk('fake'),
        children: t('orders.markFake')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Select, {
        "aria-label": t('orders.bulkStatus'),
        value: bulkStatus,
        onChange: e => setBulkStatus(e.target.value),
        children: BULK_STATUSES.map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
          value: s,
          children: t('status.' + s)
        }, s))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        size: "sm",
        variant: "secondary",
        onClick: () => runBulk(bulkStatus),
        children: t('orders.bulk').replace('{n}', String(selected.length))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        size: "sm",
        variant: "ghost",
        onClick: exportCsv,
        children: t('orders.export')
      })]
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_6__.Drawer, {
      open: drawerId > 0,
      onClose: () => setDrawerId(0),
      title: t('orders.viewOrder'),
      width: 560,
      closeLabel: t('common.close'),
      children: drawerId > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_OrderDetail__WEBPACK_IMPORTED_MODULE_7__.OrderDetail, {
        t: t,
        locale: locale,
        go: go,
        orderId: drawerId,
        variant: "drawer",
        onClose: () => setDrawerId(0),
        onMutate: () => {
          loadList();
          loadCounts();
        }
      }) : null
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Pages.js"
/*!************************************!*\
  !*** ./admin-src/screens/Pages.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pages: () => (/* binding */ Pages)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/layout-grid.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/table.mjs");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);







const TEMPLATES = [{
  value: 'single',
  labelKey: 'pages.single',
  descKey: 'pages.singleBody'
}, {
  value: 'lead',
  labelKey: 'pages.lead',
  descKey: 'pages.leadBody'
}, {
  value: 'festival',
  labelKey: 'pages.festival',
  descKey: 'pages.festivalBody'
}, {
  value: 'fashion',
  labelKey: 'pages.fashion',
  descKey: 'pages.fashionBody'
}, {
  value: 'food',
  labelKey: 'pages.food',
  descKey: 'pages.foodBody'
}, {
  value: 'health',
  labelKey: 'pages.health',
  descKey: 'pages.healthBody'
}, {
  value: 'home',
  labelKey: 'pages.home',
  descKey: 'pages.homeBody'
}, {
  value: 'beauty',
  labelKey: 'pages.beauty',
  descKey: 'pages.beautyBody'
}, {
  value: 'gadget',
  labelKey: 'pages.gadget',
  descKey: 'pages.gadgetBody'
}, {
  value: 'blank',
  labelKey: 'pages.blank',
  descKey: 'pages.singleBody'
}];
function Pages({
  t,
  go,
  locale
}) {
  const confirm = (0,_providers__WEBPACK_IMPORTED_MODULE_7__.useConfirm)();
  const {
    success,
    toast
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_7__.useToast)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [pages, setPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [meta, setMeta] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [statusFilter, setStatusFilter] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  const [view, setView] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('grid');
  const [menuId, setMenuId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [modalOpen, setModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [createTemplate, setCreateTemplate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('single');
  const [createLang, setCreateLang] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('en');
  const [createTitle, setCreateTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  function load(pageNum = 1) {
    setStatus('loading');
    const query = new URLSearchParams({
      page: String(pageNum),
      per_page: '24'
    });
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.api)('pages?' + query.toString()).then(data => {
      setPages(data.pages || []);
      setMeta({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0
      });
      setStatus('ready');
    }).catch(err => {
      setError(err.message);
      setStatus('error');
    });
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load(1);
  }, []);
  const filtered = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = search.trim().toLowerCase();
    return pages.filter(page => {
      if (statusFilter === 'publish' && page.status !== 'publish') return false;
      if (statusFilter === 'draft' && page.status !== 'draft') return false;
      if (q && !String(page.title || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pages, search, statusFilter]);
  async function removePage(id) {
    const ok = await confirm({
      title: t('pages.delete'),
      message: t('pages.deleteConfirm'),
      confirmLabel: t('pages.delete'),
      cancelLabel: t('common.cancel'),
      danger: true
    });
    if (!ok) return;
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.api)('pages/' + id, {
      method: 'DELETE'
    }).then(() => {
      success(t('pages.deleted'));
      load(meta.page);
    }).catch(err => setError(err.message));
  }
  function copyLink(page) {
    const link = page.link || '';
    if (!link) {
      toast({
        message: t('pages.noLiveLink')
      });
      return;
    }
    navigator.clipboard?.writeText(link).then(() => success(t('pages.copied'))).catch(() => toast({
      message: link
    }));
  }
  async function duplicatePage(page) {
    setBusy(true);
    try {
      const payload = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.api)('pages/' + page.id).catch(() => ({}));
      const template = payload.template || 'single';
      const language = payload.language || 'en';
      const created = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.api)('pages', {
        method: 'POST',
        body: {
          template,
          language,
          title: (page.title || t('editor.untitled')) + ' (2)'
        }
      });
      success(t('pages.duplicated'));
      go('pages/' + created.id);
    } catch (err) {
      toast({
        message: err.message || t('common.error')
      });
    } finally {
      setBusy(false);
      setMenuId(0);
    }
  }
  function createPage() {
    setBusy(true);
    (0,_api__WEBPACK_IMPORTED_MODULE_5__.api)('pages', {
      method: 'POST',
      body: {
        template: createTemplate,
        language: createLang,
        title: createTitle.trim()
      }
    }).then(page => {
      setModalOpen(false);
      setCreateTitle('');
      go('pages/' + page.id);
    }).catch(err => {
      setError(err.message);
      setBusy(false);
    });
  }
  const templateOptions = TEMPLATES.map(tpl => ({
    value: tpl.value,
    label: t(tpl.labelKey),
    description: t(tpl.descKey)
  }));
  if (status === 'loading' && !pages.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Skeleton, {
        height: 48
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        className: "nk-grid-cards",
        children: [1, 2, 3].map(i => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Skeleton, {
          height: 160
        }, i))
      })]
    });
  }
  if (status === 'error' && !pages.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_4__.Card, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
        className: "nk-muted",
        children: error || t('common.error')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        onClick: () => load(1),
        children: t('common.retry')
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    className: "nk-screen",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h1", {
        children: t('pages.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        className: "nk-screen-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          onClick: () => setModalOpen(true),
          children: t('pages.new')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "nk-filters",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        label: t('pages.search'),
        value: search,
        onChange: e => setSearch(e.target.value),
        placeholder: t('pages.search')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_4__.Select, {
        label: t('pages.status'),
        value: statusFilter,
        onChange: e => setStatusFilter(e.target.value),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
          value: "all",
          children: t('pages.filterAll')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
          value: "publish",
          children: t('pages.filterLive')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
          value: "draft",
          children: t('pages.filterDraft')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "nk-phone-actions",
        role: "group",
        "aria-label": t('pages.viewMode'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
          icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
          "aria-label": t('pages.viewGrid'),
          className: view === 'grid' ? 'is-active' : '',
          onClick: () => setView('grid')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
          icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"],
          "aria-label": t('pages.viewTable'),
          className: view === 'table' ? 'is-active' : '',
          onClick: () => setView('table')
        })]
      })]
    }), filtered.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.EmptyState, {
      title: t('pages.emptyTitle'),
      description: t('pages.emptyBody'),
      action: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        onClick: () => setModalOpen(true),
        children: t('pages.new')
      })
    }) : view === 'grid' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "nk-grid-cards",
      children: filtered.map(page => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("article", {
        className: "nk-page-card",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          className: "nk-page-card-thumb"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          style: {
            margin: 0
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
            children: page.title
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "nk-page-card-meta",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.StatusPill, {
            status: page.status === 'publish' ? 'delivered' : 'pending',
            label: page.status === 'publish' ? t('pages.published') : t('pages.draft')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
            children: [t('pages.visits'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.visits, locale)]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
            children: [t('pages.orders'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.orders, locale)]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
            children: [t('pages.conversion'), ": ", (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.conversion, locale), "%"]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "nk-screen-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
            size: "sm",
            onClick: () => go('pages/' + page.id),
            children: t('pages.edit')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            style: {
              position: 'relative'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
              icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"],
              "aria-label": t('pages.more'),
              onClick: () => setMenuId(menuId === page.id ? 0 : page.id)
            }), menuId === page.id ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
              className: "nk-page-card",
              style: {
                position: 'absolute',
                right: 0,
                top: '100%',
                zIndex: 5,
                minWidth: 160
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
                className: "nk-detail-stack",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    go('pages/' + page.id);
                    setMenuId(0);
                  },
                  children: t('pages.edit')
                }), page.link ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("a", {
                  className: "nk-ui-btn is-ghost is-sm",
                  href: page.link,
                  target: "_blank",
                  rel: "noreferrer",
                  children: t('pages.view')
                }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => copyLink(page),
                  children: t('pages.copyLink')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => duplicatePage(page),
                  disabled: busy,
                  children: t('pages.duplicate')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "danger",
                  size: "sm",
                  onClick: () => {
                    setMenuId(0);
                    removePage(page.id);
                  },
                  children: t('pages.delete')
                })]
              })
            }) : null]
          })]
        })]
      }, page.id))
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Table, {
      columns: [{
        key: 'title',
        label: t('pages.name')
      }, {
        key: 'status',
        label: t('pages.status')
      }, {
        key: 'visits',
        label: t('pages.visits'),
        sortable: true
      }, {
        key: 'orders',
        label: t('pages.orders'),
        sortable: true
      }, {
        key: 'conversion',
        label: t('pages.conversion'),
        sortable: true
      }, {
        key: 'actions',
        label: ''
      }],
      rows: filtered.map(page => ({
        id: page.id,
        title: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => go('pages/' + page.id),
          children: page.title
        }),
        status: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.StatusPill, {
          status: page.status === 'publish' ? 'delivered' : 'pending',
          label: page.status === 'publish' ? t('pages.published') : t('pages.draft')
        }),
        visits: (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.visits, locale),
        orders: (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.orders, locale),
        conversion: `${(0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(page.conversion, locale)}%`,
        actions: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "nk-phone-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
            size: "sm",
            variant: "ghost",
            onClick: () => copyLink(page),
            children: t('pages.copyLink')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
            size: "sm",
            variant: "ghost",
            onClick: () => removePage(page.id),
            children: t('pages.delete')
          })]
        })
      }))
    }), meta.totalPages > 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "nk-pager",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
        className: "nk-muted",
        children: t('pages.pageOf').replace('{page}', (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(meta.page, locale)).replace('{total}', (0,_format__WEBPACK_IMPORTED_MODULE_6__.formatNumber)(meta.totalPages, locale))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "nk-screen-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "secondary",
          size: "sm",
          disabled: meta.page <= 1,
          onClick: () => load(meta.page - 1),
          children: t('pages.prev')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "secondary",
          size: "sm",
          disabled: meta.page >= meta.totalPages,
          onClick: () => load(meta.page + 1),
          children: t('pages.next')
        })]
      })]
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
      open: modalOpen,
      onClose: () => !busy && setModalOpen(false),
      title: t('pages.createModal'),
      footer: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "ghost",
          onClick: () => setModalOpen(false),
          disabled: busy,
          children: t('common.cancel')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
          onClick: createPage,
          loading: busy,
          children: t('pages.new')
        })]
      }),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.RadioCards, {
          legend: t('pages.templatePick'),
          value: createTemplate,
          onChange: setCreateTemplate,
          options: templateOptions
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_4__.Select, {
          label: t('pages.language'),
          value: createLang,
          onChange: e => setCreateLang(e.target.value),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
            value: "en",
            children: t('settings.english')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
            value: "bn",
            children: t('settings.bangla')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
          label: t('pages.pageTitle'),
          value: createTitle,
          onChange: e => setCreateTitle(e.target.value),
          placeholder: t('pages.pageTitlePlaceholder')
        })]
      })
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Payments.js"
/*!***************************************!*\
  !*** ./admin-src/screens/Payments.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Payments: () => (/* binding */ Payments)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const GATEWAYS = ['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
const COURIERS = ['steadfast', 'pathao', 'redx'];
const PROVIDERS = [...GATEWAYS, ...COURIERS];
function generateSecret() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let secret = '';
  for (let i = 0; i < 32; i += 1) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}
function Payments({
  t,
  onSandbox,
  locale
}) {
  void locale;
  const {
    success
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_3__.useToast)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [password, setPassword] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [smsKey, setSmsKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [courierSecrets, setCourierSecrets] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [drawerId, setDrawerId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  function load() {
    setStatus('loading');
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('settings').then(data => {
      setSettings(data);
      setStatus('ready');
    }).catch(err => {
      setError(err.message);
      setStatus('error');
    });
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(load, []);
  function patchGateway(id, partial) {
    setSettings({
      ...settings,
      gateways: {
        ...settings.gateways,
        [id]: {
          ...settings.gateways[id],
          ...partial
        }
      }
    });
  }
  function patchCourier(id, partial) {
    setSettings({
      ...settings,
      couriers: {
        ...settings.couriers,
        [id]: {
          ...(settings.couriers?.[id] || {}),
          ...partial
        }
      }
    });
  }
  function providerLabel(id) {
    if (COURIERS.includes(id)) return t('courier.' + id);
    return t('pay.' + id);
  }
  function providerStatus(id) {
    if (!settings) return 'off';
    const isCourier = COURIERS.includes(id);
    const enabled = isCourier ? Boolean(settings.couriers?.[id]?.enabled) : Boolean(settings.gateways?.[id]?.enabled);
    if (!enabled) return 'off';
    if (id === 'cod') return 'ready';
    if (id === 'sslcommerz') {
      return settings.ssl_ready && settings.sslcommerz_store_id ? 'ready' : 'needs';
    }
    if (id === 'manual_bkash') {
      return settings.walletVerify?.bkash || settings.has_bkash_api ? 'ready' : 'needs';
    }
    if (id === 'manual_nagad') {
      return settings.walletVerify?.nagad || settings.has_nagad_api ? 'ready' : 'needs';
    }
    if (settings.shipping?.couriers?.[id]?.ready) return 'ready';
    return 'needs';
  }
  function statusLabel(code) {
    if (code === 'ready') return t('payments.statusReady');
    if (code === 'needs') return t('payments.statusNeedsKeys');
    return t('payments.statusOff');
  }
  function save(event) {
    event?.preventDefault?.();
    if (!settings) return;
    setSaving(true);
    setError('');
    const body = {
      ...settings,
      sslcommerz_store_passwd: password,
      sms_api_key: smsKey,
      ...courierSecrets
    };
    (0,_api__WEBPACK_IMPORTED_MODULE_2__.api)('settings', {
      method: 'PUT',
      body
    }).then(data => {
      setSettings(data);
      setPassword('');
      setSmsKey('');
      setCourierSecrets({});
      setDrawerId('');
      success(t('payments.saved'));
      onSandbox(Boolean(data.sandbox));
    }).catch(err => setError(err.message)).finally(() => setSaving(false));
  }
  const sslOn = settings && settings.gateways?.sslcommerz?.enabled;
  const sslMissing = sslOn && !settings.ssl_ready && password === '';
  const drawerTitle = drawerId ? providerLabel(drawerId) : '';
  const drawerBody = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!settings || !drawerId) return null;
    if (drawerId === 'cod') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.codHelp')
      });
    }
    if (drawerId === 'manual_bkash' || drawerId === 'manual_nagad') {
      const gw = settings.gateways[drawerId];
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: t('payments.number'),
          value: gw.number || '',
          onChange: e => patchGateway(drawerId, {
            number: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Textarea, {
          label: t('payments.instructions'),
          rows: 3,
          value: gw.instructions || '',
          onChange: e => patchGateway(drawerId, {
            instructions: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
          checked: Boolean(gw.auto_verify),
          onChange: checked => patchGateway(drawerId, {
            auto_verify: checked
          }),
          label: t('payments.autoVerify')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('payments.autoVerifyHelp')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
          padding: false,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "nk-muted",
            style: {
              padding: 12,
              margin: 0
            },
            children: t('payments.autoVerifyNote')
          })
        }), drawerId === 'manual_bkash' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
            label: t('payments.bkashAppKey'),
            value: courierSecrets.bkash_app_key || '',
            onChange: v => setCourierSecrets({
              ...courierSecrets,
              bkash_app_key: v
            }),
            saved: settings.has_bkash_api
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
            label: t('payments.bkashAppSecret'),
            value: courierSecrets.bkash_app_secret || '',
            onChange: v => setCourierSecrets({
              ...courierSecrets,
              bkash_app_secret: v
            }),
            saved: false
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
            label: t('payments.bkashUser'),
            value: courierSecrets.bkash_username || '',
            onChange: v => setCourierSecrets({
              ...courierSecrets,
              bkash_username: v
            }),
            saved: false
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
            label: t('payments.bkashPass'),
            value: courierSecrets.bkash_password || '',
            onChange: v => setCourierSecrets({
              ...courierSecrets,
              bkash_password: v
            }),
            saved: false
          }), settings.walletVerify?.bkash ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
            children: t('payments.walletReady')
          }) : null]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
            label: t('payments.nagadMerchant'),
            value: courierSecrets.nagad_merchant_id || '',
            onChange: v => setCourierSecrets({
              ...courierSecrets,
              nagad_merchant_id: v
            }),
            saved: settings.has_nagad_api
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
            label: t('payments.nagadVerifyUrl'),
            value: courierSecrets.nagad_verify_url || '',
            onChange: e => setCourierSecrets({
              ...courierSecrets,
              nagad_verify_url: e.target.value
            })
          }), settings.walletVerify?.nagad ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
            children: t('payments.walletReady')
          }) : null]
        })]
      });
    }
    if (drawerId === 'sslcommerz') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: t('payments.storeId'),
          value: settings.sslcommerz_store_id || '',
          onChange: e => setSettings({
            ...settings,
            sslcommerz_store_id: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: t('payments.password'),
          value: password,
          onChange: setPassword,
          saved: settings.ssl_ready
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('payments.passwordHelp')
        }), sslMissing ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('payments.missing')
        }) : null]
      });
    }
    if (drawerId === 'steadfast') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: t('payments.apiKey'),
          value: courierSecrets.steadfast_api_key || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            steadfast_api_key: v
          }),
          saved: settings.shipping?.couriers?.steadfast?.has_keys
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: t('payments.secretKey'),
          value: courierSecrets.steadfast_secret_key || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            steadfast_secret_key: v
          }),
          saved: false
        })]
      });
    }
    if (drawerId === 'pathao') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: t('payments.storeId'),
          value: settings.couriers?.pathao?.store_id || '',
          onChange: e => patchCourier('pathao', {
            store_id: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: "Client ID",
          value: courierSecrets.pathao_client_id || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            pathao_client_id: v
          }),
          saved: false
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: "Client secret",
          value: courierSecrets.pathao_client_secret || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            pathao_client_secret: v
          }),
          saved: false
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: "Username",
          value: courierSecrets.pathao_username || '',
          onChange: e => setCourierSecrets({
            ...courierSecrets,
            pathao_username: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: "Password",
          value: courierSecrets.pathao_password || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            pathao_password: v
          }),
          saved: false
        })]
      });
    }
    if (drawerId === 'redx') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-detail-stack",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: t('payments.storeId'),
          value: settings.couriers?.redx?.store_id || '',
          onChange: e => patchCourier('redx', {
            store_id: e.target.value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
          label: t('payments.apiKey'),
          value: courierSecrets.redx_api_key || '',
          onChange: v => setCourierSecrets({
            ...courierSecrets,
            redx_api_key: v
          }),
          saved: settings.shipping?.couriers?.redx?.has_keys
        })]
      });
    }
    return null;
  }, [settings, drawerId, password, courierSecrets, sslMissing, t]);
  if (status === 'loading' && !settings) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Skeleton, {
        height: 48
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('common.loading')
      })]
    });
  }
  if (status === 'error' && !settings) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: error || t('common.error')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: load,
        children: t('common.retry')
      })]
    });
  }
  if (!settings) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
    className: "nk-screen",
    onSubmit: save,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("header", {
      className: "nk-screen-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
          children: t('payments.title')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "nk-muted",
          children: t('payments.intro')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "nk-screen-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
          checked: Boolean(settings.sandbox),
          onChange: checked => {
            setSettings({
              ...settings,
              sandbox: checked
            });
            onSandbox(checked);
          },
          label: settings.sandbox ? t('payments.sandboxMode') : t('payments.live')
        })
      })]
    }), !settings.sandbox ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        style: {
          margin: 0
        },
        children: t('payments.liveWarning')
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "nk-muted",
      children: t('payments.sandboxHelp')
    }), error ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: error
      })
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
      style: {
        margin: 0
      },
      children: t('payments.providers')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "nk-provider-grid",
      children: PROVIDERS.map(id => {
        const isCourier = COURIERS.includes(id);
        const enabled = isCourier ? Boolean(settings.couriers?.[id]?.enabled) : Boolean(settings.gateways?.[id]?.enabled);
        const chip = providerStatus(id);
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "nk-provider-card",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "nk-provider-head",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: providerLabel(id)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
              children: statusLabel(chip)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
            checked: enabled,
            onChange: checked => {
              if (isCourier) patchCourier(id, {
                enabled: checked
              });else patchGateway(id, {
                enabled: checked
              });
            },
            label: t('payments.enabled')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
            type: "button",
            variant: "secondary",
            size: "sm",
            onClick: () => setDrawerId(id),
            children: t('payments.configure')
          })]
        }, id);
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      title: t('payments.webhooks'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.webhooksHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.webhookHeader')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
        label: t('payments.webhookSecret'),
        value: courierSecrets.courier_webhook_secret || '',
        onChange: v => setCourierSecrets({
          ...courierSecrets,
          courier_webhook_secret: v
        }),
        saved: settings.has_courier_webhook_secret
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        type: "button",
        variant: "ghost",
        onClick: () => setCourierSecrets({
          ...courierSecrets,
          courier_webhook_secret: generateSecret()
        }),
        children: t('payments.generateSecret')
      }), (settings.webhookUrls ? Object.entries(settings.webhookUrls) : []).map(([id, url]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.CopyField, {
        label: t('courier.' + id),
        value: url
      }, id))]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
      title: t('payments.smsBlock'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.smsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
        checked: Boolean(settings.sms?.enabled),
        onChange: checked => setSettings({
          ...settings,
          sms: {
            ...(settings.sms || {}),
            enabled: checked
          }
        }),
        label: t('payments.smsEnabled')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
        label: t('payments.smsSender'),
        value: settings.sms?.sender || '',
        onChange: e => setSettings({
          ...settings,
          sms: {
            ...(settings.sms || {}),
            sender: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
        label: t('payments.smsKey'),
        value: smsKey,
        onChange: setSmsKey,
        saved: settings.has_sms_key
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Select, {
        label: t('payments.otpMode'),
        value: settings.sms?.otp_mode || 'risk',
        onChange: e => setSettings({
          ...settings,
          sms: {
            ...(settings.sms || {}),
            otp_mode: e.target.value
          }
        }),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "off",
          children: t('payments.otpOff')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "risk",
          children: t('payments.otpRisk')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "always",
          children: t('payments.otpAlways')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.otpHelp')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "nk-sticky-save",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        type: "submit",
        loading: saving,
        children: t('common.save')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Drawer, {
      open: Boolean(drawerId),
      onClose: () => setDrawerId(''),
      title: drawerTitle,
      width: 420,
      children: [drawerBody, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "nk-screen-actions",
        style: {
          marginTop: 16
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          type: "submit",
          loading: saving,
          children: t('common.save')
        })
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Settings.js"
/*!***************************************!*\
  !*** ./admin-src/screens/Settings.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Settings: () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const TABS = [{
  id: 'general',
  labelKey: 'settings.tabGeneral'
}, {
  id: 'tracking',
  labelKey: 'settings.tabTracking'
}, {
  id: 'sms',
  labelKey: 'settings.tabSms'
}, {
  id: 'fraud',
  labelKey: 'settings.tabFraud'
}, {
  id: 'advanced',
  labelKey: 'settings.tabAdvanced'
}];
function snapshot(settings, capiToken, smsKey, bnDigits) {
  return JSON.stringify({
    settings,
    capiToken,
    smsKey,
    bnDigits
  });
}
function pixelsConfigured(pixels) {
  if (!pixels) {
    return false;
  }
  return Boolean((pixels.meta || '').trim() || (pixels.ga4 || '').trim() || (pixels.tiktok || '').trim());
}
function Settings({
  t,
  locale
}) {
  const {
    success,
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_2__.useToast)();
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [baseline, setBaseline] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('general');
  const [capiToken, setCapiToken] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [smsKey, setSmsKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [bnDigits, setBnDigits] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => window.localStorage.getItem('noksha_bn_digits') === '1');
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  function load() {
    setStatus('loading');
    setError('');
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('settings').then(data => {
      setSettings(data);
      setCapiToken('');
      setSmsKey('');
      const digits = window.localStorage.getItem('noksha_bn_digits') === '1';
      setBnDigits(digits);
      setBaseline(snapshot(data, '', '', digits));
      setStatus('ready');
    }).catch(err => {
      setError(err.message || t('common.error'));
      setStatus('error');
    });
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(load, []);
  const dirty = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!settings) {
      return false;
    }
    return snapshot(settings, capiToken, smsKey, bnDigits) !== baseline;
  }, [settings, capiToken, smsKey, bnDigits, baseline]);
  function patch(partial) {
    setSettings({
      ...settings,
      ...partial
    });
  }
  function discard() {
    if (!baseline) {
      return;
    }
    try {
      const parsed = JSON.parse(baseline);
      setSettings(parsed.settings);
      setCapiToken(parsed.capiToken || '');
      setSmsKey(parsed.smsKey || '');
      setBnDigits(Boolean(parsed.bnDigits));
    } catch {
      load();
    }
  }
  function save(event) {
    event?.preventDefault?.();
    if (!settings || saving) {
      return;
    }
    setSaving(true);
    const body = {
      ...settings
    };
    if (capiToken.trim() !== '') {
      body.meta_capi_token = capiToken.trim();
    }
    if (smsKey.trim() !== '') {
      body.sms_api_key = smsKey.trim();
    }
    ;(0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('settings', {
      method: 'PUT',
      body
    }).then(data => {
      setSettings(data);
      setCapiToken('');
      setSmsKey('');
      window.localStorage.setItem('noksha_bn_digits', bnDigits ? '1' : '0');
      const nextBaseline = snapshot(data, '', '', bnDigits);
      setBaseline(nextBaseline);
      success(t('settings.saved'));
      if (pixelsConfigured(data.pixels)) {
        (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('onboarding', {
          method: 'PUT',
          body: {
            pixels: true
          }
        }).catch(() => {});
      }
    }).catch(err => toastError(err.message || t('common.error'))).finally(() => setSaving(false));
  }
  if (status === 'error') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('settings.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          onClick: load,
          children: t('common.retry')
        })]
      })]
    });
  }
  if (!settings || status === 'loading') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-screen",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('settings.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
        height: 320
      })]
    });
  }
  const otpOptions = [{
    value: 'off',
    label: t('payments.otpOff'),
    description: t('payments.otpHelp')
  }, {
    value: 'risk',
    label: t('payments.otpRisk'),
    description: t('payments.otpHelp')
  }, {
    value: 'always',
    label: t('payments.otpAlways'),
    description: t('payments.otpHelp')
  }];
  let panel = null;
  if (tab === 'general') {
    panel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
      title: t('settings.tabGeneral'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
        label: t('settings.language'),
        value: settings.default_language,
        onChange: e => patch({
          default_language: e.target.value
        }),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "en",
          children: t('settings.english')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "bn",
          children: t('settings.bangla')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.storeName'),
        help: t('settings.storeNameHelp'),
        value: settings.store_name || '',
        onChange: e => patch({
          store_name: e.target.value
        }),
        placeholder: typeof window !== 'undefined' ? window.nokshaBoot?.storeName || '' : ''
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Toggle, {
        label: t('settings.bnDigits'),
        help: t('settings.bnDigitsHelp'),
        checked: bnDigits,
        onChange: setBnDigits
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('settings.regionHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
        label: t('settings.region'),
        value: "bd",
        disabled: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "bd",
          children: t('settings.regionBd')
        })
      })]
    });
  } else if (tab === 'tracking') {
    panel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
      title: t('settings.pixels'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('settings.pixelsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.meta'),
        value: settings.pixels?.meta || '',
        onChange: e => patch({
          pixels: {
            ...settings.pixels,
            meta: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.ga4'),
        value: settings.pixels?.ga4 || '',
        onChange: e => patch({
          pixels: {
            ...settings.pixels,
            ga4: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.tiktok'),
        value: settings.pixels?.tiktok || '',
        onChange: e => patch({
          pixels: {
            ...settings.pixels,
            tiktok: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.metaTest'),
        help: t('settings.metaTestHelp'),
        value: settings.pixels?.meta_test || '',
        onChange: e => patch({
          pixels: {
            ...settings.pixels,
            meta_test: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.SecretField, {
        label: t('settings.metaCapi'),
        help: t('settings.metaCapiHelp'),
        saved: Boolean(settings.has_meta_capi_token),
        savedLabel: t('settings.metaCapiSet'),
        placeholder: t('settings.metaCapiPlaceholder'),
        lockedByConstant: Boolean(settings.locked_by_constant?.meta_capi_token),
        value: capiToken,
        onChange: setCapiToken
      })]
    });
  } else if (tab === 'sms') {
    panel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
      title: t('payments.sms'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.smsHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Toggle, {
        label: t('payments.smsEnabled'),
        checked: Boolean(settings.sms?.enabled),
        onChange: v => patch({
          sms: {
            ...(settings.sms || {}),
            enabled: v
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('payments.smsSender'),
        value: settings.sms?.sender || '',
        onChange: e => patch({
          sms: {
            ...(settings.sms || {}),
            sender: e.target.value
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.SecretField, {
        label: t('payments.smsKey'),
        saved: Boolean(settings.has_sms_key),
        savedLabel: t('payments.secretSet'),
        lockedByConstant: Boolean(settings.locked_by_constant?.sms_api_key),
        value: smsKey,
        onChange: setSmsKey
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.RadioCards, {
        legend: t('payments.otpMode'),
        value: settings.sms?.otp_mode || 'risk',
        onChange: v => patch({
          sms: {
            ...(settings.sms || {}),
            otp_mode: v
          }
        }),
        options: otpOptions
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        type: "number",
        label: t('settings.otpTtl'),
        value: String(settings.sms?.otp_ttl ?? 300),
        onChange: e => patch({
          sms: {
            ...(settings.sms || {}),
            otp_ttl: Number(e.target.value) || 300
          }
        })
      })]
    });
  } else if (tab === 'fraud') {
    panel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
      title: t('settings.tabFraud'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('settings.fraudHelp')
      })
    });
  } else {
    panel = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
      title: t('settings.tabAdvanced'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('settings.advancedHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-screen-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "secondary",
          onClick: () => {
            window.location.hash = '#/payments';
          },
          children: t('nav.payments')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "secondary",
          onClick: () => {
            window.location.hash = '#/brand';
          },
          children: t('nav.brand')
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
    className: "nk-screen",
    onSubmit: save,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("header", {
      className: "nk-screen-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        children: t('settings.title')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-settings-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("nav", {
        className: "nk-settings-nav",
        "aria-label": t('settings.title'),
        children: TABS.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "button",
          className: tab === item.id ? 'is-active' : '',
          onClick: () => setTab(item.id),
          children: t(item.labelKey)
        }, item.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        children: panel
      })]
    }), dirty ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-sticky-save",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "nk-muted",
        children: t('settings.unsaved')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        type: "button",
        variant: "secondary",
        onClick: discard,
        children: t('settings.discard')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        type: "submit",
        disabled: saving,
        children: saving ? t('editor.saving') : t('common.save')
      })]
    }) : null]
  });
}

/***/ },

/***/ "./admin-src/screens/UiKit.js"
/*!************************************!*\
  !*** ./admin-src/screens/UiKit.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UiKit: () => (/* binding */ UiKit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../format */ "./admin-src/format.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/plus.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);






function UiKit({
  t,
  locale
}) {
  const {
    toast,
    success
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_2__.useToast)();
  const [toggle, setToggle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [check, setCheck] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [radio, setRadio] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('a');
  const [combo, setCombo] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [range, setRange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    preset: '7d'
  });
  const [tab, setTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('one');
  const [secret, setSecret] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "nk-uikit",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
        children: t('uikit.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "nk-muted",
        children: t('uikit.help')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: "Buttons"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-uikit-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "primary",
          children: t('common.save')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          children: "Secondary"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "ghost",
          children: "Ghost"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "danger",
          loading: true,
          children: "Danger"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
          "aria-label": "Add",
          icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
          content: "Delete",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
            "aria-label": "Delete",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"]
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: "Forms"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-uikit-row",
        style: {
          alignItems: 'stretch'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
          label: "Name",
          placeholder: "Customer"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_1__.Select, {
          label: "Method",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: "cod",
            children: "COD"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("option", {
            value: "bkash",
            children: "bKash"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Textarea, {
          label: "Note",
          rows: 2
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-uikit-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
          checked: toggle,
          onChange: setToggle,
          label: "Enabled"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Checkbox, {
          checked: check,
          onChange: setCheck,
          label: "Agree"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.RadioCards, {
        value: radio,
        onChange: setRadio,
        options: [{
          value: 'a',
          label: 'Option A',
          description: 'Default'
        }, {
          value: 'b',
          label: 'Option B',
          description: 'Alt'
        }]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Combobox, {
        label: "District",
        value: combo,
        onChange: setCombo,
        options: [{
          value: '47',
          label: 'Dhaka'
        }, {
          value: '10',
          label: 'Chattogram'
        }, {
          value: '35',
          label: 'Khulna'
        }]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: "Status & stats"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-uikit-row",
        children: [['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'returned', 'fake', 'no_answer'].map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatusPill, {
          status: s,
          label: t('status.' + s)
        }, s)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, {
          children: "Badge"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "nk-uikit-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
          label: t('home.todayOrders'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(1250, locale),
          delta: 12,
          sparkline: [4, 8, 6, 10, 9, 14, 12]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.StatCard, {
          label: t('home.revenue'),
          value: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(48200, locale),
          delta: -3,
          sparkline: [20, 18, 22, 19, 17, 16, 15]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "nk-muted",
        children: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatRelative)(Date.now() - 5 * 60 * 1000, locale)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: "Table / empty / skeleton"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Table, {
        columns: [{
          key: 'name',
          label: 'Name',
          sortable: true
        }, {
          key: 'total',
          label: 'Total',
          sortable: true
        }],
        rows: [{
          id: 1,
          name: 'Amina',
          total: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(890, locale)
        }, {
          id: 2,
          name: 'Karim',
          total: (0,_format__WEBPACK_IMPORTED_MODULE_3__.formatMoney)(1200, locale)
        }],
        selectable: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Skeleton, {
        height: 48
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.EmptyState, {
        title: t('uikit.empty'),
        description: t('uikit.emptyBody'),
        action: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: () => success(t('uikit.toast')),
          children: t('common.retry')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: "Tabs / stepper / dates / secrets"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Tabs, {
        value: tab,
        onChange: setTab,
        tabs: [{
          value: 'one',
          label: 'One',
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "nk-muted",
            children: "Panel one"
          })
        }, {
          value: 'two',
          label: 'Two',
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "nk-muted",
            children: "Panel two"
          })
        }]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Stepper, {
        current: 1,
        steps: [{
          label: 'Basics'
        }, {
          label: 'Payments'
        }, {
          label: 'Done'
        }]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.DateRangePicker, {
        value: range,
        onChange: setRange
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.CopyField, {
        label: "Webhook",
        value: "https://example.test/wp-json/noksha/v1/webhooks/pathao"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.SecretField, {
        label: "API key",
        value: secret,
        onChange: setSecret,
        saved: false
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        title: "Card",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "nk-muted",
          children: "Calm commerce operations surface."
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "secondary",
        onClick: () => toast({
          message: t('uikit.toast')
        }),
        children: "Toast"
      })]
    })]
  });
}

/***/ },

/***/ "./admin-src/screens/Welcome.js"
/*!**************************************!*\
  !*** ./admin-src/screens/Welcome.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Welcome: () => (/* binding */ Welcome)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ "./admin-src/api.js");
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../providers */ "./admin-src/providers.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui */ "./admin-src/ui/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const STEPS = [{
  id: 'store',
  labelKey: 'welcome.stepStore'
}, {
  id: 'payments',
  labelKey: 'welcome.stepPayments'
}, {
  id: 'courier',
  labelKey: 'welcome.stepCourier'
}, {
  id: 'page',
  labelKey: 'welcome.stepPage'
}];
function Welcome({
  t,
  go,
  locale
}) {
  const {
    error: toastError
  } = (0,_providers__WEBPACK_IMPORTED_MODULE_2__.useToast)();
  const [step, setStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [template, setTemplate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('single');
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('settings').then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(err => {
      toastError(err.message || t('common.error'));
      setLoading(false);
    });
  }, []);
  function skipWizard(dismiss = false) {
    const tasks = [];
    if (dismiss) {
      tasks.push((0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('onboarding', {
        method: 'PUT',
        body: {
          dismissed: true
        }
      }).catch(() => {}));
    }
    Promise.all(tasks).finally(() => go('home'));
  }
  async function saveSettings(partial) {
    const body = {
      ...settings,
      ...partial
    };
    const data = await (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('settings', {
      method: 'PUT',
      body
    });
    setSettings(data);
    return data;
  }
  async function next() {
    setBusy(true);
    try {
      if (step === 0 && settings) {
        await saveSettings({
          default_language: settings.default_language,
          sms: {
            ...(settings.sms || {}),
            sender: settings.sms?.sender || ''
          }
        });
      }
      if (step === 1 && settings) {
        await saveSettings({
          gateways: {
            ...settings.gateways,
            cod: {
              ...(settings.gateways?.cod || {}),
              enabled: Boolean(settings.gateways?.cod?.enabled)
            }
          }
        });
        (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('onboarding', {
          method: 'PUT',
          body: {
            payments: true
          }
        }).catch(() => {});
      }
      if (step === 3) {
        await (0,_api__WEBPACK_IMPORTED_MODULE_1__.api)('pages', {
          method: 'POST',
          body: {
            template,
            language: settings?.default_language || locale
          }
        });
        go('home');
        return;
      }
      setStep(s => Math.min(s + 1, STEPS.length - 1));
    } catch (err) {
      toastError(err.message || t('common.error'));
    } finally {
      setBusy(false);
    }
  }
  function back() {
    setStep(s => Math.max(0, s - 1));
  }
  const stepMeta = STEPS.map(item => ({
    id: item.id,
    label: t(item.labelKey)
  }));
  let body = null;
  if (loading || !settings) {
    body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "nk-muted",
      children: t('common.loading')
    });
  } else if (step === 0) {
    body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('welcome.storeHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
        label: t('settings.language'),
        value: settings.default_language,
        onChange: e => setSettings({
          ...settings,
          default_language: e.target.value
        }),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "en",
          children: t('settings.english')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "bn",
          children: t('settings.bangla')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        label: t('settings.storeName'),
        value: settings.sms?.sender || '',
        onChange: e => setSettings({
          ...settings,
          sms: {
            ...(settings.sms || {}),
            sender: e.target.value
          }
        })
      })]
    });
  } else if (step === 1) {
    body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('welcome.codHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Toggle, {
        label: t('pay.cod'),
        checked: Boolean(settings.gateways?.cod?.enabled),
        onChange: v => setSettings({
          ...settings,
          gateways: {
            ...settings.gateways,
            cod: {
              ...(settings.gateways?.cod || {}),
              enabled: v
            }
          }
        })
      })]
    });
  } else if (step === 2) {
    body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('welcome.courierHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('payments.couriersHelp')
      })]
    });
  } else {
    body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "nk-muted",
        children: t('welcome.pageHelp')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_ui__WEBPACK_IMPORTED_MODULE_3__.Select, {
        label: t('pages.templatePick'),
        value: template,
        onChange: e => setTemplate(e.target.value),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "single",
          children: t('pages.single')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "lead",
          children: t('pages.lead')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "fashion",
          children: t('pages.fashion')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "food",
          children: t('pages.food')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "health",
          children: t('pages.health')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "home",
          children: t('pages.home')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "beauty",
          children: t('pages.beauty')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
          value: "gadget",
          children: t('pages.gadget')
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "nk-welcome",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "nk-welcome-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
        style: {
          margin: 0
        },
        children: t('welcome.title')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Stepper, {
        steps: stepMeta,
        current: step
      }), body, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "nk-screen-actions",
        style: {
          justifyContent: 'space-between'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
          type: "button",
          variant: "ghost",
          onClick: () => skipWizard(true),
          children: t('welcome.skip')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "nk-screen-actions",
          children: [step > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
            type: "button",
            variant: "secondary",
            onClick: back,
            disabled: busy,
            children: t('welcome.back')
          }) : null, step < STEPS.length - 1 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
            type: "button",
            onClick: next,
            disabled: busy || loading,
            children: step === 2 ? t('welcome.skipStep') : t('welcome.next')
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
            type: "button",
            onClick: next,
            disabled: busy || loading,
            children: t('welcome.finish')
          })]
        })]
      })]
    })
  });
}

/***/ },

/***/ "./admin-src/screens/editorShared.js"
/*!*******************************************!*\
  !*** ./admin-src/screens/editorShared.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Icon: () => (/* binding */ Icon),
/* harmony export */   IconButton: () => (/* binding */ IconButton),
/* harmony export */   SECTION_ICONS: () => (/* binding */ SECTION_ICONS),
/* harmony export */   summaryOf: () => (/* binding */ summaryOf)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const ICONS = {
  back: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
    points: "15 18 9 12 15 6"
  }),
  chevron: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
    points: "9 18 15 12 9 6"
  }),
  next: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
    points: "9 18 15 12 9 6"
  }),
  up: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
    points: "18 15 12 9 6 15"
  }),
  down: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
    points: "6 9 12 15 18 9"
  }),
  eye: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })]
  }),
  eyeOff: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "1",
      y1: "1",
      x2: "23",
      y2: "23"
    })]
  }),
  trash: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "3 6 5 6 21 6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    })]
  }),
  plus: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })]
  }),
  phone: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "5",
      y: "2",
      width: "14",
      height: "20",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "18",
      x2: "12.01",
      y2: "18"
    })]
  }),
  desktop: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "2",
      y: "3",
      width: "20",
      height: "14",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "8",
      y1: "21",
      x2: "16",
      y2: "21"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "17",
      x2: "12",
      y2: "21"
    })]
  }),
  external: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "15 3 21 3 21 9"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "10",
      y1: "14",
      x2: "21",
      y2: "3"
    })]
  }),
  grip: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "9",
      cy: "6",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "15",
      cy: "6",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "9",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "15",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "9",
      cy: "18",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "15",
      cy: "18",
      r: "1"
    })]
  }),
  image: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "8.5",
      cy: "8.5",
      r: "1.5"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "21 15 16 10 5 21"
    })]
  }),
  layout: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "3",
      y1: "9",
      x2: "21",
      y2: "9"
    })]
  }),
  checks: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "9 11 12 14 22 4"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
    })]
  }),
  box: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "3.27 6.96 12 12.01 20.73 6.96"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "22.08",
      x2: "12",
      y2: "12"
    })]
  }),
  clock: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "12 6 12 12 16 14"
    })]
  }),
  star: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polygon", {
    points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  }),
  help: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })]
  }),
  shield: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }),
  code: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "16 18 22 12 16 6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polyline", {
      points: "8 6 2 12 8 18"
    })]
  }),
  cart: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "9",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "20",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
    })]
  }),
  tag: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "7",
      y1: "7",
      x2: "7.01",
      y2: "7"
    })]
  }),
  card: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "1",
      y: "4",
      width: "22",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "1",
      y1: "10",
      x2: "23",
      y2: "10"
    })]
  }),
  link: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    })]
  }),
  drop: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
  }),
  alert: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })]
  }),
  play: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polygon", {
    points: "5 3 19 12 5 21 5 3"
  }),
  list: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "8",
      y1: "6",
      x2: "21",
      y2: "6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "8",
      y1: "12",
      x2: "21",
      y2: "12"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "8",
      y1: "18",
      x2: "21",
      y2: "18"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "3",
      y1: "6",
      x2: "3.01",
      y2: "6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "3",
      y1: "12",
      x2: "3.01",
      y2: "12"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "3",
      y1: "18",
      x2: "3.01",
      y2: "18"
    })]
  }),
  columns: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line", {
      x1: "12",
      y1: "3",
      x2: "12",
      y2: "21"
    })]
  }),
  chat: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
  })
};
const SECTION_ICONS = {
  hero: 'layout',
  benefits: 'checks',
  product: 'box',
  countdown: 'clock',
  reviews: 'star',
  faq: 'help',
  guarantee: 'shield',
  html: 'code',
  order_form: 'cart',
  gallery: 'image',
  video: 'play',
  steps: 'list',
  compare: 'columns',
  whatsapp: 'chat'
};
function Icon({
  name,
  size = 18
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
    className: "nk-icon",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    children: ICONS[name]
  });
}
function IconButton({
  icon,
  label,
  onClick,
  disabled,
  danger,
  active
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
    type: "button",
    className: `nk-icon-btn${danger ? ' is-danger' : ''}${active ? ' is-active' : ''}`,
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, {
      name: icon
    })
  });
}
function summaryOf(section, t) {
  const props = section.props || {};
  const text = section.type === 'html' ? String(props.html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : String(props.title || props.eyebrow || props.text || props.label || props.number || '').trim();
  if (!text) {
    return section.type === 'whatsapp' ? t('editor.waSiteNumber') : t('editor.untitled');
  }
  return text.length > 44 ? text.slice(0, 42) + '…' : text;
}

/***/ },

/***/ "./admin-src/ui/Badge.js"
/*!*******************************!*\
  !*** ./admin-src/ui/Badge.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Badge: () => (/* binding */ Badge)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Badge({
  children,
  variant = 'default',
  className = ''
}) {
  const classes = ['nk-ui-badge', `is-${variant}`, className].filter(Boolean).join(' ');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: classes
  }, children);
}

/***/ },

/***/ "./admin-src/ui/Button.js"
/*!********************************!*\
  !*** ./admin-src/ui/Button.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/loader-circle.mjs");


const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'];
function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const v = VARIANTS.includes(variant) ? variant : 'primary';
  const isDisabled = disabled || loading;
  const classes = ['nk-ui-btn', `is-${v}`, `is-${size}`, className].filter(Boolean).join(' ');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    type,
    className: classes,
    disabled: isDisabled,
    'aria-busy': loading || undefined,
    ...rest
  }, loading ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: 'nk-ui-btn-spinner',
    size: size === 'sm' ? 14 : 16,
    'aria-hidden': true
  }) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: loading ? 'nk-ui-btn-label is-loading' : 'nk-ui-btn-label'
  }, children));
}

/***/ },

/***/ "./admin-src/ui/Card.js"
/*!******************************!*\
  !*** ./admin-src/ui/Card.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Card: () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Card({
  title,
  actions,
  footer,
  children,
  className = '',
  padding = true
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('section', {
    className: ['nk-ui-card', padding ? 'has-padding' : '', className].filter(Boolean).join(' ')
  }, title || actions ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('header', {
    className: 'nk-ui-card-header'
  }, title ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {
    className: 'nk-ui-card-title'
  }, title) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span'), actions ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-card-actions'
  }, actions) : null) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-card-body'
  }, children), footer ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('footer', {
    className: 'nk-ui-card-footer'
  }, footer) : null);
}

/***/ },

/***/ "./admin-src/ui/Checkbox.js"
/*!**********************************!*\
  !*** ./admin-src/ui/Checkbox.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Checkbox: () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");



function Checkbox({
  label,
  help,
  error,
  checked,
  onChange,
  disabled,
  id: idProp,
  indeterminate
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const id = idProp || `nk-checkbox-${autoId}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-checkbox-wrap' + (error ? ' is-error' : '')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('label', {
    className: 'nk-ui-checkbox-label',
    htmlFor: id
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-checkbox-box' + (checked ? ' is-checked' : '') + (indeterminate ? ' is-indeterminate' : '')
  }, checked || indeterminate ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
    size: 14,
    className: 'nk-ui-checkbox-icon',
    'aria-hidden': true
  }) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
    id,
    type: 'checkbox',
    className: 'nk-ui-checkbox-input',
    checked: !!checked,
    disabled,
    ref: el => {
      if (el) {
        el.indeterminate = !!indeterminate;
      }
    },
    onChange: e => onChange?.(e.target.checked, e),
    'aria-invalid': error ? true : undefined
  })), label ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-checkbox-text'
  }, label) : null), error ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'nk-ui-field-error',
    role: 'alert'
  }, error) : null, help && !error ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'nk-ui-field-help'
  }, help) : null);
}

/***/ },

/***/ "./admin-src/ui/Combobox.js"
/*!**********************************!*\
  !*** ./admin-src/ui/Combobox.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Combobox: () => (/* binding */ Combobox)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-down.mjs");
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");



function Combobox({
  options = [],
  value,
  onChange,
  placeholder = '',
  label,
  help,
  error,
  getOptionLabel = o => o?.label ?? String(o),
  getOptionValue = o => o?.value ?? o
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const listId = `${autoId}-listbox`;
  const inputId = `nk-combobox-${autoId}`;
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [query, setQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const rootRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const selected = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => options.find(o => getOptionValue(o) === value), [options, value, getOptionValue]);
  const filtered = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return options;
    }
    return options.filter(o => getOptionLabel(o).toLowerCase().includes(q));
  }, [options, query, getOptionLabel]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  function pick(option) {
    onChange?.(getOptionValue(option), option);
    setQuery('');
    setOpen(false);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FieldWrap__WEBPACK_IMPORTED_MODULE_2__.FieldWrap, {
    id: inputId,
    label,
    help,
    error
  }, describedBy => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    ref: rootRef,
    className: 'nk-ui-combobox' + (open ? ' is-open' : '') + (error ? ' is-error' : '')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-combobox-control'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
    id: inputId,
    type: 'text',
    className: 'nk-ui-input nk-ui-combobox-input',
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': open,
    'aria-controls': listId,
    'aria-activedescendant': undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    placeholder: selected && !open ? getOptionLabel(selected) : placeholder,
    value: open ? query : selected ? getOptionLabel(selected) : query,
    onChange: e => {
      setQuery(e.target.value);
      if (!open) {
        setOpen(true);
      }
    },
    onFocus: () => setOpen(true),
    onKeyDown: e => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: 'nk-ui-combobox-chevron',
    size: 16,
    'aria-hidden': true
  })), open ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('ul', {
    id: listId,
    role: 'listbox',
    className: 'nk-ui-combobox-list'
  }, filtered.length ? filtered.map(opt => {
    const val = getOptionValue(opt);
    const active = val === value;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
      key: String(val),
      role: 'option',
      'aria-selected': active,
      className: 'nk-ui-combobox-option' + (active ? ' is-active' : ''),
      onMouseDown: e => {
        e.preventDefault();
        pick(opt);
      }
    }, getOptionLabel(opt));
  }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
    className: 'nk-ui-combobox-empty',
    role: 'presentation'
  }, 'No results')) : null));
}

/***/ },

/***/ "./admin-src/ui/ConfirmDialog.js"
/*!***************************************!*\
  !*** ./admin-src/ui/ConfirmDialog.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmDialog: () => (/* binding */ ConfirmDialog)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./admin-src/ui/Button.js");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Modal */ "./admin-src/ui/Modal.js");



function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Modal__WEBPACK_IMPORTED_MODULE_2__.Modal, {
    open,
    onClose: onCancel,
    title,
    size: 'sm',
    footer: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      className: 'nk-ui-confirm-actions'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: 'secondary',
      onClick: onCancel
    }, cancelLabel), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: danger ? 'danger' : 'primary',
      onClick: onConfirm
    }, confirmLabel))
  }, message ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'nk-ui-confirm-message'
  }, message) : null);
}

/***/ },

/***/ "./admin-src/ui/CopyField.js"
/*!***********************************!*\
  !*** ./admin-src/ui/CopyField.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CopyField: () => (/* binding */ CopyField)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/copy.mjs");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./admin-src/ui/Button.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Input */ "./admin-src/ui/Input.js");




function CopyField({
  label,
  help,
  value,
  readOnly = true,
  onCopy,
  copyLabel = 'Copy',
  copiedLabel = 'Copied'
}) {
  const [copied, setCopied] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(String(value ?? ''));
      setCopied(true);
      onCopy?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-copy-field'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Input__WEBPACK_IMPORTED_MODULE_4__.Input, {
    label,
    help,
    value: value ?? '',
    readOnly
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: 'secondary',
    size: 'sm',
    className: 'nk-ui-copy-field-btn',
    onClick: copy,
    'aria-live': 'polite'
  }, copied ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
    size: 14,
    'aria-hidden': true
  }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    size: 14,
    'aria-hidden': true
  }), copied ? copiedLabel : copyLabel));
}

/***/ },

/***/ "./admin-src/ui/DateRangePicker.js"
/*!*****************************************!*\
  !*** ./admin-src/ui/DateRangePicker.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateRangePicker: () => (/* binding */ DateRangePicker)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./admin-src/ui/Button.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Input */ "./admin-src/ui/Input.js");



const PRESETS = [{
  id: 'today',
  label: 'Today'
}, {
  id: '7d',
  label: '7 days'
}, {
  id: '30d',
  label: '30 days'
}, {
  id: 'month',
  label: 'This month'
}, {
  id: 'custom',
  label: 'Custom'
}];
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function resolvePreset(preset) {
  const now = new Date();
  const todayStart = startOfDay(now);
  if (preset === 'all') {
    return {
      from: null,
      to: null
    };
  }
  if (preset === 'today') {
    return {
      from: todayStart,
      to: endOfDay(now)
    };
  }
  if (preset === '7d') {
    const from = new Date(todayStart);
    from.setDate(from.getDate() - 6);
    return {
      from,
      to: endOfDay(now)
    };
  }
  if (preset === '30d') {
    const from = new Date(todayStart);
    from.setDate(from.getDate() - 29);
    return {
      from,
      to: endOfDay(now)
    };
  }
  if (preset === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      from,
      to: endOfDay(now)
    };
  }
  return null;
}
function toInputDate(d) {
  if (!d) {
    return '';
  }
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) {
    return '';
  }
  const p = n => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}
function formatShort(d) {
  if (!d) {
    return '';
  }
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) {
    return '';
  }
  return x.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}
function DateRangePicker({
  value,
  onChange,
  presets = PRESETS,
  className = ''
}) {
  const hasCustom = presets.some(p => p.id === 'custom');
  const [mode, setMode] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(value?.preset || presets[0]?.id || '7d');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (value?.preset && value.preset !== mode) {
      setMode(value.preset);
    }
  }, [value?.preset]); // eslint-disable-line react-hooks/exhaustive-deps -- sync external preset only

  const range = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (mode === 'all') {
      return {
        from: null,
        to: null
      };
    }
    if (value?.from && value?.to) {
      return value;
    }
    const resolved = resolvePreset(mode === 'custom' ? '7d' : mode);
    return resolved || {
      from: null,
      to: null
    };
  }, [value, mode]);
  const showInputs = hasCustom && mode === 'custom';
  const summary = !showInputs && mode !== 'all' && range.from && range.to ? `${formatShort(range.from)} – ${formatShort(range.to)}` : '';
  function applyPreset(id) {
    setMode(id);
    if (id === 'custom') {
      const fallback = resolvePreset('7d') || range;
      onChange?.({
        preset: 'custom',
        from: range.from || fallback.from,
        to: range.to || fallback.to
      });
      return;
    }
    if (id === 'all') {
      onChange?.({
        preset: 'all',
        from: null,
        to: null
      });
      return;
    }
    const next = resolvePreset(id);
    onChange?.({
      preset: id,
      ...next
    });
  }
  function setFrom(v) {
    const from = v ? startOfDay(v) : null;
    onChange?.({
      preset: 'custom',
      from,
      to: range.to
    });
    setMode('custom');
  }
  function setTo(v) {
    const to = v ? endOfDay(v) : null;
    onChange?.({
      preset: 'custom',
      from: range.from,
      to
    });
    setMode('custom');
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: ['nk-ui-date-range', className].filter(Boolean).join(' ')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-date-range-presets',
    role: 'group',
    'aria-label': 'Date presets'
  }, presets.map(p => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_1__.Button, {
    key: p.id,
    size: 'sm',
    variant: mode === p.id ? 'primary' : 'ghost',
    className: mode === p.id ? 'is-active' : '',
    onClick: () => applyPreset(p.id)
  }, p.label))), summary ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-date-range-summary'
  }, summary) : null, showInputs ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-date-range-inputs'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Input__WEBPACK_IMPORTED_MODULE_2__.Input, {
    label: 'From',
    type: 'date',
    value: toInputDate(value?.from ?? range.from),
    onChange: e => setFrom(e.target.value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Input__WEBPACK_IMPORTED_MODULE_2__.Input, {
    label: 'To',
    type: 'date',
    value: toInputDate(value?.to ?? range.to),
    onChange: e => setTo(e.target.value)
  })) : null);
}

/***/ },

/***/ "./admin-src/ui/Drawer.js"
/*!********************************!*\
  !*** ./admin-src/ui/Drawer.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Drawer: () => (/* binding */ Drawer)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IconButton */ "./admin-src/ui/IconButton.js");



function Drawer({
  open,
  onClose,
  title,
  children,
  width = 400,
  closeLabel = 'Close'
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!open) {
      return undefined;
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) {
    return null;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-drawer-root'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    type: 'button',
    className: 'nk-ui-drawer-overlay',
    'aria-label': closeLabel,
    onClick: () => onClose?.()
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('aside', {
    className: 'nk-ui-drawer',
    style: {
      '--nk-drawer-width': typeof width === 'number' ? `${width}px` : width
    },
    role: 'dialog',
    'aria-modal': true,
    'aria-label': title || 'Drawer'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('header', {
    className: 'nk-ui-drawer-header'
  }, title ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('h2', {
    className: 'nk-ui-drawer-title'
  }, title) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_IconButton__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"],
    'aria-label': closeLabel,
    onClick: () => onClose?.()
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-drawer-body'
  }, children)));
}

/***/ },

/***/ "./admin-src/ui/EmptyState.js"
/*!************************************!*\
  !*** ./admin-src/ui/EmptyState.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyState: () => (/* binding */ EmptyState)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function EmptyState({
  icon: Icon,
  title,
  description,
  action
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-empty'
  }, Icon ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Icon, {
    className: 'nk-ui-empty-icon',
    size: 40,
    'aria-hidden': true
  }) : null, title ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {
    className: 'nk-ui-empty-title'
  }, title) : null, description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'nk-ui-empty-desc'
  }, description) : null, action ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-empty-action'
  }, action) : null);
}

/***/ },

/***/ "./admin-src/ui/FieldWrap.js"
/*!***********************************!*\
  !*** ./admin-src/ui/FieldWrap.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FieldWrap: () => (/* binding */ FieldWrap)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function FieldWrap({
  id,
  label,
  help,
  error,
  required,
  children
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [errId, helpId].filter(Boolean).join(' ') || undefined;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-field' + (error ? ' is-error' : '')
  }, label ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('label', {
    className: 'nk-ui-label',
    htmlFor: id
  }, label, required ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-required',
    'aria-hidden': true
  }, ' *') : null) : null, describedBy ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-field-control'
  }, children(describedBy)) : children(undefined), error ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    id: errId,
    className: 'nk-ui-field-error',
    role: 'alert'
  }, error) : null, help && !error ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    id: helpId,
    className: 'nk-ui-field-help'
  }, help) : null);
}

/***/ },

/***/ "./admin-src/ui/IconButton.js"
/*!************************************!*\
  !*** ./admin-src/ui/IconButton.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IconButton: () => (/* binding */ IconButton)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function IconButton({
  icon: Icon,
  'aria-label': ariaLabel,
  size = 'md',
  className = '',
  disabled,
  ...rest
}) {
  if (!ariaLabel) {
    throw new Error('IconButton requires aria-label');
  }
  const classes = ['nk-ui-icon-btn', `is-${size}`, className].filter(Boolean).join(' ');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    type: 'button',
    className: classes,
    'aria-label': ariaLabel,
    disabled,
    ...rest
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Icon, {
    size: size === 'sm' ? 16 : size === 'lg' ? 22 : 18,
    'aria-hidden': true
  }));
}

/***/ },

/***/ "./admin-src/ui/Input.js"
/*!*******************************!*\
  !*** ./admin-src/ui/Input.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Input: () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");


function Input({
  label,
  help,
  error,
  id: idProp,
  className = '',
  required,
  ...rest
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const id = idProp || `nk-input-${autoId}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FieldWrap__WEBPACK_IMPORTED_MODULE_1__.FieldWrap, {
    id,
    label,
    help,
    error,
    required
  }, describedBy => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
    id,
    className: ['nk-ui-input', className].filter(Boolean).join(' '),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    required,
    ...rest
  }));
}

/***/ },

/***/ "./admin-src/ui/Modal.js"
/*!*******************************!*\
  !*** ./admin-src/ui/Modal.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IconButton */ "./admin-src/ui/IconButton.js");



function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close'
}) {
  const panelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!open) {
      return undefined;
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }
    document.addEventListener('keydown', onKey);
    const prev = document.activeElement;
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) {
    return null;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-modal-root'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    type: 'button',
    className: 'nk-ui-modal-overlay',
    'aria-label': closeLabel,
    onClick: () => onClose?.()
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    ref: panelRef,
    className: ['nk-ui-modal', `is-${size}`].join(' '),
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': title ? 'nk-modal-title' : undefined,
    tabIndex: -1
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('header', {
    className: 'nk-ui-modal-header'
  }, title ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('h2', {
    id: 'nk-modal-title',
    className: 'nk-ui-modal-title'
  }, title) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_IconButton__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"],
    'aria-label': closeLabel,
    onClick: () => onClose?.()
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-modal-body'
  }, children), footer ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('footer', {
    className: 'nk-ui-modal-footer'
  }, footer) : null));
}

/***/ },

/***/ "./admin-src/ui/RadioCards.js"
/*!************************************!*\
  !*** ./admin-src/ui/RadioCards.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RadioCards: () => (/* binding */ RadioCards)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function RadioCards({
  name,
  value,
  onChange,
  options = [],
  legend,
  className = ''
}) {
  const gid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const groupName = name || `nk-radio-${gid}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('fieldset', {
    className: ['nk-ui-radio-cards', className].filter(Boolean).join(' '),
    role: 'radiogroup'
  }, legend ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('legend', {
    className: 'nk-ui-radio-cards-legend'
  }, legend) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-radio-cards-grid'
  }, options.map(opt => {
    const id = `${groupName}-${opt.value}`;
    const checked = value === opt.value;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('label', {
      key: String(opt.value),
      htmlFor: id,
      className: 'nk-ui-radio-card' + (checked ? ' is-checked' : '') + (opt.disabled ? ' is-disabled' : '')
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
      id,
      type: 'radio',
      name: groupName,
      value: opt.value,
      checked,
      disabled: opt.disabled,
      className: 'nk-ui-radio-card-input',
      onChange: () => onChange?.(opt.value, opt)
    }), opt.icon ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-radio-card-icon',
      'aria-hidden': true
    }, opt.icon) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-radio-card-title'
    }, opt.label), opt.description ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-radio-card-desc'
    }, opt.description) : null);
  })));
}

/***/ },

/***/ "./admin-src/ui/SecretField.js"
/*!*************************************!*\
  !*** ./admin-src/ui/SecretField.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SecretField: () => (/* binding */ SecretField)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye-off.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eye.mjs");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./admin-src/ui/Button.js");
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IconButton */ "./admin-src/ui/IconButton.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Input */ "./admin-src/ui/Input.js");





function SecretField({
  label,
  help,
  value,
  onChange,
  onSave,
  onReplace,
  onRemove,
  saved = false,
  lockedByConstant = false,
  placeholder,
  saveLabel = 'Save',
  replaceLabel = 'Replace',
  removeLabel = 'Remove',
  savedLabel = 'Saved'
}) {
  const [visible, setVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [draft, setDraft] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const masked = saved && !draft && !visible;
  const displayValue = lockedByConstant ? '••••••••' : masked ? '••••••••' : draft || value || '';
  if (lockedByConstant) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      className: 'nk-ui-secret-field is-locked'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Input__WEBPACK_IMPORTED_MODULE_5__.Input, {
      label,
      help: help || 'Defined in wp-config.php and cannot be changed here.',
      value: displayValue,
      readOnly: true
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-secret-saved'
    }, savedLabel));
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-secret-field'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Input__WEBPACK_IMPORTED_MODULE_5__.Input, {
    label,
    help,
    type: visible ? 'text' : 'password',
    value: displayValue,
    placeholder,
    onChange: e => {
      setDraft(e.target.value);
      onChange?.(e.target.value);
    },
    readOnly: saved && !draft
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-secret-actions'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_IconButton__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
    icon: visible ? lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"] : lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"],
    'aria-label': visible ? 'Hide secret' : 'Show secret',
    onClick: () => setVisible(v => !v)
  }), saved && !draft ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-secret-saved-row'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-secret-saved'
  }, savedLabel), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: 'secondary',
    size: 'sm',
    onClick: () => {
      onReplace?.();
      setDraft('');
      setVisible(true);
    }
  }, replaceLabel), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: 'ghost',
    size: 'sm',
    onClick: () => onRemove?.()
  }, removeLabel)) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: 'primary',
    size: 'sm',
    onClick: () => onSave?.(draft || value),
    disabled: !draft && !value
  }, saveLabel)));
}

/***/ },

/***/ "./admin-src/ui/Select.js"
/*!********************************!*\
  !*** ./admin-src/ui/Select.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Select: () => (/* binding */ Select)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");


function Select({
  label,
  help,
  error,
  id: idProp,
  className = '',
  required,
  children,
  ...rest
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const id = idProp || `nk-select-${autoId}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FieldWrap__WEBPACK_IMPORTED_MODULE_1__.FieldWrap, {
    id,
    label,
    help,
    error,
    required
  }, describedBy => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('select', {
    id,
    className: ['nk-ui-select', className].filter(Boolean).join(' '),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    required,
    ...rest
  }, children));
}

/***/ },

/***/ "./admin-src/ui/Skeleton.js"
/*!**********************************!*\
  !*** ./admin-src/ui/Skeleton.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Skeleton: () => (/* binding */ Skeleton)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Skeleton({
  className = '',
  width,
  height,
  circle
}) {
  const style = {};
  if (width != null) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height != null) style.height = typeof height === 'number' ? `${height}px` : height;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: ['nk-ui-skeleton', circle ? 'is-circle' : '', className].filter(Boolean).join(' '),
    style,
    'aria-hidden': true
  });
}

/***/ },

/***/ "./admin-src/ui/StatCard.js"
/*!**********************************!*\
  !*** ./admin-src/ui/StatCard.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatCard: () => (/* binding */ StatCard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Sparkline({
  data = [],
  width = 72,
  height = 24
}) {
  const points = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!data.length) {
      return '';
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    return data.map((v, i) => {
      const x = i / Math.max(data.length - 1, 1) * width;
      const y = height - (v - min) / span * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);
  if (!data.length) {
    return null;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('svg', {
    className: 'nk-ui-stat-sparkline',
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    'aria-hidden': true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('polyline', {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    points
  }));
}
function StatCard({
  label,
  value,
  delta,
  sparkline,
  className = ''
}) {
  const deltaNum = delta != null ? Number(delta) : null;
  const deltaClass = deltaNum == null ? '' : deltaNum > 0 ? 'is-up' : deltaNum < 0 ? 'is-down' : 'is-flat';
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: ['nk-ui-stat-card', className].filter(Boolean).join(' ')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-stat-top'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-stat-label'
  }, label), sparkline ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Sparkline, {
    data: sparkline
  }) : null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-stat-value'
  }, value), deltaNum != null ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: ['nk-ui-stat-delta', deltaClass].filter(Boolean).join(' ')
  }, deltaNum > 0 ? '+' : '', deltaNum, '%') : null);
}

/***/ },

/***/ "./admin-src/ui/StatusPill.js"
/*!************************************!*\
  !*** ./admin-src/ui/StatusPill.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusPill: () => (/* binding */ StatusPill)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const STATUS_VAR = {
  pending: '--nk-status-pending',
  awaiting_payment: '--nk-status-awaiting',
  confirmed: '--nk-status-confirmed',
  no_answer: '--nk-status-no-answer',
  fake: '--nk-status-fake',
  paid: '--nk-status-paid',
  shipped: '--nk-status-shipped',
  delivered: '--nk-status-delivered',
  returned: '--nk-status-returned',
  cancelled: '--nk-status-cancelled'
};
function StatusPill({
  status,
  label,
  className = ''
}) {
  const token = STATUS_VAR[status] || '--nk-status-pending';
  const text = label ?? status?.replace(/_/g, ' ');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: ['nk-ui-status-pill', className].filter(Boolean).join(' '),
    style: {
      '--nk-status-color': `var(${token})`
    }
  }, text);
}

/***/ },

/***/ "./admin-src/ui/Stepper.js"
/*!*********************************!*\
  !*** ./admin-src/ui/Stepper.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stepper: () => (/* binding */ Stepper)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");


function Stepper({
  steps = [],
  current = 0,
  className = ''
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('ol', {
    className: ['nk-ui-stepper', className].filter(Boolean).join(' '),
    'aria-label': 'Progress'
  }, steps.map((step, index) => {
    const done = index < current;
    const active = index === current;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
      key: String(step.id ?? index),
      className: 'nk-ui-step' + (done ? ' is-done' : '') + (active ? ' is-active' : ''),
      'aria-current': active ? 'step' : undefined
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-step-marker',
      'aria-hidden': true
    }, done ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
      size: 14
    }) : index + 1), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-step-label'
    }, step.label));
  }));
}

/***/ },

/***/ "./admin-src/ui/Table.js"
/*!*******************************!*\
  !*** ./admin-src/ui/Table.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Table: () => (/* binding */ Table)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Checkbox */ "./admin-src/ui/Checkbox.js");
/* harmony import */ var _EmptyState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EmptyState */ "./admin-src/ui/EmptyState.js");
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Skeleton */ "./admin-src/ui/Skeleton.js");





function SortIcon({
  direction
}) {
  if (direction === 'asc') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
      size: 14,
      'aria-hidden': true
    });
  }
  if (direction === 'desc') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
      size: 14,
      'aria-hidden': true
    });
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    size: 14,
    'aria-hidden': true
  });
}
function Table({
  columns = [],
  rows = [],
  rowKey = row => row.id,
  loading = false,
  emptyTitle = 'No data',
  emptyDescription,
  emptyAction,
  sort,
  onSort,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  getRowSelectable = () => true,
  onRowClick
}) {
  const selected = selectedKeys ?? [];
  const allKeys = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => rows.filter(getRowSelectable).map(r => rowKey(r)), [rows, getRowSelectable, rowKey]);
  const allSelected = allKeys.length > 0 && allKeys.every(k => selected.includes(k));
  const someSelected = allKeys.some(k => selected.includes(k)) && !allSelected;
  function toggleAll(next) {
    onSelectionChange?.(next ? [...allKeys] : []);
  }
  function toggleOne(key, next) {
    if (next) {
      onSelectionChange?.([...new Set([...selected, key])]);
    } else {
      onSelectionChange?.(selected.filter(k => k !== key));
    }
  }
  function handleSort(col) {
    if (!col.sortable || !onSort) {
      return;
    }
    const key = col.key;
    if (!sort || sort.key !== key) {
      onSort({
        key,
        direction: 'asc'
      });
      return;
    }
    onSort({
      key,
      direction: sort.direction === 'asc' ? 'desc' : 'asc'
    });
  }
  if (loading) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      className: 'nk-ui-table-wrap is-loading'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('table', {
      className: 'nk-ui-table'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('thead', null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tr', null, columns.map(col => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('th', {
      key: col.key,
      scope: 'col'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Skeleton__WEBPACK_IMPORTED_MODULE_6__.Skeleton, {
      height: 14,
      width: '60%'
    }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tbody', null, Array.from({
      length: 5
    }).map((_, i) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tr', {
      key: i
    }, columns.map(col => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('td', {
      key: col.key
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Skeleton__WEBPACK_IMPORTED_MODULE_6__.Skeleton, {
      height: 12,
      width: col.key === columns[0]?.key ? '80%' : '50%'
    }))))))));
  }
  if (!rows.length) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      className: 'nk-ui-table-empty'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_EmptyState__WEBPACK_IMPORTED_MODULE_5__.EmptyState, {
      title: emptyTitle,
      description: emptyDescription,
      action: emptyAction
    }));
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-table-wrap'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('table', {
    className: 'nk-ui-table'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('thead', null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tr', null, selectable ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('th', {
    scope: 'col',
    className: 'nk-ui-table-check'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Checkbox__WEBPACK_IMPORTED_MODULE_4__.Checkbox, {
    'aria-label': 'Select all rows',
    checked: allSelected,
    indeterminate: someSelected,
    onChange: toggleAll
  })) : null, columns.map(col => {
    const active = sort?.key === col.key;
    const dir = active ? sort.direction : null;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('th', {
      key: col.key,
      scope: 'col',
      className: col.sortable ? 'is-sortable' : undefined,
      'aria-sort': active ? dir === 'asc' ? 'ascending' : 'descending' : col.sortable ? 'none' : undefined
    }, col.sortable ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
      type: 'button',
      className: 'nk-ui-table-sort',
      onClick: () => handleSort(col)
    }, col.label, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortIcon, {
      direction: active ? dir : null
    })) : col.label);
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tbody', null, rows.map(row => {
    const key = rowKey(row);
    const canSelect = selectable && getRowSelectable(row);
    const isSelected = selected.includes(key);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('tr', {
      key: String(key),
      className: isSelected ? 'is-selected' : undefined,
      'data-label-map': columns.map(c => c.label).join('|'),
      onClick: onRowClick ? () => onRowClick(row) : undefined,
      style: onRowClick ? {
        cursor: 'pointer'
      } : undefined
    }, selectable ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('td', {
      className: 'nk-ui-table-check',
      'data-label': '',
      onClick: onRowClick ? e => e.stopPropagation() : undefined
    }, canSelect ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Checkbox__WEBPACK_IMPORTED_MODULE_4__.Checkbox, {
      'aria-label': `Select row ${key}`,
      checked: isSelected,
      onChange: v => toggleOne(key, v)
    }) : null) : null, columns.map(col => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('td', {
      key: col.key,
      'data-label': col.label
    }, col.render ? col.render(row, col) : row[col.key])));
  }))), rows.map(row => {
    const key = rowKey(row);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('article', {
      key: `card-${key}`,
      className: 'nk-ui-table-card',
      onClick: onRowClick ? () => onRowClick(row) : undefined,
      role: onRowClick ? 'button' : undefined,
      tabIndex: onRowClick ? 0 : undefined,
      onKeyDown: onRowClick ? e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick(row);
        }
      } : undefined
    }, selectable && getRowSelectable(row) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      className: 'nk-ui-table-card-check'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Checkbox__WEBPACK_IMPORTED_MODULE_4__.Checkbox, {
      'aria-label': `Select row ${key}`,
      checked: selected.includes(key),
      onChange: v => toggleOne(key, v)
    })) : null, columns.map(col => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      key: col.key,
      className: 'nk-ui-table-card-row'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-table-card-label'
    }, col.label), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
      className: 'nk-ui-table-card-value'
    }, col.render ? col.render(row, col) : row[col.key]))));
  }));
}

/***/ },

/***/ "./admin-src/ui/Tabs.js"
/*!******************************!*\
  !*** ./admin-src/ui/Tabs.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tabs: () => (/* binding */ Tabs)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Tabs({
  tabs = [],
  value,
  onChange,
  defaultValue,
  className = ''
}) {
  const [internal, setInternal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultValue ?? tabs[0]?.value);
  const active = value !== undefined ? value : internal;
  const setActive = v => {
    if (value === undefined) {
      setInternal(v);
    }
    onChange?.(v);
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: ['nk-ui-tabs', className].filter(Boolean).join(' ')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    role: 'tablist',
    className: 'nk-ui-tabs-list'
  }, tabs.map(tab => {
    const selected = tab.value === active;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
      key: String(tab.value),
      type: 'button',
      role: 'tab',
      id: `tab-${tab.value}`,
      'aria-selected': selected,
      'aria-controls': `panel-${tab.value}`,
      tabIndex: selected ? 0 : -1,
      className: 'nk-ui-tab' + (selected ? ' is-active' : ''),
      disabled: tab.disabled,
      onClick: () => setActive(tab.value)
    }, tab.label);
  })), tabs.map(tab => {
    const selected = tab.value === active;
    if (!selected) {
      return null;
    }
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
      key: String(tab.value),
      role: 'tabpanel',
      id: `panel-${tab.value}`,
      'aria-labelledby': `tab-${tab.value}`,
      className: 'nk-ui-tab-panel',
      tabIndex: 0
    }, tab.content);
  }));
}

/***/ },

/***/ "./admin-src/ui/Textarea.js"
/*!**********************************!*\
  !*** ./admin-src/ui/Textarea.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Textarea: () => (/* binding */ Textarea)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");


function Textarea({
  label,
  help,
  error,
  id: idProp,
  className = '',
  required,
  rows = 4,
  ...rest
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const id = idProp || `nk-textarea-${autoId}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FieldWrap__WEBPACK_IMPORTED_MODULE_1__.FieldWrap, {
    id,
    label,
    help,
    error,
    required
  }, describedBy => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('textarea', {
    id,
    rows,
    className: ['nk-ui-textarea', className].filter(Boolean).join(' '),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    required,
    ...rest
  }));
}

/***/ },

/***/ "./admin-src/ui/Toast.js"
/*!*******************************!*\
  !*** ./admin-src/ui/Toast.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToastProvider: () => (/* binding */ ToastProvider),
/* harmony export */   useToast: () => (/* binding */ useToast)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IconButton */ "./admin-src/ui/IconButton.js");



const ToastContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
let toastId = 0;
function ToastProvider({
  children
}) {
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const dismiss = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(id => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);
  const push = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(toast => {
    const id = ++toastId;
    const duration = toast.duration ?? 4000;
    setItems(prev => [...prev, {
      id,
      variant: 'default',
      ...toast
    }]);
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);
  const api = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    toast: push,
    success: (message, opts) => push({
      message,
      variant: 'success',
      ...opts
    }),
    error: (message, opts) => push({
      message,
      variant: 'error',
      ...opts
    }),
    info: (message, opts) => push({
      message,
      variant: 'info',
      ...opts
    }),
    dismiss
  }), [push, dismiss]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToastContext.Provider, {
    value: api
  }, children, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'nk-ui-toast-region',
    'aria-live': 'polite',
    'aria-relevant': 'additions',
    role: 'status'
  }, items.map(t => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    key: t.id,
    className: `nk-ui-toast is-${t.variant || 'default'}`,
    role: t.variant === 'error' ? 'alert' : 'status'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-toast-message'
  }, t.message), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_IconButton__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
    icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"],
    size: 'sm',
    'aria-label': 'Dismiss notification',
    onClick: () => dismiss(t.id)
  })))));
}
function useToast() {
  const ctx = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

/***/ },

/***/ "./admin-src/ui/Toggle.js"
/*!********************************!*\
  !*** ./admin-src/ui/Toggle.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Toggle: () => (/* binding */ Toggle)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FieldWrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FieldWrap */ "./admin-src/ui/FieldWrap.js");


function Toggle({
  label,
  help,
  error,
  checked,
  onChange,
  disabled,
  id: idProp
}) {
  const autoId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const id = idProp || `nk-toggle-${autoId}`;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_FieldWrap__WEBPACK_IMPORTED_MODULE_1__.FieldWrap, {
    id,
    label,
    help,
    error
  }, () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    id,
    type: 'button',
    role: 'switch',
    className: 'nk-ui-toggle' + (checked ? ' is-on' : ''),
    'aria-checked': !!checked,
    disabled,
    onClick: () => onChange?.(!checked)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-toggle-thumb',
    'aria-hidden': true
  })));
}

/***/ },

/***/ "./admin-src/ui/Tooltip.js"
/*!*********************************!*\
  !*** ./admin-src/ui/Tooltip.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function Tooltip({
  content,
  children,
  placement = 'top'
}) {
  const id = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  const [open, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'nk-ui-tooltip-wrap',
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open && content ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    id,
    role: 'tooltip',
    className: `nk-ui-tooltip is-${placement}`
  }, content) : null);
}

/***/ },

/***/ "./admin-src/ui/index.js"
/*!*******************************!*\
  !*** ./admin-src/ui/index.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Badge: () => (/* reexport safe */ _Badge__WEBPACK_IMPORTED_MODULE_1__.Badge),
/* harmony export */   Button: () => (/* reexport safe */ _Button__WEBPACK_IMPORTED_MODULE_2__.Button),
/* harmony export */   Card: () => (/* reexport safe */ _Card__WEBPACK_IMPORTED_MODULE_3__.Card),
/* harmony export */   Checkbox: () => (/* reexport safe */ _Checkbox__WEBPACK_IMPORTED_MODULE_4__.Checkbox),
/* harmony export */   Combobox: () => (/* reexport safe */ _Combobox__WEBPACK_IMPORTED_MODULE_5__.Combobox),
/* harmony export */   ConfirmDialog: () => (/* reexport safe */ _ConfirmDialog__WEBPACK_IMPORTED_MODULE_6__.ConfirmDialog),
/* harmony export */   CopyField: () => (/* reexport safe */ _CopyField__WEBPACK_IMPORTED_MODULE_7__.CopyField),
/* harmony export */   DateRangePicker: () => (/* reexport safe */ _DateRangePicker__WEBPACK_IMPORTED_MODULE_8__.DateRangePicker),
/* harmony export */   Drawer: () => (/* reexport safe */ _Drawer__WEBPACK_IMPORTED_MODULE_9__.Drawer),
/* harmony export */   EmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_10__.EmptyState),
/* harmony export */   IconButton: () => (/* reexport safe */ _IconButton__WEBPACK_IMPORTED_MODULE_11__.IconButton),
/* harmony export */   Input: () => (/* reexport safe */ _Input__WEBPACK_IMPORTED_MODULE_12__.Input),
/* harmony export */   Modal: () => (/* reexport safe */ _Modal__WEBPACK_IMPORTED_MODULE_13__.Modal),
/* harmony export */   RadioCards: () => (/* reexport safe */ _RadioCards__WEBPACK_IMPORTED_MODULE_14__.RadioCards),
/* harmony export */   SecretField: () => (/* reexport safe */ _SecretField__WEBPACK_IMPORTED_MODULE_15__.SecretField),
/* harmony export */   Select: () => (/* reexport safe */ _Select__WEBPACK_IMPORTED_MODULE_16__.Select),
/* harmony export */   Skeleton: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_17__.Skeleton),
/* harmony export */   StatCard: () => (/* reexport safe */ _StatCard__WEBPACK_IMPORTED_MODULE_18__.StatCard),
/* harmony export */   StatusPill: () => (/* reexport safe */ _StatusPill__WEBPACK_IMPORTED_MODULE_19__.StatusPill),
/* harmony export */   Stepper: () => (/* reexport safe */ _Stepper__WEBPACK_IMPORTED_MODULE_20__.Stepper),
/* harmony export */   Table: () => (/* reexport safe */ _Table__WEBPACK_IMPORTED_MODULE_21__.Table),
/* harmony export */   Tabs: () => (/* reexport safe */ _Tabs__WEBPACK_IMPORTED_MODULE_22__.Tabs),
/* harmony export */   Textarea: () => (/* reexport safe */ _Textarea__WEBPACK_IMPORTED_MODULE_23__.Textarea),
/* harmony export */   ToastProvider: () => (/* reexport safe */ _Toast__WEBPACK_IMPORTED_MODULE_24__.ToastProvider),
/* harmony export */   Toggle: () => (/* reexport safe */ _Toggle__WEBPACK_IMPORTED_MODULE_25__.Toggle),
/* harmony export */   Tooltip: () => (/* reexport safe */ _Tooltip__WEBPACK_IMPORTED_MODULE_26__.Tooltip),
/* harmony export */   useToast: () => (/* reexport safe */ _Toast__WEBPACK_IMPORTED_MODULE_24__.useToast)
/* harmony export */ });
/* harmony import */ var _ui_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui.css */ "./admin-src/ui/ui.css");
/* harmony import */ var _Badge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Badge */ "./admin-src/ui/Badge.js");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Button */ "./admin-src/ui/Button.js");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Card */ "./admin-src/ui/Card.js");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Checkbox */ "./admin-src/ui/Checkbox.js");
/* harmony import */ var _Combobox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Combobox */ "./admin-src/ui/Combobox.js");
/* harmony import */ var _ConfirmDialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ConfirmDialog */ "./admin-src/ui/ConfirmDialog.js");
/* harmony import */ var _CopyField__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CopyField */ "./admin-src/ui/CopyField.js");
/* harmony import */ var _DateRangePicker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DateRangePicker */ "./admin-src/ui/DateRangePicker.js");
/* harmony import */ var _Drawer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Drawer */ "./admin-src/ui/Drawer.js");
/* harmony import */ var _EmptyState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EmptyState */ "./admin-src/ui/EmptyState.js");
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./IconButton */ "./admin-src/ui/IconButton.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Input */ "./admin-src/ui/Input.js");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Modal */ "./admin-src/ui/Modal.js");
/* harmony import */ var _RadioCards__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./RadioCards */ "./admin-src/ui/RadioCards.js");
/* harmony import */ var _SecretField__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./SecretField */ "./admin-src/ui/SecretField.js");
/* harmony import */ var _Select__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Select */ "./admin-src/ui/Select.js");
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Skeleton */ "./admin-src/ui/Skeleton.js");
/* harmony import */ var _StatCard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./StatCard */ "./admin-src/ui/StatCard.js");
/* harmony import */ var _StatusPill__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./StatusPill */ "./admin-src/ui/StatusPill.js");
/* harmony import */ var _Stepper__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./Stepper */ "./admin-src/ui/Stepper.js");
/* harmony import */ var _Table__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./Table */ "./admin-src/ui/Table.js");
/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./Tabs */ "./admin-src/ui/Tabs.js");
/* harmony import */ var _Textarea__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./Textarea */ "./admin-src/ui/Textarea.js");
/* harmony import */ var _Toast__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./Toast */ "./admin-src/ui/Toast.js");
/* harmony import */ var _Toggle__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./Toggle */ "./admin-src/ui/Toggle.js");
/* harmony import */ var _Tooltip__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./Tooltip */ "./admin-src/ui/Tooltip.js");




























/***/ },

/***/ "./admin-src/style.css"
/*!*****************************!*\
  !*** ./admin-src/style.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./admin-src/styles/screens.css"
/*!**************************************!*\
  !*** ./admin-src/styles/screens.css ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./admin-src/styles/shell.css"
/*!************************************!*\
  !*** ./admin-src/styles/shell.css ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./admin-src/styles/tokens.css"
/*!*************************************!*\
  !*** ./admin-src/styles/tokens.css ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./admin-src/ui/ui.css"
/*!*****************************!*\
  !*** ./admin-src/ui/ui.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "./node_modules/lucide-react/dist/esm/Icon.mjs"
/*!*****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.mjs ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/src/utils/mergeClasses.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs");
/* harmony import */ var _shared_src_build_buildLucideIconForReact_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/build/buildLucideIconForReact.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs");
/* harmony import */ var _shared_src_utils_hasA11yProp_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/src/utils/hasA11yProp.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/lucide-react/dist/esm/context.mjs");

"use client";
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */







const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({
    color,
    size,
    width,
    height,
    strokeWidth,
    absoluteStrokeWidth,
    nonScalingStroke,
    className = "",
    children,
    iconNode = [],
    icon = {
      node: iconNode,
      aliases: [],
      size: 24
    },
    ...rest
  }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      nonScalingStroke: contextNonScalingStroke = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = (0,_context_mjs__WEBPACK_IMPORTED_MODULE_4__.useLucideContext)() ?? {};
    const hasAccessibleProp = Boolean(children) || (0,_shared_src_utils_hasA11yProp_mjs__WEBPACK_IMPORTED_MODULE_3__.hasA11yProp)(rest);
    const [name, svgAttributes, builtIconNode = []] = (0,_shared_src_build_buildLucideIconForReact_mjs__WEBPACK_IMPORTED_MODULE_2__["default"])(icon, {
      color: color ?? contextColor,
      width: width ?? size ?? contextSize,
      height: height ?? size ?? contextSize,
      strokeWidth: strokeWidth ?? contextStrokeWidth,
      absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
      nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
      className: (0,_shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__.mergeClasses)(contextClass, className),
      hasA11yProp: hasAccessibleProp,
      attributes: rest
    });
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      name,
      {
        ref,
        ...svgAttributes
      },
      [
        ...builtIconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/context.mjs"
/*!********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/context.mjs ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LucideProvider: () => (/* binding */ LucideProvider),
/* harmony export */   useLucideContext: () => (/* binding */ useLucideContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

"use client";
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const LucideContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});
function LucideProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  nonScalingStroke,
  className
}) {
  const value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      nonScalingStroke,
      className
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, nonScalingStroke, className]
  );
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(LucideContext.Provider, { value }, children);
}
const useLucideContext = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(LucideContext);


//# sourceMappingURL=context.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _shared_src_utils_toLucideIconData_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/src/utils/toLucideIconData.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs");
/* harmony import */ var _shared_src_utils_toPascalCase_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils/toPascalCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs");
/* harmony import */ var _Icon_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Icon.mjs */ "./node_modules/lucide-react/dist/esm/Icon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */






function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? (0,_shared_src_utils_toLucideIconData_mjs__WEBPACK_IMPORTED_MODULE_1__.toLucideIconData)(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ className, ...props }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_mjs__WEBPACK_IMPORTED_MODULE_3__["default"], {
      ref,
      icon: iconData,
      className,
      ...props
    })
  );
  if (iconData.name) {
    Component.displayName = (0,_shared_src_utils_toPascalCase_mjs__WEBPACK_IMPORTED_MODULE_2__.toPascalCase)(iconData.name);
  }
  return Component;
}


//# sourceMappingURL=createLucideIcon.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ArrowDown)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "arrow-down",
  size: 24,
  node: [
    ["path", { d: "M12 5v14", key: "s699le" }],
    ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
  ]
};
__iconData.node;
const ArrowDown = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=arrow-down.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ArrowUpDown)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "arrow-up-down",
  size: 24,
  node: [
    ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
    ["path", { d: "M17 20V4", key: "1ejh1v" }],
    ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
    ["path", { d: "M7 4v16", key: "1glfcx" }]
  ]
};
__iconData.node;
const ArrowUpDown = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=arrow-up-down.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ArrowUp)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "arrow-up",
  size: 24,
  node: [
    ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
    ["path", { d: "M12 19V5", key: "x0mq9r" }]
  ]
};
__iconData.node;
const ArrowUp = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=arrow-up.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/chart-column.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chart-column.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ChartColumn)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "chart-column",
  size: 24,
  node: [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
    ["path", { d: "M18 17V9", key: "2bz60n" }],
    ["path", { d: "M13 17V5", key: "1frdt8" }],
    ["path", { d: "M8 17v-3", key: "17ska0" }]
  ],
  aliases: ["bar-chart-3"]
};
__iconData.node;
const ChartColumn = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=chart-column.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/check.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/check.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Check)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
__iconData.node;
const Check = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=check.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-down.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-down.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ChevronDown)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "chevron-down",
  size: 24,
  node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
};
__iconData.node;
const ChevronDown = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=chevron-down.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ CircleQuestionMark)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "circle-question-mark",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9 9.5a3 2.5 0 016 0c0 2-2 2-3 3.5", key: "1awbb0" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }]
  ],
  aliases: ["help-circle", "circle-help"]
};
__iconData.node;
const CircleQuestionMark = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=circle-question-mark.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/copy.mjs"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/copy.mjs ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Copy)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
__iconData.node;
const Copy = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=copy.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/credit-card.mjs"
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/credit-card.mjs ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ CreditCard)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "credit-card",
  size: 24,
  node: [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }],
    ["path", { d: "M6 14h2", key: "mk7k0u" }]
  ]
};
__iconData.node;
const CreditCard = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=credit-card.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.mjs"
/*!************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.mjs ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ EllipsisVertical)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "ellipsis-vertical",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
    ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
  ],
  aliases: ["more-vertical"]
};
__iconData.node;
const EllipsisVertical = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=ellipsis-vertical.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/external-link.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/external-link.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ExternalLink)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
__iconData.node;
const ExternalLink = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=external-link.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/eye-off.mjs"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/eye-off.mjs ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ EyeOff)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "eye-off",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f"
      }
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a"
      }
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }]
  ]
};
__iconData.node;
const EyeOff = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=eye-off.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/eye.mjs"
/*!**********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/eye.mjs ***!
  \**********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Eye)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "eye",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
__iconData.node;
const Eye = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=eye.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/file-text.mjs"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/file-text.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ FileText)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "file-text",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }]
  ]
};
__iconData.node;
const FileText = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=file-text.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/house.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/house.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ House)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "house",
  size: 24,
  node: [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1"
      }
    ]
  ],
  aliases: ["home"]
};
__iconData.node;
const House = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=house.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/layout-grid.mjs"
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/layout-grid.mjs ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ LayoutGrid)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "layout-grid",
  size: 24,
  node: [
    ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
    ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
    ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
    ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
  ]
};
__iconData.node;
const LayoutGrid = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=layout-grid.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/loader-circle.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/loader-circle.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ LoaderCircle)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"]
};
__iconData.node;
const LoaderCircle = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=loader-circle.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/message-circle.mjs"
/*!*********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/message-circle.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ MessageCircle)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "message-circle",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        key: "1sd12s"
      }
    ]
  ]
};
__iconData.node;
const MessageCircle = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=message-circle.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/monitor.mjs"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/monitor.mjs ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Monitor)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "monitor",
  size: 24,
  node: [
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
    ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
    ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
  ]
};
__iconData.node;
const Monitor = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=monitor.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/moon.mjs"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/moon.mjs ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Moon)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "moon",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        key: "kfwtm"
      }
    ]
  ]
};
__iconData.node;
const Moon = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=moon.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/palette.mjs"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/palette.mjs ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Palette)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "palette",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
        key: "e79jfc"
      }
    ],
    ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
    ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
    ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
    ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
  ]
};
__iconData.node;
const Palette = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=palette.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ PanelLeftClose)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "panel-left-close",
  size: 24,
  node: [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
    ["path", { d: "M9 3v18", key: "fh3hqa" }],
    ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
  ],
  aliases: ["sidebar-close"]
};
__iconData.node;
const PanelLeftClose = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=panel-left-close.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/panel-left.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/panel-left.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ PanelLeft)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "panel-left",
  size: 24,
  node: [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
    ["path", { d: "M9 3v18", key: "fh3hqa" }]
  ],
  aliases: ["sidebar"]
};
__iconData.node;
const PanelLeft = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=panel-left.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/phone.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/phone.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Phone)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "phone",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        key: "9njp5v"
      }
    ]
  ]
};
__iconData.node;
const Phone = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=phone.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/plus.mjs"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/plus.mjs ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Plus)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
__iconData.node;
const Plus = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=plus.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/search.mjs"
/*!*************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/search.mjs ***!
  \*************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Search)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
__iconData.node;
const Search = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=search.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/settings.mjs"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/settings.mjs ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "settings",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
__iconData.node;
const Settings = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=settings.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ ShoppingBag)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "shopping-bag",
  size: 24,
  node: [
    ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
    ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
    [
      "path",
      {
        d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
        key: "o988cm"
      }
    ]
  ]
};
__iconData.node;
const ShoppingBag = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=shopping-bag.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/sun.mjs"
/*!**********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/sun.mjs ***!
  \**********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Sun)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "sun",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
  ]
};
__iconData.node;
const Sun = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=sun.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/table.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/table.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Table)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "table",
  size: 24,
  node: [
    ["path", { d: "M12 3v18", key: "108xh3" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "M3 15h18", key: "5xshup" }]
  ]
};
__iconData.node;
const Table = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=table.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/trash.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/trash.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Trash)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
__iconData.node;
const Trash = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=trash.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/users.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/users.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ Users)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "users",
  size: 24,
  node: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ]
};
__iconData.node;
const Users = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=users.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/x.mjs"
/*!********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/x.mjs ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconData: () => (/* binding */ __iconData),
/* harmony export */   "default": () => (/* binding */ X)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconData = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
__iconData.node;
const X = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(__iconData);


//# sourceMappingURL=x.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs"
/*!*****************************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs ***!
  \*****************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildLucideIconForReact)
/* harmony export */ });
/* harmony import */ var _buildLucideIconNode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buildLucideIconNode.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



function buildLucideIconForReact(icon, params = {}) {
  return (0,_buildLucideIconNode_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])(icon, {
    ...params,
    attributeNames: {
      ...params.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}


//# sourceMappingURL=buildLucideIconForReact.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs"
/*!*************************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs ***!
  \*************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildLucideIconNode)
/* harmony export */ });
/* harmony import */ var _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultAttributes.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs");
/* harmony import */ var _utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/mergeClasses.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */




function isDefined(value) {
  return value !== null && value !== void 0;
}
function buildLucideIconNode(icon, params = {}) {
  const attributeNames = params.attributeNames ?? {};
  const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
  const viewBoxWidth = icon.size ?? icon.width ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["width"];
  const viewBoxHeight = icon.size ?? icon.height ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["height"];
  const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
  const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
  const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
  const className = params.includeDefaultClasses === false ? (0,_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__.mergeClasses)(...classNamesFromClassName) : (0,_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__.mergeClasses)("lucide", ...iconClassNames, ...classNamesFromClassName);
  const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["stroke-width"]) * Number(icon.size ?? icon.width ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["width"]) / Number(params.size ?? params.width ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["width"]) : params.strokeWidth ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]["stroke-width"];
  const attributes = {
    ...Object.entries(_defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]).reduce((attrs, [attrName, value]) => {
      attrs[getAttributeName(attrName)] = value;
      return attrs;
    }, {}),
    ..."color" in params && params.color && {
      [getAttributeName("stroke")]: params.color
    },
    ..."size" in params && isDefined(params.size) && {
      [getAttributeName("width")]: params.size,
      [getAttributeName("height")]: params.size
    },
    ..."width" in params && isDefined(params.width) && {
      [getAttributeName("width")]: params.width
    },
    ..."height" in params && isDefined(params.height) && {
      [getAttributeName("height")]: params.height
    },
    [getAttributeName("stroke-width")]: calculatedStrokeWidth,
    ...className && {
      [getAttributeName("class")]: className
    },
    [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
    ...params.hasA11yProp === false ? {
      [getAttributeName("aria-hidden")]: "true"
    } : {},
    ..."attributes" in params && params.attributes
  };
  return [
    "svg",
    attributes,
    icon.node.map((child) => {
      const [name, attrs, children] = child;
      const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
      return children ? [name, nextAttrs, children] : [name, nextAttrs];
    })
  ];
}


//# sourceMappingURL=buildLucideIconNode.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs"
/*!***********************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};


//# sourceMappingURL=defaultAttributes.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasA11yProp: () => (/* binding */ hasA11yProp)
/* harmony export */ });
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const hasA11yProp = (props) => {
  if (props == null || typeof props !== "object") {
    return false;
  }
  for (const prop in props) {
    if (Object.prototype.hasOwnProperty.call(props, prop) && (prop.startsWith("aria-") || prop === "role" || prop === "title") && props[prop] != null) {
      return true;
    }
  }
  return false;
};


//# sourceMappingURL=hasA11yProp.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs"
/*!******************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses)
/* harmony export */ });
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const mergeClasses = (...classes) => {
  const tokens = /* @__PURE__ */ new Set();
  for (const cls of classes) {
    if (typeof cls !== "string") continue;
    for (const token of cls.split(/\s+/)) {
      if (token) tokens.add(token);
    }
  }
  return [...tokens].join(" ");
};


//# sourceMappingURL=mergeClasses.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase)
/* harmony export */ });
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toCamelCase = (string) => {
  let out = "";
  let upperNext = false;
  for (const ch of string) {
    if (ch === "-" || ch === "_" || ch <= " ") {
      upperNext = out.length > 0;
      continue;
    }
    if (out.length === 0) {
      out += ch.toLowerCase();
    } else {
      out += upperNext ? ch.toUpperCase() : ch;
    }
    upperNext = false;
  }
  return out;
};


//# sourceMappingURL=toCamelCase.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (value) => (value.match(/\d+[xX]\d+|[A-Z]?[a-z]+|[A-Z]|\d+/g) ?? []).join("-").toLowerCase();


//# sourceMappingURL=toKebabCase.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs"
/*!**********************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs ***!
  \**********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toLucideIconData: () => (/* binding */ toLucideIconData)
/* harmony export */ });
/* harmony import */ var _toKebabCase_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toKebabCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



function toLucideIconData(iconName, iconNode, aliases = []) {
  if (iconNode == null) {
    throw new Error("[lucide]: iconNode is required when icon name is used");
  }
  return {
    name: (0,_toKebabCase_mjs__WEBPACK_IMPORTED_MODULE_0__.toKebabCase)(iconName),
    size: 24,
    node: iconNode,
    ...aliases.length > 0 ? { aliases } : {}
  };
}


//# sourceMappingURL=toLucideIconData.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs"
/*!******************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toPascalCase: () => (/* binding */ toPascalCase)
/* harmony export */ });
/* harmony import */ var _toCamelCase_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toCamelCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs");
/**
 * @license lucide-react v1.76.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const toPascalCase = (string) => {
  const camelCase = (0,_toCamelCase_mjs__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


//# sourceMappingURL=toPascalCase.mjs.map


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		const deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn) => {
/******/ 			if(chunkIds) {
/******/ 				deferred.push([chunkIds, fn]);
/******/ 				return;
/******/ 			}
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				let [chunkIds, fn] = deferred[i];
/******/ 				let fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if (__webpack_require__.O.j(chunkIds[j])) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					const r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"admin": 0,
/******/ 			"./style-admin": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = globalThis["webpackChunknoksha"] ||= [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["./style-admin"], () => (__webpack_require__("./admin-src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=admin.js.map