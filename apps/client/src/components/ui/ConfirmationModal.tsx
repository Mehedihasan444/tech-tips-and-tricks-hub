"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
import { AlertTriangle, Trash2, Info, CheckCircle, LucideIcon } from "lucide-react";

type ConfirmationType = "danger" | "warning" | "info" | "success";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
  icon?: LucideIcon;
}

const typeConfig: Record<ConfirmationType, {
  color: "danger" | "warning" | "primary" | "success";
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}> = {
  danger: {
    color: "danger",
    icon: Trash2,
    bgColor: "bg-danger-100",
    iconColor: "text-danger",
  },
  warning: {
    color: "warning",
    icon: AlertTriangle,
    bgColor: "bg-warning-100",
    iconColor: "text-warning",
  },
  info: {
    color: "primary",
    icon: Info,
    bgColor: "bg-primary-100",
    iconColor: "text-primary",
  },
  success: {
    color: "success",
    icon: CheckCircle,
    bgColor: "bg-success-100",
    iconColor: "text-success",
  },
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
  icon: CustomIcon,
}) => {
  const config = typeConfig[type];
  const Icon = CustomIcon || config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      backdrop="blur"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "border border-divider",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-2 pt-6">
              <div className={`p-3 rounded-full ${config.bgColor}`}>
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-center">{title}</h3>
            </ModalHeader>
            
            <ModalBody className="text-center pb-2">
              <p className="text-default-500">{message}</p>
            </ModalBody>
            
            <ModalFooter className="flex gap-2 justify-center pb-6">
              <Button
                variant="flat"
                onPress={onCloseModal}
                isDisabled={isLoading}
                className="font-medium"
              >
                {cancelText}
              </Button>
              <Button
                color={config.color}
                onPress={handleConfirm}
                isDisabled={isLoading}
                className="font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" color="current" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{confirmText}</span>
                  </div>
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
