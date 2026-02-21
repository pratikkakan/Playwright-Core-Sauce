import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../pages/LoginPage";
import { DEFAULT_USER } from "../data/users";

type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: (username?: string) => Promise<LoginPage>;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Return a function that accepts optional username
    await use(async (username: string = DEFAULT_USER) => {
      const authFile = path.join(process.cwd(), ".auth", `${username}.json`);

      if (!fs.existsSync(authFile)) {
        throw new Error(`❌ Auth file not found for user: ${username}`);
      }

      // Load and apply stored auth state
      const storageState = JSON.parse(fs.readFileSync(authFile, "utf-8"));
      await page.context().addCookies(storageState.cookies);

      // Apply local storage and session storage
      await page.addInitScript(() => {
        // Storage will be restored by Playwright automatically
      });

      // Navigate to app (already logged in)
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const loginPage = new LoginPage(page);
      return loginPage;
    });
  },
});

export { expect };
