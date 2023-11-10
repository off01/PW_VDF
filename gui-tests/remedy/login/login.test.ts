import { test, expect } from "@playwright/test"; // eslint-disable-line
import LoginPage from "../../pip/page-objects/LoginPage";

test("Login to Remedy Portal", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  await loginPage.waitForElement("");
  await loginPage.enterUsername("");
  await loginPage.enterPassword("");
  await loginPage.clickLoginButton();

  // Optionally, add assertions to verify the behavior, e.g.,
  // await expect(page).toHaveURL('https://vodafone-portalip-test.position.cz/dashboard');
});
