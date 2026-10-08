import React from "react";
import PageHeader from "@/components/ui/PageHeader";

/**
 * Legacy wrapper — kept so existing `import PageTitle` calls keep working.
 * Renders the canonical PageHeader for visual consistency.
 */
const PageTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return <PageHeader title={title} subtitle={subtitle} />;
};

export default PageTitle;
