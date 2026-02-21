import { test as base, expect } from "@playwright/test";
import { POManager } from "@framework/pages/POManager";
import { LoginPage } from "../pages/LoginPage";
import { USERS } from "../data/users";

type MyFixtures = {
  user: string;
  authStage: LoginPage;
  poManager: POManager;
};

export const test = base.extend<MyFixtures>({
  // ── Option: which user to authenticate as ────────────────────────
  user: ["", { option: true }],

  // ── Fixture: runs AUTOMATICALLY before every test ────────────────
  // auto: true → no need to declare authStage in every test argument
  authStage: [
    async ({ page, user }, use) => {
      const loginPage = new LoginPage(page);

      if (user) {
        const credentials = USERS[user];
        if (!credentials) {
          throw new Error(
            `User "${user}" not found in src/data/users.ts. ` +
              `Available: ${Object.keys(USERS).join(", ")}`,
          );
        }
        await loginPage.loginAs(credentials.username, credentials.password);
      } else {
        await loginPage.goto();
      }

      await use(loginPage);
      // teardown: Playwright closes page automatically
    },
    { auto: true }, // ← runs before every test, no need to declare in test args
  ],

  poManager: async ({ page }, use) => {
    const poManager = new POManager(page);
    await use(poManager);
  },
});

export { expect };
