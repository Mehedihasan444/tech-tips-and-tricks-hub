/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDeletePost } from "@/hooks/post.hook";
import { useDeleteUser } from "@/hooks/user.hook";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({
  item,
  title,
  onDeleted,
}: {
  item: any;
  title: string;
  onDeleted?: (id: string) => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutate: handleDeleteUser, isPending: isUserLoading } = useDeleteUser();
  const { mutate: handleDeletePost, isPending: isPostLoading } = useDeletePost();

  const isLoading = title === "user" ? isUserLoading : isPostLoading;
  const itemName = item?.name || item?.title || "this item";

  const handleDelete = () => {
    const done = () => {
      onClose();
      onDeleted?.(item._id);
    };
    if (title === "user") {
      handleDeleteUser({ userId: item._id }, { onSuccess: done });
    } else if (title === "post") {
      handleDeletePost({ postId: item._id }, { onSuccess: done });
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        variant="light"
        aria-label={`Delete ${title} ${itemName}`}
        className="text-danger hover:bg-danger/10 p-2"
      >
        <Tooltip color="danger" content={`Delete ${title}`}>
          <Trash2 className="text-danger hover:scale-110 transition-transform" />
        </Tooltip>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        isDismissable={!isLoading}
        hideCloseButton={isLoading}
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border border-divider",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-2 pt-6">
                <div className="p-3 rounded-full bg-danger-100">
                  <AlertTriangle className="w-8 h-8 text-danger" />
                </div>
                <h3 className="text-xl font-bold text-center">
                  Delete {title.charAt(0).toUpperCase() + title.slice(1)}
                </h3>
              </ModalHeader>
              <ModalBody className="text-center pb-2">
                <p className="text-default-500">
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">{item?.name || item?.title}</strong>?
                </p>
                <p className="text-sm text-danger-500 mt-2">This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter className="flex gap-2 justify-center pb-6">
                <Button
                  variant="flat"
                  onPress={onClose}
                  isDisabled={isLoading}
                  className="font-medium"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isDisabled={isLoading}
                  className="font-medium"
                >
                  {isLoading ? (
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
