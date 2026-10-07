import type { TDemoAccount } from "./demoUsers";

/**
 * Credentials for the demo accounts shown on the sign-in page.
 *
 * Imported only by `DemoLoginPanel`, which is itself behind the
 * `isDemoLoginEnabled` build-time guard, so these literals are removed from
 * production bundles.
 *
 * Defaults must match the API seeds in `apps/api/src/app/config/env.ts`
 * (DEMO_ADMIN_EMAIL / DEMO_USER_PASSWORD, …) or the accounts will not exist.
 */
export const DEMO_ACCOUNTS: TDemoAccount[] = [
  {
    id: "ADMIN",
    label: "Admin",
    role: "ADMIN",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@demo.test",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "DemoAdmin@123",
    description: "Moderation, reports, user management",
    icon: "shield",
  },
  {
    id: "USER",
    label: "Member",
    role: "USER",
    email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "user@demo.test",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "DemoUser@123",
    description: "Posts, drafts, analytics, payments",
    icon: "user",
  },
];
