const { test } = require('./fixtures/baseFixture');
const testData = require('./testdata/testdata.json');

const roles = ['admin', 'normal', 'branch'];

// The same 4 tests run once for every role
for (const role of roles) {
  test.describe(`Create request as ${role}`, () => {

    // Request data from testdata.json. To give one role different data,
    // add a "request": { ... } block inside that role and it overrides the shared values.
    const data = { ...testData, ...(testData[role].request || {}) };

    // Before every test: log in as this role and check the dashboard
    test.beforeEach(async ({ logAs, dashboardPage }) => {
      await logAs(testData[role]);
      await dashboardPage.verifyDashboardPage();
       await dashboardPage.closeRequestPopupIfShown();
    });

    test('Verify create request with mandatory field', { tag: '@smoke' }, async ({ requestPage }) => {
      await requestPage.createRequestMandatory(data);
    });

    test('Verify create request with non-mandatory field', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestNonMandatory(data);
    });

    test('Verify create request with supporting document', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestSuppDocument(data);
    });

    test('Verify create request with template generation', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestTemplate(data);
    });

  });
  const creators = ['admin', 'branch'];   // users who create the request and send it to Level 1
  const approverRole = 'normal';          // Level 1 user who approves it

// test.describe('Approve request', () => {
//   for (const creator of creators) {
//     test(`Request created by ${creator} is approved by ${approverRole}`, { tag: '@smoke' }, async () => {
//       // 1. creator logs in, creates the request, sends it to Level 1
//       // 2. normal user logs in again (new session) and approves
//     });
//   }
// });
}