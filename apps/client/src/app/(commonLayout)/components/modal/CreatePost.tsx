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
import { useCreatePost } from "@/hooks/post.hook";
import { extractAndProcessImages } from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/_utils/extractAndProcessImages";
import Image from "next/image";
import { useUser } from "@/context/user.provider";
import { PenSquare, X, Crown, Loader2 } from "lucide-react";
import { useDraftAutoSave, deleteDraft } from "@/hooks/useDraftAutoSave";
import DraftStatus from "@/components/ui/DraftStatus";
import AIAssistantPanel from "@/components/ui/AIAssistantPanel";

// Separate component for the editor to ensure proper reinitialization
function QuillEditor({
  onImagesAdded,
  isDisabled,
  quillRef: externalQuillRef,
  initialContent,
  onContentChange,
}: {
  onImagesAdded: (files: File[]) => void;
  isDisabled: boolean;
  quillRef: React.MutableRefObject<any>;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}) {
  const { quill, quillRef } = useQuill();

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

      // Enable/disable editor based on isDisabled prop
      quill.enable(!isDisabled);

      // Set initial content if provided
      if (initialContent && quill.root.innerHTML === '<p><br></p>') {
        quill.root.innerHTML = initialContent;
      }

      // Listen for content changes
      if (onContentChange) {
        quill.on('text-change', () => {
          onContentChange(quill.root.innerHTML);
        });
      }
    }
  }, [quill, onImagesAdded, isDisabled, externalQuillRef, initialContent, onContentChange]);

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

export default function CreatePost() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));
  const [isPremium, setIsPremium] = useState(false);
  const [pictures, setPictures] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0); // Key to force remount
  const [editorContent, setEditorContent] = useState("");
  const [initialEditorContent, setInitialEditorContent] = useState("");
  const quillInstanceRef = useRef<any>(null);
  const { user } = useUser();
  const {
    mutate: handleCreatePost,
    isSuccess,
    isPending,
    reset: resetMutation,
  } = useCreatePost();

  // Draft auto-save hook
  const {
    currentDraftId,
    isSaving: isDraftSaving,
    hasUnsavedChanges,
    scheduleSave,
    // discardDraft,
    getLastSavedText,
  } = useDraftAutoSave({
    showNotifications: false, // Don't show toast for every save
  });

  // Auto-save draft when content changes
  useEffect(() => {
    if (isOpen && (title || editorContent)) {
      scheduleSave({
        title,
        content: editorContent,
        category: selectedCategory,
        tags: Array.from(selectedTags),
        isPremium,
      });
    }
  }, [isOpen, title, editorContent, selectedCategory, selectedTags, isPremium, scheduleSave]);

  // // Handle loading a draft
  // const handleLoadDraft = useCallback((draft: PostDraft) => {
  //   setTitle(draft.title);
  //   setSelectedCategory(draft.category);
  //   setSelectedTags(new Set(draft.tags));
  //   setIsPremium(draft.isPremium);
  //   setInitialEditorContent(draft.content);
  //   setEditorContent(draft.content);
  //   setEditorKey(prev => prev + 1); // Force editor remount with new content
  //   onOpen();
  //   toast.success('Draft loaded!');
  // }, [onOpen]);

  // Handle content change from editor
  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

  // Force remount editor when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditorKey(prev => prev + 1);
    }
  }, [isOpen]);

  // Memoized handler for adding images
  const handleImagesAdded = useCallback((files: File[]) => {
    setPictures((prevPictures) => [...prevPictures, ...files]);
  }, []);

  // Memoized handler for removing images
  const removeImage = useCallback((index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Memoized handler for category changes
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Reset form function
  const resetForm = useCallback(() => {
    setTitle("");
    setSelectedCategory("");
    setSelectedTags(new Set([]));
    setPictures([]);
    setIsPremium(false);
    setIsSubmitting(false);
    setEditorContent("");
    setInitialEditorContent("");

    if (quillInstanceRef.current) {
      try {
        quillInstanceRef.current.setText("");
      } catch (error) {
        console.error("Error clearing editor:", error);
      }
    }
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen && !isSubmitting && !isPending) {
      const timer = setTimeout(() => {
        resetForm();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSubmitting, isPending, resetForm]);

  // Handle successful post creation - also delete the draft
  useEffect(() => {
    if (isSuccess && !isSubmitting) {
      // Delete the draft since post was published
      if (currentDraftId) {
        deleteDraft(currentDraftId);
      }
      resetForm();
      resetMutation(); // Reset mutation state to prevent re-triggering
      onOpenChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    // Prevent multiple simultaneous submissions
    if (isSubmitting || isPending) {
      toast.info("Please wait, your post is being created...");
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

      const postData = {
        content: cleanedContent,
        title: title.trim(),
        category: selectedCategory,
        isPremium,
        tags: Array.from(selectedTags),
        author: user?._id,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(postData));

      if (pictures.length > 0) {
        pictures.forEach((file) => {
          formData.append("postImages", file);
        });
      }

      handleCreatePost(formData);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isPending,
    validateForm,
    title,
    selectedCategory,
    isPremium,
    selectedTags,
    user,
    pictures,
    handleCreatePost,
  ]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    if (isSubmitting || isPending) {
      toast.info("Please wait until the post is created before closing.");
      return;
    }
    onOpenChange();
  }, [isSubmitting, isPending, onOpenChange]);

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        size="lg"
        startContent={<PenSquare size={20} />}
        className="font-semibold shadow-lg shadow-primary/30"
        isDisabled={isSubmitting || isPending}
      >
        Create Post
      </Button>

      {/* Drafts Manager Button */}
      {/* <DraftsManager onLoadDraft={handleLoadDraft} /> */}

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
                <ModalHeader className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <PenSquare className="text-primary" size={20} />
                  <span className="text-xl font-bold">Create Your Post</span>
                  <div className="flex-1" />
                  <DraftStatus
                    isSaving={isDraftSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                    lastSavedText={getLastSavedText()}
                  />
                  <AIAssistantPanel
                    content={editorContent}
                    title={title}
                    category={selectedCategory}
                    availableTags={postTags}
                    onTitleSelect={(newTitle) => setTitle(newTitle)}
                    onTagsSelect={(tags) => setSelectedTags(new Set(tags))}
                    onContentImprove={(improved) => {
                      setInitialEditorContent(improved);
                      setEditorContent(improved);
                      setEditorKey(prev => prev + 1);
                    }}
                  />
                  {(isSubmitting || isPending) && (
                    <Loader2 className="animate-spin text-primary" size={20} />
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
                        inputWrapper: "border-2 border-default-200 hover:border-primary focus-within:border-primary",
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
                      value={selectedCategory}
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
                      <Crown size={18} className={isPremium ? "text-warning" : "text-default-400"} />
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
                      onSelectionChange={(keys) => setSelectedTags(keys as Set<string>)}
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
                    <div className={`border-2 border-default-200 rounded-xl overflow-hidden hover:border-primary transition-colors ${(isSubmitting || isPending) ? 'opacity-50 pointer-events-none' : ''
                      }`}>
                      {isOpen && (
                        <QuillEditor
                          key={editorKey}
                          onImagesAdded={handleImagesAdded}
                          isDisabled={isSubmitting || isPending}
                          quillRef={quillInstanceRef}
                          initialContent={initialEditorContent}
                          onContentChange={handleContentChange}
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
                  {pictures.length > 0 && (
                    <div className="flex gap-2 flex-wrap max-w-md">
                      {pictures.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`preview-${index}`}
                            width={50}
                            height={50}
                            className="object-cover rounded-lg border-2 border-default-200"
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
                  )}
                  
                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    className="font-semibold shadow-lg shadow-primary/30"
                    startContent={
                      (isSubmitting || isPending) ?
                        <Loader2 size={18} className="animate-spin" /> :
                        <PenSquare size={18} />
                    }
                    isLoading={isSubmitting || isPending}
                    isDisabled={isSubmitting || isPending}
                  >
                    {(isSubmitting || isPending) ? "Publishing..." : "Publish Post"}
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