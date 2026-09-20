const { expect } = require('@playwright/test');

class Dashboard {

    constructor(page) {

        this.page = page;

        this.homeButton = page.locator(
            "//a[normalize-space()='Home']"
        );
    }

    async verifyDashboardPage() {

        await expect(this.homeButton).toBeVisible();
    }
}

module.exports = Dashboard;