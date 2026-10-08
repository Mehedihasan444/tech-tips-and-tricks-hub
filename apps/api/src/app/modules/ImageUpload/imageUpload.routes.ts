import express from "express";
import { ImageUploadController } from "./imageUpload.controller";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.single("photo"),
  ImageUploadController.uploadImage,
);

export const ImageUploadRoutes = router;
