import type { ComponentPropsWithoutRef, JSX } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resolveDocumentHref, type DocumentOrigin } from '../lib/content';

type MarkdownRendererProps = {
  content: string;
  origin: DocumentOrigin | null;
};

const isInternalHref = (href: string): boolean => href.startsWith('/') && !href.startsWith('//');

const isExternalHref = (href: string): boolean => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(href);

const MarkdownLink = ({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<'a'> & { href?: string }): JSX.Element => {
  if (!href) {
    return <span>{children}</span>;
  }

  if (isInternalHref(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const MarkdownImage = ({
  src,
  alt,
  ...props
}: ComponentPropsWithoutRef<'img'> & { src?: string; alt?: string }): JSX.Element | null => {
  if (!src) {
    return null;
  }

  return <img src={src} alt={alt ?? ''} loading="lazy" {...props} />;
};

export default function MarkdownRenderer({ content, origin }: MarkdownRendererProps): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, ...props }) => (
          <MarkdownLink href={href ? resolveDocumentHref(origin, href) : href} {...props} />
        ),
        img: ({ src, alt, ...props }) => (
          <MarkdownImage
            src={typeof src === 'string' ? resolveDocumentHref(origin, src) : undefined}
            alt={alt}
            {...props}
          />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
