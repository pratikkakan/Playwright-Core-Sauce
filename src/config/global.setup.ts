import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const BASE_URL = process.env.BASE_URL ?? "https://www.saucedemo.com";
const AUTH_FILE = path.join(process.cwd(), ".auth", "session.json");
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

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

async function globalSetup() {
  console.log("🔧 Global Setup: Starting...");

  // 1. Health check - verify app is reachable
  const isAppHealthy = await checkAppHealth(BASE_URL);
  if (!isAppHealthy) {
    throw new Error(
      `❌ Application at ${BASE_URL} is not reachable after ${MAX_RETRIES} attempts`,
    );
  }

  // 2. Ensure .auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 3. Store session data
  const sessionData = {
    baseURL: BASE_URL,
    timestamp: new Date().toISOString(),
    // We'll add API token here later
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(sessionData, null, 2));
  console.log("✅ Global Setup: Complete");
}

export default globalSetup;
