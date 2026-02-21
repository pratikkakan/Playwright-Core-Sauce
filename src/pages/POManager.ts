import { Page } from "@playwright/test";
import { InventoryPage } from "./Inventory";
import { LoginPage } from "./LoginPage";

export class POManager {
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(private readonly page: Page) {
    this.loginPage = new LoginPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getInventoryPage(): InventoryPage {
    return this.inventoryPage;
  }
}
