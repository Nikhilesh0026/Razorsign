const { expect } = require('@playwright/test');

/** A success or info message appears on screen. */
async function expectToastMessage(page, text) {
  const toast = page.locator('.toast, .Toastify__toast, [role="alert"]').filter({ hasText: text }).first();
  await expect(toast).toBeVisible({ timeout: 10 * 1000 });
}

/** A mandatory field shows a validation message. */
async function expectFieldError(locator, text) {
  const error = locator.locator('xpath=ancestor::*[1]').getByText(text);
  await expect(error).toBeVisible();
}

/** The page URL contains the given path. */
async function expectUrlContains(page, path) {
  await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

/** A table has a row containing the given text. */
async function expectTableContainsRow(table, text) {
  await expect(table.locator('tbody tr').filter({ hasText: text }).first()).toBeVisible();
}

module.exports = {
  expectToastMessage,
  expectFieldError,
  expectUrlContains,
  expectTableContainsRow,
};