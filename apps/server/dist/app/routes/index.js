"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const meilisearch_routes_1 = require("../modules/Meilisearch/meilisearch.routes");
const user_route_1 = require("../modules/User/user.route");
const imageUpload_routes_1 = require("../modules/ImageUpload/imageUpload.routes");
const post_route_1 = require("../modules/Post/post.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const comment_route_1 = require("../modules/Comment/comment.route");
const story_routes_1 = require("../modules/Stories/story.routes");
const friends_route_1 = require("../modules/Friends/friends.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/posts",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/search-posts",
        route: meilisearch_routes_1.MeilisearchRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/friends",
        route: friends_route_1.FriendRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/comments",
        route: comment_route_1.CommentRoutes,
    },
    {
        path: "/image-upload",
        route: imageUpload_routes_1.ImageUploadRoutes,
    },
    { path: '/stories',
        route: story_routes_1.StoryRoutes }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
