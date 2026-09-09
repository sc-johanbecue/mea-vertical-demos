'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Link as SitecoreLink, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField, Field } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { LucideIcon } from 'lucide-react';
import {
  Book,
  BookOpen,
  Clapperboard,
  FolderOpen,
  Headphones,
  Heart,
  Home,
  Layers,
  Library,
  Newspaper,
} from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import type { BcAccessFields } from '@/lib/bc-access';
import { useBcAccessAllowed } from '@/lib/use-bc-access-allowed';
import { usePortalNav } from './portal-nav-context';

export interface PortalNavItemFields extends BcAccessFields {
  Link?: LinkField;
  /** Lucide icon name, e.g. home, newspaper, headphones */
  Icon?: TextField;
  IsActive?: Field<boolean>;
  HasChildren?: Field<boolean>;
}

const defaults: Required<
  Pick<PortalNavItemFields, 'Link' | 'Icon' | 'IsActive' | 'HasChildren'>
> = {
  Link: { value: { href: '/', text: 'Home' } },
  Icon: { value: 'home' },
  IsActive: { value: false },
  HasChildren: { value: false },
};

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  library: Library,
  heart: Heart,
  star: Heart,
  favourites: Heart,
  favorites: Heart,
  folder: FolderOpen,
  folderopen: FolderOpen,
  collections: FolderOpen,
  newspaper: Newspaper,
  newspapers: Newspaper,
  bookopen: BookOpen,
  magazine: BookOpen,
  magazines: BookOpen,
  headphones: Headphones,
  audiobook: Headphones,
  audiobooks: Headphones,
  book: Book,
  fiction: Book,
  layers: Layers,
  comics: Layers,
  comic: Layers,
  film: Clapperboard,
  clapperboard: Clapperboard,
  movies: Clapperboard,
  movie: Clapperboard,
  eresources: Library,
};

function resolveIcon(name?: string): LucideIcon {
  const key = String(name ?? 'home')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
  return ICONS[key] ?? Home;
}

export type PortalNavItemProps = ComponentProps & { fields?: PortalNavItemFields };

function isChecked(field?: Field<boolean>): boolean {
  const v = field?.value as unknown;
  return v === true || v === '1' || v === 1;
}

function resolveLinkedTarget(link?: LinkField): { id?: string; path?: string } {
  const value = link?.value as { id?: string; href?: string; url?: string } | undefined;
  const id = value?.id?.replace(/[{}]/g, '') || undefined;
  const path = value?.href || value?.url || undefined;
  return { id, path };
}

function Layout(props: PortalNavItemProps, extra = ''): JSX.Element | null {
  const { params, rendering } = props;
  const fields = { ...defaults, ...props.fields } as typeof defaults;
  const id = params?.DynamicPlaceholderId ?? '1';
  const active = isChecked(fields.IsActive);
  const hasChildren = isChecked(fields.HasChildren);
  const [open, setOpen] = useState(active || hasChildren);
  const Icon = resolveIcon(String(fields.Icon?.value ?? 'home'));
  const { closeNav } = usePortalNav();
  const { page } = useSitecore();
  const { user, isLoading } = useUser();
  const editing = Boolean(page?.mode?.isEditing);
  const target = resolveLinkedTarget(props.fields?.Link);

  // Prefer rights on the linked Collection/page (where authors set Entitlements/Roles),
  // falling back to rights authored directly on the nav datasource.
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
    <li
      key={componentKey(props)}
      className={`bc-portal-nav-item component ${active ? 'is-active' : ''} ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-portal-nav-item__row">
        <SitecoreLink
          field={fields.Link}
          className="bc-portal-nav-item__link"
          onClick={() => closeNav()}
        >
          <span className="bc-portal-nav-item__icon" aria-hidden="true">
            <Icon size={18} strokeWidth={2} />
          </span>
          <span className="bc-portal-nav-item__label">{fields.Link?.value?.text || 'Item'}</span>
        </SitecoreLink>
        {hasChildren ? (
          <button
            type="button"
            className="bc-portal-nav-item__toggle"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '▾' : '›'}
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul className="bc-portal-nav-item__children">
          <Placeholder name={`portal-nav-children-${id}`} rendering={rendering} />
        </ul>
      ) : null}
    </li>
  );
}

export const Default = (p: PortalNavItemProps): JSX.Element | null => Layout(p);
export const Inversed = (p: PortalNavItemProps): JSX.Element | null => Layout(p, 'component--inversed');
export const Animated = (p: PortalNavItemProps): JSX.Element | null => Layout(p, 'component--animated');
export const InversedAnimated = (p: PortalNavItemProps): JSX.Element | null =>
  Layout(p, 'component--inversed component--animated');
