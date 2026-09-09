'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
  Text,
  RichText,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Download } from 'lucide-react';

/**
 * SpecificationSection Component
 * Specification details section with image
 *
 * Features:
 * - Title and rich text description
 * - Downloadable specification PDF
 * - Feature image
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Section description */
  Description: RichTextField;
  /** Download link */
  DownloadLink: LinkField;
  /** Feature image */
  Image: ImageField;
  /** Dictionary key: Specification_DownloadButton */
  DownloadButtonText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Specification' },
  Description: {
    value:
      '<p>Every Miller home is built to the highest standards, with quality fixtures and fittings throughout. Our specification includes energy-efficient features and modern conveniences.</p>',
  },
  DownloadLink: { value: { href: '/specification.pdf', text: 'Download Specification' } },
  Image: { value: { src: '', alt: 'Specification' } },
  DownloadButtonText: { value: 'Download Specification' },
};

export type SpecificationSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SpecificationSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;

  return (
    <div className={`component specification-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Content */}
          <div className="flex-1">
            {/* Title */}
            <h2 className="mb-4 text-2xl font-bold text-[#003057] md:text-3xl">
              {fields.Title ? <Text field={fields.Title} /> : 'Specification'}
            </h2>

            {/* Description */}
            {fields.Description && (
              <div className="prose prose-sm mb-6 max-w-none text-[#4a4a4a] [&_a]:text-[#0072CE]">
                <RichText field={fields.Description} />
              </div>
            )}

            {/* Download Button */}
            {fields.DownloadLink ? (
              <SitecoreLink
                field={fields.DownloadLink}
                className="inline-flex items-center gap-2 font-medium text-[#003057] transition-colors hover:text-[#0072CE]"
              />
            ) : (
              <button className="inline-flex items-center gap-2 font-medium text-[#003057] transition-colors hover:text-[#0072CE]">
                <Download className="h-5 w-5" />
                Download Specification
              </button>
            )}
          </div>

          {/* Image */}
          {fields.Image && (
            <div className="shrink-0 lg:w-1/2">
              <div className="overflow-hidden rounded-lg">
                <SitecoreImage field={fields.Image} className="h-auto w-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
