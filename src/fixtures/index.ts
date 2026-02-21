import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS } from "../data/users";

/**
 * appPage(usernameKey?) → LoginPage
 *
 * Called WITHOUT a key → navigates to the login page only (no login)
 * Called WITH a key   → navigates + logs in + waits for Products page
 *
 * Available keys (defined in src/data/users.ts):
 *   "standard_user" | "problem_user" | "locked_out_user" | "performance_glitch_user"
 *
 * Usage:
 *   const page = await appPage();                 // fresh login page
 *   const page = await appPage("standard_user");  // already logged in
 */

type TestFixtures = {
  appPage: (usernameKey?: string) => Promise<LoginPage>;
};

export const test = base.extend<TestFixtures>({
  appPage: async ({ page }, use) => {
    // Provide a function the test calls to get a LoginPage
    await use(async (usernameKey?: string) => {
      const loginPage = new LoginPage(page);

      if (usernameKey) {
        // Login: look up credentials → navigate → fill → submit → wait
        const user = USERS[usernameKey];
        if (!user) {
          throw new Error(
            `User "${usernameKey}" not found. Check src/data/users.ts`,
          );
        }
        await loginPage.loginAs(user.username, user.password);
      } else {
        // No login: just navigate to the login page
        await loginPage.goto();
      }

      return loginPage;
    });
  },
});

export { expect };
