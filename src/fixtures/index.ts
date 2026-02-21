import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS } from "../data/users";

/**
 * user  (option)   – key from src/data/users.ts, default '' = no login
 * authStage (fixture) – automatically logs in (or just navigates) before the
 *                     test body runs. No factory calls needed inside tests.
 *
 * Usage in tests:
 *
 *   // Log in as a specific user for an entire describe block
 *   test.use({ user: "standard_user" });
 *
 *   // Inside the test – authStage is already authenticated
 *   test("can see products", async ({ authStage }) => {
 *     expect(await authStage.isLoggedIn()).toBe(true);
 *   });
 *
 *   // For unauthenticated tests omit test.use – user defaults to ''
 *   test("login page shown when not logged in", async ({ authStage }) => {
 *     expect(await authStage.isLoggedIn()).toBe(false);
 *   });
 */

type TestFixtures = {
  /** Key from USERS map. Empty string = navigate to login page without logging in. */
  user: string;
  /** Ready-to-use LoginPage. Already logged in when user option is set. */
  authStage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  // ── Option: which user to authenticate as ─────────────────────────────────
  // Test-scoped option → test.use({ user }) works inside describe blocks too.
  user: ["", { option: true }],

  // ── Fixture: runs automatically before every test body ────────────────────
  authStage: async ({ page, user }, use) => {
    const loginPage = new LoginPage(page);

    if (user) {
      const credentials = USERS[user];
      if (!credentials) {
        throw new Error(
          `User "${user}" not found in src/data/users.ts. ` +
            `Available: ${Object.keys(USERS).join(", ")}`,
        );
      }
      // Navigates → fills → submits → waits for redirect → waits for network idle
      await loginPage.loginAs(credentials.username, credentials.password);
    } else {
      // No user set – just land on the login page (unauthenticated tests)
      await loginPage.goto();
    }

    // Hand the ready page object to the test
    await use(loginPage);

    // ── Teardown (runs after the test body) ───────────────────────────────
    // Nothing to clean up – Playwright closes the page automatically.
    // Add explicit logout here if the app requires it between tests.
  },
});

export { expect };
