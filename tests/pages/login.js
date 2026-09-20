class Login {
    constructor(page) {
        this.page = page;
        this.email = page.locator("#txtUserName");
        this.password = page.locator("//input[@placeholder='Password']");
        this.loginButton = page.locator("//input[@value='Login']");
    }

    async loginApplication(username, password) {
        await this.email.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

module.exports = Login;