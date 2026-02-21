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
        page,
      }) => {
        const items = page.locator(".inventory_item");
        await expect(items).toHaveCount(6);
      });

      test("Verify the user is able to see the links available in the page", async ({
        page,
      }) => {
        const allLinks = page.locator("a");
        await expect(allLinks).toHaveCount(4);
      });
    });
  }
});
