import { Page, Locator } from "@playwright/test";

/**
 * LoginPage - Page Object Model for the Sauce Demo login page.
 *
 * Public API:
 *   goto()                        → navigate to the login page (no login)
 *   loginAs(username, password)   → full login: navigate → fill → submit → wait for Products
 *   isLoggedIn()                  → returns true if the Products page is visible
 */
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly productsTitle: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
    this.loginButton = page.locator('input[data-test="login-button"]');
    this.productsTitle = page.locator('span.title:has-text("Products")');
  }

  /** Navigate to the login page without logging in. */
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /**
   * Complete login in one call:
   * 1. Navigate to the login page
   * 2. Fill in username and password
   * 3. Click the login button
   * 4. Wait until the Products page is fully loaded
   */
  async loginAs(username: string, password: string): Promise<void> {
    await this.page.goto("/");
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.productsTitle.waitFor({ state: "visible", timeout: 5000 });
    await this.page.waitForLoadState("networkidle");
  }

  /** Returns true if the Products page is visible (user is logged in). */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.productsTitle.waitFor({ state: "visible", timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
