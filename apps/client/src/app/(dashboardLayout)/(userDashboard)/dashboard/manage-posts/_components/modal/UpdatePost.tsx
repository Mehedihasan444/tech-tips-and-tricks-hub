/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect, useState, useCallback, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Checkbox,
  Chip,
} from "@nextui-org/react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast } from "sonner";
import {
  postCategories,
  postTags,
} from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/constant";
import { extractAndProcessImages } from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/_utils/extractAndProcessImages";
import Image from "next/image";
import { FilePenLine, X, Crown, Loader2 } from "lucide-react";
import { useUpdatePost } from "@/hooks/post.hook";

// Separate component for the editor to ensure proper reinitialization
function QuillEditor({
  onImagesAdded,
  isDisabled,
  quillRef: externalQuillRef,
  initialContent,
}: {
  onImagesAdded: (files: File[]) => void;
  isDisabled: boolean;
  quillRef: React.MutableRefObject<any>;
  initialContent?: string;
}) {
  const { quill, quillRef } = useQuill();
  const contentLoaded = useRef(false);

  useEffect(() => {
    if (quill) {
      // Store quill instance in parent ref
      externalQuillRef.current = quill;

      const selectLocalImage = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.setAttribute("multiple", "multiple");
        input.click();

        input.onchange = () => {
          const files = input.files;
          if (files) {
            onImagesAdded(Array.from(files));
          }
        };
      };

      const toolbar = quill.getModule("toolbar") as any;
      if (toolbar) {
        toolbar.addHandler("image", selectLocalImage);
      }

      // Load initial content only once
      if (initialContent && !contentLoaded.current) {
        quill.clipboard.dangerouslyPasteHTML(initialContent);
        contentLoaded.current = true;
      }

      // Enable/disable editor based on isDisabled prop
      quill.enable(!isDisabled);
    }
  }, [quill, onImagesAdded, isDisabled, externalQuillRef, initialContent]);

  return (
    <div
      ref={quillRef}
      className="flex-1 bg-white"
      style={{
        minHeight: "280px",
        maxHeight: "280px",
      }}
    />
  );
}

export default function UpdatePost({ post }: { post: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(post?.title || "");
  const [selectedCategory, setSelectedCategory] = useState(post?.category || "");
  const [isPremium, setIsPremium] = useState(post?.isPremium || false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(post?.tags || [])
  );
  const [pictures, setPictures] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(post?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const quillInstanceRef = useRef<any>(null);

  const { mutate: handleUpdatePost, isSuccess, isPending } = useUpdatePost();

  // Force remount editor when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditorKey((prev) => prev + 1);
      // Reset to original values when opening
      setTitle(post?.title || "");
      setSelectedCategory(post?.category || "");
      setIsPremium(post?.isPremium || false);
      setSelectedTags(new Set(post?.tags || []));
      setPictures([]);
      setExistingImages(post?.images || []);
    }
  }, [isOpen, post]);

  // Memoized handler for adding images
  const handleImagesAdded = useCallback((files: File[]) => {
    setPictures((prevPictures) => [...prevPictures, ...files]);
  }, []);

  // Memoized handler for removing new images
  const removeImage = useCallback((index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Memoized handler for removing existing images
  const removeExistingImage = useCallback((index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Memoized handler for category changes
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    },
    []
  );

  // Handle successful post update
  useEffect(() => {
    if (isSuccess) {
      toast.success("Post updated successfully!");
      setIsSubmitting(false);
      onOpenChange();
    }
  }, [isSuccess, onOpenChange]);

  // Validate form before submission
  const validateForm = useCallback((): boolean => {
    if (!title.trim()) {
      toast.warning("Please enter a post title!");
      return false;
    }

    if (!selectedCategory) {
      toast.warning("Please select a category!");
      return false;
    }

    if (selectedTags.size === 0) {
      toast.warning("Please select at least one tag!");
      return false;
    }

    if (!quillInstanceRef.current) {
      toast.error("Editor is not ready. Please try again.");
      return false;
    }

    const content = quillInstanceRef.current.getText().trim();
    if (!content || content.length < 10) {
      toast.warning("Please write some content for your post (at least 10 characters)!");
      return false;
    }

    return true;
  }, [title, selectedCategory, selectedTags]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Prevent multiple simultaneous submissions
      if (isSubmitting || isPending) {
        toast.info("Please wait, your post is being updated...");
        return;
      }

      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const quillContent = quillInstanceRef.current.root.innerHTML;
        const { cleanedContent } = extractAndProcessImages(quillContent);

        const updatedPostData = {
          content: cleanedContent,
          title: title.trim(),
          category: selectedCategory,
          isPremium,
          tags: Array.from(selectedTags),
          images: existingImages, // Send only the remaining existing images
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(updatedPostData));

        if (pictures.length > 0) {
          pictures.forEach((file) => {
            formData.append("postImages", file);
          });
        }

        handleUpdatePost({ formData, postId: post._id });
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Failed to update post. Please try again.");
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      isPending,
      validateForm,
      title,
      selectedCategory,
      isPremium,
      selectedTags,
      post,
      pictures,
      handleUpdatePost,
      existingImages
    ]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    if (isSubmitting || isPending) {
      toast.info("Please wait until the post is updated before closing.");
      return;
    }
    onOpenChange();
  }, [isSubmitting, isPending, onOpenChange]);

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent" isDisabled={isSubmitting || isPending}>
        <Tooltip color="primary" content="Edit post">
          <span className="text-lg text-primary cursor-pointer active:opacity-50">
            <FilePenLine />
          </span>
        </Tooltip>
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={handleModalClose}
        scrollBehavior="inside"
        size="3xl"
        isDismissable={!isSubmitting && !isPending}
        hideCloseButton={isSubmitting || isPending}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border-2 border-divider bg-content1",
          header: "border-b-2 border-divider",
          footer: "border-t-2 border-divider",
          closeButton: "hover:bg-danger-100 text-danger hover:text-danger active:bg-danger-200",
        }}
      >
        <ModalContent className="max-h-[90vh]">
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
                <ModalHeader className="flex items-center gap-2 flex-shrink-0">
                  <FilePenLine className="text-primary" size={24} />
                  <span className="text-2xl font-bold">Update Your Post</span>
                  {(isSubmitting || isPending) && (
                    <Loader2 className="ml-auto animate-spin text-primary" size={20} />
                  )}
                </ModalHeader>

                <ModalBody className="flex flex-col gap-5 overflow-y-auto flex-1">
                  {/* Post Title */}
                  <div>
                    <Input
                      id="title"
                      isRequired
                      name="title"
                      variant="bordered"
                      label="Post Title"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      size="lg"
                      isDisabled={isSubmitting || isPending}
                      classNames={{
                        input: "text-base font-medium",
                        inputWrapper:
                          "border-2 border-default-200 hover:border-primary focus-within:border-primary",
                      }}
                    />
                  </div>

                  {/* Category and Premium */}
                  <div className="flex gap-4 items-end">
                    <Select
                      isRequired
                      id="category"
                      name="category"
                      variant="bordered"
                      label="Category"
                      placeholder="Select a category"
                      selectedKeys={new Set([selectedCategory])}
                      onChange={handleCategoryChange}
                      size="lg"
                      className="flex-1"
                      isDisabled={isSubmitting || isPending}
                      classNames={{
                        trigger: "border-2 border-default-200 hover:border-primary",
                      }}
                    >
                      {postCategories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex items-center gap-2 h-14 px-4 border-2 border-default-200 rounded-xl hover:border-warning transition-colors">
                      <Crown
                        size={18}
                        className={isPremium ? "text-warning" : "text-default-400"}
                      />
                      <Checkbox
                        isSelected={isPremium}
                        onValueChange={setIsPremium}
                        color="warning"
                        isDisabled={isSubmitting || isPending}
                      >
                        <span className="font-medium">Premium</span>
                      </Checkbox>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Select
                      label="Tags"
                      isRequired
                      name="tags"
                      variant="bordered"
                      selectionMode="multiple"
                      placeholder="Select relevant tags"
                      selectedKeys={selectedTags}
                      onSelectionChange={(keys) => {
                        if (keys !== "all") {
                          setSelectedTags(keys as Set<string>);
                        }
                      }}
                      size="lg"
                      isDisabled={isSubmitting || isPending}
                      classNames={{
                        trigger: "border-2 border-default-200 hover:border-primary",
                      }}
                      renderValue={(items) => (
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item) => (
                            <Chip key={item.key} size="sm" color="primary" variant="flat">
                              {item.key}
                            </Chip>
                          ))}
                        </div>
                      )}
                    >
                      {postTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          #{tag}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Rich Text Editor */}
                  <div className="min-h-[280px]">
                    <div
                      className={`border-2 border-default-200 rounded-xl overflow-hidden hover:border-primary transition-colors ${
                        isSubmitting || isPending ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {isOpen && (
                        <QuillEditor
                          key={editorKey}
                          onImagesAdded={handleImagesAdded}
                          isDisabled={isSubmitting || isPending}
                          quillRef={quillInstanceRef}
                          initialContent={post?.content}
                        />
                      )}
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter className="justify-between flex-shrink-0 items-center">
                  <Button
                    color="default"
                    variant="flat"
                    onPress={onClose}
                    size="lg"
                    isDisabled={isSubmitting || isPending}
                  >
                    Cancel
                  </Button>

                  {/* Image Previews */}
                  <div className="flex gap-2 flex-wrap max-w-md">
                    {/* Existing images with delete option */}
                    {existingImages.map((image: string, index: number) => (
                      <div key={`existing-${index}`} className="relative group">
                        <Image
                          src={image}
                          alt={`existing-${index}`}
                          width={50}
                          height={50}
                          className="object-cover rounded-lg border-2 border-default-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          disabled={isSubmitting || isPending}
                          className="absolute -top-1.5 -right-1.5 bg-danger text-white rounded-full p-0.5 
                                   opacity-0 group-hover:opacity-100 transition-opacity shadow-lg
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* New images to be uploaded */}
                    {pictures.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`new-${index}`}
                          width={50}
                          height={50}
                          className="object-cover rounded-lg border-2 border-success"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting || isPending}
                          className="absolute -top-1.5 -right-1.5 bg-danger text-white rounded-full p-0.5 
                                   opacity-0 group-hover:opacity-100 transition-opacity shadow-lg
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    className="font-semibold shadow-lg shadow-primary/30"
                    startContent={
                      isSubmitting || isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <FilePenLine size={18} />
                      )
                    }
                    isLoading={isSubmitting || isPending}
                    isDisabled={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? "Updating..." : "Update Post"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}