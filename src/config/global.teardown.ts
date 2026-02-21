import * as fs from "fs";
import * as path from "path";

const AUTH_FILE = path.join(process.cwd(), ".auth", "session.json");

async function globalTeardown() {
  console.log("🧹 Global Teardown: Starting...");

  try {
    // Delete the session file if it exists
    if (fs.existsSync(AUTH_FILE)) {
      fs.unlinkSync(AUTH_FILE);
      console.log("✅ Session file deleted");
    }

    // Delete the entire .auth directory if empty
    const authDir = path.dirname(AUTH_FILE);
    if (fs.existsSync(authDir) && fs.readdirSync(authDir).length === 0) {
      fs.rmdirSync(authDir);
      console.log("✅ .auth directory cleaned up");
    }
  } catch (error) {
    console.warn("⚠️ Teardown warning:", error);
  }

  console.log("✅ Global Teardown: Complete");
}

export default globalTeardown;
