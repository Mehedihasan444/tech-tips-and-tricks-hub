"use client";

import React from "react";
import { Chip, Tooltip } from "@heroui/react";
import { Cloud, CloudOff, Loader2 } from "lucide-react";

interface DraftStatusProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedText: string;
}

export default function DraftStatus({
  isSaving,
  hasUnsavedChanges,
  lastSavedText,
}: DraftStatusProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <DraftChip
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedText={lastSavedText}
      />
    </span>
  );
}

function DraftChip({ isSaving, hasUnsavedChanges, lastSavedText }: DraftStatusProps) {
  if (isSaving) {
    return (
      <Tooltip content="Saving draft...">
        <Chip
          size="sm"
          variant="flat"
          color="warning"
          startContent={<Loader2 size={12} className="animate-spin" />}
        >
          Saving...
        </Chip>
      </Tooltip>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Tooltip content="Changes will be auto-saved">
        <Chip size="sm" variant="flat" color="warning" startContent={<CloudOff size={12} />}>
          Unsaved
        </Chip>
      </Tooltip>
    );
  }

  if (lastSavedText) {
    return (
      <Tooltip content={lastSavedText}>
        <Chip size="sm" variant="flat" color="success" startContent={<Cloud size={12} />}>
          {lastSavedText}
        </Chip>
      </Tooltip>
    );
  }

  return null;
}
