const { test, expect } = require('@playwright/test');
const Login = require('./pages/login');
const { readExcel } = require('./utils/excel');

const users = readExcel('UserData.xlsx'); // columns: username, password

for (const user of users) {
  test(`user can log in: ${user.username}`, async ({ page }) => {
    const loginPage = new Login(page);
    await page.goto('https://demorazorsign.practiceleague.com/');
    await loginPage.loginApplication(user.username, user.password);
    await expect(page).toHaveURL(/Home/i); // replace with an assertion on a post-login element
  });
}