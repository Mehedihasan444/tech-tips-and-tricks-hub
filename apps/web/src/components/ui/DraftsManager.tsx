"use client";

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Chip,
  useDisclosure,
} from '@nextui-org/react';
import { FileText, Trash2, Clock, Edit3, FolderOpen } from 'lucide-react';
import { PostDraft, getAllDrafts, deleteDraft } from '@/hooks/useDraftAutoSave';
import ConfirmationModal from './ConfirmationModal';
import { formatDistanceToNow } from 'date-fns';

interface DraftsManagerProps {
  onLoadDraft: (draft: PostDraft) => void;
  trigger?: React.ReactNode;
}

export default function DraftsManager({ onLoadDraft, trigger }: DraftsManagerProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // Load drafts when modal opens
  useEffect(() => {
    if (isOpen) {
      setDrafts(getAllDrafts());
    }
  }, [isOpen]);

  const handleDeleteDraft = (id: string) => {
    deleteDraft(id);
    setDrafts(getAllDrafts());
    setDraftToDelete(null);
  };

  const handleLoadDraft = (draft: PostDraft) => {
    onLoadDraft(draft);
    onOpenChange();
  };

  const formatDate = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      {trigger ? (
        <div onClick={onOpen}>{trigger}</div>
      ) : (
        <Button
          variant="bordered"
          color="default"
          size="lg"
          startContent={<FolderOpen size={18} />}
          onPress={onOpen}
          className="font-medium"
        >
          Drafts {(drafts.length || getAllDrafts().length) > 0 && `(${drafts.length || getAllDrafts().length})`}
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                <span>Saved Drafts</span>
                {drafts.length > 0 && (
                  <Chip size="sm" color="primary" variant="flat">
                    {drafts.length}
                  </Chip>
                )}
              </ModalHeader>
              <ModalBody>
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-default-300 mb-4" size={48} />
                    <p className="text-default-500">No saved drafts</p>
                    <p className="text-sm text-default-400 mt-1">
                      Your drafts will appear here when you start writing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {drafts.map((draft) => (
                      <Card
                        key={draft.id}
                        isPressable
                        onPress={() => handleLoadDraft(draft)}
                        className="hover:bg-default-100 transition-colors"
                      >
                        <CardBody className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg truncate">
                                {draft.title || 'Untitled Draft'}
                              </h4>
                              <p className="text-sm text-default-500 line-clamp-2 mt-1">
                                {stripHtml(draft.content) || 'No content'}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                {draft.category && (
                                  <Chip size="sm" variant="flat" color="primary">
                                    {draft.category}
                                  </Chip>
                                )}
                                {draft.isPremium && (
                                  <Chip size="sm" variant="flat" color="warning">
                                    Premium
                                  </Chip>
                                )}
                                <span className="text-xs text-default-400 flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatDate(draft.lastSaved)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                startContent={<Edit3 size={14} />}
                                onPress={() => handleLoadDraft(draft)}
                              >
                                Continue
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                isIconOnly
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDraftToDelete(draft.id);
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!draftToDelete}
        onClose={() => setDraftToDelete(null)}
        onConfirm={() => draftToDelete && handleDeleteDraft(draftToDelete)}
        title="Delete Draft"
        message="Are you sure you want to delete this draft? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}
