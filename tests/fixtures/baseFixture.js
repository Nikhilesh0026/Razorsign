const base = require('@playwright/test');
const Dashboard = require('../pages/Dashboard');
const { RequestPage } = require('../pages/request');

exports.test = base.test.extend({
  dashboardPage: async ({ page }, use) => {
    await use(new Dashboard(page));
  },

  requestPage: async ({ page }, use) => {
    await use(new RequestPage(page));
  },
});

exports.expect = base.expect;