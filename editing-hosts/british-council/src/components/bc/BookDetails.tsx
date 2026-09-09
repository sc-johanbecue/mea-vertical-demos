'use client';

import { useMemo, useState, type JSX } from 'react';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, TextField } from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface BookDetailsFields {
  CoverImage?: ImageField;
  Title?: TextField;
  Author?: TextField;
  Publisher?: TextField;
  PublishedYear?: TextField;
  ISBN?: TextField;
  Genre?: TextField;
  Language?: TextField;
  PageCount?: TextField;
  Synopsis?: TextField;
  SampleExcerpt?: TextField;
}

export type BookDetailsProps = ComponentProps & { fields?: BookDetailsFields };

const SAMPLE_PAGE_COUNT = 20;

function asText(field?: TextField | { value?: unknown }): string {
  const v = field?.value;
  if (v == null) return '';
  return String(v);
}

function buildSamplePages(title: string, author: string, excerpt: string): string[] {
  const base =
    excerpt.trim() ||
    `${title} opens with a quiet moment that sets the tone for everything that follows. ${
      author ? `In the voice of ${author}, ` : ''
    }the first passages invite the reader into a carefully observed world of places, people and ideas.`;

  const sentences = base
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  const pages: string[] = [];
  for (let page = 1; page <= SAMPLE_PAGE_COUNT; page += 1) {
    const chunks: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      const sentence = sentences[(page + i) % Math.max(sentences.length, 1)] || base;
      chunks.push(sentence);
    }
    pages.push(
      `Page ${page}\n\n${chunks.join(' ')}\n\n[Sample preview — this is a simulated extract of ${title}.]`
    );
  }
  return pages;
}

function BookDetailsView({ props, extra = '' }: { props: BookDetailsProps; extra?: string }): JSX.Element {
  const { params, fields: propFields } = props;
  const { page } = useSitecore();
  const routeFields = (page?.layout?.sitecore?.route?.fields || {}) as BookDetailsFields;
  const fields = { ...routeFields, ...propFields };

  const title = asText(fields.Title) || 'Untitled';
  const author = asText(fields.Author);
  const excerpt = asText(fields.SampleExcerpt);
  const pages = useMemo(() => buildSamplePages(title, author, excerpt), [title, author, excerpt]);

  const [readerOpen, setReaderOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const meta = [
    { label: 'Author', value: author },
    { label: 'Publisher', value: asText(fields.Publisher) },
    { label: 'Year', value: asText(fields.PublishedYear) },
    { label: 'ISBN', value: asText(fields.ISBN) },
    { label: 'Genre', value: asText(fields.Genre) },
    { label: 'Language', value: asText(fields.Language) },
    { label: 'Pages', value: asText(fields.PageCount) },
  ].filter((item) => item.value);

  const openReader = () => {
    setPageIndex(0);
    setReaderOpen(true);
  };

  return (
    <section
      key={componentKey(props)}
      className={`bc-book-details component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-book-details__hero">
        <div className="bc-book-details__cover">
          <Image field={fields.CoverImage ?? { value: { src: '', alt: title } }} />
        </div>
        <div className="bc-book-details__info">
          <Text tag="h1" className="bc-book-details__title" field={fields.Title ?? { value: title }} />
          {author ? <p className="bc-book-details__author">by {author}</p> : null}
          {meta.length ? (
            <dl className="bc-book-details__meta">
              {meta.map((item) => (
                <div key={item.label} className="bc-book-details__meta-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <button type="button" className="bc-book-details__read-btn" onClick={openReader}>
            <BookOpen size={18} aria-hidden="true" />
            Read sample (first {SAMPLE_PAGE_COUNT} pages)
          </button>
        </div>
      </div>

      {asText(fields.Synopsis) ? (
        <div className="bc-book-details__synopsis">
          <h2>Synopsis</h2>
          <Text tag="p" field={fields.Synopsis} />
        </div>
      ) : null}

      {readerOpen ? (
        <div className="bc-book-reader" role="dialog" aria-modal="true" aria-label={`Sample reader for ${title}`}>
          <div className="bc-book-reader__panel">
            <header className="bc-book-reader__header">
              <div>
                <p className="bc-book-reader__kicker">Sample preview</p>
                <h2 className="bc-book-reader__title">{title}</h2>
              </div>
              <button type="button" className="bc-book-reader__close" onClick={() => setReaderOpen(false)} aria-label="Close reader">
                <X size={22} aria-hidden="true" />
              </button>
            </header>
            <div className="bc-book-reader__page">
              <pre className="bc-book-reader__text">{pages[pageIndex]}</pre>
            </div>
            <footer className="bc-book-reader__footer">
              <button
                type="button"
                className="bc-book-reader__nav"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Previous
              </button>
              <span className="bc-book-reader__counter">
                Page {pageIndex + 1} of {SAMPLE_PAGE_COUNT}
              </span>
              <button
                type="button"
                className="bc-book-reader__nav"
                disabled={pageIndex >= SAMPLE_PAGE_COUNT - 1}
                onClick={() => setPageIndex((i) => Math.min(SAMPLE_PAGE_COUNT - 1, i + 1))}
              >
                Next
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export const Default = (p: BookDetailsProps): JSX.Element => <BookDetailsView props={p} />;
export const Inversed = (p: BookDetailsProps): JSX.Element => (
  <BookDetailsView props={p} extra="component--inversed" />
);
export const Animated = (p: BookDetailsProps): JSX.Element => (
  <BookDetailsView props={p} extra="component--animated" />
);
export const InversedAnimated = (p: BookDetailsProps): JSX.Element => (
  <BookDetailsView props={p} extra="component--inversed component--animated" />
);