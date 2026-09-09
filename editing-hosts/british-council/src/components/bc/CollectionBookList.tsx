'use client';

import type { JSX } from 'react';
import { Placeholder, Text, useSitecore, Image, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface CollectionBookListFields {
  Title?: TextField;
}

export type ChildBook = {
  id: string;
  title: string;
  coverImage?: ImageField;
  link?: LinkField;
};

export type CollectionBookListProps = ComponentProps & {
  fields?: CollectionBookListFields;
  childBooks?: ChildBook[];
};

const defaults: Required<CollectionBookListFields> = {
  Title: { value: 'Books' },
};

function Layout(props: CollectionBookListProps, extra = ''): JSX.Element {
  const { params, rendering, childBooks } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const id = params?.DynamicPlaceholderId ?? '1';
  const { page } = useSitecore();
  const editing = page?.mode?.isEditing;

  return (
    <section
      key={componentKey(props)}
      className={`bc-collection-books component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <Text tag="h2" className="bc-portal-section__title" field={fields.Title} />
      {childBooks && childBooks.length > 0 ? (
        <div className="bc-book-grid">
          {childBooks.map((book) => (
            <article key={book.id} className="bc-book-card">
              <SitecoreLink field={book.link ?? { value: { href: '#', text: book.title } }} className="bc-book-card__link">
                <span className="bc-book-card__cover">
                  <Image field={book.coverImage ?? { value: { src: '', alt: book.title } }} />
                </span>
                <h3 className="bc-book-card__title">{book.title}</h3>
              </SitecoreLink>
            </article>
          ))}
        </div>
      ) : null}
      <div className="bc-book-grid">
        <Placeholder name={`collection-books-${id}`} rendering={rendering} />
      </div>
      {editing && (!childBooks || childBooks.length === 0) ? (
        <p className="bc-collection-books__hint">
          Add Book items as children of this Collection page, or drop BookCard components into this placeholder.
        </p>
      ) : null}
    </section>
  );
}

export const Default = (p: CollectionBookListProps): JSX.Element => Layout(p);
export const Inversed = (p: CollectionBookListProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: CollectionBookListProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: CollectionBookListProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
