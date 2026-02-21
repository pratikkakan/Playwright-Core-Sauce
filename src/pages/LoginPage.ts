import { Page, Locator } from "@playwright/test";

/**
 * LoginPage - Page Object Model for Sauce Demo login page
 * Encapsulates all login-related interactions and locators
 */
export class LoginPage {
  // UI Locators - defined once in constructor (DRY principle)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly productsTitle: Locator;

  /**
   * Constructor - Initialize all locators
   * All selectors defined in ONE place for easy maintenance
   */
  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
    this.loginButton = page.locator('input[data-test="login-button"]');
    this.productsTitle = page.locator('span.title:has-text("Products")');
  }

  // ──────────── Navigation ────────────
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  // ──────────── Login Actions ────────────
  /**
   * Fill credentials and click login button
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Wait for Products page to fully load after login
   */
  async waitForProductsPage(): Promise<void> {
    await this.productsTitle.waitFor({ state: "visible", timeout: 5000 });
    await this.page.waitForLoadState("networkidle");
  }

  // ──────────── Verification ────────────
  /**
   * Check if logged in by verifying Products page is visible
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.productsTitle.waitFor({ state: "visible", timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // ──────────── Convenience Methods ────────────
  /**
   * Complete login flow:
   * Step 1: Enter username & password
   * Step 2: Click login button
   * Step 3: Wait for Products page to load
   */
  async completeLogin(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.waitForProductsPage();
  }
}
