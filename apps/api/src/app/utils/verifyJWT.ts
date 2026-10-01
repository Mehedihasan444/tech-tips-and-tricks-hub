import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { USER_ROLE, USER_STATUS } from "../modules/User/user.constant";

export const createToken = (
  jwtPayload: {
    _id?: string;
    name: string;
    email: string;
    mobileNumber?: string;
    role: keyof typeof USER_ROLE;
    status: keyof typeof USER_STATUS;
    nickName: string;
  },
  secret: string,
  expiresIn: string | undefined,
) => {
  return jwt.sign(jwtPayload, secret, {
    // `expiresIn` comes from process.env, so it is an arbitrary string at runtime
    // (e.g. "1d"). jsonwebtoken parses it with `ms` at runtime, but its types only
    // allow the `ms` StringValue union, so the cast is needed at this boundary.
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, "You are not authorized!");
  }
};
