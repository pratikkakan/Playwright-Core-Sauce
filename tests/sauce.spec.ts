import { test, expect } from "../src/fixtures/index";

const users = [
  "standard_user",
  "problem_user",
  "performance_glitch_user",
] as const;

test.describe.parallel("First Test - All Users", () => {
  for (const user of users) {
    test.describe(`${user}`, () => {
      test.use({ user });

      test("User is able to log in and see inventory items", async ({
        authStage,
      }) => {
        expect(await authStage.isLoggedIn()).toBe(true);
        const items = authStage.page.locator(".inventory_item");
        await expect(items).toHaveCount(6);
        console.log(`✅ ${user} can see inventory items`);
      });

      test("Verify the user is able to see the links available in the page", async ({
        authStage,
      }) => {
        const allLinks = authStage.page.locator("a");
        await expect(allLinks).toHaveCount(4);
        console.log(`✅ ${user} can see the links available in the page`);
      });
    });
  }
});
