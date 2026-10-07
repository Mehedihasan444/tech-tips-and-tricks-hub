import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken, verifyToken } from "../../utils/verifyJWT";
import { TLoginUser, TRegisterUser } from "./auth.interface";
import { User } from "../User/user.model";
import { USER_ROLE } from "../User/user.constant";
import { EmailHelper } from "../../utils/emailSender";

const registerUser = async (payload: TRegisterUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.CONFLICT, "This user is already exist!");
  }

  payload.role = USER_ROLE.USER;

  //create new user
  const newUser = await User.create(payload);

  //create token and sent to the  client

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    mobileNumber: newUser.mobileNumber,
    profilePhoto: newUser.profilePhoto,
    role: newUser.role,
    status: newUser.status,
    nickName: newUser.nickName,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};
const socialLoginUser = async (payload: {
  name: string;
  email: string;
  profilePhoto: string;
  nickName: string;
  role?: "ADMIN" | "USER";
}) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }
  if (user) {
    //create token and sent to the  client

    const jwtPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profilePhoto: user.profilePhoto,
      role: user.role,
      status: user.status,
      nickName: user.nickName,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  payload.role = USER_ROLE.USER;

  //create new user
  const newUser = await User.create(payload);

  //create token and sent to the  client

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    mobileNumber: newUser.mobileNumber,
    profilePhoto: newUser.profilePhoto,
    role: newUser.role,
    status: newUser.status,
    nickName: newUser.nickName,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.UNAUTHORIZED, "Password do not matched");

  //create token and sent to the  client

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePhoto: user.profilePhoto,
    role: user.role,
    status: user.status,
    nickName: user.nickName,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const resetPassword = async (userId: string, oldPassword: string, newPassword: string) => {
  // checking if the user is exist
  const result = await User.findById(userId);
  // checking if the user is exist
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  const user = await User.isUserExistsByEmail(result?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  // //checking if the password is correct
  if (!(await User.isPasswordMatched(oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));

  await User.findOneAndUpdate(
    {
      email: user.email,
      role: user.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  //
  // `verifyToken` maps an expired or malformed JWT to AppError(401). Calling
  // `jwt.verify` directly let `TokenExpiredError` escape, and `globalErrorHandler`
  // has no case for it — so a routine, expired refresh token was reported as a
  // 500 server fault. Clients then could not distinguish "your session ended,
  // sign in again" from "the server is broken", and simply retried forever.
  const decoded = verifyToken(token, config.jwt_refresh_secret as string) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePhoto: user.profilePhoto,
    role: user.role,
    status: user.status,
    nickName: user.nickName,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePhoto: user.profilePhoto,
    role: user.role,
    status: user.status,
    nickName: user.nickName,
  };
  const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, "10m");

  // reset_pass_ui_link is `${CLIENT_URL}${RESET_PASS_UI_LINK}` where the default
  // RESET_PASS_UI_LINK is now just a path (e.g. `/reset-password`). Append
  // credentials as a single well-formed query string.
  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;

  // Await so SMTP failures surface here (caught by catchAsync -> 502) instead
  // of becoming an unhandled rejection that takes down the whole process.
  await EmailHelper.sendEmail(user?.email, resetUILink);
  return null;
};
export const AuthServices = {
  registerUser,
  loginUser,
  resetPassword,
  refreshToken,
  socialLoginUser,
  forgetPassword,
};
