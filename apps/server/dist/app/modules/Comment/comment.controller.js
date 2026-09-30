"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
const createComment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield comment_service_1.CommentServices.createCommentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment Created Successfully",
        data: user,
    });
}));
const getAllCommentsOfASinglePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.query.postId;
    if (!postId) {
        throw new Error("provide postId");
    }
    const comments = yield comment_service_1.CommentServices.getAllCommentsOfASinglePostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comments Retrieved Successfully",
        data: comments,
    });
}));
const deleteComment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield comment_service_1.CommentServices.deleteCommentFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment deleted successfully",
        data: null,
    });
}));
const updateComment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedComment = yield comment_service_1.CommentServices.updateCommentInDB(req.body); // Use req.body for payload
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment updated successfully",
        data: updatedComment,
    });
}));
const getSingleComment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_service_1.CommentServices.getSingleCommentFromDB(req.params.id); // Use req.params.id instead of nickName
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Comment Retrieved Successfully",
        data: comment,
    });
}));
exports.CommentControllers = {
    getSingleComment,
    createComment,
    getAllCommentsOfASinglePost,
    deleteComment,
    updateComment,
};
