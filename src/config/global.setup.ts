import dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (!process.env.BASE_URL) {
  throw new Error(
    "BASE_URL is not set. Copy .env.example to .env and fill in the values.",
  );
}

const BASE_URL = process.env.BASE_URL;
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

  const isAppHealthy = await checkAppHealth(BASE_URL);
  if (!isAppHealthy) {
    throw new Error(
      `❌ Application at ${BASE_URL} is not reachable after ${MAX_RETRIES} attempts`,
    );
  }

  console.log("✅ Global Setup: Complete");
}

export default globalSetup;
