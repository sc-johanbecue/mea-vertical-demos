'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { KpmgBeyondSolutionCardTile } from './KpmgBeyondSolutionCardTile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  type KpmgBeyondSolutionsSectionFields,
  getSolutionItemsFromFields,
  matchesSolutionsSearch,
  resolveKpmgBeyondSolutionsSectionFields,
} from './kpmg-beyond-solutions-section-shared';

export type KpmgBeyondSolutionsSectionProps = ComponentProps & {
  fields: KpmgBeyondSolutionsSectionFields;
};

export const Default = (props: KpmgBeyondSolutionsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = resolveKpmgBeyondSolutionsSectionFields(
    props.fields,
    props.rendering?.fields as KpmgBeyondSolutionsSectionFields | undefined
  );
  const componentKey = id ?? props.rendering?.uid ?? 'solutions-section';
  const editingHydration = useEditingHydrationProps();
  const [searchQuery, setSearchQuery] = useState('');

  const solutionItems = useMemo(
    () =>
      getSolutionItemsFromFields(
        fields,
        props.rendering?.fields as KpmgBeyondSolutionsSectionFields | undefined
      ),
    [fields, props.rendering?.fields]
  );

  const visibleItems = useMemo(
    () => solutionItems.filter((item) => matchesSolutionsSearch(item, searchQuery)),
    [solutionItems, searchQuery]
  );

  return (
    <section
      key={componentKey}
      {...editingHydration}
      id={id}
      data-cy="solutions-section"
      className={['component kpmg-beyond-solutions w-full px-5 pt-8 xl:px-[60px]', styles || ''].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[1059px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Text
          tag="h2"
          field={fields.PageTitle}
          className="m-0 text-[22px] font-semibold text-white xl:text-[28px]"
          data-cy="solutions-section-title"
        />
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">{fields.SearchPlaceholder?.value?.toString() || 'Search'}</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={fields.SearchPlaceholder?.value?.toString() || 'Search for a solution...'}
            className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-base text-white outline-none focus:border-kpmg-purple"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60" aria-hidden>
            ⌕
          </span>
        </label>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[1059px]">
        {visibleItems.length === 0 ? (
          <p className="text-sm text-white/70">
            {searchQuery.trim() ? 'No solutions match your search.' : 'No solutions to display.'}
          </p>
        ) : null}
        {visibleItems.map((item) => (
          <KpmgBeyondSolutionCardTile
            key={item.id}
            item={item}
            componentKey={`${componentKey}-${item.id}`}
          />
        ))}
      </div>
    </section>
  );
};
