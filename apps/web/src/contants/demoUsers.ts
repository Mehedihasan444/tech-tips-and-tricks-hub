/**
 * Guard for the one-click demo logins on the sign-in page.
 *
 * SECURITY: the demo accounts are ordinary users that authenticate through the
 * regular `POST /auth/login` route — this adds no auth bypass. They only exist
 * because the API seeds them when `DEMO_LOGIN_ENABLED=true`, which
 * `apps/api/src/app/config/env.ts` forces to `false` when NODE_ENV=production.
 *
 * The credentials live in `demoAccounts.ts`, which is imported *only* by
 * `DemoLoginPanel`. Keeping them out of this module means that once the panel is
 * dead-code-eliminated in a production build, the credentials are dropped from
 * the bundle too rather than merely hidden.
 */
export type TDemoRole = "ADMIN" | "USER";

export type TDemoAccount = {
  id: TDemoRole;
  label: string;
  role: TDemoRole;
  email: string;
  password: string;
  description: string;
  icon: "shield" | "user";
};

/**
 * Resolved from `process.env.NODE_ENV`, which Next.js replaces at build time, so
 * `isDemoLoginEnabled && <DemoLoginPanel />` folds to `false` in production.
 */
export const isDemoLoginEnabled =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN !== "false";
