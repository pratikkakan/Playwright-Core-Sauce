import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS, DEFAULT_USER } from "../data/users";

/**
 * ═══════════════════════════════════════════════════════════════
 * LOGIN PAGE FIXTURE - SIMPLE & FLEXIBLE
 * ═══════════════════════════════════════════════════════════════
 *
 * This fixture can be used in TWO ways:
 *
 * 1️⃣  Fresh page (for testing login flow):
 *     const loginPage = await loginPage();
 *     // Now test login with any credentials
 *
 * 2️⃣  Already logged in (for testing app features):
 *     const homePage = await loginPage("standard_user");
 *     // Now test product page, checkout, etc
 *
 * ═══════════════════════════════════════════════════════════════
 */

type TestFixtures = {
  loginPage: (username?: string) => Promise<LoginPage>;
};

export const test = base.extend<TestFixtures>({
  /**
   * loginPage - Single flexible fixture
   *
   * @param username - Optional. If provided, logs in automatically
   * @returns LoginPage instance (either fresh or already logged in)
   */
  loginPage: async ({ page }, use) => {
    // Return a function that tests can call
    await use(async (username?: string) => {
      const loginPageInstance = new LoginPage(page);

      // If username is provided, log in automatically
      if (username) {
        const user = USERS[username];
        if (!user) {
          throw new Error(`❌ User not found: ${username}`);
        }

        console.log(`🔐 Logging in as: ${username}`);
        await loginPageInstance.goto();
        await loginPageInstance.completeLogin(user.username, user.password);
        console.log(`✅ Successfully logged in as: ${username}`);
      }

      // Return LoginPage (either fresh or logged in)
      return loginPageInstance;
    });
  },
});

export { expect };
