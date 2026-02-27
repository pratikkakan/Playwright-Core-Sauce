export type Environment = "dev" | "staging" | "prod";

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
  // add more service URLs as needed
  // authServiceURL: string;
  // searchServiceURL: string;
}

export const environments: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseURL: "https://dev.saucedemo.com",
    apiBaseURL: "https://api.dev.saucedemo.com",
  },
  staging: {
    baseURL: "https://staging.saucedemo.com",
    apiBaseURL: "https://api.staging.saucedemo.com",
  },
  prod: {
    baseURL: "https://www.saucedemo.com",
    apiBaseURL: "https://api.saucedemo.com",
  },
};

export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const resolvedEnv = (env ?? process.env.ENV ?? "dev") as Environment;
  const config = environments[resolvedEnv];
  if (!config) {
    throw new Error(
      `Unknown environment: "${resolvedEnv}". Valid options: ${Object.keys(environments).join(", ")}`,
    );
  }
  return config;
}
