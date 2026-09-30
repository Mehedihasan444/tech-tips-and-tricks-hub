/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
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
    // isPending: createPostPending,
    isSuccess,
    reset: resetMutation,
  } = useCreatePost();

  // Load draft from localStorage if navigating from drafts page
  useEffect(() => {
    const loadDraftData = localStorage.getItem('loadDraft');
    if (loadDraftData && quill) {
      try {
        const draft: PostDraft = JSON.parse(loadDraftData);
        setTitle(draft.title || '');
        setSelectedCategory(draft.category || '');
        setSelectedTags(new Set(draft.tags || []) as any);
        setIsPremium(draft.isPremium || false);
        if (draft.content) {
          quill.root.innerHTML = draft.content;
        }
        setLoadedDraftId(draft.id);
        // Clear the loadDraft from localStorage after loading
        localStorage.removeItem('loadDraft');
        toast.success('Draft loaded successfully!');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [quill]);

  const handleSelectionChange = (e: any) => {
    setSelectedTags(new Set(e.target.value.split(",")));
  };
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
          setPictures((prevPictures) => [
            ...prevPictures,
            ...Array.from(files),
          ]);
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

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || selectedTags.size === 0 || !title || !quill) {
      toast.warning("Please fill up all input fields!");
      return;
    }

    // Append the Quill editor content as HTML
    const quillContent = quill.root.innerHTML;
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
                        className=""
                        variant={"underlined"}
                        label="Select your relevant Category"
                        placeholder="Select a Category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        {postCategories.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </Select>
                      <Checkbox
                        isSelected={isPremium}
                        onValueChange={setIsPremium}
                      
                      >
                        Premium
                      </Checkbox>
                    </div>

          {/* Select Tags */}
          <div className="mb-6">
            <Select
              label="Select your relevant Tags"
              isRequired
              name="tags"
              variant={"underlined"}
              selectionMode="multiple"
              placeholder="Select Tags"
              selectedKeys={selectedTags}
              className=""
              onChange={handleSelectionChange}
            >
              {postTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Quill Editor */}
          <div className="border border-gray-500 rounded-md p-2 overflow-hidden flex flex-col">
            {/* Sticky toolbar */}
            <div
              className="sticky top-0 bg-default-50 z-10"
              style={{ borderBottom: "1px solid #ccc" }}
            >
              {/* Quill toolbar will automatically appear here */}
            </div>

            {/* Scrollable Text Area */}
            <div
              ref={quillRef}
              style={{
                height: "400px", // Editor height
                background: "white",
                overflowY: "auto", // Scrollable text area
                padding: "10px",
              }}
            />
            <div className="pt-2 flex gap-2">
              {pictures?.map((image, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={"picture"}
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
            >
              Submit Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
