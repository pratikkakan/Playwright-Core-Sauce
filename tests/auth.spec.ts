import { test, expect } from "../src/fixtures/index";



test.describe("standard_user", () => {
  test.use({ user: "standard_user" });

  test("can log in", async ({ appPage }) => {
    // appPage is already on the inventory page – fixture handled login
    expect(await appPage.isLoggedIn()).toBe(true);
  });

  test("sees 6 products on the inventory page", async ({ appPage }) => {
    // Verify the full product catalogue is displayed after login
    const items = appPage.page.locator(".inventory_item");
    await expect(items).toHaveCount(6);
  });
});

test.describe("problem_user", () => {
  test.use({ user: "problem_user" });

  test("can log in", async ({ appPage }) => {
    expect(await appPage.isLoggedIn()).toBe(true);
  });
});

test.describe("performance_glitch_user", () => {
  test.use({ user: "performance_glitch_user" });

  test("can log in", async ({ appPage }) => {
    expect(await appPage.isLoggedIn()).toBe(true);
  });
});

// ── Unauthenticated tests – no user option → fixture only navigates ─────────

test("login page is shown when not logged in", async ({ appPage }) => {
  expect(await appPage.isLoggedIn()).toBe(false);
});

test("locked_out_user sees an error message", async ({ appPage }) => {
  // Attempt login without waiting for redirect (login() vs loginAs())
  await appPage.login("locked_out_user", "secret_sauce");

  const errorMessage = await appPage.getErrorMessage();
  expect(errorMessage).toContain("Sorry, this user has been locked out.");
});
