import { TPost } from "@/types/TPost";

const STORAGE_KEY = "tech-tips-saved-posts";

/** Fired on window whenever the saved-posts set changes on this device. */
export const SAVED_POSTS_EVENT = "tech-tips:saved-posts-changed";

const isBrowser = () => typeof window !== "undefined";

const readAll = (): TPost[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (posts: TPost[]) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    // Notify other tabs/pages on this device.
    window.dispatchEvent(new Event(SAVED_POSTS_EVENT));
  } catch {
    // Quota exceeded or storage disabled — bookmarks stay in memory only.
  }
};

/** Bookmarks are stored on this device (no account sync yet). */
export const getSavedPosts = (): TPost[] => readAll();

export const isPostSaved = (postId: string): boolean =>
  readAll().some((post) => post?._id === postId);

/** Toggles the bookmark. Returns true when the post is now saved. */
export const toggleSavedPost = (post: TPost): boolean => {
  const saved = readAll();
  const exists = saved.some((item) => item?._id === post?._id);
  writeAll(exists ? saved.filter((item) => item?._id !== post?._id) : [...saved, post]);
  return !exists;
};

export const clearSavedPosts = (): void => writeAll([]);
