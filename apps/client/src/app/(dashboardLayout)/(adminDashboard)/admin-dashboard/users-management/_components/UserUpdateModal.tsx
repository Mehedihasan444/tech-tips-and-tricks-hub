"use client";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FilePenLine, Loader2, Shield, UserCheck } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

// Example roles and statuses
const roles = [
  { key: "ADMIN", label: "Admin", icon: Shield },
  { key: "USER", label: "User", icon: UserCheck },
];

const statuses = [
  { key: "ACTIVE", label: "Active", color: "success" as const },
  { key: "BLOCKED", label: "Blocked", color: "danger" as const },
];

export default function UserUpdateModal({ user }: { user: IUser }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [role, setRole] = useState<string>(user?.role || "USER");
  const [status, setStatus] = useState<string>(user?.status || "ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mutate: handleUserUpdate, isPending, isSuccess } = useUpdateUser();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRole(user?.role || "USER");
      setStatus(user?.status || "ACTIVE");
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("User updated successfully!");
      setIsSubmitting(false);
      onOpenChange();
    }
  }, [isSuccess, onOpenChange]);

  const handleSave = useCallback(() => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      toast.info("Please wait, updating user...");
      return;
    }

    // Validate changes
    if (role === user.role && status === user.status) {
      toast.info("No changes detected");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        role,
        status,
      };

      handleUserUpdate({ userId: user._id, userData });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
      setIsSubmitting(false);
    }
  }, [role, status, user, isSubmitting, isPending, handleUserUpdate]);

  const handleClose = useCallback(() => {
    if (isSubmitting || isPending) {
      toast.info("Please wait until the update is complete.");
      return;
    }
    onOpenChange();
  }, [isSubmitting, isPending, onOpenChange]);

  const hasChanges = role !== user.role || status !== user.status;

  return (
    <>
      <Button 
        onPress={onOpen} 
        className="bg-transparent min-w-0 w-auto h-auto p-0"
        isDisabled={isSubmitting || isPending}
      >
        <Tooltip color="primary" content="Edit user">
          <FilePenLine className="text-primary cursor-pointer hover:scale-110 transition-transform" size={20} />
        </Tooltip>
      </Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={handleClose} 
        placement="top-center"
        isDismissable={!isSubmitting && !isPending}
        hideCloseButton={isSubmitting || isPending}
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border-2 border-divider",
          header: "border-b-2 border-divider",
          footer: "border-t-2 border-divider",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <FilePenLine className="text-primary" size={20} />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Update User</span>
                  <span className="text-sm text-default-500 font-normal">
                    {user.name}
                  </span>
                </div>
                {(isSubmitting || isPending) && (
                  <Loader2 className="ml-auto animate-spin text-primary" size={20} />
                )}
              </ModalHeader>
              <ModalBody className="gap-4 py-6">
                {/* Role Selection */}
                <div>
                  <Select
                    label="Role"
                    placeholder="Select a role"
                    selectedKeys={[role]}
                    onChange={(e) => setRole(e.target.value)}
                    isDisabled={isSubmitting || isPending}
                    variant="bordered"
                    size="lg"
                    startContent={<Shield size={18} className="text-default-400" />}
                    classNames={{
                      trigger: "border-2 hover:border-primary",
                    }}
                  >
                    {roles.map((r) => (
                      <SelectItem 
                        key={r.key} 
                        value={r.key}
                        startContent={<r.icon size={16} />}
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Status Selection */}
                <div>
                  <Select
                    label="Status"
                    placeholder="Select a status"
                    selectedKeys={[status]}
                    onChange={(e) => setStatus(e.target.value)}
                    isDisabled={isSubmitting || isPending}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      trigger: "border-2 hover:border-primary",
                    }}
                  >
                    {statuses.map((s) => (
                      <SelectItem 
                        key={s.key} 
                        value={s.key}
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Changes indicator */}
                {hasChanges && (
                  <div className="bg-warning-50 border-l-4 border-warning p-3 rounded-r-lg">
                    <p className="text-sm text-warning-700">
                      You have unsaved changes
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button 
                  color="default" 
                  variant="flat" 
                  onPress={onClose}
                  isDisabled={isSubmitting || isPending}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSave}
                  isLoading={isSubmitting || isPending}
                  isDisabled={isSubmitting || isPending || !hasChanges}
                  startContent={
                    !(isSubmitting || isPending) && <FilePenLine size={16} />
                  }
                >
                  {isSubmitting || isPending ? "Updating..." : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}