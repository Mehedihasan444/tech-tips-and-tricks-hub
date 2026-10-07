/**
 * Single place where auth cookies are written.
 *
 * Two of the four write paths previously set the access token without
 * `httpOnly`, `secure` or `sameSite`, so the token was readable from
 * `document.cookie` on the token-refresh and password-reset paths only.
 */
export const authCookieOptions = (maxAgeSeconds: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeSeconds,
});

/** 1 day, matching the access-token lifetime used by the API. */
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;
