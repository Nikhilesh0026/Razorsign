// templateField.mock.spec.js
// ONE file, everything hardcoded. Purpose: mock GetTemplateField and watch how the UI handles it.
//
// Run all:      npx playwright test templateField.mock.spec.js --headed
// Run one:      npx playwright test templateField.mock.spec.js -g "5 fields" --headed
//
// BEFORE RUNNING, change the 4 values marked  <-- CHANGE

const { test, expect } = require('@playwright/test');

// ---------- HARDCODED CONFIG ----------
const UI_URL = 'https://demorazorsignapi.practiceleague.com';                        // <-- CHANGE (login page of the app)
const USERNAME = 'syadav@practiceleague.com';                             // <-- CHANGE
const PASSWORD = 'Sep@2026';                             // <-- CHANGE
const API = 'https://demorazorsignapi.practiceleague.com/api/ContractTransaction/GetTemplateField';

// ---------- HARDCODED MOCK DATA ----------
// <-- CHANGE the key names to match the REAL response (DevTools > Network > GetTemplateField > Response)
const FIVE_FIELDS = [
  { fieldId: 1, fieldName: 'Vendor Name',     fieldType: 'Text',     isMandatory: true  },
  { fieldId: 2, fieldName: 'Contract Value',  fieldType: 'Number',   isMandatory: true  },
  { fieldId: 3, fieldName: 'Start Date',      fieldType: 'Date',     isMandatory: false },
  { fieldId: 4, fieldName: 'Payment Terms',   fieldType: 'Dropdown', isMandatory: false },
  { fieldId: 5, fieldName: 'Auto Renewal',    fieldType: 'Checkbox', isMandatory: false },
];

const makeFields = n =>
  Array.from({ length: n }, (_, i) => ({
    fieldId: i + 1,
    fieldName: `Custom Field ${i + 1}`,
    fieldType: 'Text',
    isMandatory: false,
  }));

// If the real API wraps the data, e.g. { data: [...] } or { result: [...] }, set WRAP to that key.
const WRAP = null;                                            // <-- CHANGE (null = plain array)
const body = list => (WRAP ? { [WRAP]: list } : list);

// ---------- HELPERS ----------
async function mockFields(page, payload, status = 200, delayMs = 0) {
  await page.route(`${API}**`, async route => {
    if (delayMs) await new Promise(r => setTimeout(r, delayMs));
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  });
}

async function loginAndOpenTemplate(page) {
  await page.goto(UI_URL);
  // TODO: replace these locators with real ones (use: npx playwright codegen <UI_URL>)
  await page.getByPlaceholder(/user|email/i).fill(USERNAME);
  await page.getByPlaceholder(/password/i).fill(PASSWORD);
  await page.getByRole('button', { name: /login|sign in/i }).click();

  // TODO: navigate to the screen that calls GetTemplateField (open/create a template-based request)
  // Example:
  // await page.getByText('Requests').click();
  // await page.getByRole('button', { name: 'New Request' }).click();
  // await page.getByText('Template Based').click();
}

// ---------- TESTS ----------
test.describe('GetTemplateField - UI handling (mocked)', () => {

  test('5 fields - exact data check', async ({ page }) => {
    await mockFields(page, body(FIVE_FIELDS));          // register BEFORE the screen opens
    await loginAndOpenTemplate(page);

    for (const f of FIVE_FIELDS) {
      await expect(page.getByText(f.fieldName).first()).toBeVisible();
    }
    await page.pause();                                  // inspect UI manually, then click Resume
  });

  test('100 fields', async ({ page }) => {
    await mockFields(page, body(makeFields(100)));
    const start = Date.now();
    await loginAndOpenTemplate(page);
    await expect(page.getByText('Custom Field 100', { exact: true })).toBeVisible({ timeout: 60000 });
    console.log(`100 fields visible after ${Date.now() - start} ms`);
  });

  test('200 fields', async ({ page }) => {
    await mockFields(page, body(makeFields(200)));
    const start = Date.now();
    await loginAndOpenTemplate(page);
    await expect(page.getByText('Custom Field 200', { exact: true })).toBeVisible({ timeout: 60000 });
    console.log(`200 fields visible after ${Date.now() - start} ms`);
  });

  test('empty fields', async ({ page }) => {
    await mockFields(page, body([]));
    await loginAndOpenTemplate(page);
    await expect(page.getByText('Custom Field 1')).toHaveCount(0);
    await page.pause();                                  // check if an empty message is shown
  });

  test('server error 500', async ({ page }) => {
    await mockFields(page, { message: 'Internal Server Error' }, 500);
    await loginAndOpenTemplate(page);
    await page.pause();                                  // check: error message? frozen page? blank?
  });

  test('slow API 8 sec', async ({ page }) => {
    await mockFields(page, body(FIVE_FIELDS), 200, 8000);
    await loginAndOpenTemplate(page);
    await page.pause();                                  // check: loader shown while waiting?
  });

  test('special characters and long name', async ({ page }) => {
    await mockFields(page, body([
      { fieldId: 1, fieldName: '<b>Bold</b> & "quotes"', fieldType: 'Text', isMandatory: false },
      { fieldId: 2, fieldName: 'A'.repeat(200),          fieldType: 'Text', isMandatory: false },
      { fieldId: 3, fieldName: 'फील्ड 🍎',                fieldType: 'Text', isMandatory: false },
    ]));
    await loginAndOpenTemplate(page);
    await expect(page.getByText('<b>Bold</b> & "quotes"')).toBeVisible();   // text, not HTML
  });

  test('malformed JSON', async ({ page }) => {
    await mockFields(page, '{ broken json');
    await loginAndOpenTemplate(page);
    await page.pause();                                  // check: app should not crash
  });

});