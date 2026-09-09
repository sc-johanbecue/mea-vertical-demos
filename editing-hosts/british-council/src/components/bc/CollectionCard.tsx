'use client';

import type { JSX } from 'react';
import { Image, Link as SitecoreLink, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import type { BcAccessFields } from '@/lib/bc-access';
import { useBcAccessAllowed } from '@/lib/use-bc-access-allowed';

export interface CollectionCardFields extends BcAccessFields {
  Image?: ImageField;
  Title?: TextField;
  Link?: LinkField;
}

const defaults: Required<Pick<CollectionCardFields, 'Image' | 'Title' | 'Link'>> = {
  Image: { value: { src: '', alt: '' } },
  Title: { value: 'Collection' },
  Link: { value: { href: '/', text: 'Open' } },
};

export type CollectionCardProps = ComponentProps & { fields?: CollectionCardFields };

function resolveLinkedTarget(link?: LinkField): { id?: string; path?: string } {
  const value = link?.value as { id?: string; href?: string; url?: string } | undefined;
  const id = value?.id?.replace(/[{}]/g, '') || undefined;
  const path = value?.href || value?.url || undefined;
  return { id, path };
}

function Layout(props: CollectionCardProps, extra = ''): JSX.Element | null {
  const { params } = props;
  const fields = { ...defaults, ...props.fields };
  const { page } = useSitecore();
  const { user, isLoading } = useUser();
  const editing = Boolean(page?.mode?.isEditing);
  const target = resolveLinkedTarget(props.fields?.Link);

  const { allowed } = useBcAccessAllowed({
    fields: props.fields,
    id: target.id,
    path: target.id ? undefined : target.path,
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
      className={`bc-collection-card component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <SitecoreLink field={fields.Link} className="bc-collection-card__link">
        <span className="bc-collection-card__media">
          <Image field={fields.Image} />
        </span>
        <Text tag="h3" className="bc-collection-card__title" field={fields.Title} />
      </SitecoreLink>
    </article>
  );
}

export const Default = (p: CollectionCardProps): JSX.Element | null => Layout(p);
export const Inversed = (p: CollectionCardProps): JSX.Element | null =>
  Layout(p, 'component--inversed');
export const Animated = (p: CollectionCardProps): JSX.Element | null =>
  Layout(p, 'component--animated');
export const InversedAnimated = (p: CollectionCardProps): JSX.Element | null =>
  Layout(p, 'component--inversed component--animated');
