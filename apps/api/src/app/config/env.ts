import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url(),

  DB_URL: z.string().min(1, "DB_URL is required"),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(31).default(12),

  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default("1d"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default("7d"),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 chars"),
  ADMIN_PROFILE_PHOTO: z.string().url().optional().or(z.literal("")),
  ADMIN_MOBILE_NUMBER: z.string().optional().default(""),

  // Demo accounts backing the one-click role logins on the web login page.
  // `DEMO_LOGIN_ENABLED` is coerced off in production below so these can never
  // be switched on for a real deployment by a stray env value.
  DEMO_LOGIN_ENABLED: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  DEMO_ADMIN_EMAIL: z.string().email().default("admin@demo.test"),
  DEMO_ADMIN_PASSWORD: z.string().min(8).default("DemoAdmin@123"),
  DEMO_USER_EMAIL: z.string().email().default("user@demo.test"),
  DEMO_USER_PASSWORD: z.string().min(8).default("DemoUser@123"),

  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),

  MEILISEARCH_HOST: z.string().url().optional().or(z.literal("")),
  MEILISEARCH_MASTER_KEY: z.string().optional().default(""),

  SENDER_EMAIL: z.string().email().optional().or(z.literal("")),
  SENDER_APP_PASS: z.string().optional().default(""),

  RESET_PASS_UI_LINK: z.string().startsWith("/").default("/reset-password"),

  STORE_ID: z.string().optional().default(""),
  SIGNATURE_KEY: z.string().optional().default(""),
  PAYMENT_URL: z.string().url().optional().or(z.literal("")),
  PAYMENT_VERIFY_URL: z.string().url().optional().or(z.literal("")),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(50),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  const data = parsed.data;

  // Hard guarantee: demo accounts can never exist in production, even if
  // DEMO_LOGIN_ENABLED=true leaks into a production env file.
  if (data.NODE_ENV === "production") {
    data.DEMO_LOGIN_ENABLED = false;
  }

  return data;
}

export const env = loadEnv();
