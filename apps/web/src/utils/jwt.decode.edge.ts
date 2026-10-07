import { jwtDecode, JwtPayload } from "jwt-decode";

// Edge-safe decode only: no Node `crypto`, no `jsonwebtoken`.
// Signature verification must happen server-side (Node runtime) via jwt.verify;
// middleware treats the payload as untrusted and only routes on it, while real
// authorization is enforced by the API.
export const decode = (token: string): (JwtPayload & { role?: string }) | null => {
  try {
    return jwtDecode<JwtPayload & { role?: string }>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (decoded: JwtPayload | null | undefined): boolean => {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
};
