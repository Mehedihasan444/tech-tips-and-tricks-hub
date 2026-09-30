import { useMutation } from "@tanstack/react-query";
import { getFilteredPosts, getFilteredPostsByCategory, getSearchedPosts, searchPosts } from "../services/Search";

export const useSearchPosts = () => {
  return useMutation({
    mutationKey: ["SEARCH_POSTS"],
    mutationFn: async (searchTerm: string) => await searchPosts(searchTerm),
  });
};
export const useGetSearchedPosts = () => {
  return useMutation({
    mutationKey: ["SEARCH_POSTS"],
    mutationFn: async (searchTerm: string) => await getSearchedPosts(searchTerm),
  });
}
export const useGetFilteredPosts = () => {
  return useMutation({
    mutationKey: ["SEARCH_POSTS"],
    mutationFn: async (sortBy: string) => await getFilteredPosts(sortBy),
  });
}
export const useGetFilteredPostsByCategory = () => {
  return useMutation({
    mutationKey: ["SEARCH_POSTS"],
    mutationFn: async (category: string) => await getFilteredPostsByCategory(category),
  });
}