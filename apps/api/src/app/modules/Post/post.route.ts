import express from "express";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import validateRequest from "../../middlewares/validateRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { postControllers } from "./post.controller";
import { PostValidation } from "./post.validation";

const router = express.Router();

router.post(
  "/",
    auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "postImages",maxCount: 3 }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.createPostValidationSchema),
  postControllers.createPost
);

router.get("/", postControllers.getAllPosts);

router.get("/:id", postControllers.getPost);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "postImages",maxCount: 3 }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.updatePostValidationSchema),
  postControllers.updatePost
);

router.delete("/:id", auth(USER_ROLE.USER), postControllers.deletePost);

export const PostRoutes = router;
