/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import ContentCard from "@/components/ui/ContentCard";
import { postCategories, postTags } from "./constant";
import { toast } from "sonner";
import { extractAndProcessImages } from "./_utils/extractAndProcessImages";
import Image from "next/image";
import { FileText, ImagePlus, PenSquare } from "lucide-react";
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

  const removePicture = (index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setTitle("");
    setSelectedCategory("");
    setSelectedTags(new Set([]));
    setPictures([]);
    setIsPremium(false);
    setLoadedDraftId(null);
    if (quill) quill.setText("");
    toast.info("Form cleared");
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
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div>
        <PageTitle
          title="Create a New Post"
          subtitle="Write once, reach every engineer on the platform."
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <ContentCard
            title="Post details"
            subtitle="Title, category and tags help readers find you"
            icon={FileText}
          >
            <Input
              isRequired
              name="title"
              variant="bordered"
              label="Post Title"
              placeholder="e.g. 5 React patterns I use in production"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <Select
                isRequired
                id="category"
                name="category"
                aria-label="Select a category"
                variant="bordered"
                label="Category"
                placeholder="Select a Category"
                className="flex-1"
                selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set([])}
                onSelectionChange={(keys) =>
                  handleCategoryChange(keys === "all" ? "" : (keys as Set<string>))
                }
              >
                {postCategories.map((item) => (
                  <SelectItem key={item}>{item}</SelectItem>
                ))}
              </Select>
              <Select
                label="Tags"
                aria-label="Select tags"
                isRequired
                name="tags"
                variant="bordered"
                selectionMode="multiple"
                placeholder="Select Tags"
                selectedKeys={selectedTags}
                className="flex-1"
                onSelectionChange={(keys) => {
                  if (keys !== "all") setSelectedTags(new Set(keys as Set<string>) as any);
                }}
              >
                {postTags.map((tag) => (
                  <SelectItem key={tag}>{tag}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-warning/10 p-3">
              <Checkbox isSelected={isPremium} onValueChange={setIsPremium} color="warning">
                <span className="text-sm font-medium">Premium post</span>
              </Checkbox>
              <span className="text-xs leading-relaxed text-default-500">
                Premium posts are visible to subscribers only and earn you revenue share.
              </span>
            </div>
          </ContentCard>

          <ContentCard
            title="Content"
            subtitle="Use the toolbar to format text or embed images"
            icon={PenSquare}
          >
            {/* Quill injects its own toolbar as the first child of the editor
                node, so no placeholder element is needed here. */}
            <div
              ref={quillRef}
              className="rounded-xl bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
              style={{
                height: "400px",
                overflowY: "auto",
                padding: "10px",
              }}
            />
            {previewUrls.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-default-600">
                  <ImagePlus size={15} aria-hidden="true" />
                  Attached images ({previewUrls.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <span
                      key={`${url}-${index}`}
                      className="relative block size-20 overflow-hidden rounded-xl border border-divider"
                    >
                      <Image
                        src={url}
                        alt={`Attached image ${index + 1}`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePicture(index)}
                        aria-label={`Remove attached image ${index + 1}`}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-xs text-white transition-colors hover:bg-danger"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </ContentCard>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="flat" onPress={handleClear} isDisabled={isCreatePending}>
              Clear
            </Button>
            <Button
              color="primary"
              type="submit"
              className="font-semibold"
              isLoading={isCreatePending}
              isDisabled={isCreatePending}
            >
              {isCreatePending ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
