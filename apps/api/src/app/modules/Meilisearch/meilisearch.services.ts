import { QueryBuilder } from "../../builder/QueryBuilder";
import meiliClient from "../../utils/meilisearch";
import { PostsSearchableFields } from "../Post/post.constant";
import { Post } from "../Post/post.model";
import {
  SearchPostByCategoryQueryMaker,
  SearchPostByDateRangeQueryMaker,
  SearchPostByUserQueryMaker,
} from "../Post/post.utils";

const getAllPosts = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  query = (await SearchPostByCategoryQueryMaker(query)) || query;

  const postQuery = new QueryBuilder(
    Post.find().populate("author").populate("category"),
    query
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

export const MeilisearchServices = {
  getAllPosts,
};
