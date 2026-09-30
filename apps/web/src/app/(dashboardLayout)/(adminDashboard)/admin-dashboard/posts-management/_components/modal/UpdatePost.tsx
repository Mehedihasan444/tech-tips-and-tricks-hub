/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FormEvent, useEffect, useState } from "react";
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
import { FilePenLine } from "lucide-react";
import { useUpdatePost } from "@/hooks/post.hook";

export default function UpdatePost({ post }: { post: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState(post?.title || ""); // Prefill title
  const [selectedCategory, setSelectedCategory] = useState(
    post?.category || ""
  ); // Prefill category
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(post?.tags || [])
  );
  // Prefill tags
  const [pictures, setPictures] = useState<File[] | []>([]); // To handle newly selected pictures

  const { mutate: handleUpdatePost, isSuccess } = useUpdatePost(); // Use update post hook

  useEffect(() => {
    const selectLocalImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.setAttribute("multiple", "multiple"); // Allow multiple image selection
      input.click();

      input.onchange = () => {
        const files = input.files;
        // Append new images to the existing ones
        if (files) {
          setPictures((prevPictures) => [
            ...prevPictures,
            ...Array.from(files),
          ]);
        }
      };
    };

    if (quill) {
      const toolbar = quill.getModule("toolbar") as any;
      toolbar.addHandler("image", selectLocalImage);

      // Prefill Quill editor with the existing post content
      if (post?.content) {
        quill.clipboard.dangerouslyPasteHTML(post.content);
      }
    }

    if (isSuccess) {
      toast.success("Post updated successfully!");
    }
  }, [quill, post, isSuccess]);

  const handleSelectionChange = (e: any) => {
    setSelectedTags(new Set(e.target.value.split(",")));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || selectedTags.size === 0 || !title || !quill) {
      toast.warning("Please fill up all input fields!");
      return;
    }

    const quillContent = quill.root.innerHTML;
    const { cleanedContent } = extractAndProcessImages(quillContent);

    const updatedPostData = {
      content: cleanedContent,
      title,
      category: selectedCategory,
      tags: Array.from(selectedTags),
      images: post.images
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedPostData));

    pictures.forEach((file) => {
      formData.append("postImages", file);
    });

    // Trigger update post mutation
    handleUpdatePost({ formData, postId: post._id });
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-transparent">
        <Tooltip color="primary" content="Edit post">
          <span className="text-lg text-primary cursor-pointer active:opacity-50">
            <FilePenLine />
          </span>
        </Tooltip>
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
        radius="lg"
        size={"3xl"}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border rounded-md  ",
          header: "border-b-[1px] ",
          footer: "border-t-[1px] ",
          closeButton: "hover:bg-default-50/5 active:bg-default-50/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                {/* <FilePenLine /> */}
                <span>Update Post</span>
              </ModalHeader>
              <ModalBody className="flex flex-col mb-2 gap-4 h-[450px] overflow-y-scroll">
                <div>
                  <div className="mb-6">
                    <Input
                      id="title"
                      isRequired
                      name="title"
                      className="!text-primary"
                      variant={"underlined"}
                      label="Post Title"
                      placeholder="Enter Post Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <Select
                      isRequired
                      id="category"
                      name="category"
                      variant={"underlined"}
                      label="Select your relevant Category"
                      placeholder="Select a Category"
                      selectedKeys={new Set([selectedCategory])}
                      onChange={handleCategoryChange}
                    >
                      {postCategories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="mb-6">
                    <Select
                      label="Select your relevant Tags"
                      isRequired
                      name="tags"
                      variant={"underlined"}
                      selectionMode="multiple"
                      placeholder="Select Tags"
                      selectedKeys={selectedTags}
                      onChange={handleSelectionChange}
                    >
                      {postTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="border border-gray-500 rounded-md p-2 overflow-hidden flex flex-col">
                    <div className="sticky top-0 bg-default-50 z-10">
                      {/* Quill toolbar automatically appears here */}
                    </div>

                    <div
                      ref={quillRef}
                      style={{
                        height: "100%",
                        background: "white",
                        overflowY: "auto",
                        minHeight: "320px",
                        padding: "10px",
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="justify-between">
                <div className="float-left flex gap-2 h-16">
                  {post?.images?.map((image: string, index: number) => (
                    <Image
                      key={index}
                      src={image}
                      alt={"picture"}
                      width={70}
                      height={100}
                      className="object-cover "
                    />
                  ))}
                  {pictures?.map((image, index) => (
                    <Image
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={"picture"}
                      width={70}
                      height={100}
                      className="object-cover "
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    className="bg-primary text-default-50 shadow-lg shadow-indigo-500/20"
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
