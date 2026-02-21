export interface User {
  username: string;
  password: string;
  role?: string;
}

export const USERS: Record<string, User> = {
  standard_user: {
    username: "standard_user",
    password: "secret_sauce",
    role: "standard",
  },
  problem_user: {
    username: "problem_user",
    password: "secret_sauce",
    role: "problem",
  },
  locked_out_user: {
    username: "locked_out_user",
    password: "secret_sauce",
    role: "locked",
  },
  performance_glitch_user: {
    username: "performance_glitch_user",
    password: "secret_sauce",
    role: "performance",
  },
};

export const DEFAULT_USER = "standard_user";
