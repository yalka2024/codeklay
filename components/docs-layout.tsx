import React from "react";
import { DocsLanguageSwitcher } from "./docs-language-switcher";

interface DocsLayoutProps {
  currentLang: string;
  children: React.ReactNode;
}

export function DocsLayout({ currentLang, children }: DocsLayoutProps) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>CodePal Documentation</h1>
        <DocsLanguageSwitcher currentLang={currentLang} />
      </header>
      <nav style={{ margin: "1.5rem 0" }}>
        <a href={`/docs/${currentLang}/getting-started.md`} style={{ marginRight: 16 }}>Getting Started</a>
        <a href={`/docs/${currentLang}/faq.md`} style={{ marginRight: 16 }}>FAQ</a>
        <a href={`/docs/${currentLang}/plugin-dev-guide.md`}>Plugin Developer Guide</a>
      </nav>
      <main>{children}</main>
    </div>
  );
} 