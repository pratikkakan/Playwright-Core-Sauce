// ✅ Define allowed project keys
type ProjectKey =
  | "chromium"
  | "firefox"
  | "webkit"
  | "mobile-chrome"
  | "mobile-safari";

export const runConfig = {
  // ✅ Now typed — autocomplete will suggest valid options
  projects: ["chromium", "firefox"] as ProjectKey[],

  // ✅ Pick which tags to run: e.g. "@smoke", "@regression", "@login", "@checkout"
  // Leave empty [] to run ALL tests in the selected projects
  tags: ["@smoke"],

  // ✅ Exclude specific tags: e.g. ["@wip", "@skip"]
  // Leave empty [] to not exclude any tags
  excludeTags: [] as string[],

  // ✅ Pick specific test files (optional) — leave empty [] to run all
  // Example: ["tests/sauce.spec.ts", "tests/checkout.spec.ts"]
  testFiles: [] as string[],

  // ✅ Set headed or headless
  headed: false, // false = headless, true = headed (browser visible)

  // ✅ Run tests within the same file in parallel
  // true  = all tests run in parallel (fastest, but tests must be independent)
  // false = tests in the same file run serially (safer for shared state)
  fullyParallel: false,

  // ✅ Workers — how many parallel workers to use
  // Use 1 to run everything serially (useful for debugging)
  workers: 6,

  // ✅ Retries on failure
  retries: 0,
};
