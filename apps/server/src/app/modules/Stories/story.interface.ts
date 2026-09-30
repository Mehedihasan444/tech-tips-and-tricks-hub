import { Model, Types } from "mongoose";

export type TStory = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  userImage: string;
  imageUrl: string;
  timestamp: Date;
  expiresAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type StoryModel = Model<TStory, Record<string, unknown>>;