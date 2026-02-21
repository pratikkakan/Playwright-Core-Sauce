import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { chromium } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS, DEFAULT_USER } from "../data/users";

const BASE_URL = process.env.BASE_URL ?? "https://www.saucedemo.com";
const AUTH_DIR = path.join(process.cwd(), ".auth");

type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: (username?: string) => Promise<LoginPage>;
};

// Helper: Authenticate user and save auth state (lazy loading)
async function authenticateUserLazy(username: string): Promise<string> {
  const user = USERS[username];
  if (!user) {
    throw new Error(`❌ User not found: ${username}`);
  }

  console.log(`🔐 Authenticating user: ${username}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.completeLogin(user.username, user.password);

    const storageState = await context.storageState();
    const authFile = path.join(AUTH_DIR, `${username}.json`);
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
    console.log(`✅ Auth state saved: .auth/${username}.json`);

    return JSON.stringify(storageState, null, 2);
  } finally {
    await browser.close();
  }
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Return a function that accepts optional username
    await use(async (username: string = DEFAULT_USER) => {
      const authFile = path.join(AUTH_DIR, `${username}.json`);

      // Lazy loading: authenticate if auth file doesn't exist
      if (!fs.existsSync(authFile)) {
        console.log(
          `📁 Auth file not found for ${username}, creating on-demand...`,
        );
        await authenticateUserLazy(username);
      }

      // Load and apply stored auth state
      const storageState = JSON.parse(fs.readFileSync(authFile, "utf-8"));
      await page.context().addCookies(storageState.cookies);

      // Navigate to app (already logged in)
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const loginPage = new LoginPage(page);
      return loginPage;
    });
  },
});

export { expect };
