const { test ,expect } = require('@playwright/test');


class Request {
    constructor(page) {
        this.page = page;
        this.createreq = page.locator("//a[normalize-space()='Create']");
        this.requestreq = page.locator("//a[normalize-space()='Request']");
        this.contracttype = page.locator("//body/div[@id='root']/div/div[@class='mainContainer AfterLoginbody']/div[@class='container containerFull customFormElements']/div[@class='grid gridCol3']/div[@class='mandatory']/div[contains(@class,'css-b62m3t-container')]/div[@class='mandatory__control css-13cymwt-control']/div[@class='mandatory__indicators css-1wy0on6']/div[1]");
        this.contractvalue = page.locator("//div[@id='react-select-2-option-193']");
    }

    async CreateRequest() {
        await this.createreq.hover();
       // await this.page.waitForTimeout(2000);
        await expect(this.requestreq).toBeVisible();
        await this.requestreq.click();
        await this.contracttype.click();
       // await this.page.waitForTimeout(2000);
        await this.contractvalue.scrollIntoViewIfNeeded();
        await this.contractvalue.click();
        await this.page.waitForTimeout(2000);
        
    }
}

module.exports = Request;