'use client';

import type { JSX } from 'react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './markdown-content.module.css';

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({ content, className }: MarkdownContentProps): JSX.Element | null {
  if (!content.trim()) {
    return null;
  }

  return (
    <div className={clsx(styles.root, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
