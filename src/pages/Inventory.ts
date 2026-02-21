import { Page, Locator } from  "@playwright/test";


export class InventoryPage {
    private readonly inventoryItems: Locator;
    private readonly allLinks: Locator;
    
    constructor(readonly page: Page) {
        this.page = page;
        this.inventoryItems = page.locator(".inventory_item");
        this.allLinks = page.locator("a");
    }

    async getInventoryItemsCount(): Promise<number> {
        return this.inventoryItems.count();
    }

    async getAllLinksCount(): Promise<number> {
        return this.allLinks.count();
    }


}