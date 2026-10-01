import { test, expect } from '@playwright/test';

test.describe('API Mocking', () => {

  test("mocks a fruit", async ({ page }) => {
    // Register the mock BEFORE navigating
    await page.route('https://demo.playwright.dev/api-mocking/api/v1/fruits', async route => {
      const json = [
        { name: 'playwrightNikhilesh', id: 335 },
        { name: 'playwrightgaurav', id: 336 },
        { name: 'playwrightdeva', id: 335 },
      ];
      await route.fulfill({ json });
    });

    await page.goto('https://demo.playwright.dev/api-mocking');

    // Assert mocked data is visible
    await expect(page.getByText('playwrightNikhilesh')).toBeVisible();
    await expect(page.getByText('playwrightgaurav')).toBeVisible();
    await expect(page.getByText('playwrightdeva')).toBeVisible();
    await page.waitForTimeout(5000);
  });

  test('mocks and calls api', async ({ page }) => {
    await page.route('https://demo.playwright.dev/api-mocking/api/v1/fruits', async route => {
      // Call the REAL api, then modify its response
      const response = await route.fetch();
      const json = await response.json();
      json.push({ name: 'playwrightNikhilesh', id: 335 });

      await route.fulfill({ response, json });
    });

    await page.goto('https://demo.playwright.dev/api-mocking');

    // Added fruit is visible
    await expect(page.getByText('playwrightNikhilesh')).toBeVisible();
    // A real fruit from the actual API is still visible
    await expect(page.getByText('Strawberry')).toBeVisible();
    await page.waitForTimeout(5000);
  });



test('server error 500', async ({ page }) => {
  await page.route('https://demo.playwright.dev/api-mocking/api/v1/fruits', route =>
    route.fulfill({ status: 500, json: { error: 'Internal Server Error' } })
  );

  await page.goto('https://demo.playwright.dev/api-mocking');

  await expect(page.getByText('Strawberry')).toHaveCount(0);
});





});