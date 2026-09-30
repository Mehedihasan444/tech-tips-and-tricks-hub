"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const imageUpload_controller_1 = require("./imageUpload.controller");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.post('/', multer_config_1.multerUpload.single('photo'), imageUpload_controller_1.ImageUploadController.uploadImage);
exports.ImageUploadRoutes = router;
