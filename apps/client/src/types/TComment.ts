/* eslint-disable @typescript-eslint/no-explicit-any */

export type TComment = {
  _id: string;
  postId: string;
  commentText: string;
  commentUser: {
    name: string;
    photo: string;
    nickName: string;
  };
  createdAt: string;
  children: any;
};
