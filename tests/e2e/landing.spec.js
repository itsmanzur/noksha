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
    await page.locator('[name="bump"]').check();
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
    expect(total).toBe(subtotal - 150 + shipping);

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

    // Order: name and phone only on this page.
    await page.locator('input[name="name"]').fill('E2E Buyer');
    await page.locator('input[name="phone"]').fill('01999000111');
    await page.locator('.nk-submit').click();
    await page.waitForURL(/nk_order=/, { timeout: 30000 });
    await expect(page.locator('body')).toContainText(/NK-/);

    expect(errors, 'no JavaScript errors on the page').toEqual([]);
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

    // The product's real rating counts every approved review (5, 4 and 3 stars): 4.0 from 3.
    await expect(page.locator('.nk-rating')).toContainText('4.0');
    await expect(page.locator('.nk-rating')).toContainText('(3)');
    expect(errors, 'no JavaScript errors on the page').toEqual([]);
  });

  test('a stale price is caught before the order is placed', async ({ page }) => {
    await page.goto(fixture.url);
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
