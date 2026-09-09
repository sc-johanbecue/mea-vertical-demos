import type { JSX } from 'react';
import {
  Text,
  Image as SitecoreImage,
  Link as SitecoreLink,
  ImageField,
  LinkField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * ChoiceCard Component
 * A card component for choice/path selection popups
 * Features: image, heading, description, and CTA button
 *
 * Use inside PopupSection placeholder for choice-style popups
 */

interface Fields {
  /** Card image displayed at the top */
  Image: ImageField;
  /** Card heading/title - displays in light blue */
  Heading: TextField;
  /** Card description text - displays in gray */
  Description: TextField;
  /** Call-to-action link with button styling */
  CTALink: LinkField;
  /** CTA button text */
  CTAText: TextField;
}

const defaultFields: Fields = {
  Image: { value: { src: '', alt: 'Choice' } },
  Heading: { value: 'I want to register\nfor updates' },
  Description: { value: 'Receive the latest news, updates and offers from Miller Homes.' },
  CTALink: { value: { href: '#' } },
  CTAText: { value: 'Click Here' },
};

export type ChoiceCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ChoiceCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div
      className={`component choice-card flex w-full flex-col overflow-hidden rounded-md bg-white shadow-xl md:w-1/2 md:max-w-90 ${styles || ''}`}
      id={id}
    >
      {/* Image */}
      {fields.Image && (
        <div className="relative aspect-16/10 w-full overflow-hidden">
          <SitecoreImage field={fields.Image} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-6 py-8 text-center">
        {/* Heading - using font-light for elegant look, br tags for line break in Sitecore */}
        {fields.Heading && (
          <h3 className="mb-4 text-2xl leading-tight font-light text-[#0072CE] md:text-[28px]">
            <Text field={fields.Heading} />
          </h3>
        )}

        {/* Description */}
        {fields.Description && (
          <p className="text-foreground-light mb-6 max-w-70 flex-1 text-sm leading-relaxed">
            <Text field={fields.Description} />
          </p>
        )}

        {/* CTA Button */}
        {fields.CTALink && (
          <SitecoreLink
            field={fields.CTALink}
            className="w-full max-w-55 rounded bg-[#003057] px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
          >
            <Text field={fields.CTAText} />
          </SitecoreLink>
        )}
      </div>
    </div>
  );
};

export default Default;
