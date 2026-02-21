import { test, expect } from "../src/fixtures/index";


test.describe("Auth - Login Tests", () => {
  test("standard_user can log in", async ({ appPage }) => {
    const page = await appPage("standard_user");
    expect(await page.isLoggedIn()).toBe(true);
  });

  test("problem_user can log in", async ({ appPage }) => {
    const page = await appPage("problem_user");
    expect(await page.isLoggedIn()).toBe(true);
  });

  test("performance_glitch_user can log in", async ({ appPage }) => {
    const page = await appPage("performance_glitch_user");
    expect(await page.isLoggedIn()).toBe(true);
  });

  test("login page is shown when not logged in", async ({ appPage }) => {
    const page = await appPage(); // no username → just navigate, don't login
    expect(await page.isLoggedIn()).toBe(false);
  });
});
