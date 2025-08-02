import React from "react";

export function HelpButton({ lang }: { lang: string }) {
  return (
    <a
      href={`/docs/${lang}/faq`}
      style={{
        display: 'inline-block',
        padding: '6px 16px',
        background: '#f5f5f5',
        color: '#333',
        borderRadius: 4,
        textDecoration: 'none',
        fontWeight: 500,
        border: '1px solid #ccc',
      }}
    >
      Help
    </a>
  );
} 