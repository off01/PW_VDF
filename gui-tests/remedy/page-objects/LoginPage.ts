import { Page } from 'playwright';

class LoginPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://remedytest.oskarmobil.cz/');
    }

    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }

    private async getElementByXPath(xpath: string) {
        const elements = await this.page.$$('xpath=' + xpath);
        if (elements.length > 0) {
            return elements[0];
        } else {
            throw new Error(`Element with XPath ${xpath} not found.`);
        }
    }    

    async enterUsername(username: string) {
        const inputElement = await this.getElementByXPath('');
        await inputElement.fill(username);
    }

    async enterPassword(password: string) {
        const inputElement = await this.getElementByXPath('');
        await inputElement.fill(password);
    }

    async clickLoginButton() {
        const inputElement = await this.getElementByXPath('');
        await inputElement.click();
    }
}

export default LoginPage;
