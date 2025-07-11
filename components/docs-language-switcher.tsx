import React from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
];

export function DocsLanguageSwitcher({ currentLang }: { currentLang: string }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <label htmlFor="docs-lang-select" style={{ marginRight: 8 }}>
        Language:
      </label>
      <select
        id="docs-lang-select"
        value={currentLang}
        onChange={e => {
          const lang = e.target.value;
          window.location.href = `/docs/${lang}/getting-started.md`;
        }}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
} 