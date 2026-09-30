import { IUser } from "./IUser";

export type TPost = {
  _id: string;
  title: string;
  content: string;
  images: string[];
  category: string;
  tags: string[];
  author: IUser;
  likes: number;
  dislikes: number;
  upvotes: string[];
  downvotes: string[];
  comments: string[];
  savedBy: string[];
  views: number;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
