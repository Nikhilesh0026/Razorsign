const { expect } = require('@playwright/test');
const path = require('path');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

class RequestPage {
  constructor(page) {
    this.page = page;

    // ---------- create request ----------
    this.createButton     = page.getByText('Create', { exact: true });
    this.requestButton    = page.getByText('Request', { exact: true });
    // TODO: confirm the label text for the contract type field
    this.contracttype     = page.locator("//label[contains(.,'Contract Type')]/following::input[1]");
    this.template         = page.locator("//label[normalize-space()='Template']/following::input[1]");
    this.contractcategory = page.locator("//label[contains(.,'Contract Category_1')]/following::input[1]");
    this.zone             = page.locator("//label[contains(.,'Zone')]/following::input[1]");
    this.selfparty        = page.locator("//label[contains(.,'Contract Self Party')]/following::input[1]");
    this.otherparty       = page.locator("//label[contains(.,'Contract Other Party Name')]/following::input[1]");
    this.contracttitle    = page.locator("//input[@class='mandatory']");
    this.contractdetails  = page.locator('#BodyInput');
    this.supportingdoc    = page.locator('input[name="10628"]');
    this.submitButton     = page.locator("//input[@value='Create']");
    this.okButton         = page.locator("//input[@value='Ok']");
    this.successMessage   = page.getByText('Contract Request Added Successfully.', { exact: true });

    // ---------- template ----------
    this.selectTemplate   = page.getByText('Select Template', { exact: true });
    this.loadTemplateBtn  = page.locator('input[value="Load"]');
    this.fullNameInput    = page.locator('#Name');
    this.saveTemplateBtn  = page.locator("//input[@value='Save']");
    this.templateOkBtn    = page.locator("//input[@value='Ok']");

    // ---------- delete ----------
    this.deleteRequestBtn = page.getByTitle('Delete', { exact: true });
    this.confirmDeleteBtn = page.locator("//input[@value='Yes']");
    this.deleteDescBox    = page.locator('#Description:visible');
    this.deleteSaveBtn    = page.locator("//input[@value='Save']");

    // ---------- requests list / approval ----------
    this.searchInput      = page.getByPlaceholder('Search', { exact: true });
    // TODO: confirm this locator against the results list
    this.searchResultItem =  page.locator("//div[3]//div[7]//img[1]");
    this.viewRequestBtn   =   page.getByRole('button', { name: 'View' })
    this.approveBtn       = page.locator("//input[@value='Approve']");
    this.pendingOption    = page.getByLabel('Pending', { exact: true });
    this.saveApproveBtn   = page.locator("//input[@id='ApproveContract']");

    // ---------- requestor approval ----------
    this.homeLink         = page.getByText('Home', { exact: true });
    this.approvalsTab     = page.getByText('Approvals', { exact: true });
    this.requestDetails   = page.locator("//input[@id='react-select-2-input']");
    this.approveReplyBtn  = page.locator('button').filter({ hasText: 'Click here' }).first();
    this.replyTextarea    = page.locator('textarea.mandatory');
    this.updateApproveBtn =   page.locator('input[type="button"]');
    // ---------- login / logout ----------
    // TODO: replace with a locator for the profile/avatar icon
    this.profileIcon      = page.locator('div.img-wrap:visible');
    this.signOutBtn       = page.locator("//input[@value='Sign out']");
    this.loginBtn         = page.locator("//input[@value='Login']");
    this.usernameInput    = page.locator('#txtUserName');
    this.passwordInput    = page.locator("//input[@placeholder='Password']");
  }

  // ---------- shared helpers ----------

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

  async fillOtherParty(otherParty) {
    await this.otherparty.waitFor({ state: 'visible' });
    await this.otherparty.fill(otherParty);
    // Match the suggestion by name instead of a hardcoded full string
    const suggestion = this.page.getByRole('option').filter({ hasText: otherParty }).first();
    await suggestion.waitFor({ state: 'visible' });
    await suggestion.click();
  }

  async fillTitle(title) {
    await this.contracttitle.waitFor({ state: 'visible' });
    await this.contracttitle.fill('');
    await this.contracttitle.fill(title);
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
    await this.okButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.okButton.click();
 //   await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  // ---------- template ----------

  async loadTemplateAndFill({ fullName }) {
    await this.selectTemplate.click();
    await this.loadTemplateBtn.click();
    await this.fullNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.fullNameInput.fill(fullName);
    await this.saveTemplateBtn.click();
    await this.templateOkBtn.click();
  }

  // ---------- delete ----------

  async requestdelete() {
    await this.deleteRequestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteRequestBtn.scrollIntoViewIfNeeded();
    await expect(this.deleteRequestBtn).toBeEnabled();
    await this.deleteRequestBtn.click();
    await this.confirmDeleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.confirmDeleteBtn.click();
    await this.deleteDescBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteDescBox.fill('Request deleted by automation');
    await this.deleteSaveBtn.click();
  }

  // ---------- login / logout ----------

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
    // Wait for an element that only appears after a successful login
    await this.createButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async logout() {
    await this.profileIcon.hover();
    await this.signOutBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.signOutBtn.click();
    await this.loginBtn.waitFor({ state: 'visible', timeout: 15000 });
  }

  // ---------- approval flows ----------

  /**
   * Opens the request matching `title` from the Requests list.
   * Used by both the approver and the requestor flows.
   */
  async openRequestByTitle(title) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(title);
    await this.searchResultItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchResultItem.click();

    // TODO: replace with a locator scoped to the row containing `title`
   // const menu = this.page.locator('div').filter({ hasText: title }).locator('img').first();
  //  await menu.waitFor({ state: 'visible', timeout: 10000 });
   // await menu.click();

    await this.viewRequestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.viewRequestBtn.click();
  }

  /**
   * Logs in as the approver (NORMAL_* credentials) and approves the request.
   */
  async requestapproval(title = 'approval mandatory feild for request') {
    await this.login(requireEnv('NORMAL_USERNAME'), requireEnv('NORMAL_PASSWORD'));
    await this.openRequestByTitle(title);

    await this.approveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.approveBtn.click();
    await this.pendingOption.click();
    await this.saveApproveBtn.click();
  }

  /**
   * Logs in as the requestor (BRANCH_* credentials) and replies to the
   * approval with "approve".
   */
  async requestorapprove(title = 'approval mandatory feild for request') {
    await this.login(requireEnv('BRANCH_USERNAME'), requireEnv('BRANCH_PASSWORD'));
    await this.homeLink.click();
    await this.openRequestByTitle(title);

    await this.requestDetails.click();
    await this.approvalsTab.click();
    await this.approveReplyBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.approveReplyBtn.click();
    await this.replyTextarea.fill('approve');
    await this.updateApproveBtn.click();
  }

  // ---------- form filling ----------

  // zone, details and Template are optional
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
    if (Template) await this.selectOption(this.template, Template);
  }

  // ---------- request flows ----------

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

    // TODO: adjust the '..' segments if this file's location differs from pages/
    const filePath = path.resolve(
      __dirname, '..', 'tests', 'testdata', 'sample-document.pdf'
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
    await this.loadTemplateAndFill({ fullName: data.Fullname });
    await this.requestdelete();
  }

  async editRequest(data) {
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
}

module.exports = { RequestPage };