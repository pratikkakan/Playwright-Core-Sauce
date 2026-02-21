import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS } from "../data/users";

/**
 * Custom fixtures for Sauce Demo tests.
 *
 * appPage(usernameKey?)  →  LoginPage instance
 *
 *   Called WITHOUT a key  → navigates to the login page only (no login)
 *   Called WITH a key     → navigates, logs in as that user, waits for Products page
 *
 * Available user keys (defined in src/data/users.ts):
 *   "standard_user" | "problem_user" | "locked_out_user" | "performance_glitch_user"
 *
 * Example usage:
 *   const page  = await appPage();                  // fresh login page
 *   const page  = await appPage("standard_user");   // already logged in
 */

type TestFixtures = {
  appPage: (usernameKey?: string) => Promise<LoginPage>;
};

export const test = base.extend<TestFixtures>({
  appPage: async ({ page }, use) => {
    await use(async (usernameKey?: string) => {
      const loginPage = new LoginPage(page);

      if (usernameKey) {
        const user = USERS[usernameKey];
        if (!user) {
          throw new Error(
            `User "${usernameKey}" not found. Check src/data/users.ts for valid keys.`,
          );
        }
        await loginPage.loginAs(user.username, user.password);
      } else {
        await loginPage.goto();
      }

      return loginPage;
    });
  },
});

export { expect };
