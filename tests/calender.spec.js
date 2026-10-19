const { test } = require('@playwright/test');

test('calendar test', async ({ page }) => {
  await page.goto('https://practice-automation.com/calendars/');

  await page.getByRole('textbox', { name: 'Select or enter a date' }).click();
  await page.locator("//button[contains(@class,'dp-cal-month')]").click();
  await page.getByText('December', { exact: true }).click();
  await page.locator("//button[text()='17']").click();

  await page.waitForTimeout(6000);
});