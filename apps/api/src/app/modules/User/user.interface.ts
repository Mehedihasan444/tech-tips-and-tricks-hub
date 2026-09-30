/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant";
type IEducation = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
};
type ISocialMedia = {
  platform: string;
  url: string;
};
export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  mobileNumber?: string;
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  education?: IEducation[];
  socialMedia?: ISocialMedia[];
  shortBio?: string;
  nickName: string;
  followers?: ObjectId[];
  following?: ObjectId[];
  isPremium?: boolean;
  subscriptionStartDate?:string
};
export interface TUserData {
  loggedInUserId?: string;
  _id?: string;
  name?: string;
  role?: string;
  email?: string;
  status?: string;
  mobileNumber?: string;
  profilePhoto?: string;
  bio?: string;
  nickName?: string;
  shortBio?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  education?: IEducation[];
  socialMedia?: ISocialMedia[];
  followers?: TUser[];
  following?: TUser[];
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
  subscriptionStartDate?:string
  __v?: number;
}
export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
