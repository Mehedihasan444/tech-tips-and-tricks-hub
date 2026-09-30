"use client";
import React, { Dispatch, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import { Ellipsis, AlertTriangle, Trash2 } from "lucide-react";
import { TComment } from "@/types/TComment";
import { useDeleteComment } from "@/hooks/comment.hook";
import { useUser } from "@/context/user.provider";
import { TPost } from "@/types/TPost";
import { timeDifference } from "@/utils/timeDifference";

const CommentMenu = ({
  comment,
  setReplyTo,
  setComment,
  setText,
  setUpdateComment,
  post,
}: {
  comment: TComment;
  setReplyTo: Dispatch<string>;
  setComment: Dispatch<TComment>;
  setText: Dispatch<string>;
  setUpdateComment: Dispatch<boolean>;
  post: TPost;
}) => {
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { user } = useUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<{ commentId: string; postId: string } | null>(null);

  const openDeleteModal = (commentId: string, postId: string) => {
    setCommentToDelete({ commentId, postId });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete);
      setIsDeleteModalOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleEdit = () => {
    setText(comment.commentText);
    setComment(comment);
    setUpdateComment(true);
  };

  const handleReply = () => {
    if (comment) {
      setReplyTo(comment?.commentUser?.name);
      setComment(comment);
    }
  };

  const isOwnerOfThePost = user?.nickName === post?.author?.nickName;
  const isOwnComment = user?.nickName === comment?.commentUser?.nickName;

  // Conditionally render the component only if comment, post, and user exist
  if (comment && post && user) {
    return (
      <>
        <div className="bg-default-200 p-2 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-semibold text-sm">
              {comment?.commentUser?.name}
            </h3>

            {(isOwnerOfThePost || isOwnComment) && (
              <Dropdown size="sm">
                <DropdownTrigger>
                  <button>
                    <Ellipsis size={16} />
                  </button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    onClick={() => openDeleteModal(comment._id, comment.postId)}
                  >
                    Delete
                  </DropdownItem>
                  <DropdownItem key="edit" color="default" onClick={handleEdit}>
                    Edit
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
          <p className="text-sm text-default-600">{comment.commentText}</p>
        </div>

        <div className="flex justify-between gap-5 px-3">
          <span className="text-xs font-semibold text-default-500">{timeDifference(comment?.createdAt)}</span>
          <button
            onClick={handleReply}
            className="text-xs font-semibold text-default-500"
          >
            Reply
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)}
          size="sm"
          backdrop="blur"
          isDismissable={!isDeleting}
          hideCloseButton={isDeleting}
          classNames={{
            backdrop: "bg-black/50 backdrop-blur-sm",
            base: "border border-divider",
          }}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col items-center gap-2 pt-6">
              <div className="p-3 rounded-full bg-danger-100">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              <h3 className="text-xl font-bold text-center">Delete Comment</h3>
            </ModalHeader>
            <ModalBody className="text-center pb-2">
              <p className="text-default-500">
                Are you sure you want to delete this comment?
              </p>
              <p className="text-sm text-danger-500 mt-2">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter className="flex gap-2 justify-center pb-6">
              <Button 
                variant="flat" 
                onPress={() => setIsDeleteModalOpen(false)}
                isDisabled={isDeleting}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleConfirmDelete}
                isDisabled={isDeleting}
                className="font-medium"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" color="current" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </div>
                )}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Return null if comment, post, or user are not present
  return null;
};

export default CommentMenu;
