"use client";
import { useDeletePost } from "@/hooks/post.hook";
import { useDeleteUser } from "@/hooks/user.hook";
import { Button, useDisclosure, Tooltip } from "@heroui/react";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

/**
 * Delete trigger + confirmation — now built on the canonical
 * `ConfirmationModal` so danger styling stays in one place.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        className="p-2 text-danger hover:bg-danger/10"
      >
        <Tooltip color="danger" content={`Delete ${title}`}>
          <Trash2 className="text-danger transition-transform hover:scale-110" />
        </Tooltip>
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => onOpenChange()}
        onConfirm={handleDelete}
        title={`Delete ${title.charAt(0).toUpperCase() + title.slice(1)}`}
        message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isLoading}
      />
    </>
  );
}
