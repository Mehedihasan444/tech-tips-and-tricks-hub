"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  generateTitleSuggestions,
  suggestTags,
  generateSummary,
  improveWriting,
  generateContentOutline,
  expandContent,
  generateCodeExample,
  checkWritingQuality,
} from '@/services/AIService';

// Get API key from localStorage (user-provided)
const getApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gemini-api-key');
};

// Save API key to localStorage
export const saveApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gemini-api-key', key);
};

// Remove API key from localStorage
export const removeApiKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gemini-api-key');
};

// Check if API key exists
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

interface UseAIAssistantReturn {
  // State
  isLoading: boolean;
  error: string | null;
  hasKey: boolean;
  
  // Actions
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  
  // AI Features
  suggestTitles: (content: string, category: string) => Promise<string[]>;
  suggestPostTags: (content: string, title: string, availableTags: string[]) => Promise<string[]>;
  summarizeContent: (content: string) => Promise<string>;
  improveContent: (content: string) => Promise<string>;
  getContentOutline: (title: string, category: string) => Promise<string>;
  expandOnContent: (content: string, topic: string) => Promise<string>;
  getCodeExample: (topic: string, language: string) => Promise<string>;
  analyzeQuality: (content: string) => Promise<{ issues: string[]; score: number; suggestions: string[] }>;
}

export const useAIAssistant = (): UseAIAssistantReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(() => hasApiKey());

  const setApiKey = useCallback((key: string) => {
    saveApiKey(key);
    setHasKey(true);
    toast.success('API key saved successfully');
  }, []);

  const clearApiKey = useCallback(() => {
    removeApiKey();
    setHasKey(false);
    toast.info('API key removed');
  }, []);

  const executeWithLoading = useCallback(async <T>(
    fn: () => Promise<T>,
    errorMessage: string = 'AI request failed'
  ): Promise<T> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast.error('Please set your Gemini API key first');
      throw new Error('No API key');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fn();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const suggestTitles = useCallback(async (content: string, category: string): Promise<string[]> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await generateTitleSuggestions(content, category, apiKey);
    }, 'Failed to generate title suggestions');
  }, [executeWithLoading]);

  const suggestPostTags = useCallback(async (
    content: string,
    title: string,
    availableTags: string[]
  ): Promise<string[]> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await suggestTags(content, title, availableTags, apiKey);
    }, 'Failed to suggest tags');
  }, [executeWithLoading]);

  const summarizeContent = useCallback(async (content: string): Promise<string> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await generateSummary(content, apiKey);
    }, 'Failed to generate summary');
  }, [executeWithLoading]);

  const improveContent = useCallback(async (content: string): Promise<string> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await improveWriting(content, apiKey);
    }, 'Failed to improve content');
  }, [executeWithLoading]);

  const getContentOutline = useCallback(async (title: string, category: string): Promise<string> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await generateContentOutline(title, category, apiKey);
    }, 'Failed to generate outline');
  }, [executeWithLoading]);

  const expandOnContent = useCallback(async (content: string, topic: string): Promise<string> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await expandContent(content, topic, apiKey);
    }, 'Failed to expand content');
  }, [executeWithLoading]);

  const getCodeExample = useCallback(async (topic: string, language: string): Promise<string> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await generateCodeExample(topic, language, apiKey);
    }, 'Failed to generate code example');
  }, [executeWithLoading]);

  const analyzeQuality = useCallback(async (
    content: string
  ): Promise<{ issues: string[]; score: number; suggestions: string[] }> => {
    return executeWithLoading(async () => {
      const apiKey = getApiKey()!;
      return await checkWritingQuality(content, apiKey);
    }, 'Failed to analyze content');
  }, [executeWithLoading]);

  return {
    isLoading,
    error,
    hasKey,
    setApiKey,
    clearApiKey,
    suggestTitles,
    suggestPostTags,
    summarizeContent,
    improveContent,
    getContentOutline,
    expandOnContent,
    getCodeExample,
    analyzeQuality,
  };
};

export default useAIAssistant;
