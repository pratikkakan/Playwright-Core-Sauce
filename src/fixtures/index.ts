import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS, DEFAULT_USER } from "../data/users";

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
      const user = USERS[username];
      if (!user) {
        throw new Error(`❌ User not found: ${username}`);
      }

      console.log(`🔐 Logging in as: ${username}`);

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.completeLogin(user.username, user.password);

      console.log(`✅ Successfully logged in as: ${username}`);
      return loginPage;
    });
  },
});

export { expect };
