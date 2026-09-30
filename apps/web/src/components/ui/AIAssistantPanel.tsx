"use client";

import React, { useState } from 'react';
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
} from '@nextui-org/react';
import {
  Sparkles,
  Wand2,
  ListChecks,
  FileText,
  Lightbulb,
  Key,
  Check,
  AlertCircle,
  Copy,
  Settings,
} from 'lucide-react';
import { useAIAssistant, removeApiKey } from '@/hooks/useAIAssistant';
import { toast } from 'sonner';

interface AIAssistantPanelProps {
  content: string;
  title: string;
  category: string;
  availableTags: string[];
  onTitleSelect?: (title: string) => void;
  onTagsSelect?: (tags: string[]) => void;
  onContentImprove?: (content: string) => void;
  onOutlineGenerate?: (outline: string) => void;
}

export default function AIAssistantPanel({
  content,
  title,
  category,
  availableTags,
  onTitleSelect,
  onTagsSelect,
  onContentImprove,
  onOutlineGenerate,
}: AIAssistantPanelProps) {
  const {
    isLoading,
    hasKey,
    setApiKey,
    suggestTitles,
    suggestPostTags,
    improveContent,
    getContentOutline,
    analyzeQuality,
  } = useAIAssistant();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Results state
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [outline, setOutline] = useState('');
  const [qualityResult, setQualityResult] = useState<{
    issues: string[];
    score: number;
    suggestions: string[];
  } | null>(null);

  // Modal states
  const {
    isOpen: isResultsOpen,
    onOpen: onResultsOpen,
    onOpenChange: onResultsOpenChange,
  } = useDisclosure();
  const [resultType, setResultType] = useState<'titles' | 'tags' | 'outline' | 'quality'>('titles');

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      onOpenChange();
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const handleRemoveApiKey = () => {
    removeApiKey();
    window.location.reload();
  };

  const handleGenerateTitles = async () => {
    if (!content.trim()) {
      toast.warning('Please write some content first');
      return;
    }
    try {
      const suggestions = await suggestTitles(content, category || 'Technology');
      setTitleSuggestions(suggestions);
      setResultType('titles');
      onResultsOpen();
    } catch {
      // Error handled in hook
    }
  };

  const handleSuggestTags = async () => {
    if (!content.trim() && !title.trim()) {
      toast.warning('Please write a title or some content first');
      return;
    }
    try {
      const suggestions = await suggestPostTags(content, title, availableTags);
      setTagSuggestions(suggestions);
      setResultType('tags');
      onResultsOpen();
    } catch {
      // Error handled in hook
    }
  };

  const handleImproveContent = async () => {
    if (!content.trim()) {
      toast.warning('Please write some content first');
      return;
    }
    try {
      const improved = await improveContent(content);
      if (onContentImprove) {
        onContentImprove(improved);
        toast.success('Content improved and applied!');
      }
    } catch {
      // Error handled in hook
    }
  };

  const handleGenerateOutline = async () => {
    if (!title.trim() && !category) {
      toast.warning('Please enter a title or select a category first');
      return;
    }
    try {
      const generatedOutline = await getContentOutline(title || 'Tech Tips', category || 'Technology');
      setOutline(generatedOutline);
      setResultType('outline');
      onResultsOpen();
    } catch {
      // Error handled in hook
    }
  };

  const handleAnalyzeQuality = async () => {
    if (!content.trim()) {
      toast.warning('Please write some content first');
      return;
    }
    try {
      const result = await analyzeQuality(content);
      setQualityResult(result);
      setResultType('quality');
      onResultsOpen();
    } catch {
      // Error handled in hook
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!hasKey) {
    return (
      <>
        <Tooltip content="Set up AI Assistant">
          <Button
            variant="flat"
            color="secondary"
            size="sm"
            startContent={<Key size={16} />}
            onPress={onOpen}
          >
            Setup AI
          </Button>
        </Tooltip>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  <Sparkles className="text-secondary" size={20} />
                  <span>Setup AI Assistant</span>
                </ModalHeader>
                <ModalBody>
                  <p className="text-default-600 text-sm mb-4">
                    Enter your Google Gemini API key to enable AI-powered features like title suggestions, 
                    content improvement, and more.
                  </p>
                  <Input
                    label="Gemini API Key"
                    placeholder="AIzaSy..."
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    endContent={
                      <Button
                        variant="light"
                        size="sm"
                        isIconOnly
                        onPress={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? '🙈' : '👁️'}
                      </Button>
                    }
                  />
                  <p className="text-xs text-default-400 mt-2">
                    Get your free API key from{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="secondary" onPress={handleSaveApiKey}>
                    Save Key
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              color="secondary"
              size="sm"
              startContent={isLoading ? <Spinner size="sm" /> : <Sparkles size={16} />}
              isDisabled={isLoading}
            >
              AI Assistant
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="AI Assistant Actions">
            <DropdownItem
              key="titles"
              startContent={<Lightbulb size={16} />}
              description="Generate catchy titles"
              onPress={handleGenerateTitles}
            >
              Suggest Titles
            </DropdownItem>
            <DropdownItem
              key="tags"
              startContent={<ListChecks size={16} />}
              description="Recommend relevant tags"
              onPress={handleSuggestTags}
            >
              Suggest Tags
            </DropdownItem>
            <DropdownItem
              key="outline"
              startContent={<FileText size={16} />}
              description="Create content structure"
              onPress={handleGenerateOutline}
            >
              Generate Outline
            </DropdownItem>
            <DropdownItem
              key="improve"
              startContent={<Wand2 size={16} />}
              description="Enhance writing quality"
              onPress={handleImproveContent}
            >
              Improve Writing
            </DropdownItem>
            <DropdownItem
              key="quality"
              startContent={<AlertCircle size={16} />}
              description="Check grammar & style"
              onPress={handleAnalyzeQuality}
            >
              Analyze Quality
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<Settings size={16} />}
              description="Manage API key"
              onPress={onOpen}
              className="text-warning"
            >
              Settings
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* API Key Settings Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Settings className="text-secondary" size={20} />
                <span>AI Settings</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="text-success" size={16} />
                    <span className="text-sm text-success-700">API Key configured</span>
                  </div>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={handleRemoveApiKey}
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-default-400 mt-2">
                  Your API key is stored locally in your browser.
                </p>
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

      {/* Results Modal */}
      <Modal isOpen={isResultsOpen} onOpenChange={onResultsOpenChange} size="lg" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Sparkles className="text-secondary" size={20} />
                <span>
                  {resultType === 'titles' && 'Title Suggestions'}
                  {resultType === 'tags' && 'Tag Suggestions'}
                  {resultType === 'outline' && 'Content Outline'}
                  {resultType === 'quality' && 'Quality Analysis'}
                </span>
              </ModalHeader>
              <ModalBody>
                {/* Title Suggestions */}
                {resultType === 'titles' && (
                  <div className="space-y-3">
                    {titleSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-default-100 rounded-lg hover:bg-default-200 transition-colors"
                      >
                        <span className="flex-1">{suggestion}</span>
                        <div className="flex gap-2">
                          <Tooltip content="Copy">
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => copyToClipboard(suggestion)}
                            >
                              <Copy size={14} />
                            </Button>
                          </Tooltip>
                          {onTitleSelect && (
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => {
                                onTitleSelect(suggestion);
                                onClose();
                              }}
                            >
                              Use This
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tag Suggestions */}
                {resultType === 'tags' && (
                  <div className="space-y-4">
                    <p className="text-sm text-default-600">
                      Based on your content, we recommend these tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions.map((tag, index) => (
                        <Chip key={index} color="primary" variant="flat">
                          #{tag}
                        </Chip>
                      ))}
                    </div>
                    {onTagsSelect && (
                      <Button
                        color="primary"
                        onPress={() => {
                          onTagsSelect(tagSuggestions);
                          onClose();
                        }}
                      >
                        Apply All Tags
                      </Button>
                    )}
                  </div>
                )}

                {/* Content Outline */}
                {resultType === 'outline' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-default-100 rounded-lg whitespace-pre-wrap">
                      {outline}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="flat"
                        startContent={<Copy size={16} />}
                        onPress={() => copyToClipboard(outline)}
                      >
                        Copy
                      </Button>
                      {onOutlineGenerate && (
                        <Button
                          color="primary"
                          onPress={() => {
                            onOutlineGenerate(outline);
                            onClose();
                          }}
                        >
                          Insert to Editor
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Quality Analysis */}
                {resultType === 'quality' && qualityResult && (
                  <div className="space-y-4">
                    {/* Score */}
                    <div className="flex items-center gap-4 p-4 bg-default-100 rounded-lg">
                      <div
                        className={`text-4xl font-bold ${
                          qualityResult.score >= 8
                            ? 'text-success'
                            : qualityResult.score >= 5
                            ? 'text-warning'
                            : 'text-danger'
                        }`}
                      >
                        {qualityResult.score}/10
                      </div>
                      <div>
                        <p className="font-medium">Quality Score</p>
                        <p className="text-sm text-default-500">
                          {qualityResult.score >= 8
                            ? 'Excellent writing!'
                            : qualityResult.score >= 5
                            ? 'Good, but can be improved'
                            : 'Needs improvement'}
                        </p>
                      </div>
                    </div>

                    {/* Issues */}
                    {qualityResult.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertCircle size={16} className="text-warning" />
                          Issues Found
                        </h4>
                        <ul className="space-y-1">
                          {qualityResult.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-default-600 flex items-start gap-2">
                              <span className="text-warning">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {qualityResult.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Lightbulb size={16} className="text-primary" />
                          Suggestions
                        </h4>
                        <ul className="space-y-1">
                          {qualityResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-default-600 flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
    </>
  );
}
