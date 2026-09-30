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
exports.MeilisearchServices = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const post_constant_1 = require("../Post/post.constant");
const post_model_1 = require("../Post/post.model");
const post_utils_1 = require("../Post/post.utils");
const getAllPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Date range search
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    query = (yield (0, post_utils_1.SearchPostByCategoryQueryMaker)(query)) || query;
    const postQuery = new QueryBuilder_1.QueryBuilder(post_model_1.Post.find().populate("author").populate("category"), query)
        .filter()
        .search(post_constant_1.PostsSearchableFields)
        .sort()
        .paginate()
        .fields();
    const result = yield postQuery.modelQuery;
    return result;
});
exports.MeilisearchServices = {
    getAllPosts,
};
