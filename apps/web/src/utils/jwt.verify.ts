import jwt, { JwtPayload } from "jsonwebtoken";

// Server-only (Node runtime): uses Node `crypto` via `jsonwebtoken`.
// Never import this file from middleware (Edge) or client components.
export const jwtVerify = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

    return decoded;
  } catch {
    return null;
  }
};
