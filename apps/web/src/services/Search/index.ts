"use server";

import axiosInstance from "@/config/axios.config";


export const searchPosts = async (searchTerm: string) => {
  try {
    const res = await axiosInstance.get(
      `/search-posts?searchTerm=${searchTerm}`
    );

    return res.data;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to search posts");
  }
};
export const getSearchedPosts = async (searchTerm: string) => {
  try {
    const res = await axiosInstance.get(
      `/posts?searchTerm=${searchTerm}`
    );

    return res.data;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to search posts");
  }
};
export const getFilteredPosts = async (sortBy: string) => {
  try {
    const res = await axiosInstance.get(
      `/posts?sortBy=${sortBy}`
    );

    return res.data;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to search posts");
  }
};
export const getFilteredPostsByCategory = async (category: string) => {
  try {
    const res = await axiosInstance.get(
      `/posts?category=${category}`
    );

    return res.data;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to search posts");
  }
};