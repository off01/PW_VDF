import { defineConfig, devices, firefox } from "@playwright/test";
import config from "./config/config";
import { testPlanFilter } from "allure-playwright/dist/testplan";

export default defineConfig({
  timeout: 300000,
  use: {
    browserName: "firefox",
    baseURL: config.baseURL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Authorization: "Basic dGVzdGluZzp0ZXN0aW5nMTIz",
    },
  },
  retries: 0,
  grep: testPlanFilter(),
  reporter: [["list"], ["html"], ["allure-playwright"]],
  /* projects: [
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    }
    // Pokud chcete přidat Webkit, doplňte další projektovou konfiguraci zde
  ], */
});
