import { test, expect } from "../src/fixtures/index";

const users = [
  "standard_user",
  "problem_user",
  "performance_glitch_user",
] as const;

test.describe("First Test - All Users", () => {
  for (const user of users) {
    test.describe(`${user}`, () => {
      test.use({ user });

      test("User is able to log in and see inventory items", async ({
        appPage,
      }) => {
        expect(await appPage.isLoggedIn()).toBe(true);
        const items = appPage.page.locator(".inventory_item");
        await expect(items).toHaveCount(6);
        console.log(`✅ ${user} can see inventory items`);
      });
    });
  }
});
