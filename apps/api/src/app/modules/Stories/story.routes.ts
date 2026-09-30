import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { StoryController } from "./story.controller";
import { createStoryValidationSchema } from "./story.validation";
import { USER_ROLE } from "../User/user.constant";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

// Create a new story (requires authentication)
router.post(
  "/",
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  // validateImageFileRequest(ImageFilesArrayZodSchema),
  //   validateRequest(createStoryValidationSchema),
  StoryController.createStory
);

// Get user stories and stories of users they follow
router.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN), StoryController.getAllStories);

// Get stories by user ID
router.get("/user/:userId", StoryController.getStoriesByUserId);

// Delete a story (requires authentication)
router.delete("/:id", auth(USER_ROLE.USER, USER_ROLE.ADMIN), StoryController.deleteStory);

export const StoryRoutes = router;