// Edge-safe (jwt-decode only, no Node crypto). Safe to import from middleware
// and client components. For signature verification use `./jwt.verify`
// (Node-only) from server code.
import { jwtDecode, JwtPayload } from "jwt-decode";

export const decode = (token: string) => {
  const decoded = jwtDecode(token) as JwtPayload;

  return decoded;
};
