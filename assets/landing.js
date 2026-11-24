(function () {
  var cfg = window.nokshaFront || {};
  var landing = document.querySelector('.nk-landing');
  if (!landing) {
    return;
  }

  var lang = cfg.lang === 'bn' ? 'bn' : 'en';
  var strings = cfg.strings || {};

  /* ---- Session & attribution ---- */

  var sessionKey = 'noksha_sid';
  var attrKey = 'noksha_attr';
  var session = '';

  try {
    session = window.localStorage.getItem(sessionKey) || '';
    if (!session) {
      session = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(sessionKey, session);
    }
  } catch (e) {
    session = 'sess' + Date.now().toString(36);
  }

  function cookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function readAttribution() {
    var params = typeof URLSearchParams !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'];
    var next = {};
    try {
      next = JSON.parse(window.sessionStorage.getItem(attrKey) || '{}') || {};
    } catch (err) {
      next = {};
    }
    keys.forEach(function (key) {
      var value = params ? params.get(key) : '';
      if (value) {
        next[key] = value;
      }
    });
    var fbp = cookie('_fbp');
    var fbc = cookie('_fbc');
    if (fbp) {
      next.fbp = fbp;
    }
    if (fbc) {
      next.fbc = fbc;
    }
    if (next.fbclid && !next.fbc) {
      next.fbc = 'fb.1.' + Date.now() + '.' + next.fbclid;
    }
    try {
      window.sessionStorage.setItem(attrKey, JSON.stringify(next));
    } catch (err) {}
    return next;
  }

  var attribution = readAttribution();

  function eventId() {
    return 'nk_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  /* ---- Pixels ---- */

  function trackPixels(name, payload) {
    payload = payload || {};
    try {
      if (typeof window.fbq === 'function' && cfg.pixels && cfg.pixels.meta) {
        if (payload.event_id) {
          window.fbq('track', name, payload, { eventID: payload.event_id });
        } else {
          window.fbq('track', name, payload);
        }
      }
    } catch (err) {}
    try {
      if (typeof window.ttq === 'object' && window.ttq && typeof window.ttq.track === 'function' && cfg.pixels && cfg.pixels.tiktok) {
        var map = { ViewContent: 'ViewContent', InitiateCheckout: 'InitiateCheckout', Purchase: 'CompletePayment' };
        window.ttq.track(map[name] || name, {
          value: payload.value,
          currency: payload.currency || 'BDT',
          content_name: payload.content_name,
          content_ids: payload.content_ids,
          contents: payload.contents,
          quantity: payload.num_items
        });
      }
    } catch (err) {}
    try {
      if (typeof window.gtag === 'function' && cfg.pixels && cfg.pixels.ga4) {
        var gaName = name === 'ViewContent' ? 'view_item' : (name === 'InitiateCheckout' ? 'begin_checkout' : 'purchase');
        window.gtag('event', gaName, {
          currency: payload.currency || 'BDT',
          value: payload.value,
          transaction_id: payload.order_number || payload.event_id,
          items: [{
            item_id: (payload.content_ids && payload.content_ids[0]) || String(cfg.pageId || ''),
            item_name: payload.content_name || cfg.productName || '',
            quantity: payload.num_items || 1
          }]
        });
      }
    } catch (err) {}
  }

  function productPayload(extra) {
    var base = {
      content_name: cfg.productName || '',
      content_ids: [String(cfg.pageId || '')],
      content_type: 'product',
      currency: 'BDT',
      value: Number(cfg.price || 0),
      num_items: 1
    };
    Object.keys(extra || {}).forEach(function (key) {
      base[key] = extra[key];
    });
    return base;
  }

  /* ---- HTTP ---- */

  function post(path, body) {
    return window.fetch(cfg.root + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var failure = new Error(data.message || 'Error');
          failure.payload = data;
          throw failure;
        }
        return data;
      });
    });
  }

  /* ---- PageView ---- */

  if (!cfg.preview && cfg.pageId) {
    var seen = 'noksha_seen_' + cfg.pageId;
    try {
      if (!window.sessionStorage.getItem(seen)) {
        window.sessionStorage.setItem(seen, '1');
        post('events', {
          nonce: cfg.nonce,
          page_id: cfg.pageId,
          event: 'page_view',
          session_id: session,
          variant: cfg.variant || ''
        }).catch(function () {});
      }
    } catch (err) {
      post('events', {
        nonce: cfg.nonce,
        page_id: cfg.pageId,
        event: 'page_view',
        session_id: session,
        variant: cfg.variant || ''
      }).catch(function () {});
    }
    trackPixels('ViewContent', productPayload());
  }

  if (cfg.purchase && !cfg.preview) {
    var purchaseSeenKey = 'noksha_purchase_' + (cfg.purchase.event_id || cfg.purchase.order_number || '');
    try {
      if (!window.sessionStorage.getItem(purchaseSeenKey)) {
        window.sessionStorage.setItem(purchaseSeenKey, '1');
        trackPixels('Purchase', cfg.purchase);
      }
    } catch (err) {
      trackPixels('Purchase', cfg.purchase);
    }
  }

  /* ---- Helpers ---- */

  function pad2(n) {
    n = String(n);
    return n.length < 2 ? '0' + n : n;
  }

  function money(amount) {
    if (!amount) {
      return strings.free || 'Free';
    }
    var digits = Math.round(amount) === amount ? 0 : 2;
    return '৳' + amount.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  function invalidPhoneMessage() {
    if (strings.invalidPhone) {
      return strings.invalidPhone;
    }
    return lang === 'bn'
      ? 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন। ০১ দিয়ে শুরু, ১১ সংখ্যা।'
      : 'Enter a valid Bangladeshi mobile number: 11 digits starting with 01.';
  }

  function digitsOnly(value) {
    return String(value || '').replace(/\D+/g, '');
  }

  function isValidBdPhone(value) {
    var d = digitsOnly(value);
    return /^01[0-9]{9}$/.test(d);
  }

  function refreshNonceIfStale() {
    var created = Number(cfg.nonceCreatedAt || 0);
    var age = (Date.now() / 1000) - created;
    if (!cfg.root || (created && age < 36000)) {
      return Promise.resolve();
    }
    return window.fetch(cfg.root + 'nonce', { credentials: 'same-origin' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.nonce) {
          cfg.nonce = data.nonce;
          cfg.nonceCreatedAt = data.createdAt || Math.floor(Date.now() / 1000);
        }
      })
      .catch(function () {});
  }

  function copyText(text) {
    text = String(text || '');
    if (!text) {
      return Promise.resolve(false);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }

  var ERROR_FIELD_MAP = {
    invalid_phone: 'phone',
    invalid_name: 'name',
    invalid_email: 'email',
    invalid_address: 'address',
    invalid_geo: 'division_id',
    trx_required: 'trx_id',
    invalid_payment: 'payment_method',
    otp_required: 'otp_code'
  };

  function errorCodeToField(code) {
    if (!code) {
      return '';
    }
    var bare = String(code).replace(/^noksha_/, '');
    return ERROR_FIELD_MAP[bare] || '';
  }

  /* ---- Countdown ---- */

  document.querySelectorAll('.nk-count').forEach(function (node) {
    var ends = new Date(node.getAttribute('data-ends')).getTime();
    function tick() {
      if (!ends || isNaN(ends)) {
        return;
      }
      var diff = Math.max(0, ends - Date.now());
      var parts = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60
      };
      Object.keys(parts).forEach(function (unit) {
        var el = node.querySelector('[data-unit="' + unit + '"]');
        if (el) {
          el.textContent = pad2(parts[unit]);
        }
      });
    }
    tick();
    window.setInterval(tick, 1000);
  });

  /* ---- FAQ accordion ---- */

  document.querySelectorAll('.nk-faq').forEach(function (faqRoot) {
    var oneOpen = faqRoot.hasAttribute('data-one-open') || faqRoot.classList.contains('nk-faq-one');
    faqRoot.querySelectorAll('.nk-faq-item > button').forEach(function (button) {
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') === 'true';
        if (oneOpen && !open) {
          faqRoot.querySelectorAll('.nk-faq-item > button[aria-expanded="true"]').forEach(function (other) {
            if (other !== button) {
              other.setAttribute('aria-expanded', 'false');
              if (other.nextElementSibling) {
                other.nextElementSibling.hidden = true;
              }
            }
          });
        }
        button.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (button.nextElementSibling) {
          button.nextElementSibling.hidden = open;
        }
      });
    });
  });

  /* ---- Sticky CTA ---- */

  var stickyBar = document.querySelector('.nk-sticky-cta');
  if (stickyBar) {
    var observeTarget = document.getElementById('nk-order') || landing.querySelector('.nk-form');
    if (observeTarget && typeof IntersectionObserver !== 'undefined') {
      var stickyHidden = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          stickyHidden = entry.isIntersecting;
          stickyBar.classList.toggle('is-hidden', stickyHidden);
          stickyBar.setAttribute('aria-hidden', stickyHidden ? 'true' : 'false');
        });
      }, { threshold: 0.12 });
      io.observe(observeTarget);
    }
    stickyBar.addEventListener('click', function (event) {
      var link = event.target.closest('a[href="#nk-order"], button[data-scroll-order]');
      if (!link && event.target.closest('.nk-sticky-cta')) {
        link = stickyBar.querySelector('a[href="#nk-order"], button[data-scroll-order]');
      }
      var target = document.getElementById('nk-order') || landing.querySelector('.nk-form');
      if (target) {
        event.preventDefault();
        try {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
          target.scrollIntoView(true);
        }
        var focusable = target.querySelector('input, select, textarea, button');
        if (focusable) {
          window.setTimeout(function () { focusable.focus(); }, 400);
        }
      }
    });
  }

  /* ---- Copy buttons ---- */

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var from = btn.getAttribute('data-copy-from');
      var source = from ? document.querySelector(from) : btn;
      var attr = btn.getAttribute('data-copy-attr');
      var text = attr && source ? source.getAttribute(attr) : (source ? (source.textContent || source.value) : btn.getAttribute('data-copy'));
      if (!text && btn.getAttribute('data-copy')) {
        text = btn.getAttribute('data-copy');
      }
      copyText(text).then(function (ok) {
        if (ok) {
          btn.classList.add('is-copied');
          window.setTimeout(function () { btn.classList.remove('is-copied'); }, 1500);
        }
      });
    });
  });

  var form = landing.querySelector('.nk-form');
  if (!form) {
    return;
  }

  var errorBox = form.querySelector('.nk-form-error');
  var phoneInput = form.querySelector('[name="phone"]');
  var nameInput = form.querySelector('[name="name"]');
  var qty = landing.querySelector('[name="qty"]');
  var bumpInput = form.querySelector('[name="bump"]');

  var division = form.querySelector('[data-geo="division"]');
  var district = form.querySelector('[data-geo="district"]');
  var upazila = form.querySelector('[data-geo="upazila"]');

  var geo = { divisions: [] };
  var geoLoaded = false;
  var geoLoading = null;

  function placeholder(select) {
    var option = select && select.querySelector('option');
    return option ? option.textContent : '';
  }

  function clearChildren(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function clearSelect(select) {
    clearChildren(select);
  }

  function fill(select, items, label) {
    if (!select) {
      return;
    }
    var current = select.value;
    clearSelect(select);
    var first = document.createElement('option');
    first.value = '';
    first.textContent = label || '';
    select.appendChild(first);
    items.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.id;
      option.textContent = item[lang] || item.en || item.id;
      select.appendChild(option);
    });
    var found = false;
    for (var i = 0; i < select.options.length; i += 1) {
      if (select.options[i].value === current) {
        found = true;
        break;
      }
    }
    if (found) {
      select.value = current;
    }
    syncComboboxFromSelect(select);
  }

  function districtsOf(id) {
    var found = null;
    geo.divisions.forEach(function (item) {
      if (item.id === id) {
        found = item;
      }
    });
    return found ? found.districts : [];
  }

  function upazilasOf(divisionId, districtId) {
    var list = districtsOf(divisionId);
    var found = null;
    list.forEach(function (item) {
      if (item.id === districtId) {
        found = item;
      }
    });
    return found ? found.upazilas : [];
  }

  function currentShipping() {
    var districtId = district ? String(district.value || '') : '';
    var upazilaId = upazila ? String(upazila.value || '') : '';
    var zones = Array.isArray(cfg.shippingZones) ? cfg.shippingZones : [];
    var fallback = Number(cfg.shippingDefault != null ? cfg.shippingDefault : (cfg.shippingOutside != null ? cfg.shippingOutside : cfg.shipping)) || 0;
    if (zones.length) {
      var i;
      for (i = 0; i < zones.length; i += 1) {
        var zone = zones[i] || {};
        var upazilas = (zone.upazilaIds || []).map(String);
        if (upazilaId && upazilas.indexOf(upazilaId) !== -1) {
          return Number(zone.price != null ? zone.price : fallback) || 0;
        }
      }
      for (i = 0; i < zones.length; i += 1) {
        zone = zones[i] || {};
        var districts = (zone.districtIds || []).map(String);
        if (districtId && districts.indexOf(districtId) !== -1) {
          return Number(zone.price != null ? zone.price : fallback) || 0;
        }
      }
      for (i = 0; i < zones.length; i += 1) {
        zone = zones[i] || {};
        if (!(zone.districtIds || []).length && !(zone.upazilaIds || []).length) {
          return Number(zone.price != null ? zone.price : fallback) || 0;
        }
      }
      return fallback;
    }
    if (districtId && districtId === String(cfg.dhakaDistrictId || '47')) {
      return Number(cfg.shippingInside != null ? cfg.shippingInside : cfg.shipping) || 0;
    }
    return Number(cfg.shippingOutside != null ? cfg.shippingOutside : cfg.shipping) || 0;
  }

  function maxQty() {
    return Math.max(1, Math.min(10, Number(cfg.maxQty) || 10));
  }

  /* ---- WooCommerce variations: price, image and stock follow the choice ---- */

  var variationSelect = landing.querySelector('[data-variation]');

  function applyVariation() {
    if (!variationSelect || !Array.isArray(cfg.variations)) {
      return;
    }
    var id = Number(variationSelect.value);
    var chosen = null;
    cfg.variations.forEach(function (row) {
      if (Number(row.id) === id) {
        chosen = row;
      }
    });
    if (!chosen) {
      return;
    }
    cfg.variationId = id;
    cfg.price = Number(chosen.price) || 0;
    cfg.maxQty = chosen.stock == null ? 10 : Math.max(1, Math.min(10, Number(chosen.stock)));
    if (qty) {
      qty.max = String(cfg.maxQty);
    }
    landing.querySelectorAll('.nk-price-now').forEach(function (el) {
      el.textContent = money(cfg.price);
    });
    landing.querySelectorAll('.nk-price-was').forEach(function (el) {
      var regular = Number(chosen.regularPrice) || 0;
      if (regular > cfg.price) {
        el.textContent = money(regular);
      } else {
        el.textContent = '';
      }
    });
    var sticky = landing.querySelector('.nk-sticky-cta-price');
    if (sticky) {
      sticky.textContent = money(cfg.price);
    }
    if (chosen.imageUrl) {
      landing.querySelectorAll('.nk-hero-media img, .nk-gallery img').forEach(function (img) {
        img.src = chosen.imageUrl;
        img.removeAttribute('srcset');
      });
    }
    updateTotals();
  }

  if (variationSelect) {
    variationSelect.addEventListener('change', applyVariation);
  }

  function bumpPrice() {
    if (!bumpInput || !bumpInput.checked || !cfg.bump || !cfg.bump.enabled) {
      return 0;
    }
    return Number(cfg.bump.price || 0) || 0;
  }

  function updateTotals() {
    var count = Math.max(1, Math.min(maxQty(), Number(qty && qty.value) || 1));
    if (qty) {
      qty.value = String(count);
    }
    var sub = (Number(cfg.price || 0) * count) + bumpPrice();
    var shipping = currentShipping();
    var subEl = landing.querySelector('[data-subtotal]');
    var shipEl = landing.querySelector('[data-shipping]');
    var totalEl = landing.querySelector('[data-total]');
    if (subEl) {
      subEl.textContent = money(sub);
    }
    if (shipEl) {
      shipEl.textContent = money(shipping);
    }
    if (totalEl) {
      totalEl.textContent = money(sub + shipping);
      totalEl.classList.add('nk-total-pop');
      window.setTimeout(function () { totalEl.classList.remove('nk-total-pop'); }, 320);
    }
  }

  /* ---- Geo combobox ---- */

  function comboboxRoot(select) {
    if (!select) {
      return null;
    }
    return select.closest('.nk-combobox');
  }

  function syncComboboxFromSelect(select) {
    var root = comboboxRoot(select);
    if (!root) {
      return;
    }
    var display = root.querySelector('.nk-combobox-display, [data-combobox-display]');
    var search = root.querySelector('.nk-combobox-search, [data-combobox-search]');
    var opt = select.options[select.selectedIndex];
    var text = opt && opt.value ? opt.textContent : '';
    if (display) {
      display.textContent = text;
    }
    if (search && !root.classList.contains('is-open')) {
      search.value = text;
    }
    renderComboboxList(select);
  }

  function renderComboboxList(select) {
    var root = comboboxRoot(select);
    if (!root) {
      return;
    }
    var list = root.querySelector('.nk-combobox-list, [data-combobox-list], ul[role="listbox"]');
    if (!list) {
      return;
    }
    var search = root.querySelector('.nk-combobox-search, [data-combobox-search]');
    var q = search ? String(search.value || '').trim().toLowerCase() : '';
    clearChildren(list);
    for (var i = 0; i < select.options.length; i += 1) {
      var option = select.options[i];
      if (!option.value) {
        continue;
      }
      var label = option.textContent || '';
      if (q && label.toLowerCase().indexOf(q) === -1) {
        continue;
      }
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', option.value);
      li.textContent = label;
      if (select.value === option.value) {
        li.setAttribute('aria-selected', 'true');
      }
      list.appendChild(li);
    }
  }

  function bindCombobox(select) {
    var root = comboboxRoot(select);
    if (!root || root.getAttribute('data-combobox-bound') === '1') {
      return;
    }
    root.setAttribute('data-combobox-bound', '1');
    var search = root.querySelector('.nk-combobox-search, [data-combobox-search]');
    var list = root.querySelector('.nk-combobox-list, [data-combobox-list], ul[role="listbox"]');
    if (!search || !list) {
      return;
    }
    function open() {
      root.classList.add('is-open');
      if (list.hasAttribute('hidden')) {
        list.hidden = false;
      }
      renderComboboxList(select);
    }
    function close() {
      root.classList.remove('is-open');
      list.hidden = true;
      syncComboboxFromSelect(select);
    }
    search.addEventListener('focus', function () {
      ensureGeo().then(open);
    });
    search.addEventListener('input', function () {
      open();
    });
    list.addEventListener('click', function (event) {
      var item = event.target.closest('[data-value]');
      if (!item) {
        return;
      }
      select.value = item.getAttribute('data-value') || '';
      if (typeof Event === 'function') {
        select.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        var ev = document.createEvent('Event');
        ev.initEvent('change', true, true);
        select.dispatchEvent(ev);
      }
      close();
    });
    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        close();
      }
    });
    syncComboboxFromSelect(select);
  }

  function initGeoSelects() {
    if (!division) {
      return;
    }
    var divisionLabel = placeholder(division);
    var districtLabel = placeholder(district);
    var upazilaLabel = placeholder(upazila);
    fill(division, geo.divisions, divisionLabel);
    division.addEventListener('change', function () {
      fill(district, districtsOf(division.value), districtLabel);
      fill(upazila, [], upazilaLabel);
      updateTotals();
    });
    if (district) {
      district.addEventListener('change', function () {
        fill(upazila, upazilasOf(division.value, district.value), upazilaLabel);
        updateTotals();
      });
    }
    [division, district, upazila].forEach(function (sel) {
      if (sel) {
        bindCombobox(sel);
      }
    });
  }

  function ensureGeo() {
    if (geoLoaded) {
      return Promise.resolve();
    }
    if (geoLoading) {
      return geoLoading;
    }
    if (!cfg.geoUrl || !division) {
      geoLoaded = true;
      return Promise.resolve();
    }
    geoLoading = window.fetch(cfg.geoUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        geo.divisions = data.divisions || [];
        geoLoaded = true;
        initGeoSelects();
      })
      .catch(function () {
        geoLoaded = true;
      });
    return geoLoading;
  }

  function bindGeoLazy() {
    var nonceBound = false;
    form.addEventListener('focusin', function (event) {
      if (!nonceBound) {
        nonceBound = true;
        refreshNonceIfStale();
      }
      ensureGeo();
    });
    landing.querySelectorAll('[data-geo]').forEach(function (node) {
      node.addEventListener('focus', function () { ensureGeo(); });
    });
  }

  bindGeoLazy();

  /* ---- Checkout start ---- */

  var started = false;
  var checkoutEventId = eventId();

  function startCheckout() {
    if (started || cfg.preview) {
      return;
    }
    started = true;
    trackPixels('InitiateCheckout', productPayload({
      event_id: checkoutEventId,
      value: Number(cfg.price || 0) + currentShipping()
    }));
    post('events', {
      nonce: cfg.nonce,
      page_id: cfg.pageId,
      event: 'checkout_start',
      session_id: session,
      variant: cfg.variant || ''
    }).catch(function () {
      started = false;
    });
  }

  form.addEventListener('focusin', startCheckout);

  /* ---- Quantity stepper ---- */

  function setQty(next) {
    if (!qty) {
      return;
    }
    var val = Math.max(1, Math.min(maxQty(), Number(next) || 1));
    qty.value = String(val);
    updateTotals();
  }

  landing.querySelectorAll('[data-qty-dec]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setQty((Number(qty && qty.value) || 1) - 1);
    });
  });
  landing.querySelectorAll('[data-qty-inc]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setQty((Number(qty && qty.value) || 1) + 1);
    });
  });
  if (qty) {
    qty.addEventListener('input', updateTotals);
    qty.addEventListener('change', updateTotals);
  }
  if (bumpInput) {
    bumpInput.addEventListener('change', updateTotals);
  }
  updateTotals();

  /* ---- Phone validation ---- */

  var phoneErrorEl = null;

  function phoneLabelWrap() {
    if (!phoneInput) {
      return null;
    }
    return phoneInput.closest('label') || phoneInput.parentElement;
  }

  function ensurePhoneErrorEl() {
    var wrap = phoneLabelWrap();
    if (!wrap) {
      return null;
    }
    if (!phoneErrorEl) {
      phoneErrorEl = wrap.querySelector('.nk-field-error');
      if (!phoneErrorEl) {
        phoneErrorEl = document.createElement('span');
        phoneErrorEl.className = 'nk-field-error';
        phoneErrorEl.setAttribute('role', 'alert');
        phoneErrorEl.hidden = true;
        wrap.appendChild(phoneErrorEl);
      }
    }
    return phoneErrorEl;
  }

  function setPhoneError(show) {
    var el = ensurePhoneErrorEl();
    if (!el) {
      return;
    }
    if (show) {
      el.textContent = invalidPhoneMessage();
      el.hidden = false;
      phoneInput.setAttribute('aria-invalid', 'true');
    } else {
      el.hidden = true;
      el.textContent = '';
      phoneInput.removeAttribute('aria-invalid');
    }
  }

  function validatePhoneLive() {
    if (!phoneInput) {
      return true;
    }
    var raw = String(phoneInput.value || '').trim();
    if (raw === '') {
      setPhoneError(false);
      return false;
    }
    var ok = isValidBdPhone(raw);
    setPhoneError(!ok);
    return ok;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', validatePhoneLive);
    phoneInput.addEventListener('blur', validatePhoneLive);
  }

  /* ---- Lead capture (blur only) ---- */

  function captureLead() {
    if (cfg.preview || !phoneInput) {
      return;
    }
    if (!isValidBdPhone(phoneInput.value)) {
      return;
    }
    post('leads/capture', {
      nonce: cfg.nonce,
      page_id: cfg.pageId,
      session_id: session,
      phone: phoneInput.value || '',
      name: nameInput ? (nameInput.value || '') : ''
    }).catch(function () {});
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', captureLead);
  }

  /* ---- Payment panels ---- */

  var trx = form.querySelector('.nk-trx');
  var walletPanels = form.querySelectorAll('.nk-wallet');

  function togglePaymentPanels() {
    var checked = form.querySelector('input[name="payment_method"]:checked');
    var method = checked ? checked.value : '';
    var isManual = method.indexOf('manual_') === 0;
    if (trx) {
      trx.hidden = !isManual;
    }
    walletPanels.forEach(function (panel) {
      var key = panel.getAttribute('data-wallet') || panel.getAttribute('data-payment') || '';
      panel.hidden = !isManual || (key !== '' && key !== method);
    });
  }

  form.querySelectorAll('input[name="payment_method"]').forEach(function (input) {
    input.addEventListener('change', togglePaymentPanels);
  });
  togglePaymentPanels();

  /* ---- OTP ---- */

  var otpBox = form.querySelector('.nk-otp');
  var otpSend = form.querySelector('[data-otp-send]');
  var otpHidden = form.querySelector('[name="otp_code"]');
  var otpDigitsWrap = form.querySelector('.nk-otp-digits');
  var otpResendSec = 60;
  var otpTimer = null;
  var otpRemaining = 0;

  function showOtp() {
    if (otpBox) {
      otpBox.hidden = false;
    }
  }

  function syncOtpHidden() {
    if (!otpHidden || !otpDigitsWrap) {
      return;
    }
    var parts = [];
    otpDigitsWrap.querySelectorAll('input').forEach(function (input) {
      parts.push(digitsOnly(input.value).slice(0, 1));
    });
    otpHidden.value = parts.join('');
  }

  function bindOtpDigits() {
    if (!otpDigitsWrap) {
      return;
    }
    var inputs = otpDigitsWrap.querySelectorAll('input');
    if (otpHidden && otpHidden.type !== 'hidden') {
      otpHidden.tabIndex = -1;
      otpHidden.setAttribute('aria-hidden', 'true');
    }
    inputs.forEach(function (input, index) {
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('maxlength', '1');
      input.setAttribute('autocomplete', index === 0 ? 'one-time-code' : 'off');
      input.addEventListener('input', function () {
        var v = digitsOnly(input.value).slice(-1);
        input.value = v;
        syncOtpHidden();
        if (v && inputs[index + 1]) {
          inputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && !input.value && inputs[index - 1]) {
          inputs[index - 1].focus();
        }
      });
      input.addEventListener('paste', function (event) {
        var text = '';
        if (event.clipboardData) {
          text = event.clipboardData.getData('text') || '';
        }
        var chars = digitsOnly(text).slice(0, inputs.length);
        if (!chars) {
          return;
        }
        event.preventDefault();
        for (var i = 0; i < inputs.length; i += 1) {
          inputs[i].value = chars.charAt(i) || '';
        }
        syncOtpHidden();
        var focusIndex = Math.min(chars.length, inputs.length - 1);
        inputs[focusIndex].focus();
      });
    });
  }

  function otpSendLabel(seconds) {
    if (seconds > 0) {
      return (strings.otpResendIn || (lang === 'bn' ? 'পাঠানো হয়েছে' : 'Sent')) + ' (' + seconds + 's)';
    }
    return strings.otpSend || (lang === 'bn' ? 'কোড পাঠান' : 'Send code');
  }

  function tickOtpResend() {
    if (!otpSend) {
      return;
    }
    otpRemaining -= 1;
    if (otpRemaining <= 0) {
      window.clearInterval(otpTimer);
      otpTimer = null;
      otpSend.disabled = false;
      otpSend.textContent = otpSendLabel(0);
      return;
    }
    otpSend.textContent = otpSendLabel(otpRemaining);
  }

  function startOtpResendTimer() {
    if (!otpSend) {
      return;
    }
    otpRemaining = otpResendSec;
    otpSend.disabled = true;
    otpSend.textContent = otpSendLabel(otpRemaining);
    if (otpTimer) {
      window.clearInterval(otpTimer);
    }
    otpTimer = window.setInterval(tickOtpResend, 1000);
  }

  function sendOtp() {
    if (cfg.preview || !phoneInput || (otpSend && otpSend.disabled)) {
      return;
    }
    if (!isValidBdPhone(phoneInput.value)) {
      setPhoneError(true);
      phoneInput.focus();
      return;
    }
    post('otp/send', {
      nonce: cfg.nonce,
      phone: phoneInput.value || '',
      lang: cfg.lang || 'en'
    }).then(function () {
      showOtp();
      startOtpResendTimer();
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = strings.otpSent || (lang === 'bn' ? 'কোড পাঠানো হয়েছে' : 'Code sent');
      }
    }).catch(function (error) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = error.message || 'Error';
        errorBox.focus();
      }
    });
  }

  if (otpSend) {
    otpSend.addEventListener('click', sendOtp);
  }
  bindOtpDigits();
  if (cfg.otpMode === 'always' && cfg.otpReady) {
    showOtp();
  }

  /* ---- Form errors ---- */

  function clearFieldErrors() {
    form.querySelectorAll('.is-invalid, [aria-invalid="true"]').forEach(function (el) {
      el.classList.remove('is-invalid');
      if (el.getAttribute('aria-invalid') === 'true' && el !== phoneInput) {
        el.removeAttribute('aria-invalid');
      }
    });
    form.querySelectorAll('.nk-field-error').forEach(function (el) {
      if (el !== phoneErrorEl) {
        el.hidden = true;
        el.textContent = '';
      }
    });
  }

  function markFieldInvalid(name) {
    if (!name) {
      return;
    }
    if (name === 'payment_method') {
      var pm = form.querySelector('input[name="payment_method"]:checked') || form.querySelector('input[name="payment_method"]');
      if (pm) {
        pm.classList.add('is-invalid');
        pm.setAttribute('aria-invalid', 'true');
      }
      return;
    }
    if (name === 'otp_code' && otpDigitsWrap) {
      otpDigitsWrap.classList.add('is-invalid');
      var first = otpDigitsWrap.querySelector('input');
      if (first) {
        first.focus();
      }
      return;
    }
    var field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
  }

  function showFormError(message, fieldName) {
    clearFieldErrors();
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = message || 'Error';
      if (typeof errorBox.focus === 'function') {
        errorBox.setAttribute('tabindex', '-1');
        errorBox.focus();
      }
    }
    if (fieldName) {
      markFieldInvalid(fieldName);
    }
  }

  function clientValidate() {
    var messages = [];
    clearFieldErrors();

    var required = form.querySelectorAll('[required]');
    for (var i = 0; i < required.length; i += 1) {
      var el = required[i];
      if (el.type === 'radio') {
        continue;
      }
      if (!String(el.value || '').trim()) {
        messages.push((el.labels && el.labels[0] ? el.labels[0].textContent : el.name) + (lang === 'bn' ? ' প্রয়োজন' : ' is required'));
        el.classList.add('is-invalid');
      }
    }

    if (phoneInput && String(phoneInput.value || '').trim() && !isValidBdPhone(phoneInput.value)) {
      setPhoneError(true);
      messages.push(invalidPhoneMessage());
    }

    if (messages.length) {
      showFormError(messages.join(' '), phoneInput && !isValidBdPhone(phoneInput.value) ? 'phone' : '');
      return false;
    }
    return true;
  }

  /* ---- Submit ---- */

  function renderThanks(result) {
    form.replaceChildren();
    var box = document.createElement('div');
    box.className = 'nk-thanks';

    var heading = document.createElement('h3');
    heading.textContent = result.heading || strings.thankYou || (lang === 'bn' ? 'ধন্যবাদ' : 'Thank you');

    var text = document.createElement('p');
    text.textContent = result.message || strings.thankYouText || '';

    box.appendChild(heading);
    box.appendChild(text);

    if (result.orderNumber) {
      var orderRow = document.createElement('p');
      orderRow.className = 'nk-thanks-order';
      var label = document.createElement('strong');
      label.textContent = (strings.orderNumber || (lang === 'bn' ? 'অর্ডার নং' : 'Order')) + ' ';
      var code = document.createElement('span');
      code.className = 'nk-order-number';
      code.textContent = result.orderNumber;
      orderRow.appendChild(label);
      orderRow.appendChild(code);

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'nk-btn-ghost';
      copyBtn.setAttribute('data-copy', result.orderNumber);
      copyBtn.textContent = lang === 'bn' ? 'কপি' : 'Copy';
      copyBtn.addEventListener('click', function () {
        copyText(result.orderNumber);
        copyBtn.classList.add('is-copied');
        window.setTimeout(function () { copyBtn.classList.remove('is-copied'); }, 1500);
      });

      orderRow.appendChild(copyBtn);
      box.appendChild(orderRow);
    }

    form.appendChild(box);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (cfg.preview) {
      showFormError(strings.previewOnly || (lang === 'bn' ? 'প্রিভিউ মোডে অর্ডার সম্ভব নয়।' : 'Orders are disabled in preview.'));
      return;
    }
    if (!clientValidate()) {
      return;
    }
    syncOtpHidden();
    startCheckout();

    var button = form.querySelector('[type="submit"]');
    var labelHtml = button ? button.innerHTML : '';
    if (button) {
      button.disabled = true;
      button.classList.add('nk-is-loading');
      if (strings.placing) {
        button.setAttribute('data-label', button.textContent || '');
        button.textContent = strings.placing;
      }
    }

    var data = new window.FormData(form);
    if (qty) {
      data.set('qty', qty.value);
    }
    var purchaseEventId = eventId();

    post('checkout', {
      nonce: cfg.nonce,
      page_id: cfg.pageId,
      session_id: session,
      event_id: purchaseEventId,
      attribution: attribution,
      variant: cfg.variant || '',
      bump: bumpInput && bumpInput.checked ? 1 : 0,
      variation_id: variationSelect ? Number(variationSelect.value) || 0 : 0,
      otp_code: data.get('otp_code') || '',
      name: data.get('name') || '',
      phone: data.get('phone') || '',
      email: data.get('email') || '',
      division_id: data.get('division_id') || '',
      district_id: data.get('district_id') || '',
      upazila_id: data.get('upazila_id') || '',
      address: data.get('address') || '',
      note: data.get('note') || '',
      payment_method: data.get('payment_method') || '',
      trx_id: data.get('trx_id') || '',
      qty: Number(data.get('qty') || 1),
      company_website: data.get('company_website') || ''
    }).then(function (result) {
      if (result.redirect) {
        window.location.href = result.redirect;
        return;
      }
      if (result.purchase) {
        var pKey = 'noksha_purchase_' + (result.purchase.event_id || result.eventId || result.orderNumber || '');
        try {
          if (!window.sessionStorage.getItem(pKey)) {
            window.sessionStorage.setItem(pKey, '1');
            trackPixels('Purchase', result.purchase);
          }
        } catch (err) {
          trackPixels('Purchase', result.purchase);
        }
      }
      if (result.thanksUrl) {
        window.location.href = result.thanksUrl;
        return;
      }
      renderThanks(result);
    }).catch(function (error) {
      var payload = error.payload || {};
      var code = payload.code || '';
      if (code === 'noksha_otp_required' || (payload.data && payload.data.otp_required)) {
        showOtp();
        if (!(data.get('otp_code') || '')) {
          sendOtp();
        }
      }
      var field = errorCodeToField(code);
      showFormError(error.message || 'Error', field);
      if (button) {
        button.disabled = false;
        button.classList.remove('nk-is-loading');
        if (button.getAttribute('data-label')) {
          button.textContent = button.getAttribute('data-label');
        } else if (labelHtml) {
          button.innerHTML = labelHtml;
        }
      }
    });
  });
})();