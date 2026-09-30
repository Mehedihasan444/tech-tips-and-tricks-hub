import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-user",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.get("/", UserControllers.getAllUsers);
router.put(
  "/update-profile-photo",
  multerUpload.fields([{ name: "image" }]),
  parseBody,
  UserControllers.updateProfilePhoto
);
router.get("/:nickName", UserControllers.getSingleUser);
router.put("/:id", UserControllers.updateUserFollowListAndFollowersList);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);
