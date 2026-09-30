import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

// Define the schema for the embedded child comments
let childCommentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true }, // Define _id explicitly
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  commentText: { type: String, required: true },
  commentUser: {
    type: {
      name: String,
      photo: String,
      nickName: String,
    },
    required: true,
  },
  createdAt: { type: String, required: true },
});
childCommentSchema.add({ children: [childCommentSchema] });

// Define the main comment schema
let commentSchema = new Schema<TComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentText: { type: String, required: true },
    commentUser: {
      type: {
        name: String,
        photo: String,
        nickName: String,
      },
      required: true,
    },
    createdAt: { type: String, required: true },
    children: [{ type: childCommentSchema, default: [] }],
  },
  {
    timestamps: true,
  }
);
// // Export the model
export const Comment = model<TComment>("Comment", commentSchema);
