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
export interface IUser {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto: string;
  bio?: string;
  nickName?: string;
  shortBio?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  education?: IEducation[];
  socialMedia?: ISocialMedia[];
  followers?: IUser[];
  following?: IUser[];
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
subscriptionStartDate?: string;
  __v?: number;
}

export interface IUserData {
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
  followers?: IUser[];
  following?: IUser[];
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
  subscriptionStartDate?: string;
  __v?: number;
}
