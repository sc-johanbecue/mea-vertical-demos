'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import { useKpmgBeyondArticlePageFields } from './kpmg-beyond-article-route-fields';

export type KpmgBeyondArticleBreadcrumbProps = ComponentProps;

function fieldText(field: TextField | undefined, fallback: string): string {
  const value = field?.value?.toString().trim();
  return value || fallback;
}

export const Default = (props: KpmgBeyondArticleBreadcrumbProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { page } = useSitecore();
  const fields = useKpmgBeyondArticlePageFields(props);
  const editingHydration = useEditingHydrationProps();
  const category = fieldText(fields.CategoryLabel, 'Insights');
  const title = fieldText(fields.ArticleTitle, page.layout?.sitecore?.route?.displayName ?? 'Article');

  return (
    <nav
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      aria-label="Breadcrumb"
      data-cy="article-breadcrumb"
      className={[
        'component kpmg-beyond-article-breadcrumb mx-auto w-full max-w-[860px] px-5 pt-6 text-sm text-white/70 xl:px-[60px]',
        styles || '',
      ].join(' ')}
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        <li>
          <Link href="/" className="text-white/70 no-underline hover:text-white hover:underline">
            Insights Hub
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/50">
          &gt;
        </li>
        <li>
          <span className="uppercase">{category}</span>
        </li>
        <li aria-hidden="true" className="text-white/50">
          &gt;
        </li>
        <li className="text-white">{title}</li>
      </ol>
    </nav>
  );
};
