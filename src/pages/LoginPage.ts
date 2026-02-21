import { Page, Locator } from "@playwright/test";

export class LoginPage {
  // Locators - initialized in constructor
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly productsTitle: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    // Initialize all locators in constructor (single point of definition)
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
    this.loginButton = page.locator('input[data-test="login-button"]');
    this.productsTitle = page
      .locator('span.title:has-text("Products")')
      .first();
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsUser(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }

  async waitForProductsPage(): Promise<void> {
    await this.productsTitle.waitFor({ state: "visible" });
    await this.page.waitForLoadState("networkidle");
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.productsTitle.waitFor({ state: "visible" });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: "visible" });
      return true;
    } catch {
      return false;
    }
  }

  // Convenience method for complete login flow
  async completeLogin(username: string, password: string): Promise<void> {
    await this.loginAsUser(username, password);
    await this.waitForProductsPage();
  }
}
