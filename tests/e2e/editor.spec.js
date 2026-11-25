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

    // A second, custom add-on, and room for a third.
    await expect(page.locator('.nk-bump-edit')).toHaveCount(2);
    await expect(page.getByText('Add-on 2')).toBeVisible();
    await expect(page.locator('.nk-bump-edit').nth(1).locator('input[value="Gift wrap"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add another add-on' })).toBeVisible();

    // Order form tab: the coupon switch is on.
    await page.getByRole('tab', { name: 'Order form & payment' }).click();
    await expect(page.getByRole('switch', { name: 'Coupon field' })).toBeChecked();

    // Settings: the WooCommerce emails switch.
    await page.goto(`${fixture.adminUrl}#/settings`);
    await expect(page.getByRole('switch', { name: /WooCommerce emails/ })).toBeVisible({ timeout: 20000 });

    expect(errors, 'no JavaScript errors in the editor').toEqual([]);
  });

  test('suggestions: use one, add a real review, fill the empty fields', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`${fixture.adminUrl}#/pages/${fixture.pageId}`);
    const panel = page.locator('.nk-suggest');
    await expect(panel).toBeVisible({ timeout: 20000 });
    await expect(panel).toContainText('Suggestions from this product');

    // What the product offers, read from the store.
    await expect(panel).toContainText('A soft everyday shirt');
    await expect(panel).toContainText('Soft combed cotton');
    await expect(panel).toContainText('Material');
    // Only the two reviews that count; the 3-star and the unapproved one stay out.
    await expect(panel).toContainText('Nasrin');
    await expect(panel).toContainText('Verified buyer');
    await expect(panel).toContainText('Imran');
    await expect(panel).not.toContainText('Rupa');
    await expect(panel).not.toContainText('Karim');

    // Nothing changed yet: the preview still shows the template's headline.
    const preview = page.frameLocator('iframe.nk-editor-iframe');
    await expect(preview.locator('h1')).not.toContainText('E2E Shirt');

    // "Use" on the headline puts it on the page.
    await panel.locator('.nk-suggest-row', { hasText: 'Headline' }).getByRole('button', { name: 'Use' }).click();
    await expect(preview.locator('h1')).toContainText('E2E Shirt', { timeout: 15000 });

    // Add the verified review: the preview shows the mark.
    await panel.locator('.nk-suggest-row', { hasText: 'Nasrin' }).getByRole('button', { name: 'Add' }).click();
    await expect(preview.locator('.nk-verified')).toBeVisible({ timeout: 15000 });
    await expect(panel.locator('.nk-suggest-row', { hasText: 'Nasrin' }).getByRole('button')).toHaveText('Used');

    // Fill the empty fields, never the ones that have text.
    await panel.getByRole('button', { name: 'Fill all empty fields' }).click();
    await expect(preview.locator('h1')).toContainText('E2E Shirt');

    expect(errors, 'no JavaScript errors in the editor').toEqual([]);
  });
});
