import { POST_STATUS } from "./post.constant";

import { ObjectId } from "mongoose";

export interface TPost {
  title: string;
  category: string;
  tags: string[];
  content: string;
  images?: string[];
  author: ObjectId;
  likes?: number;
  dislikes?: number;
  status?: keyof typeof POST_STATUS;
  isPremium?: boolean;
}
