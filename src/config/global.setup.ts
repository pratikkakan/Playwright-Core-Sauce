import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const BASE_URL = process.env.BASE_URL ?? "https://www.saucedemo.com";
const AUTH_DIR = path.join(process.cwd(), ".auth");
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function checkAppHealth(url: string): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔍 Health check attempt ${attempt}/${MAX_RETRIES}: ${url}`);
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        console.log("✅ App is healthy and reachable");
        return true;
      }
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed:`, (error as Error).message);
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY}ms...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  return false;
}

async function globalSetup(): Promise<void> {
  console.log("🔧 Global Setup: Starting...");

  // 1. Health check - verify app is reachable
  const isAppHealthy = await checkAppHealth(BASE_URL);
  if (!isAppHealthy) {
    throw new Error(
      `❌ Application at ${BASE_URL} is not reachable after ${MAX_RETRIES} attempts`,
    );
  }

  // 2. Ensure .auth directory exists
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  console.log("✅ Global Setup: Complete (tests will login on-demand)");
}

export default globalSetup;
