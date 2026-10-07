/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { postCategories, postTags } from "./constant";
import { toast } from "sonner";
import { extractAndProcessImages } from "./_utils/extractAndProcessImages";
import Image from "next/image";
import { useCreatePost } from "@/hooks/post.hook";
import { useUser } from "@/context/user.provider";
import { PostDraft, deleteDraft } from "@/hooks/useDraftAutoSave";

export default function CreatePost() {
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set([]));
  const [pictures, setPictures] = useState<File[] | []>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loadedDraftId, setLoadedDraftId] = useState<string | null>(null);
  const { user } = useUser();
  const {
    mutate: handleCreatePost,
    isPending: isCreatePending,
    isSuccess,
    reset: resetMutation,
  } = useCreatePost();

  // Load draft from localStorage if navigating from drafts page
  useEffect(() => {
    const loadDraftData = localStorage.getItem("loadDraft");
    if (loadDraftData && quill) {
      try {
        const draft: PostDraft = JSON.parse(loadDraftData);
        setTitle(draft.title || "");
        setSelectedCategory(draft.category || "");
        setSelectedTags(new Set(draft.tags || []) as any);
        setIsPremium(draft.isPremium || false);
        if (draft.content) {
          // Assigning root.innerHTML bypasses Quill's Delta, so quill.getText()
          // still returned empty and the submit handler then rejected the post
          // with "Please write some content" for a draft the user could see.
          quill.clipboard.dangerouslyPasteHTML(draft.content);
        }
        setLoadedDraftId(draft.id);
        // Clear the loadDraft from localStorage after loading
        localStorage.removeItem("loadDraft");
        toast.success("Draft loaded successfully!");
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [quill]);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Object URLs must be created once per file (not during render) and
  // revoked when replaced to avoid leaks and flicker.
  useEffect(() => {
    const urls = pictures.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pictures]);
  useEffect(() => {
    const selectLocalImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.setAttribute("multiple", "multiple"); // Allow multiple image selection
      input.click();

      input.onchange = () => {
        const files = input.files;
        // Check if files are present and append them
        if (files) {
          setPictures((prevPictures) => [...prevPictures, ...Array.from(files)]);
        }
      };
    };

    if (quill) {
      const toolbar = quill.getModule("toolbar") as any; // Cast as 'any' if type is not available
      toolbar.addHandler("image", selectLocalImage);
    }
  }, [quill]);

  // Handle successful post creation
  useEffect(() => {
    if (isSuccess) {
      setSelectedCategory(""); // Reset category
      setSelectedTags(new Set([])); // Reset tags
      setTitle(""); // Reset title
      setPictures([]); // Reset pictures
      setIsPremium(false); // Reset premium
      if (quill) {
        quill.setText(""); // Reset quill editor
      }
      // Delete the draft if post was created from a draft
      if (loadedDraftId) {
        deleteDraft(loadedDraftId);
        setLoadedDraftId(null);
      }
      // Reset mutation state to prevent re-triggering
      resetMutation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // Handle category change (HeroUI Select reports selection keys, not events)
  const handleCategoryChange = (keys: Set<string> | string) => {
    const next = typeof keys === "string" ? keys : (Array.from(keys)[0] ?? "");
    setSelectedCategory(next as string);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreatePending) return;
    if (!selectedCategory || selectedTags.size === 0 || !title.trim() || !quill) {
      toast.warning("Please fill up all input fields!");
      return;
    }

    // Append the Quill editor content as HTML
    const quillContent = quill.root.innerHTML;
    const plainText = quill.getText().trim();
    if (!plainText) {
      toast.warning("Please write some content for your post.");
      return;
    }
    const { cleanedContent } = extractAndProcessImages(quillContent);
    const postData = {
      content: cleanedContent,
      title,
      category: selectedCategory,
      isPremium,
      tags: Array.from(selectedTags),
      author: user?._id,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(postData));
    pictures.forEach((file) => {
      formData.append("postImages", file);
    });

    handleCreatePost(formData);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto rounded-lg p-6">
        <PageTitle title="Create a New Post"></PageTitle>
        <form onSubmit={handleSubmit}>
          {/* Post title */}
          <div className="mb-6">
            <Input
              isRequired
              name="title"
              className=""
              variant={"underlined"}
              label="Post Title"
              placeholder="Enter Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Select Category */}
          <div className="mb-6 flex justify-between items-center gap-5">
            <Select
              isRequired
              id="category"
              name="category"
              aria-label="Select a category"
              className=""
              variant={"underlined"}
              label="Select your relevant Category"
              placeholder="Select a Category"
              selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set([])}
              onSelectionChange={(keys) =>
                handleCategoryChange(keys === "all" ? "" : (keys as Set<string>))
              }
            >
              {postCategories.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>
            <div className="flex flex-col gap-1 shrink-0">
              <Checkbox isSelected={isPremium} onValueChange={setIsPremium}>
                Premium
              </Checkbox>
              <span className="text-xs text-default-600 max-w-[180px]">
                Premium posts are visible to subscribers only.
              </span>
            </div>
          </div>

          {/* Select Tags */}
          <div className="mb-6">
            <Select
              label="Select your relevant Tags"
              aria-label="Select tags"
              isRequired
              name="tags"
              variant={"underlined"}
              selectionMode="multiple"
              placeholder="Select Tags"
              selectedKeys={selectedTags}
              className=""
              onSelectionChange={(keys) => {
                if (keys !== "all") setSelectedTags(new Set(keys as Set<string>) as any);
              }}
            >
              {postTags.map((tag) => (
                <SelectItem key={tag}>{tag}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Quill Editor */}
          <div className="border border-default-300 rounded-md p-2 overflow-hidden flex flex-col">
            {/* Quill injects its own toolbar as the first child of the editor
                node, so no placeholder element is needed here. */}

            {/* Scrollable Text Area */}
            <div
              ref={quillRef}
              className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 rounded-xl"
              style={{
                height: "400px", // Editor height
                overflowY: "auto", // Scrollable text area
                padding: "10px",
              }}
            />
            <div className="pt-2 flex gap-2 flex-wrap">
              {previewUrls.map((url, index) => (
                <Image
                  key={`${url}-${index}`}
                  src={url}
                  alt={`Attached image ${index + 1}`}
                  width={100}
                  height={100}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            {/* <Button
              color="secondary"
              variant="light"
              onPress={() => console.log("Post closed")}
            >
              Cancel
            </Button> */}
            <Button
              className="bg-secondary text-default-50 shadow-lg shadow-indigo-500/20"
              type="submit"
              isLoading={isCreatePending}
              isDisabled={isCreatePending}
            >
              {isCreatePending ? "Publishing..." : "Submit Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
