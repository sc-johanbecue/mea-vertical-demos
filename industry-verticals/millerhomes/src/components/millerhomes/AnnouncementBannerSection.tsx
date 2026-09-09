'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * AnnouncementBannerSection Component
 * Blue announcement banner for releases, events, special offers
 *
 * Features:
 * - Dark blue background
 * - Heading and description
 * - Expandable "Read more" content
 */

interface Fields {
  /** Banner heading */
  Heading: TextField;
  /** Banner description */
  Description: RichTextField;
  /** Read more link */
  ReadMoreLink: LinkField;
}

const defaultFields: Fields = {
  Heading: {
    value: 'The Wait is Almost Over - First Homes Available 5th February',
  },
  Description: {
    value:
      '<p>We are excited to announce that our first release of homes at Bramcote Hills Rise will be available from Thursday 5th February through Holden Copley Estate Agents, located at 20 Wheeler Place, Long Eaton, Nottingham, NG10 1JN.</p><p>This first release showcases a selection of beautifully crafted homes designed to suit contemporary lifestyles, offering comfort, quality, and sustainable design.</p>',
  },
  ReadMoreLink: {
    value: {
      href: '#',
      text: 'Read more',
      title: 'Read more about the release',
    },
  },
};

export type AnnouncementBannerSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: AnnouncementBannerSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`component announcement-banner-section bg-[#003057] py-6 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Heading */}
          {fields.Heading && (
            <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">
              <Text field={fields.Heading} />
            </h2>
          )}

          {/* Description */}
          {fields.Description && (
            <div className="mb-4 text-sm text-white/90 md:text-base [&_a]:text-[#0072CE] [&_a]:underline">
              <RichText field={fields.Description} />
            </div>
          )}

          {/* Read More */}
          {fields.ReadMoreLink ? (
            <SitecoreLink
              field={fields.ReadMoreLink}
              className="inline-flex items-center gap-1 text-sm font-medium text-white underline transition-colors hover:text-white/80"
            />
          ) : (
            <button className="inline-flex items-center gap-1 text-sm font-medium text-white underline transition-colors hover:text-white/80">
              Read more
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
