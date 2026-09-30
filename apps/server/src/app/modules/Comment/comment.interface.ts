// import { ObjectId } from "mongoose";

// // Define the TComment type
// export type TComment = {
//   postId: ObjectId;
//   commentText: string;
//   commentUser: {
//     name: string;
//     photo: string;
//   };
//   createdAt: string;
//   children?: TComment[];
// };


import { ObjectId, Types } from "mongoose";
// Define the TComment type
export type TComment = {
  _id?: Types.ObjectId; // Add the _id field here
  postId: ObjectId;
  commentText: string;
  commentUser: {
    name: string;
    photo: string;
    nickName: string;
  };
  createdAt: string;
  children?: TComment[]; // Children should be of type TComment[]
};
