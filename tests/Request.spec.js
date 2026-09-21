const { test } = require('./fixtures/baseFixture');
const testData = require('./testdata/testdata.json');

const roles = ['admin', 'normal', 'branch'];

// Same four tests are generated once for every role
for (const role of roles) {
  test.describe(`Create request as ${role}`, () => {

    // Request data is shared. To give a role different data, add a "request": { ... }
    // object inside that role in testdata.json and it overrides the shared values.
    const data = { ...testData, ...(testData[role].request || {}) };

    test.beforeEach(async ({ logAs, dashboardPage }) => {
      await logAs(testData[role]);
      await dashboardPage.verifyDashboardPage();
    });

    test('Verify create request with mandatory field', { tag: '@smoke' }, async ({ requestPage }) => {
      await requestPage.createRequestMandatory(
        data.contracttype,
        data.contractcategory,
        data.selfparty,
        data.otherparty,
        data.contracTatMandatory
      );
    });

    test('Verify create request with non-mandatory field', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestNonMandatory(
        data.contracttype,
        data.contractcategory,
        data.zone,
        data.selfparty,
        data.otherparty,
        data.contracttitNonMandatory,
        data.contractdetails
      );
    });

    test('Verify create request with supporting document', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestSuppDocument(
        data.contracttype,
        data.contractcategory,
        data.zone,
        data.selfparty,
        data.otherparty,
        data.contractsuporttittle,
        data.contractdetails
      );
    });

    test('Verify create request with template generation', { tag: '@regression' }, async ({ requestPage }) => {
      await requestPage.createRequestTemplate(
        data.contracttype,
        data.contractcategory,
        data.zone,
        data.selfparty,
        data.otherparty,
        data.contracttitTemplate,
        data.contractdetails
      );
    });

  });   // closes test.describe
}       // closes the for loop