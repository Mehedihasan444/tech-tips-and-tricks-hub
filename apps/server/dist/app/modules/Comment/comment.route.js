"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../User/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
exports.CommentRoutes = router;
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.USER), comment_controller_1.CommentControllers.createComment);
router.get("/", comment_controller_1.CommentControllers.getAllCommentsOfASinglePost);
router.delete("/", (0, auth_1.default)(user_constant_1.USER_ROLE.USER), comment_controller_1.CommentControllers.deleteComment);
router.put("/", (0, auth_1.default)(user_constant_1.USER_ROLE.USER), comment_controller_1.CommentControllers.updateComment);
router.get("/:id", comment_controller_1.CommentControllers.getSingleComment); // Add this route to fetch a single comment by ID
