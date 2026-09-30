"use client";

import { useEffect, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface PostDraft {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  lastSaved: number;
  createdAt: number;
}

const DRAFT_STORAGE_KEY = 'tech-tips-post-drafts';
const AUTO_SAVE_DELAY = 3000; // 3 seconds

// Get all drafts from localStorage
export const getAllDrafts = (): PostDraft[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const drafts = localStorage.getItem(DRAFT_STORAGE_KEY);
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error reading drafts:', error);
    return [];
  }
};

// Save drafts to localStorage
const saveDraftsToStorage = (drafts: PostDraft[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving drafts:', error);
  }
};

// Get a specific draft by ID
export const getDraftById = (id: string): PostDraft | null => {
  const drafts = getAllDrafts();
  return drafts.find(d => d.id === id) || null;
};

// Delete a draft
export const deleteDraft = (id: string): void => {
  const drafts = getAllDrafts();
  const filtered = drafts.filter(d => d.id !== id);
  saveDraftsToStorage(filtered);
};

// Clear all drafts
export const clearAllDrafts = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_STORAGE_KEY);
};

// Generate unique ID
const generateDraftId = (): string => {
  return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

interface UseDraftAutoSaveOptions {
  draftId?: string;
  onDraftLoaded?: (draft: PostDraft) => void;
  showNotifications?: boolean;
}

interface DraftData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPremium: boolean;
}

export const useDraftAutoSave = (options: UseDraftAutoSaveOptions = {}) => {
  const { draftId: initialDraftId, onDraftLoaded, showNotifications = true } = options;
  
  const [currentDraftId, setCurrentDraftId] = useState<string>(initialDraftId || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Load draft on mount if draftId is provided
  useEffect(() => {
    if (initialDraftId) {
      const draft = getDraftById(initialDraftId);
      if (draft && onDraftLoaded) {
        onDraftLoaded(draft);
        lastSavedDataRef.current = JSON.stringify({
          title: draft.title,
          content: draft.content,
          category: draft.category,
          tags: draft.tags,
          isPremium: draft.isPremium,
        });
        setLastSaved(new Date(draft.lastSaved));
      }
    }
  }, [initialDraftId, onDraftLoaded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save draft immediately
  const saveDraft = useCallback((data: DraftData, forceNew = false): string => {
    const dataString = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (dataString === lastSavedDataRef.current && !forceNew) {
      return currentDraftId;
    }

    setIsSaving(true);

    try {
      const drafts = getAllDrafts();
      const now = Date.now();
      
      let draftIdToUse = currentDraftId;
      
      if (!draftIdToUse || forceNew) {
        draftIdToUse = generateDraftId();
        setCurrentDraftId(draftIdToUse);
      }

      const existingDraftIndex = drafts.findIndex(d => d.id === draftIdToUse);
      
      const draftData: PostDraft = {
        id: draftIdToUse,
        ...data,
        lastSaved: now,
        createdAt: existingDraftIndex >= 0 ? drafts[existingDraftIndex].createdAt : now,
      };

      if (existingDraftIndex >= 0) {
        drafts[existingDraftIndex] = draftData;
      } else {
        drafts.unshift(draftData); // Add to beginning
      }

      // Keep only last 10 drafts
      const trimmedDrafts = drafts.slice(0, 10);
      saveDraftsToStorage(trimmedDrafts);
      
      lastSavedDataRef.current = dataString;
      setLastSaved(new Date(now));
      setHasUnsavedChanges(false);

      if (showNotifications && existingDraftIndex < 0) {
        toast.success('Draft saved!', {
          description: 'Your post has been auto-saved.',
          duration: 2000,
        });
      }

      return draftIdToUse;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (showNotifications) {
        toast.error('Failed to save draft');
      }
      return currentDraftId;
    } finally {
      setIsSaving(false);
    }
  }, [currentDraftId, showNotifications]);

  // Schedule auto-save with debouncing
  const scheduleSave = useCallback((data: DraftData) => {
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only schedule if there's meaningful content
    if (!data.title.trim() && !data.content.trim()) {
      setHasUnsavedChanges(false);
      return;
    }

    // Schedule new save
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(data);
    }, AUTO_SAVE_DELAY);
  }, [saveDraft]);

  // Discard current draft
  const discardDraft = useCallback(() => {
    if (currentDraftId) {
      deleteDraft(currentDraftId);
      setCurrentDraftId('');
      setLastSaved(null);
      setHasUnsavedChanges(false);
      lastSavedDataRef.current = '';
      
      if (showNotifications) {
        toast.info('Draft discarded');
      }
    }
  }, [currentDraftId, showNotifications]);

  // Format last saved time
  const getLastSavedText = useCallback((): string => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    
    if (diff < 60000) {
      return 'Saved just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `Saved at ${lastSaved.toLocaleTimeString()}`;
    }
  }, [lastSaved]);

  return {
    currentDraftId,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveDraft,
    scheduleSave,
    discardDraft,
    getLastSavedText,
    getAllDrafts,
    deleteDraft,
  };
};

export default useDraftAutoSave;
