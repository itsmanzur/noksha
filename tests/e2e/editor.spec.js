const { test, expect } = require('@playwright/test');
const fs = require('fs');

const fixture = JSON.parse(fs.readFileSync(process.env.NK_E2E_FIXTURE, 'utf8'));

// Open the page in the editor and its page settings (the offer tab opens first).
async function openPageSettings(page) {
  await page.goto(`${fixture.adminUrl}#/pages/${fixture.pageId}`);
  const settings = page.getByRole('button', { name: /Page settings/ }).first();
  await expect(settings).toBeVisible({ timeout: 30000 });
  await settings.click();
}

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

    await openPageSettings(page);

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
    // Order form: the page's own field name, the added field, and adding/removing one.
    await expect(page.getByLabel('Name shown for Name')).toHaveValue('Your name');
    await expect(page.locator('.nk-row-custom input[value="Delivery time"]')).toBeVisible();
    const customRows = page.locator('.nk-row-custom');
    const rowsBefore = await customRows.count();
    await page.getByRole('button', { name: 'Add a field' }).click();
    await expect(customRows).toHaveCount(rowsBefore + 1);
    await expect(customRows.last().locator('input[type="text"]')).toHaveValue('New field');
    await customRows.last().getByRole('button', { name: 'Remove this field' }).click();
    await expect(customRows).toHaveCount(rowsBefore);

    // Settings: the WooCommerce emails switch.
    await page.goto(`${fixture.adminUrl}#/settings`);
    await expect(page.getByRole('switch', { name: /WooCommerce emails/ })).toBeVisible({ timeout: 20000 });

    expect(errors, 'no JavaScript errors in the editor').toEqual([]);
  });

  test('suggestions: use one, add a real review, fill the empty fields', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await openPageSettings(page);
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

  test('analytics: sales by product', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${fixture.adminUrl}#/analytics`);
    const card = page.locator('.nk-ui-card, section', { hasText: 'By product' }).first();
    await expect(card).toBeVisible({ timeout: 30000 });
    // Columns, and at least one product row (the site has orders from the smoke checks).
    for (const heading of ['Product', 'Pieces', 'Sales', 'As add-on', 'Conversion']) {
      await expect(card).toContainText(heading);
    }
    await expect(card.locator('tbody tr').first()).toBeVisible();
    expect(errors, 'no JavaScript errors on the analytics screen').toEqual([]);
  });

  test('draft pages from store products', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${fixture.adminUrl}#/pages`);
    await page.getByRole('button', { name: 'From store products' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Pages from store products');
    await dialog.getByPlaceholder('Name or SKU').fill('E2E Shirt');
    const row = dialog.locator('.nk-bulk-list li', { hasText: 'E2E Shirt' });
    await expect(async () => {
      const retry = dialog.getByRole('button', { name: 'Try again' });
      if (await retry.isVisible()) {
        await retry.click();
      }
      await expect(row).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 45000 });
    // The fixture already sells it on pages; the list says so.
    await expect(row).toContainText(/has \d+ page/);
    // Prices show the taka sign, not an HTML code.
    await expect(row).toContainText('৳');
    await expect(row).not.toContainText('&#');
    await row.locator('input[type="checkbox"]').check();
    await dialog.getByRole('button', { name: 'Make 1 draft pages' }).click();
    await expect(dialog).toContainText('1 draft pages made.', { timeout: 30000 });
    await dialog.getByRole('button', { name: 'Open' }).click();
    // The new page opens in the editor with the product's text, and the sample guarantee hidden.
    const preview = page.frameLocator('iframe.nk-editor-iframe');
    await expect(preview.locator('h1')).toContainText('E2E Shirt', { timeout: 30000 });
    await expect(preview.locator('body')).not.toContainText('mustard');
    await expect(preview.locator('body')).toContainText('Verified buyer');
    expect(errors, 'no JavaScript errors').toEqual([]);
  });

  test('my sections and my templates', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    // The delivery page, so the other tests' page keeps one top banner (the editor saves as you go).
    await page.goto(`${fixture.adminUrl}#/pages/${fixture.shipPageId}`);

    // Keep the top banner in "My sections".
    await page.getByRole('button', { name: /Top banner/ }).first().click();
    await page.getByRole('button', { name: 'Save to my sections' }).click();
    await page.getByLabel('Name').fill('E2E banner');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Saved.')).toBeVisible();

    // Add it back from "My sections": the page now has two top banners.
    await page.getByRole('button', { name: /Sections/ }).first().click();
    const banners = page.getByRole('button', { name: /Top banner/ });
    const before = await banners.count();
    await page.getByRole('button', { name: 'Add section' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('My sections');
    await dialog.getByRole('button', { name: /E2E banner/ }).click();
    await page.getByRole('button', { name: /Sections/ }).first().click();
    await expect(banners).toHaveCount(before + 1);

    // Delete it from the library (pages keep their copy).
    await page.getByRole('button', { name: 'Add section' }).click();
    await dialog.getByRole('button', { name: 'Delete from my sections' }).first().click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(dialog.getByRole('button', { name: /E2E banner/ })).toHaveCount(0);
    await page.keyboard.press('Escape');

    // Keep the page as "My template", then start a new page from it.
    await page.getByRole('button', { name: /Page settings/ }).first().click();
    await page.getByRole('tab', { name: 'Link & language' }).click();
    await page.getByRole('button', { name: 'Save as my template' }).click();
    await page.getByLabel('Name').fill('E2E template');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Saved.')).toBeVisible();

    await page.goto(`${fixture.adminUrl}#/pages`);
    await page.getByRole('button', { name: 'New page' }).first().click();
    const create = page.getByRole('dialog');
    await create.getByLabel('Start from').selectOption({ label: 'E2E template' });
    await create.getByLabel('Page title').fill('E2E from template');
    await create.getByRole('button', { name: 'New page' }).click();
    // The editor opens on the new page, with the template's product name and sections.
    const preview = page.frameLocator('iframe.nk-editor-iframe');
    await expect(preview.locator('.nk-order')).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: /Top banner/ })).toHaveCount(before + 1);
    expect(errors, 'no JavaScript errors').toEqual([]);
  });

  test('bundle cards in the editor', async ({ page }) => {
    await page.goto(`${fixture.adminUrl}#/pages/${fixture.shipPageId}`);
    await page.getByRole('button', { name: 'Add section' }).click();
    await page.getByRole('dialog').getByRole('button', { name: /Bundle cards/ }).click();
    await expect(page.getByLabel('Mark as most popular')).toBeVisible();
    const preview = page.frameLocator('iframe.nk-editor-iframe');
    await expect(preview.locator('.nk-bundles')).toContainText('Bundle cards show the quantity discounts', { timeout: 20000 });
    // Leave the page as it was.
    await page.getByRole('button', { name: 'Delete section' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(preview.locator('.nk-bundles')).toHaveCount(0, { timeout: 20000 });
  });
});
