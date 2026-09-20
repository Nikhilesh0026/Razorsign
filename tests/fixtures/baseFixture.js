const base = require('@playwright/test');
const Login = require('../pages/Login');
const Dashboard = require('../pages/Dashboard');

exports.test = base.test.extend({
    dashboardPage: async ({ page }, use) => {
       const dashboard = new Dashboard(page);   // "const", not "cost"
       await use(dashboard); 
    },

    // loginAs(user) opens the app and logs in with that user
    loginAs: async ({ page }, use) => {
        const loginPage = new Login(page);
        await use(async (user) => {
            await page.goto(process.env.QA_URL);
            await loginPage.loginApplication(user.username, user.password);
        });
    },
});

exports.expect = base.expect;