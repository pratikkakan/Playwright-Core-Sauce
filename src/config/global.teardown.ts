async function globalTeardown() {
  // Tests use on-demand login (no stored sessions), so no cleanup is needed.
  console.log("✅ Global Teardown: Complete");
}

export default globalTeardown;
