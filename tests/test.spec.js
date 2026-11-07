const { test, expect } = require('@playwright/test');

test('alert popup', async ({ page }) => {
  await page.goto('https://demo.automationtesting.in/Alerts.html');

  // Handler is ready before the click opens the alert
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('I am an alert box!');
    await dialog.accept();
  });

  await page.locator("//button[@class='btn btn-danger']").click();
});






test('alert ok and cancel', async ({ page }) => {
  await page.goto('https://demo.automationtesting.in/Alerts.html');

  await page.locator("//a[text()='Alert with OK & Cancel ']").click();

  // Handler for the confirm box: click OK
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Press a Button !');
    await dialog.dismiss();
  });

  await page.locator("//button[@class='btn btn-primary']").click();

  await expect(page.locator("//p[text()='You pressed Ok']")).toBeVisible();

  await page.waitForTimeout(7000);
});



test('alert textbox', async ({ page }) => {
  await page.goto('https://demo.automationtesting.in/Alerts.html');

  await page.locator("//a[text()='Alert with Textbox ']").click();

  // Handler is ready before the button opens the prompt
  page.once('dialog', async dialog => {
   // expect(dialog.type()).toBe('prompt');
    expect(dialog.message()).toBe('Please enter your name');   // check the exact message on the site
    await dialog.accept('Nikhilesh');              // type text, then click OK
  });

  await page.locator("//button[@class='btn btn-info']").click();

  await expect(
    page.locator("//p[text()='Hello Nikhilesh How are you today']")
  ).toBeVisible();

  await page.waitForTimeout(7000);
});



