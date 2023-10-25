import { defineConfig, devices, firefox } from '@playwright/test';
import { config } from "dotenv";

config();

export default defineConfig({
  timeout: 300000,
  use: {
    browserName: 'firefox',
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "Authorization": "Basic dGVzdGluZzp0ZXN0aW5nMTIz"
    },
  },
  retries: 0,
  reporter: [["list"], ["html"]],
  /* projects: [
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    }
    // Pokud chcete přidat Webkit, doplňte další projektovou konfiguraci zde
  ], */
});
