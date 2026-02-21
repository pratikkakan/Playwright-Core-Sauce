import { test, expect } from "../src/fixtures/index";

const users = [
  "standard_user",
  "problem_user",
  "performance_glitch_user",
] as const;

for (const user of users) {
  test.describe(` Sauce Demo Test Via${user}`, () => {
    test.use({ user }); // ✅ at describe scope, no extra nesting

    test("User is able to log in and see inventory items", async ({
      poManager,
    }) => {
      const items = await poManager.getInventoryPage().getInventoryItemsCount();
      await expect(items).toEqual(6);
    });

    test("Verify the user is able to see the links available in the page", async ({
      poManager,
    }) => {
      const items = await poManager.getInventoryPage().getAllLinksCount();
      await expect(items).toEqual(4);
    });
  });
}
