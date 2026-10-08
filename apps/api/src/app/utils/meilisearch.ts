import type { Document, Types } from "mongoose";
import type { Meilisearch as MeilisearchType } from "meilisearch";
import config from "../config";
import { noImage } from "../modules/Post/post.constant";
import { TPost } from "../modules/Post/post.interface";

// Meilisearch is optional: the API must boot (auth, posts, etc.) even when
// MEILISEARCH_HOST is unset. `meilisearch` v0.62 is ESM-only (`"type": "module"`
// with no CJS `require` fallback), so a top-level `import { Meilisearch }`
// compiles to `require("meilisearch")` in our CommonJS build and crashes the
// process on Vercel with ERR_REQUIRE_ESM — even when the feature is disabled.
// We therefore keep only a type-only import (erased at compile time) and lazy
// load the real client with a native dynamic `import()` only when needed.
// NOTE: `await import("meilisearch")` would be downleveled by tsc with
// `module: commonjs` back into `require()`, so we go through `new Function`
// to force a true native ESM import at runtime on Node 20+.
const meilisearchHost = (config.meilisearch_host as string | undefined)?.trim() || "";

let clientPromise: Promise<MeilisearchType | null> | null = null;

async function getMeiliClient(): Promise<MeilisearchType | null> {
  if (!meilisearchHost) return null;
  if (!clientPromise) {
    clientPromise = (
      new Function("return import('meilisearch')")() as Promise<typeof import("meilisearch")>
    )
      .then(
        ({ Meilisearch }) =>
          new Meilisearch({
            host: meilisearchHost,
            apiKey: config.meilisearch_master_key || undefined,
          }),
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Meilisearch client failed to load, search indexing disabled:", error);
        return null;
      });
  }
  return clientPromise;
}

export async function addDocumentToIndex(
  result: Document<unknown, object, TPost> & TPost & { _id: Types.ObjectId },
  indexKey: string,
) {
  const meiliClient = await getMeiliClient();
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
  const meiliClient = await getMeiliClient();
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
  const meiliClient = await getMeiliClient();
  if (!meiliClient) return;
  await meiliClient.deleteIndex(indexKey);
};

export { getMeiliClient };

// Legacy default export kept for compatibility. It was previously the sync
// client instance; it is now `null` because the client loads asynchronously.
// Import { getMeiliClient } instead.
export default null;
