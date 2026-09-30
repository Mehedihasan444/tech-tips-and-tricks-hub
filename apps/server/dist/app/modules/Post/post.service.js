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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const meilisearch_1 = require("../../utils/meilisearch");
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    if (images) {
        const { postImages } = images;
        payload.images = postImages === null || postImages === void 0 ? void 0 : postImages.map((image) => image.path);
        const result = yield post_model_1.Post.create(payload);
        yield (0, meilisearch_1.addDocumentToIndex)(result, "posts");
        return result;
    }
    else {
        const result = yield post_model_1.Post.create(payload);
        yield (0, meilisearch_1.addDocumentToIndex)(result, "posts");
        return result;
    }
});
const updatePostInDB = (postId, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    if (images.postImages) {
        const { postImages } = images;
        const previousImages = payload.images || [];
        const newImages = (postImages === null || postImages === void 0 ? void 0 : postImages.map((image) => image.path)) || [];
        payload.images = [...previousImages, ...newImages];
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    if (result) {
        yield (0, meilisearch_1.addDocumentToIndex)(result, "posts");
    }
    else {
        throw new Error(`Post with ID ${postId} not found.`);
    }
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Date range search
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchPostByCategoryQueryMaker)(query)) || query;
    const postQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate("author"), query)
        .filter()
        .search(post_constant_1.PostsSearchableFields)
        .sort()
        .paginate()
        .fields();
    const result = yield postQuery.modelQuery;
    // Get the total count of posts for the query (ignoring pagination)
    const totalPosts = yield post_model_1.Post.countDocuments(); //+
    // Calculate the page count
    const limit = Number(query === null || query === void 0 ? void 0 : query.limit) || 10;
    const pageCount = Math.ceil(totalPosts / limit);
    if ((query === null || query === void 0 ? void 0 : query.page) || (query === null || query === void 0 ? void 0 : query.limit)) {
        return {
            data: result,
            pageCount,
            currentPage: Number(query === null || query === void 0 ? void 0 : query.page) || 1,
        };
    }
    else {
        return result;
    }
});
const getPostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(postId).populate("author");
    return result;
});
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(postId);
    const deletedPostId = result === null || result === void 0 ? void 0 : result._id;
    if (deletedPostId) {
        yield (0, meilisearch_1.deleteDocumentFromIndex)("posts", deletedPostId.toString());
    }
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostFromDB,
    updatePostInDB,
    deletePostFromDB,
};
