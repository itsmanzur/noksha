const { test, expect } = require('@playwright/test');
const fs = require('fs');

const fixture = JSON.parse(fs.readFileSync(process.env.NK_E2E_FIXTURE, 'utf8'));

test.describe('editor: WooCommerce product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixture.loginUrl);
    await page.fill('#user_login', fixture.user);
    await page.fill('#user_pass', fixture.password);
    await page.click('#wp-submit');
    await page.waitForURL(/wp-admin/);
  });

  test('picks a store product and an add-on, shows coupon and email settings', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`${fixture.adminUrl}#/pages/${fixture.pageId}`);
    await expect(page.locator('#noksha-root')).toBeVisible();

    // Offer tab is open first: the source is the store product we set up.
    const wcRadio = page.getByRole('radio', { name: 'WooCommerce product' }).first();
    await expect(wcRadio).toBeChecked({ timeout: 20000 });
    await expect(page.locator('.nk-wc-selected').first()).toContainText('E2E Shirt');
    await expect(page.locator('.nk-wc-selected').first()).toContainText('2 options');

    // Search finds the product.
    await page.getByPlaceholder('Name or SKU').first().fill('E2E Shirt');
    await expect(page.locator('.nk-wc-result').first()).toContainText('E2E Shirt');

    // The bump is a store product too (a simple one only).
    await expect(page.locator('.nk-wc-selected').nth(1)).toContainText('E2E Addon');
    await page.getByPlaceholder('Name or SKU').nth(1).fill('E2E');
    await expect(page.locator('.nk-wc-result', { hasText: 'E2E Addon' })).toBeVisible();
    await expect(page.locator('.nk-wc-result', { hasText: 'E2E Shirt' })).toHaveCount(1); // only in the main search

    // Order form tab: the coupon switch is on.
    await page.getByRole('tab', { name: 'Order form & payment' }).click();
    await expect(page.getByRole('switch', { name: 'Coupon field' })).toBeChecked();

    // Settings: the WooCommerce emails switch.
    await page.goto(`${fixture.adminUrl}#/settings`);
    await expect(page.getByRole('switch', { name: /WooCommerce emails/ })).toBeVisible({ timeout: 20000 });

    expect(errors, 'no JavaScript errors in the editor').toEqual([]);
  });
});
