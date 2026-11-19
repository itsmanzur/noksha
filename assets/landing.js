(function () {
  var cfg = window.nokshaFront || {};
  var landing = document.querySelector('.nk-landing');
  if (!landing) {
    return;
  }

  var sessionKey = 'noksha_sid';
  var attrKey = 'noksha_attr';
  var session = '';
  try {
    session = window.localStorage.getItem(sessionKey) || '';
    if (!session) {
      session = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(sessionKey, session);
    }
  } catch (error) {
    session = 'sess' + Date.now().toString(36);
  }

  function cookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function readAttribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'];
    var next = {};
    try {
      next = JSON.parse(window.sessionStorage.getItem(attrKey) || '{}') || {};
    } catch (error) {
      next = {};
    }
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        next[key] = value;
      }
    });
    var fbp = cookie('_fbp');
    var fbc = cookie('_fbc');
    if (fbp) next.fbp = fbp;
    if (fbc) next.fbc = fbc;
    if (next.fbclid && !next.fbc) {
      next.fbc = 'fb.1.' + Date.now() + '.' + next.fbclid;
    }
    try {
      window.sessionStorage.setItem(attrKey, JSON.stringify(next));
    } catch (error) {}
    return next;
  }

  var attribution = readAttribution();

  function eventId() {
    return 'nk_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {
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
    var purchaseSeen = 'noksha_purchase_' + (cfg.purchase.event_id || cfg.purchase.order_number || '');
    try {
      if (!window.sessionStorage.getItem(purchaseSeen)) {
        window.sessionStorage.setItem(purchaseSeen, '1');
        trackPixels('Purchase', cfg.purchase);
      }
    } catch (error) {
      trackPixels('Purchase', cfg.purchase);
    }
  }

  document.querySelectorAll('.nk-count').forEach(function (node) {
    var ends = new Date(node.getAttribute('data-ends')).getTime();
    function tick() {
      if (!ends || Number.isNaN(ends)) {
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
          el.textContent = String(parts[unit]).padStart(2, '0');
        }
      });
    }
    tick();
    window.setInterval(tick, 1000);
  });

  document.querySelectorAll('.nk-faq-item > button').forEach(function (button) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (button.nextElementSibling) {
        button.nextElementSibling.hidden = open;
      }
    });
  });

  var form = landing.querySelector('.nk-form');
  if (!form) {
    return;
  }

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

  var geo = { divisions: [] };
  var division = form.querySelector('[data-geo="division"]');
  var district = form.querySelector('[data-geo="district"]');
  var upazila = form.querySelector('[data-geo="upazila"]');
  var lang = cfg.lang === 'bn' ? 'bn' : 'en';

  function placeholder(select) {
    var option = select && select.querySelector('option');
    return option ? option.textContent : '';
  }

  function fill(select, items, label) {
    if (!select) {
      return;
    }
    var current = select.value;
    select.replaceChildren();
    var first = document.createElement('option');
    first.value = '';
    first.textContent = label || '';
    select.appendChild(first);
    items.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.id;
      option.textContent = item[lang] || item.en;
      select.appendChild(option);
    });
    if (Array.prototype.some.call(select.options, function (option) { return option.value === current; })) {
      select.value = current;
    }
  }

  function districtsOf(id) {
    var found = geo.divisions.find(function (item) { return item.id === id; });
    return found ? found.districts : [];
  }

  function upazilasOf(divisionId, districtId) {
    var found = districtsOf(divisionId).find(function (item) { return item.id === districtId; });
    return found ? found.upazilas : [];
  }

  function currentShipping() {
    var districtId = district ? district.value : '';
    if (districtId && String(districtId) === String(cfg.dhakaDistrictId || '47')) {
      return Number(cfg.shippingInside != null ? cfg.shippingInside : cfg.shipping) || 0;
    }
    return Number(cfg.shippingOutside != null ? cfg.shippingOutside : cfg.shipping) || 0;
  }

  if (division && cfg.geoUrl) {
    var divisionLabel = placeholder(division);
    var districtLabel = placeholder(district);
    var upazilaLabel = placeholder(upazila);
    window.fetch(cfg.geoUrl).then(function (res) { return res.json(); }).then(function (data) {
      geo.divisions = data.divisions || [];
      fill(division, geo.divisions, divisionLabel);
    }).catch(function () {});
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
  }

  function money(amount) {
    if (!amount) {
      return (cfg.strings && cfg.strings.free) || 'Free';
    }
    var digits = Math.round(amount) === amount ? 0 : 2;
    return '৳' + amount.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }

  var qty = landing.querySelector('[name="qty"]');
  var bumpInput = form.querySelector('[name="bump"]');
  function bumpPrice() {
    if (!bumpInput || !bumpInput.checked || !cfg.bump || !cfg.bump.enabled) {
      return 0;
    }
    return Number(cfg.bump.price || 0) || 0;
  }
  function updateTotals() {
    var count = Math.max(1, Math.min(10, Number(qty && qty.value) || 1));
    var sub = (Number(cfg.price || 0) * count) + bumpPrice();
    var shipping = currentShipping();
    var subEl = landing.querySelector('[data-subtotal]');
    var shipEl = landing.querySelector('[data-shipping]');
    var totalEl = landing.querySelector('[data-total]');
    if (subEl) subEl.textContent = money(sub);
    if (shipEl) shipEl.textContent = money(shipping);
    if (totalEl) totalEl.textContent = money(sub + shipping);
  }
  if (qty) {
    qty.addEventListener('input', updateTotals);
  }
  if (bumpInput) {
    bumpInput.addEventListener('change', updateTotals);
  }
  updateTotals();

  var otpBox = form.querySelector('.nk-otp');
  var otpSend = form.querySelector('[data-otp-send]');
  function showOtp() {
    if (otpBox) {
      otpBox.hidden = false;
    }
  }
  function sendOtp() {
    if (cfg.preview || !phoneInput) {
      return;
    }
    post('otp/send', {
      nonce: cfg.nonce,
      phone: phoneInput.value || '',
      lang: cfg.lang || 'en'
    }).then(function () {
      showOtp();
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = (cfg.strings && cfg.strings.otpSent) || 'OK';
      }
    }).catch(function (error) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = error.message || 'Error';
      }
    });
  }
  if (otpSend) {
    otpSend.addEventListener('click', sendOtp);
  }
  if (cfg.otpMode === 'always' && cfg.otpReady) {
    showOtp();
  }

  var trx = form.querySelector('.nk-trx');
  function toggleTrx() {
    if (!trx) {
      return;
    }
    var checked = form.querySelector('input[name="payment_method"]:checked');
    trx.hidden = !checked || checked.value.indexOf('manual_') !== 0;
  }
  form.querySelectorAll('input[name="payment_method"]').forEach(function (input) {
    input.addEventListener('change', toggleTrx);
  });
  toggleTrx();

  var phoneInput = form.querySelector('[name="phone"]');
  var nameInput = form.querySelector('[name="name"]');
  var leadTimer = null;
  function captureLead() {
    if (cfg.preview || !phoneInput) {
      return;
    }
    var phone = String(phoneInput.value || '').replace(/\D+/g, '');
    if (phone.length < 11) {
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
    phoneInput.addEventListener('input', function () {
      window.clearTimeout(leadTimer);
      leadTimer = window.setTimeout(captureLead, 1200);
    });
  }

  var errorBox = form.querySelector('.nk-form-error');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (cfg.preview) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = (cfg.strings && cfg.strings.previewOnly) || '';
      }
      return;
    }
    startCheckout();
    var button = form.querySelector('[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = (cfg.strings && cfg.strings.placing) || button.textContent;
    }
    var data = new window.FormData(form);
    if (qty) {
      data.set('qty', qty.value);
    }
    var purchaseEventId = eventId();
    var label = button ? button.textContent : '';
    post('checkout', {
      nonce: cfg.nonce,
      page_id: cfg.pageId,
      session_id: session,
      event_id: purchaseEventId,
      attribution: attribution,
      variant: cfg.variant || '',
      bump: bumpInput && bumpInput.checked ? 1 : 0,
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
      if (result.purchase) {
        trackPixels('Purchase', result.purchase);
      }
      if (result.redirect) {
        window.location.href = result.redirect;
        return;
      }
      if (result.thanksUrl) {
        window.location.href = result.thanksUrl;
        return;
      }
      form.replaceChildren();
      var box = document.createElement('div');
      box.className = 'nk-thanks';
      var heading = document.createElement('h3');
      heading.textContent = result.heading || '';
      var text = document.createElement('p');
      text.textContent = result.message || '';
      var number = document.createElement('p');
      var strong = document.createElement('strong');
      strong.textContent = (cfg.strings && cfg.strings.orderNumber) || '';
      number.append(strong, document.createTextNode(result.orderNumber ? ' ' + result.orderNumber : ''));
      box.append(heading, text, number);
      form.append(box);
    }).catch(function (error) {
      var payload = error.payload || {};
      if (payload.code === 'noksha_otp_required' || (payload.data && payload.data.otp_required)) {
        showOtp();
        if (!(data.get('otp_code') || '')) {
          sendOtp();
        }
      }
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = error.message || 'Error';
      }
      if (button) {
        button.disabled = false;
        if (label) {
          button.textContent = label;
        }
      }
    });
  });
})();
