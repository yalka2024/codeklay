import React from "react";
import { DocsLayout } from "@/components/docs-layout";

// This page expects Next.js App Router with dynamic [lang] param
// Example route: /docs/en, /docs/es, etc.

interface DocsPageProps {
  params: { lang: string };
}

export default function DocsPage({ params }: DocsPageProps) {
  const { lang } = params;

  // TODO: Load and render the appropriate markdown file for the selected doc and language
  // For now, just show a placeholder
  return (
    <DocsLayout currentLang={lang}>
      <h2>Welcome to CodePal Docs ({lang})</h2>
      <p>This is a placeholder for the localized documentation content.</p>
      {/* You can load and render markdown files here using a markdown renderer */}
    </DocsLayout>
  );
} 