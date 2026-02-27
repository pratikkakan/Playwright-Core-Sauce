import { defineConfig, devices } from "@playwright/test";
import { runConfig } from "./run.config";
import { getEnvironmentConfig } from "./src/config/envrionments";

const envConfig = getEnvironmentConfig(runConfig.env);

const allProjects = {
  chromium: {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  firefox: {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  webkit: {
    name: "webkit",
    use: { ...devices["Desktop Safari"] },
  },
  "mobile-chrome": {
    name: "mobile-chrome",
    use: { ...devices["Pixel 5"] },
  },
  "mobile-safari": {
    name: "mobile-safari",
    use: { ...devices["iPhone 13"] },
  },
};

type ProjectKey = keyof typeof allProjects;

export default defineConfig({
  testDir: "./tests",
  retries: runConfig.retries,
  workers: runConfig.workers,
  fullyParallel: runConfig.fullyParallel,

  ...(runConfig.testFiles.length > 0 && {
    testMatch: runConfig.testFiles,
  }),

  // ✅ Max time for each test to run
  timeout: 30_000,

  // ✅ Max time for the whole test suite
  globalTimeout: 0, // 0 = no limit

  // ✅ Max time for expect() assertions
  expect: {
    timeout: 5_000,
  },

  // ✅ Include tests matching these tags
  ...(runConfig.tags.length > 0 && {
    grep: new RegExp(runConfig.tags.join("|")),
  }),

  // ✅ Exclude tests matching these tags
  ...(runConfig.excludeTags.length > 0 && {
    grepInvert: new RegExp(runConfig.excludeTags.join("|")),
  }),

  // "html" | "list" | "dot" | "json" | "line"
  reporter: "html",

  projects: (runConfig.projects as ProjectKey[]).map((p) => allProjects[p]),

  use: {
    baseURL: envConfig.baseURL,
    headless: !runConfig.headed,

    // ✅ Max time for actions like click, fill, hover etc.
    actionTimeout: 10_000,

    // ✅ Max time for page.goto() and navigations
    navigationTimeout: 30_000,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
});
