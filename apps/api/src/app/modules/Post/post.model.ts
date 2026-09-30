import { Schema, model } from "mongoose";
import { TPost } from "./post.interface";
import { postCategories, postTags } from "./post.constant";
const PostSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    category: {
      type: String,
      required: true,
      enum: postCategories,
    },
    tags: {
      type: [String],
      required: true,
      enum: postTags,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a user model
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "PUBLISHED",
    },
    isPremium: {
      type: Boolean,
      required:true
      // default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = model<TPost>("Post", PostSchema);
