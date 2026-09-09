'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import type { BcAccessFields } from '@/lib/bc-access';
import { useBcAccessAllowed } from '@/lib/use-bc-access-allowed';

export interface BookCardFields extends BcAccessFields {
  CoverImage?: ImageField;
  Title?: TextField;
  Link?: LinkField;
}

const defaults: Required<Pick<BookCardFields, 'CoverImage' | 'Title' | 'Link'>> = {
  CoverImage: { value: { src: '', alt: '' } },
  Title: { value: 'Book title' },
  Link: { value: { href: '/', text: 'Open' } },
};

export type BookCardProps = ComponentProps & { fields?: BookCardFields };

function resolveLinkedItemId(link?: LinkField): string {
  const value = link?.value as { id?: string; href?: string; url?: string } | undefined;
  return value?.id?.replace(/[{}]/g, '') || '';
}

function Layout(props: BookCardProps, extra = ''): JSX.Element | null {
  const { params, rendering } = props;
  const fields = { ...defaults, ...props.fields };
  const { page } = useSitecore();
  const { user, isLoading } = useUser();
  const editing = Boolean(page?.mode?.isEditing);
  const datasourceId = rendering?.dataSource?.replace(/[{}]/g, '') || '';
  const linkedId = resolveLinkedItemId(props.fields?.Link);
  const accessId = datasourceId || linkedId;

  const { allowed } = useBcAccessAllowed({
    fields: props.fields,
    id: accessId || undefined,
    user,
    isUserLoading: isLoading,
    skip: editing,
  });

  if (!allowed) {
    return null;
  }

  return (
    <article
      key={componentKey(props)}
      className={`bc-book-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bc-book-card__link">
        <span className="bc-book-card__cover">
          <Image field={fields.CoverImage} />
        </span>
        <Text tag="h3" className="bc-book-card__title" field={fields.Title} />
      </SitecoreLink>
    </article>
  );
}

export const Default = (p: BookCardProps): JSX.Element | null => Layout(p);
export const Inversed = (p: BookCardProps): JSX.Element | null => Layout(p, 'component--inversed');
export const Animated = (p: BookCardProps): JSX.Element | null => Layout(p, 'component--animated');
export const InversedAnimated = (p: BookCardProps): JSX.Element | null =>
  Layout(p, 'component--inversed component--animated');
