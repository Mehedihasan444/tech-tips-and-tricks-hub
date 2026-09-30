import express from "express";
import { USER_ROLE } from "../User/user.constant";
import auth from "../../middlewares/auth";
import { CommentControllers } from "./comment.controller";
const router = express.Router();

export const CommentRoutes = router;

router.post("/", auth(USER_ROLE.USER), CommentControllers.createComment);
router.get("/", CommentControllers.getAllCommentsOfASinglePost);
router.delete("/", auth(USER_ROLE.USER), CommentControllers.deleteComment);
router.put("/", auth(USER_ROLE.USER), CommentControllers.updateComment);
router.get("/:id", CommentControllers.getSingleComment); // Add this route to fetch a single comment by ID
