import { Page, Locator } from "@playwright/test";

/**
 * LoginPage - Page Object Model for the application login page.
 *
 * Selectors are app-specific (update them when switching apps).
 * The login FLOW and verification logic is app-agnostic:
 *   - loginAs() waits for the browser to navigate away from the login path.
 *   - isLoggedIn() checks the current URL — no dependency on any DOM element.
 *
 * Public API:
 *   goto()                        → navigate to the login page (no login)
 *   loginAs(username, password)   → full login: navigate → fill → submit → wait for redirect
 *   isLoggedIn()                  → returns true if the browser has left the login page
 */
export class LoginPage {
  // ── Selectors (update these when switching apps) ──────────────────────────
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  /**
   * @param page        - Playwright Page instance
   * @param loginPath   - URL path of the login page (default: "/")
   */
  constructor(
    private readonly page: Page,
    private readonly loginPath: string = "/",
  ) {
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
    this.loginButton = page.locator('input[data-test="login-button"]');
  }

  /** Navigate to the login page without logging in. */
  async goto(): Promise<void> {
    await this.page.goto(this.loginPath);
  }

  /**
   * Complete login in one call:
   * 1. Navigate to the login page
   * 2. Fill in username and password
   * 3. Click the login button
   * 4. Wait for the browser to navigate away from the login path
   */
  async loginAs(username: string, password: string): Promise<void> {
    await this.page.goto(this.loginPath);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait until the URL changes away from the login page — works for any app
    await this.page.waitForURL((url) => url.pathname !== this.loginPath, {
      timeout: 5000,
    });
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Returns true if the browser is no longer on the login page.
   * URL-based check — no dependency on any app-specific DOM element.
   */
  async isLoggedIn(): Promise<boolean> {
    const currentPath = new URL(this.page.url()).pathname;
    return currentPath !== this.loginPath;
  }
}
