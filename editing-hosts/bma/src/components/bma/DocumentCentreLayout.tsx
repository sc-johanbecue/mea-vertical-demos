'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import {
  DocumentCentreProvider,
  DocumentCentreResultsPanel,
  DocumentCentreSidebarControls,
} from '@/components/bma/DocumentCentreLive';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, hasLink } from '@/lib/component-utils';

export interface DocumentCentreLayoutFields {
  SidebarTitle: TextField;
  ResultsHeading: TextField;
  ResultsIntro: TextField;
  ArchiveLink: LinkField;
  ResultsCountLabel: TextField;
  ShowSearch: TextField;
  ShowViewableFilter: TextField;
  ShowDocTypeFilter: TextField;
  ShowCategoryFilter: TextField;
  ShowTopicFilter: TextField;
  ShowMediaFilter: TextField;
}

const defaultFields: DocumentCentreLayoutFields = {
  SidebarTitle: { value: 'Filter documents' },
  ResultsHeading: { value: 'Documents' },
  ResultsIntro: { value: 'Search and filter documents published from Content Hub.' },
  ArchiveLink: { value: { href: '#', text: 'View archive' } },
  ResultsCountLabel: { value: 'Results' },
  ShowSearch: { value: '1' },
  ShowViewableFilter: { value: '1' },
  ShowDocTypeFilter: { value: '1' },
  ShowCategoryFilter: { value: '1' },
  ShowTopicFilter: { value: '1' },
  ShowMediaFilter: { value: '1' },
};

export type DocumentCentreLayoutProps = ComponentProps & { fields?: DocumentCentreLayoutFields };

function isEnabled(field?: TextField, fallback = true): boolean {
  if (field?.value === undefined || field?.value === null || String(field.value).trim() === '') {
    return fallback;
  }
  const value = String(field.value).trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

export const Default = (props: DocumentCentreLayoutProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing ?? false;
  const countLabel = fields.ResultsCountLabel?.value?.toString() || 'Results';

  const enabledFilters = {
    search: isEnabled(fields.ShowSearch),
    viewable: isEnabled(fields.ShowViewableFilter),
    docTypes: isEnabled(fields.ShowDocTypeFilter),
    categories: isEnabled(fields.ShowCategoryFilter),
    topics: isEnabled(fields.ShowTopicFilter),
    media: isEnabled(fields.ShowMediaFilter),
  };

  return (
    <DocumentCentreProvider
      resultsCountLabel={countLabel}
      enabledFilters={enabledFilters}
      contentHubEnabled={!isEditing}
    >
      <section
        key={componentKey(props)}
        className={`bma-doc-centre ${params?.styles ?? ''}`.trim()}
        id={params?.RenderingIdentifier}
      >
        <aside className="bma-doc-centre__sidebar">
          <Text tag="h2" className="bma-doc-centre__sidebar-title" field={fields.SidebarTitle} />
          {isEditing ? (
            <p className="bma-doc-centre__authoring-note">
              Editing mode: no Content Hub requests. Use the Show* checkboxes on this datasource to choose which
              filters appear on the live site.
            </p>
          ) : null}
          <DocumentCentreSidebarControls />
        </aside>

        <div className="bma-doc-centre__results">
          <header className="bma-doc-centre__results-header">
            <div>
              <Text tag="h2" className="bma-doc-centre__results-heading" field={fields.ResultsHeading} />
              <Text tag="p" className="bma-doc-centre__results-intro" field={fields.ResultsIntro} />
            </div>
            <div className="bma-doc-centre__results-meta">
              {hasLink(fields.ArchiveLink?.value) ? (
                <SitecoreLink field={fields.ArchiveLink} className="bma-doc-centre__archive" />
              ) : null}
            </div>
          </header>
          <DocumentCentreResultsPanel />
        </div>
      </section>
    </DocumentCentreProvider>
  );
};
