const { expect } = require('@playwright/test');
const path = require('path');

class RequestPage {
  constructor(page) {
    this.page = page;

    this.createButton     = page.getByText('Create', { exact: true });
    this.requestButton    = page.getByText('Request', { exact: true });
    this.contracttype     = page.locator('div.mandatory__value-container.css-hlgwow').locator('div').nth(1);

    // FIX: removed hardcoded 'react-select-3-input' (react-select ids are dynamic)
    // and matched the label exactly so "Select Template" is not picked up.
    this.template         = page.locator("//label[normalize-space()='Template']/following::input[1]");

    this.contractcategory = page.locator("//label[contains(.,'Contract Category_1')]/following::input[1]");
    this.zone             = page.locator("//label[contains(.,'Zone')]/following::input[1]");
    this.selfparty        = page.locator("//label[contains(.,'Contract Self Party')]/following::input[1]");
    this.otherparty       = page.locator("//label[contains(.,'Contract Other Party Name')]/following::input[1]");
    this.otherpartdrop    = page.getByText('abc-h (Party Type 1)[djagtap@practiceleague.com] [India, Pune]', { exact: true });
    this.contracttittle   = page.locator("//input[@class='mandatory']");
    this.contractdetails  = page.locator('#BodyInput');
    this.supportingdoc    = page.locator('input[name="10628"]');
    this.submitButton     = page.locator("//input[@value='Create']");
    this.ok               = page.locator("//input[@value='Ok']");
    this.success          = page.getByText('Contract Request Added Successfully.', { exact: true });
    this.selecttemp       = page.getByText('Select Template', { exact: true });
    this.tempname         = page.getByText('Automation Template', { exact: true });
    this.tempload         = page.locator('input[value="Load"]');
    this.fullnametxt      = page.locator('#Name');

    // FIX: '#Graduation\ ' turned into '#Graduation ' in a JS string (broken selector).
    // The id contains a trailing space, so use an attribute selector.
    this.year             = page.locator('[id="Graduation "]');

    this.date             = page.locator('#MaindateBirthdate');

    // FIX: getByRole('button') matched every button (strict mode violation).
    // TODO: change 'Save' to the real button text on your template form.
    this.savetemp         =  page.locator("//input[@value='Save']");
  }

  // ---------- reusable steps ----------

  async openRequestForm() {
    await this.createButton.hover();
    await this.requestButton.waitFor({ state: 'visible' });
    await this.requestButton.click();
  }

  async selectOption(field, name) {
    await field.click();
    const option = this.page.getByRole('option', { name, exact: true });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async fillOtherParty(otherparty) {
    await this.otherparty.waitFor({ state: 'visible' });
    await this.otherparty.click();
    await this.otherparty.fill(otherparty);
    await this.otherpartdrop.click();
  }

  async fillTitle(title) {
    await this.contracttittle.waitFor({ state: 'visible' });
    await this.contracttittle.press('Control+A');
    await this.contracttittle.press('Backspace');
    await this.contracttittle.fill(title);
  }

  async fillDetails(details) {
    await this.contractdetails.waitFor({ state: 'visible' });
    await this.contractdetails.fill(details);
  }

  async submitAndVerify() {
    await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.submitButton.scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
    await this.ok.click();
  }

  // Takes ONE object (not a string followed by an object)
  async loadTemplateAndFill({ fullName, year, date }) {
    await this.selecttemp.click();

    
    await this.tempload.click();

    
    await this.page.waitForTimeout(5000);
    await this.fullnametxt.fill("Nikhilesh");
   await this.page.waitForTimeout(4000);
    

    await this.savetemp.click();
  }

  // zone, details and template are optional
  // FIX: parameter is now lowercase `template` everywhere (was `Template` here
  // but `template` at the call site, so the dropdown step never ran).
  async fillRequestForm({
    contracttype,
    Template,
    contractcategory,
    zone,
    selfparty,
    otherparty,
    title,
    details,
  }) {
    await this.openRequestForm();
    await this.selectOption(this.contracttype, contracttype);
    await this.selectOption(this.contractcategory, contractcategory);
    if (zone) await this.selectOption(this.zone, zone);
    await this.selectOption(this.selfparty, selfparty);
    await this.fillOtherParty(otherparty);
    await this.fillTitle(title);
    if (details) await this.fillDetails(details);

    if (Template) {
      await this.selectOption(this.template, 'Automation Template');
      
    }
  }

  // ---------- the four flows: each one receives the test data object ----------

  async createRequestMandatory(data) {
    await this.fillRequestForm({
      contracttype: data.contracttype,
      contractcategory: data.contractcategory,
      selfparty: data.selfparty,
      otherparty: data.otherparty,
      title: data.contracTatMandatory,
    });
    await this.submitAndVerify();
  }

  async createRequestNonMandatory(data) {
    await this.fillRequestForm({
      contracttype: data.contracttype,
      contractcategory: data.contractcategory,
      zone: data.zone,
      selfparty: data.selfparty,
      otherparty: data.otherparty,
      title: data.contracttitNonMandatory,
      details: data.contractdetails,
    });
    await this.submitAndVerify();
  }

  async createRequestSuppDocument(data) {
    await this.fillRequestForm({
      contracttype: data.contracttype,
      contractcategory: data.contractcategory,
      zone: data.zone,
      selfparty: data.selfparty,
      otherparty: data.otherparty,
      title: data.contractsuporttittle,
      details: data.contractdetails,
    });

    // FIX: relative path so it works on every machine and on Jenkins.
    // TODO: adjust the '..' segments to match where this page file lives
    // relative to tests/testdata.
    const filePath = path.resolve(
      __dirname,
      '..',
      'tests',
      'testdata',
      'sample-docx-files-sampledocument (1).pdf'
    );
    await this.supportingdoc.setInputFiles(filePath);

    await this.submitAndVerify();
  }

  async createRequestTemplate(data) {
    await this.fillRequestForm({
      contracttype: data.contracttype,
      Template: data.Template,
      contractcategory: data.contractcategory,
      zone: data.zone,
      selfparty: data.selfparty,
      otherparty: data.otherparty,
      title: data.contracttitTemplate,
      details: data.contractdetails,
      
    });

    await this.submitAndVerify();

    // FIX: pass a single object (was data.Template, { ... })
    await this.loadTemplateAndFill({
      fullName: data.Fullname,
      // year: data.year,
      // date: data.date,
    });
  }
}

module.exports = { RequestPage };