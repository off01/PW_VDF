import { test, expect } from "@playwright/test"; // eslint-disable-line
import LoginPage from "../../pip/page-objects/LoginPage";

test("Login to Vodafone Portal", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  await loginPage.waitForElement("#weColorPanel8");
  await loginPage.enterUsername("jan.meyer1@vodafone.com");
  await loginPage.enterPassword("Vodafone12345678");
  await loginPage.clickLoginButton();
  await loginPage.waitForElementByXPath('//div[@class="weButtonDarkText" and text()="Ověřit"]');
  console.log("Please enter the SMS code manually, then press Enter to continue.");
  await page.pause();
  await loginPage.clickVerifyButton();
  // Optionally, add assertions to verify the behavior, e.g.,
  // await expect(page).toHaveURL('https://vodafone-portalip-test.position.cz/dashboard');
});
