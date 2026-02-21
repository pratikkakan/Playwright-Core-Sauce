import { test, expect } from "../src/fixtures/index";

/**
 * HOME PAGE TESTS - SIMPLE FIXTURE USAGE
 *
 * loginPage fixture can be used TWO ways:
 *
 * 1. Fresh page (for testing login):
 *    const page = await loginPage();
 *
 * 2. Already logged in (for testing app):
 *    const home = await loginPage("standard_user");
 */

test.describe("Home Page Tests", () => {
  test("Test 1: standard_user should be able to login", async ({
    loginPage,
  }) => {
    // loginPage("standard_user") = navigate + login + return ready-to-use page
    const home = await loginPage("standard_user");

    // Verify login was successful
    const isLoggedIn = await home.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    console.log("✅ Standard user logged in successfully");
  });

  test("Test 2: problem_user should be able to login", async ({
    loginPage,
  }) => {
    // loginPage("problem_user") with different user
    const home = await loginPage("problem_user");

    const isLoggedIn = await home.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    console.log("✅ Problem user logged in successfully");
  });

  test("Test 3: performance_glitch_user should be able to login", async ({
    loginPage,
  }) => {
    // loginPage("performance_glitch_user") with yet another user
    const home = await loginPage("performance_glitch_user");

    const isLoggedIn = await home.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    console.log("✅ Performance glitch user logged in successfully");
  });

  test("Test 4: Login page should appear when no username provided", async ({
    loginPage,
  }) => {
    // loginPage() with NO username = just fresh page, not logged in
    const page = await loginPage();

    // You should NOT be logged in yet
    const isLoggedIn = await page.isLoggedIn();
    expect(isLoggedIn).toBe(false);

    console.log("✅ Login page displayed (not logged in)");
  });
});
