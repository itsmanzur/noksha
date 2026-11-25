const { test, expect } = require('@playwright/test');
const fs = require('fs');

const fixture = JSON.parse(fs.readFileSync(process.env.NK_E2E_FIXTURE, 'utf8'));

// "৳1,350" -> 1350
const amount = (text) => Number(String(text).replace(/[^\d.]/g, '')) || 0;

test.describe('landing page for a WooCommerce product', () => {
  test('options, add-on, coupon and order', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(fixture.url);

    // Options: the page starts on the first size and follows the choice.
    const select = page.locator('[data-variation]');
    await expect(select).toBeVisible();
    await expect(select.locator('option')).toHaveCount(2);
    await expect(page.locator('.nk-price-now').first()).toContainText('500');

    await select.selectOption(String(fixture.variations.L));
    await expect(page.locator('.nk-price-now').first()).toContainText('650');
    await expect(page.locator('[data-subtotal]')).toContainText('650');

    // Stock: size L has 3 in stock.
    const qty = page.locator('[name="qty"]');
    await expect(qty).toHaveAttribute('max', '3');
    await qty.fill('9');
    await qty.dispatchEvent('change');
    await expect(qty).toHaveValue('3');
    await qty.fill('2');
    await qty.dispatchEvent('change');

    // Add-on: a store product, 200.
    await page.locator('[data-bump-index="0"]').check();
    await expect(page.locator('[data-subtotal]')).toContainText('1,500');

    // Coupon: 10% of the lines.
    await expect(page.locator('#nk-coupon-code')).toBeVisible();
    await page.locator('#nk-coupon-code').fill('e2e10');
    await page.locator('[data-coupon-apply]').click();
    await expect(page.locator('[data-coupon-msg]')).toContainText(/applied/i);
    await expect(page.locator('[data-discount-row]')).toBeVisible();
    await expect(page.locator('[data-discount]')).toContainText('150');
    const subtotal = amount(await page.locator('[data-subtotal]').textContent());
    const shipping = amount(await page.locator('[data-shipping]').textContent());
    const total = amount(await page.locator('[data-total]').textContent());
    // Two pieces reach the first step: 50 off, shown on its own row.
    await expect(page.locator('[data-tier-row]')).toBeVisible();
    const tier = amount(await page.locator('[data-tier]').textContent());
    expect(tier).toBe(50);
    expect(total).toBe(subtotal - tier - 150 + shipping);

    // A wrong coupon shows WooCommerce's reason and takes the discount away.
    await page.locator('#nk-coupon-code').fill('nope');
    await page.locator('[data-coupon-apply]').click();
    await expect(page.locator('[data-coupon-msg]')).toBeVisible();
    await expect(page.locator('[data-discount-row]')).toBeHidden();
    await page.locator('#nk-coupon-code').fill('e2e10');
    await page.locator('[data-coupon-apply]').click();
    await expect(page.locator('[data-discount]')).toContainText('150');

    // Changing the quantity asks WooCommerce again.
    await qty.fill('1');
    await qty.dispatchEvent('change');
    await expect(page.locator('[data-discount]')).toContainText('85');

    // Order: name, phone and the page's own "Delivery time" field.
    await expect(page.locator('[data-field="name"]')).toContainText('Your name');
    await page.locator('select[name="custom[c_when01]"]').selectOption('Evening');
    await page.locator('input[name="name"]').fill('E2E Buyer');
    await page.locator('input[name="phone"]').fill('01999000111');
    await page.locator('.nk-submit').click();
    await page.waitForURL(/nk_order=/, { timeout: 30000 });
    await expect(page.locator('body')).toContainText(/NK-/);

    expect(errors, 'no JavaScript errors on the page').toEqual([]);
  });

  test('delivery charge from WooCommerce zones', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(fixture.shipUrl);
    // The district lists load when the form is first touched.
    await page.locator('input[name="name"]').focus();
    await page.waitForFunction(() => document.querySelectorAll('[data-geo="division"] option').length > 1);

    const pick = (where) => page.evaluate(([division, district]) => {
      const d = document.querySelector('[data-geo="division"]');
      d.value = division;
      d.dispatchEvent(new Event('change', { bubbles: true }));
      const s = document.querySelector('[data-geo="district"]');
      s.value = district;
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }, [where.division, where.district]);
    // What the server says for this district (cost is null when no zone covers it).
    const quote = (where) => page.evaluate(async ([pageId, district]) => {
      const res = await fetch(window.nokshaFront.root + 'shipping?page_id=' + pageId + '&district_id=' + district + '&qty=1&_=' + Date.now());
      return res.json();
    }, [fixture.shipPageId, where.district]);

    for (const name of ['dhaka', 'gazipur', 'sylhet']) {
      const where = fixture.districts[name];
      await pick(where);
      const q = await quote(where);
      expect(q.source).toBe('auto');
      if (q.cost !== null) {
        await expect(page.locator('[data-shipping]'), name).toContainText(String(q.cost));
      }
    }

    // Order to the last district: checkout compares the charge shown with its own.
    // Two steps: payment and the order button come after the details.
    await expect(page.locator('.nk-submit')).toBeHidden();
    await expect(page.locator('.nk-step-count')).toContainText('Step 1 of 2');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('.nk-form-error').first()).toBeVisible();
    await expect(page.locator('.nk-submit')).toBeHidden();
    await page.locator('input[name="name"]').fill('E2E Delivery');
    await page.locator('input[name="phone"]').fill('01999000111');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('.nk-step-count')).toContainText('Step 2 of 2');
    await expect(page.locator('input[name="phone"]')).toBeHidden();
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.locator('input[name="phone"]')).toHaveValue('01999000111');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.locator('.nk-submit').click();
    await page.waitForURL(/nk_order=/, { timeout: 30000 });
    expect(errors, 'no JavaScript errors on the page').toEqual([]);
  });

  test('ad events use the product and option ids', async ({ page }) => {
    // Catch what would go to Meta, and switch the pixel on for this page only.
    await page.addInitScript(() => {
      window.__events = [];
      window.fbq = function () { window.__events.push(Array.prototype.slice.call(arguments)); };
      let config;
      Object.defineProperty(window, 'nokshaFront', {
        configurable: true,
        get() { return config; },
        set(value) { config = value; config.pixels = Object.assign({}, config.pixels, { meta: '1' }); },
      });
    });
    await page.goto(fixture.url);
    const events = () => page.evaluate(() => window.__events.filter((e) => e[0] === 'track').map((e) => ({ name: e[1], ids: (e[2] || {}).content_ids, contents: (e[2] || {}).contents })));
    await expect.poll(async () => (await events()).map((e) => e.name)).toContain('ViewContent');
    const view = (await events()).find((e) => e.name === 'ViewContent');
    expect(view.ids).toEqual([String(fixture.variations.S)]);

    // Choose size L, then start the form: InitiateCheckout carries L's id.
    await page.locator('[data-variation]').selectOption(String(fixture.variations.L));
    await page.locator('input[name="name"]').focus();
    await expect.poll(async () => (await events()).map((e) => e.name)).toContain('InitiateCheckout');
    const start = (await events()).find((e) => e.name === 'InitiateCheckout');
    expect(start.ids).toEqual([String(fixture.variations.L)]);
    expect(start.contents[0].id).toBe(String(fixture.variations.L));
  });

  test('sections for phones only and larger screens only', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(fixture.url);
    await expect(page.locator('.nk-faq').first()).toBeVisible();
    await expect(page.locator('.nk-guarantee')).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.nk-guarantee')).toBeVisible();
    await expect(page.locator('.nk-faq').first()).toBeHidden();
    // The order form shows on both.
    // One id per element: the section is #nk-order (scroll target), the form #nk-order-form,
    // and the quantity box outside the form belongs to it.
    await expect(page.locator('[id="nk-order"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.querySelector('[name="qty"]').form && document.querySelector('[name="qty"]').form.id)).toBe('nk-order-form');
    await expect(page.locator('.nk-submit')).toBeVisible();
  });

  test('sections shown only at some times or stock states', async ({ page }) => {
    await page.goto(fixture.url);
    await expect(page.locator('.nk-rich', { hasText: 'Coming offer' })).toBeHidden();
    await expect(page.locator('.nk-rich', { hasText: 'Back soon' })).toBeHidden();
    await expect(page.locator('.nk-bundles')).toBeVisible();

    // A visitor whose clock is past the start sees it, even from the same (cached) HTML.
    await page.clock.install({ time: Date.now() + 31 * 24 * 3600 * 1000 });
    await page.goto(fixture.url);
    await expect(page.locator('.nk-rich', { hasText: 'Coming offer' })).toBeVisible();
    await expect(page.locator('.nk-rich', { hasText: 'Back soon' })).toBeHidden();
  });

  test('live words follow the chosen option', async ({ page }) => {
    await page.goto(fixture.url);
    const heading = page.locator('.nk-product h2');
    await expect(heading).toContainText('Now ৳500');
    await page.locator('[data-variation]').selectOption(String(fixture.variations.L));
    await expect(heading).toContainText('Now ৳650');
    await expect(heading.locator('[data-nk-token="stock"]')).toHaveText(/^\d+$/);
  });

  test('bundle cards', async ({ page }) => {
    await page.goto(fixture.url);
    const cards = page.locator('[data-bundle-qty]');
    await expect(cards).toHaveCount(3);
    await expect(page.locator('.nk-bundle.is-popular')).toHaveAttribute('data-bundle-qty', '2');
    await expect(cards.nth(1).locator('[data-bundle-pay]')).toHaveText('৳950');

    // A card sets the quantity, and the totals follow (3 pieces: 100 off).
    await cards.nth(2).click();
    await expect(page.locator('[name="qty"]')).toHaveValue('3');
    await expect(cards.nth(2)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-tier]')).toContainText('100');

    // Size L: the cards follow the price (3 x 650 - 100).
    await page.locator('[data-variation]').selectOption(String(fixture.variations.L));
    await expect(cards.nth(2).locator('[data-bundle-pay]')).toHaveText('৳1,850');
  });

  test('several add-ons', async ({ page }) => {
    await page.goto(fixture.url);
    await expect(page.locator('[name="bump"]')).toHaveCount(2);
    const sub = async () => amount(await page.locator('[data-subtotal]').textContent());
    const base = await sub();
    await page.locator('[data-bump-index="1"]').check();
    await expect(page.locator('[data-subtotal]')).toContainText(String(base + 30));
    await page.locator('[data-bump-index="0"]').check();
    await expect(page.locator('[data-subtotal]')).toContainText(String(base + 230));
    await page.locator('[data-bump-index="1"]').uncheck();
    await expect(page.locator('[data-subtotal]')).toContainText(String(base + 200));
  });

  test('quantity steps', async ({ page }) => {
    await page.goto(fixture.url);
    const steps = page.locator('[data-tier-qty]');
    await expect(steps).toHaveCount(2);
    await expect(page.locator('[data-tier-row]')).toBeHidden();

    await page.locator('[data-tier-qty="3"]').click();
    await expect(page.locator('[name="qty"]')).toHaveValue('3');
    await expect(page.locator('[data-tier-qty="3"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-tier]')).toContainText('100');
    const subtotal = amount(await page.locator('[data-subtotal]').textContent());
    const shipping = amount(await page.locator('[data-shipping]').textContent());
    await expect(page.locator('[data-total]')).toContainText(String(subtotal - 100 + shipping).replace(/\B(?=(\d{3})+(?!\d))/g, ','));

    // Back to one piece: no step.
    await page.locator('[name="qty"]').fill('1');
    await page.locator('[name="qty"]').dispatchEvent('change');
    await expect(page.locator('[data-tier-row]')).toBeHidden();
    await expect(page.locator('[data-tier-qty="3"]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('gallery and rating', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(fixture.url);

    // Three pictures: the main one and two from the gallery.
    const thumbs = page.locator('.nk-thumb');
    await expect(thumbs).toHaveCount(3);
    const main = page.locator('.nk-hero-media > img');
    await expect(main).toHaveAttribute('src', /nk-e2e-front/);
    await expect(thumbs.first()).toHaveAttribute('aria-current', 'true');

    await thumbs.nth(1).click();
    await expect(main).toHaveAttribute('src', /nk-e2e-back/);
    await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(thumbs.first()).not.toHaveAttribute('aria-current', 'true');

    // Choosing size L shows that variation's own picture; the thumbnails stay.
    await page.locator('[data-variation]').selectOption(String(fixture.variations.L));
    await expect(main).toHaveAttribute('src', /nk-e2e-variation/);
    await expect(thumbs).toHaveCount(3);

    // Search engines get the same facts as Product data in <head>.
    const ld = await page.evaluate(() => {
      const node = document.querySelector('head script[type="application/ld+json"]');
      return node ? JSON.parse(node.textContent) : null;
    });
    expect(ld && ld['@type']).toBe('Product');
    expect(ld.name).toBe('E2E Shirt');
    expect(ld.offers['@type']).toBe('AggregateOffer');
    expect([ld.offers.lowPrice, ld.offers.highPrice]).toEqual(['500.00', '650.00']);
    expect(ld.aggregateRating.reviewCount).toBe(3);
    expect(ld.image.length).toBe(3);

    // The product's real rating counts every approved review (5, 4 and 3 stars): 4.0 from 3.
    await expect(page.locator('.nk-rating')).toContainText('4.0');
    await expect(page.locator('.nk-rating')).toContainText('(3)');
    expect(errors, 'no JavaScript errors on the page').toEqual([]);
  });

  test('a cached page with an old price corrects itself, and shows the real stock', async ({ page }) => {
    // Serve the page as an old cache would: a lower price baked into the HTML.
    await page.route('**/offer/e2e-noksha/**', async (route) => {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(/"price":500(\.0+)?,/, '"price":1,').replace(/৳500/g, '৳1');
      await route.fulfill({ response, body });
    });
    await page.goto(fixture.url);
    // The live check fixes the price shown, before the buyer does anything.
    await expect(page.locator('.nk-price-now').first()).toContainText('500');
    expect(await page.evaluate(() => window.nokshaFront.price)).toBe(500);

    // Low stock from the real numbers (other tests may have bought some): ask the live check.
    const live = await page.evaluate(async (pageId) => (await fetch(window.nokshaFront.root + 'live?page_id=' + pageId + '&_=' + Date.now())).json(), fixture.pageId);
    const small = live.variations.find((row) => row.id === fixture.variations.S);
    await expect(page.locator('[data-stock-hint]')).toContainText('Only ' + small.stock + ' left');
    await page.locator('[data-variation]').selectOption(String(fixture.variations.L));
    await expect(page.locator('[data-stock-hint]')).toContainText(/Only \d left/);
  });

  test('a stale price is caught before the order is placed', async ({ page }) => {
    await page.goto(fixture.url);
    await page.waitForLoadState('networkidle');
    // Pretend the page came from a cache with an old price.
    await page.evaluate(() => {
      window.nokshaFront.price = 1;
      document.querySelectorAll('.nk-price-now').forEach((el) => { el.textContent = '৳1'; });
    });
    await page.locator('input[name="name"]').fill('E2E Buyer');
    await page.locator('input[name="phone"]').fill('01999000111');
    await page.locator('.nk-submit').click();
    await expect(page.locator('.nk-form-error')).toBeVisible();
    await expect(page.locator('.nk-form-error')).toContainText(/price changed/i);
    // The page now shows the real price.
    await expect(page.locator('.nk-price-now').first()).toContainText('500');
    await expect(page).not.toHaveURL(/nk_order=/);
  });
});
