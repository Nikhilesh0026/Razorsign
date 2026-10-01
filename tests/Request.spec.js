const { test } = require('./fixtures/baseFixture');
const testData = require('./testdata/testdata.json');
const { roles, authFile,restoreSession  } = require('./utils/auth');

for (const role of roles) {
  test.describe(`Create request as ${role}`, () => {
    // Each role starts from its own saved session (no login steps in tests)
    test.use({ storageState: authFile(role) });

    // Shared request data; a "request" block inside a role overrides it
    const data = { ...testData, ...(testData[role].request || {}) };

    // ...inside test.describe:
   test.beforeEach(async ({ context, page, dashboardPage }) => {
  await restoreSession(context, role); // must come before page.goto
  await page.goto('/');
  await dashboardPage.verifyDashboardPage();
  await dashboardPage.closeRequestPopupIfShown();
    });

    // TC01
    test('TC01 - Verify create request with mandatory field @smoke', async ({ requestPage }) => {

      await requestPage.createRequestMandatory(data);
    });

    // TC02
    test('TC02 - Verify create request with non-mandatory field @regression', async ({ requestPage }) => {
      await requestPage.createRequestNonMandatory(data);
    });

    // TC03
    test('TC03 - Verify create request with supporting document @regression', async ({ requestPage }) => {
      await requestPage.createRequestSuppDocument(data);
    });

    // TC04
    test('TC04 - Verify create request with template generation @Nikhilesh', async ({ requestPage ,page}) => {
      await page.goto('/');
      await requestPage.createRequestTemplate(data);
    });
  });
}