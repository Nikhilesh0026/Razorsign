const { test } = require('./fixtures/baseFixture');
const testData = require('./testdata/testdata.json');
const { authFile, restoreSession } = require('./utils/auth');
const { RequestPage } = require('../tests/pages/request');
const { startTrace, stopTrace } = require('../tests/utils/Screenshottracehelpers');
const { expectToastMessage } = require('../tests/utils/assertionhelper');

const role = 'branch';

test.describe(`Create request as ${role}`, () => {
  test.use({ storageState: authFile(role) });

  const data = { ...testData, ...(testData[role]?.request || {}) };

  test.beforeEach(async ({ context, page, dashboardPage }) => {
   // await startTrace(context);
    await restoreSession(context, role);
    await page.goto('/');
    await dashboardPage.verifyDashboardPage();
    await dashboardPage.closeRequestPopupIfShown();
  });

  // test.afterEach(async ({ context }, testInfo) => {
  //   const tracePath = await stopTrace(context, `${testInfo.title}`);
  //   await testInfo.attach('trace', { path: tracePath });
  // });

  test('TC01 - Verify create request with mandatory field @reg', async ({ requestPage }) => {
    await requestPage.createRequestMandatory(data);
  });

  test('TC02 - Verify create request with non-mandatory field @regression', async ({ requestPage }) => {
    await requestPage.createRequestNonMandatory(data);
  });

  test('TC03 - Verify create request with supporting document @regression', async ({ requestPage }) => {
    await requestPage.createRequestSuppDocument(data);
  });

  test('TC04 - Verify create request with template generation @regression', async ({ requestPage }) => {
    await requestPage.createRequestTemplate(data);
  });

  test('TC05 - Verify delete request @regression', async ({ requestPage }) => {
    await requestPage.createRequestMandatory(data);
    await requestPage.requestdelete();
  });

  test.describe('Pending approval flow', () => {
    test('TC06 - Verify request pending flow @regression', async ({ browser, requestPage }) => {
      await requestPage.createRequestMandatory(data);
      // await expectToastMessage(page, 'created');

      const approverContext = await browser.newContext();
      try {
        const approverPage = await approverContext.newPage();
        await approverPage.goto('/');
        const approverRequestPage = new RequestPage(approverPage);
        await approverRequestPage.requestapproval();

        // await expectToastMessage(approverPage, 'sent');
      } finally {
        await approverContext.close();
      }
    });

    test('TC07 - Verify request approve from requestor @RequestApprovals', async ({ browser }) => {
      const requestorContext = await browser.newContext();
      try {
        const requestorPage = await requestorContext.newPage();
        await requestorPage.goto('/');
        const requestorRequestPage = new RequestPage(requestorPage);
        await requestorRequestPage.requestorapprove();
      } finally {
       // await requestorContext.close();
      }
    });

    test('TC08 - Verify request approve from level1 User @regression', async ({ browser }) => {
      const level1Context = await browser.newContext();
      try {
        const level1Page = await level1Context.newPage();
        await level1Page.goto('/');
        const level1RequestPage = new RequestPage(level1Page);
        await level1RequestPage.level1Userapprove();
      } finally {
        await level1Context.close();
      }
    });

    test('TC09 - Verify request approve from level2 User @regression', async ({ browser }) => {
      const level2Context = await browser.newContext();
      try {
        const level2Page = await level2Context.newPage();
        await level2Page.goto('/');
        const level2RequestPage = new RequestPage(level2Page);
        await level2RequestPage.level2Userapprove();
      } finally {
        await level2Context.close();
      }
    });
    
  });
});