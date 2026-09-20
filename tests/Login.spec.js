const { test } = require('./fixtures/baseFixture');
const users = require('./testdata/testdata.json');

test.describe('Dashboard by role', () => {

    test('Admin sees dashboard', { tag: '@smoke' }, async ({ loginAs, dashboardPage }) => {
       
         await loginAs(users.admin);
        await dashboardPage.verifyDashboardPage();
    });

    test('Normal user sees dashboard', { tag: '@regression' }, async ({ loginAs, dashboardPage }) => {
       
        await loginAs(users.normal);
        await dashboardPage.verifyDashboardPage();
    });

    test('Branch user sees dashboard', { tag: '@regression' }, async ({ loginAs, dashboardPage }) => {
    
        await loginAs(users.branch);
        await dashboardPage.verifyDashboardPage();
    });

});