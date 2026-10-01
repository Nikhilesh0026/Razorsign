const fs = require('fs');
const { test: setup } = require('./fixtures/baseFixture');
const Login = require('./pages/Login');
const testData = require('./testdata/testdata.json');
const { roles, authFile, sessionFile } = require('./utils/auth');

for (const role of roles) {
  setup(`authenticate as ${role}`, async ({ page, dashboardPage }) => {
    const user = testData[role];

    await page.goto('/');
    await new Login(page).loginApplication(user.username, user.password);
    await dashboardPage.verifyDashboardPage();

    await page.context().storageState({ path: authFile(role) });

    const session = await page.evaluate(() => JSON.stringify(sessionStorage));
    fs.writeFileSync(sessionFile(role), session);
  });
}