import React, { type JSX } from 'react';
import {
  TextField,
  Text,
  RichTextField,
  RichText,
  ImageField,
  Image as SitecoreImage,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ContentCard Component
 * Card for "Your place to be" carousel with image, title, description, and CTA
 *
 * Desktop: Shows as part of 3-panel carousel view
 * - Each "slide" shows: text card | large image | text card (partial)
 *
 * Mobile/Tablet: Single card with image on top, content below
 *
 * Used inside ContentCarouselSection placeholder
 */

interface Fields {
  Image: ImageField;
  Title: TextField;
  Description: RichTextField;
  CTAText: TextField;
  CTALink: LinkField;
}

const defaultFields: Fields = {
  Image: { value: { src: '/placeholder.svg?height=500&width=800', alt: 'Content' } },
  Title: { value: 'New Development coming to Leicestershire, Summer 2025' },
  Description: {
    value:
      '<p>Willowbrook Rise is our latest development coming to Countesthorpe, Leicestershire. Register your interest and receive exclusive updates.</p>',
  },
  CTAText: { value: 'Register Online' },
  CTALink: { value: { href: '#' } },
};

export type ContentCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContentCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  // Don't render empty cards (prevents empty slides in carousel)
  const hasContent = fields.Title?.value || fields.Image?.value?.src || fields.Description?.value;
  if (!hasContent) {
    return null;
  }

  return (
    <div
      className={`component content-card w-full shrink-0 px-2 lg:w-[65%] lg:px-4 ${styles || ''}`}
      id={id}
    >
      {/* Mobile/Tablet: Stacked layout */}
      <div className="bg-background-accent overflow-hidden lg:hidden">
        {/* Image */}
        {fields.Image?.value?.src && (
          <div className="relative aspect-4/3 overflow-hidden">
            <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
          </div>
        )}
        {/* Content */}
        <div className="bg-[hsl(0,0%,96%)] p-6">
          <h3 className="mb-3 text-xl leading-tight font-bold text-[#003057]">
            <Text field={fields.Title} />
          </h3>
          <div className="text-foreground-light mb-5 text-sm leading-relaxed">
            <RichText field={fields.Description} />
          </div>
          {fields.CTALink?.value?.href && (
            <SitecoreLink
              field={fields.CTALink}
              className="inline-block bg-[#003057] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#002040]"
            >
              <Text field={fields.CTAText} />
            </SitecoreLink>
          )}
        </div>
      </div>

      {/* Desktop: Side-by-side layout within carousel - Image LEFT, Text RIGHT */}
      <div className="hidden h-100 overflow-hidden bg-[rgb(245,245,245)] lg:flex xl:h-112.5">
        {/* Image - wider (60-65%) */}
        <div className="relative w-[62%] shrink-0">
          {fields.Image?.value?.src && (
            <SitecoreImage
              field={fields.Image}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        {/* Text Content - narrower (38%) */}
        <div className="bg-background-accent flex w-[38%] flex-col justify-center overflow-hidden p-5 xl:p-6">
          <h3 className="mb-3 text-xl leading-tight font-bold text-[#003057] xl:text-2xl">
            <Text field={fields.Title} />
          </h3>
          <div className="text-foreground-light mb-4 line-clamp-4 text-sm leading-relaxed">
            <RichText field={fields.Description} />
          </div>
          {fields.CTALink?.value?.href && (
            <div>
              <SitecoreLink
                field={fields.CTALink}
                className="inline-block bg-[#003057] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#002040]"
              >
                <Text field={fields.CTAText} />
              </SitecoreLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
