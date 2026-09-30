const base = require('@playwright/test');
const Login = require('../pages/Login');
const Dashboard = require('../pages/Dashboard');
const { RequestPage } = require('../pages/request');

exports.test = base.test.extend({
    dashboardPage: async ({ page }, use) => {
        await use(new Dashboard(page));
    },

    requestPage: async ({ page }, use) => {
        await use(new RequestPage(page));
    },

    // logAs(user) opens the app and logs in with that user
    logAs: async ({ page }, use) => {
        const loginPage = new Login(page);
        await use(async (user) => {
            await page.goto('https://demorazorsign.practiceleague.com/');
            await loginPage.loginApplication(user.username, user.password);
        });
    },
});

exports.expect = base.expect;