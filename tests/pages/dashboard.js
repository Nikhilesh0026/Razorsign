const { expect } = require('@playwright/test');

class Dashboard {
    constructor(page) {
        this.page = page;
        this.homeButton = page.locator("//a[normalize-space()='Home']");
        this.closeRequestPopup =  page.getByTitle('Close Request')
    }

    async verifyDashboardPage() {
        await expect(this.homeButton).toBeVisible();
    }

    // Closes the small "Request" popup if it appears after login.
    // Safe for every role: if the popup never shows, it just continues.
    async closeRequestPopupIfShown() {
        const shown = await this.closeRequestPopup
            .waitFor({ state: 'visible', timeout: 3000 })
            .then(() => true)
            .catch(() => false);

        if (shown) {
            await this.closeRequestPopup.click();
            await this.closeRequestPopup.waitFor({ state: 'hidden' });
        }
    }
}

module.exports = Dashboard;