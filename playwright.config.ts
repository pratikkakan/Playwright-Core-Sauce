import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// ─── Load environment variables ─────
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const BASE_URL = process.env.BASE_URL ?? "https://www.saucedemo.com";

// ─── Playwright Configuration ───
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",

  // ── Parallelism ───
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
//   retries: process.env.CI ? 2 : 0,

  // ── Shared Test Options ──────
  use: {
    baseURL: BASE_URL,
    navigationTimeout: 30_000,
    actionTimeout: 10_000,

    // Browser context
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Debugging artifacts saved on failure
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",

    // Locale
    locale: "en-US",
    timezoneId: "America/New_York",
  },

  // ── Global Setup / Teardown ───────
  globalSetup: "./src/config/global.setup.ts",
  globalTeardown: "./src/config/global.teardown.ts",

  // ── Projects (Browsers) ───────
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "api",
      use: {
        baseURL: process.env.API_BASE_URL ?? "https://api.saucedemo.com",
        extraHTTPHeaders: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },
  ],
});
