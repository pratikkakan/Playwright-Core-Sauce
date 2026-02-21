import { test, expect } from "../src/fixtures/index";
import { POManager } from "@framework/pages/POManager";

const users = [
  "standard_user",
  "problem_user",
  "performance_glitch_user",
] as const;

test.describe.parallel("First Test - All Users", () => {
  for (const user of users) {
    test.describe(`${user}`, () => {
      test.use({ user });

      // ✅ No authStage in args — fixture runs automatically
      test("User is able to log in and see inventory items", async ({
        page,
      }) => {
        const poManager = new POManager(page);
        const items = await poManager
          .getInventoryPage()
          .getInventoryItemsCount();
        // const items = inventoryPage.getInventoryItems();
        await expect(items).toEqual(6);
      });

      test("Verify the user is able to see the links available in the page", async ({
        page,
      }) => {
        const poManager = new POManager(page);
        const items = await poManager.getInventoryPage().getAllLinksCount();
        // const allLinks = page.locator("a");
        await expect(items).toEqual(4);
      });
    });
  }
});
