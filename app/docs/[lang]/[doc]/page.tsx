import React from "react";
import { DocsLayout } from "@/components/docs-layout";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";

// This page expects Next.js App Router with dynamic [lang] and [doc] params
// Example route: /docs/en/getting-started, /docs/es/faq, etc.

interface DocsPageProps {
  params: { lang: string; doc: string };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { lang, doc } = params;
  let markdown = "";
  try {
    // Construct the path to the markdown file in the docs folder
    const filePath = path.join(process.cwd(), "docs", lang, `${doc}.md`);
    markdown = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    markdown = `# Not Found\nThe requested documentation (${lang}/${doc}) was not found.`;
  }

  return (
    <DocsLayout currentLang={lang}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </DocsLayout>
  );
} 