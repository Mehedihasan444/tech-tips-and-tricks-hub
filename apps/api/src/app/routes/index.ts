import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { MeilisearchRoutes } from "../modules/Meilisearch/meilisearch.routes";
import { UserRoutes } from "../modules/User/user.route";
import { ImageUploadRoutes } from "../modules/ImageUpload/imageUpload.routes";
import { PostRoutes } from "../modules/Post/post.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { CommentRoutes } from "../modules/Comment/comment.route";
import { StoryRoutes } from "../modules/Stories/story.routes";
import { FriendRoutes } from "../modules/Friends/friends.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/search-posts",
    route: MeilisearchRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/friends",
    route: FriendRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
  {
    path: "/image-upload",
    route: ImageUploadRoutes,
  },
  { path: '/stories',
    route: StoryRoutes }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
