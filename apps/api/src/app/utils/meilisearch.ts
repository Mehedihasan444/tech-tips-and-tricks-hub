import { Meilisearch } from "meilisearch";
import { Document, Types } from "mongoose";
import config from "../config";
import { noImage } from "../modules/Post/post.constant";
import { TPost } from "../modules/Post/post.interface";

// Meilisearch is optional: the API must boot (auth, posts, etc.) even when
// MEILISEARCH_HOST is unset. The `meilisearch` v0.62 JS client exports
// `Meilisearch` (lowercase "s"); the old `MeiliSearch` name is `undefined`
// and `new undefined()` crashes the process at import time.
const meilisearchHost = (config.meilisearch_host as string | undefined)?.trim() || "";

const meiliClient = meilisearchHost
  ? new Meilisearch({
      host: meilisearchHost,
      apiKey: config.meilisearch_master_key || undefined,
    })
  : null;

export async function addDocumentToIndex(
  result: Document<unknown, object, TPost> & TPost & { _id: Types.ObjectId },
  indexKey: string,
) {
  if (!meiliClient) return;
  const index = meiliClient.index(indexKey);

  const { _id, title, content, images, category, tags } = result;
  const firstImage = images?.[0] || noImage;

  const document = {
    id: _id.toString(), // Ensure the ID is a string
    title,
    content,
    thumbnail: firstImage,
    category,
    tags,
  };

  try {
    await index.addDocuments([document]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding document to MeiliSearch:", error);
  }
}

export const deleteDocumentFromIndex = async (indexKey: string, id: string) => {
  if (!meiliClient) return;
  const index = meiliClient.index(indexKey);

  try {
    await index.deleteDocument(id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting resource from MeiliSearch:", error);
  }
};

export const deleteMeiliSearchIndex = async (indexKey: string) => {
  if (!meiliClient) return;
  await meiliClient.deleteIndex(indexKey);
};

export default meiliClient;
