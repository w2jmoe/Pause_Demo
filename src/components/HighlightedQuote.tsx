import type { ReactNode } from 'react';

type HighlightedQuoteProps = {
  text: string;
  keywords: string[];
};

/** 在引用原文中轻量标出命中词，方便对照「命中」列表，但不抢戏。 */
export function HighlightedQuote({ text, keywords }: HighlightedQuoteProps) {
  return <span className="trigger-quote-text">「{highlightKeywords(text, keywords)}」</span>;
}

function highlightKeywords(text: string, keywords: string[]): ReactNode {
  const ordered = [...new Set(keywords)]
    .filter((keyword) => keyword.trim().length > 0)
    .sort((left, right) => right.length - left.length);

  if (ordered.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${ordered.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const matched = ordered.some((keyword) => keyword.toLowerCase() === part.toLowerCase());
    if (!matched) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <mark className="risk-mark" key={`${part}-${index}`}>
        {part}
      </mark>
    );
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
