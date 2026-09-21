const { expect } = require('@playwright/test');
const path = require('path');

class RequestPage {
  constructor(page) {
    this.page = page;

    this.createButton     = page.getByText('Create', { exact: true });
    this.requestButton    = page.getByText('Request', { exact: true });
    this.contracttype     = page.locator('div.mandatory__value-container.css-hlgwow').locator('div').nth(1);
    this.template         = page.locator("//label[contains(.,'Template')]/following::input[@id='react-select-3-input']");
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
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();

    await this.ok.waitFor({ state: 'visible' });
    await expect(this.success).toHaveText('Contract Request Added Successfully.');
    await this.ok.click();
  }

  // zone and details are optional
  async fillRequestForm({ contracttype, Template, contractcategory, zone, selfparty, otherparty, title, details }) {
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

    // File lives inside the project, so it works on every machine and on Jenkins
    const filePath = path.resolve(__dirname, 'C://Users//nkhetmalis//Desktop//RazorSign_framework//Razorsign//tests//testdata//sample-docx-files-sampledocument (1).pdf');
    await this.supportingdoc.setInputFiles(filePath);

    await this.submitAndVerify();
  }

  // NOTE: this flow is identical to non-mandatory. Add the template-selection steps here.
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
  }
}

module.exports = { RequestPage };