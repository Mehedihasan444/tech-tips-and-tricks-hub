"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Divider,
} from '@nextui-org/react';
import { FileText, Trash2, Clock, Edit3, Plus, Search, RefreshCw } from 'lucide-react';
import { PostDraft, getAllDrafts, deleteDraft } from '@/hooks/useDraftAutoSave';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EmptyState from '@/components/ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [filteredDrafts, setFilteredDrafts] = useState<PostDraft[]>([]);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load drafts on mount
  useEffect(() => {
    loadDrafts();
  }, []);

  // Filter drafts based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDrafts(drafts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDrafts(
        drafts.filter(
          (draft) =>
            draft.title?.toLowerCase().includes(query) ||
            draft.content?.toLowerCase().includes(query) ||
            draft.category?.toLowerCase().includes(query) ||
            draft.tags?.some((tag) => tag.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, drafts]);

  const loadDrafts = () => {
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      setDrafts(getAllDrafts());
      setIsLoading(false);
    }, 300);
  };

  const handleDeleteDraft = (id: string) => {
    deleteDraft(id);
    setDrafts(getAllDrafts());
    setDraftToDelete(null);
  };

  const handleEditDraft = (draft: PostDraft) => {
    // Store the draft in localStorage temporarily for the create post page to pick up
    localStorage.setItem('loadDraft', JSON.stringify(draft));
    router.push('/dashboard/create-post');
  };

  const formatDate = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-5 px-5 md:px-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl border-l-5 border-primary font-bold pl-5 text-default-800">
            My Drafts
          </h1>
          {drafts.length > 0 && (
            <Chip size="sm" color="primary" variant="flat" className="ml-3">
              {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
            </Chip>
          )}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search size={18} className="text-default-400" />}
            className="w-full md:w-64"
            size="sm"
          />
          <Button
            isIconOnly
            variant="flat"
            size="sm"
            onPress={loadDrafts}
            aria-label="Refresh drafts"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={() => router.push('/dashboard/create-post')}
          >
            New Post
          </Button>
        </div>
      </div>

      <Divider className="mb-6" />

      {/* Drafts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody className="p-5">
                <div className="h-6 bg-default-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-default-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-default-100 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-default-200 rounded w-16"></div>
                  <div className="h-6 bg-default-200 rounded w-20"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredDrafts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={searchQuery ? "No drafts found" : "No drafts yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms"
              : "Your saved drafts will appear here. Start writing a post and it will be automatically saved."
          }
          actionLabel={searchQuery ? "Clear Search" : "Create New Post"}
          onAction={() => {
            if (searchQuery) {
              setSearchQuery('');
            } else {
              router.push('/dashboard/create-post');
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <Card
              key={draft.id}
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-default-50"
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-lg text-default-800 line-clamp-1">
                    {draft.title || 'Untitled Draft'}
                  </h3>
                  {draft.isPremium && (
                    <Chip size="sm" variant="flat" color="warning">
                      Premium
                    </Chip>
                  )}
                </div>

                <p className="text-sm text-default-500 line-clamp-3 mb-4 min-h-[3.75rem]">
                  {stripHtml(draft.content) || 'No content yet...'}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {draft.category && (
                    <Chip size="sm" variant="flat" color="primary">
                      {draft.category}
                    </Chip>
                  )}
                  {draft.tags?.slice(0, 2).map((tag) => (
                    <Chip key={tag} size="sm" variant="bordered">
                      {tag}
                    </Chip>
                  ))}
                  {(draft.tags?.length || 0) > 2 && (
                    <Chip size="sm" variant="bordered">
                      +{draft.tags!.length - 2}
                    </Chip>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-divider">
                  <span className="text-xs text-default-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(draft.lastSaved)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<Edit3 size={14} />}
                      onPress={() => handleEditDraft(draft)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      isIconOnly
                      onPress={() => setDraftToDelete(draft.id)}
                      aria-label="Delete draft"
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
    </div>
  );
}
