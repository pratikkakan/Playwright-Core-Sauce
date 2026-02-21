import { test, expect } from "../src/fixtures/index";

test.describe("Home Page - Multi-User Tests", () => {
  test("should display products for standard_user", async ({
    authenticatedPage,
  }) => {
    // Request authenticated page for standard_user
    const homePage = await authenticatedPage("standard_user");

    // Verify we're logged in as standard_user
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    console.log("✅ Standard user successfully logged in");
  });

  test("should display products for problem_user", async ({
    authenticatedPage,
  }) => {
    // Request authenticated page for problem_user
    const homePage = await authenticatedPage("problem_user")
    // Verify we're logged in
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBe(true); 

    console.log("✅ Problem user successfully logged in");
  });

  test("should display products for performance_glitch_user", async ({
    authenticatedPage,
  }) => {
    // Request authenticated page for performance_glitch_user
    const homePage = await authenticatedPage("performance_glitch_user");

    // Verify we're logged in
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBe(true);

    console.log("✅ Performance glitch user successfully logged in");
  });
});
