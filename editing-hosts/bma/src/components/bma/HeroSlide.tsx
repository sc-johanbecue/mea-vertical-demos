'use client';

import type { JSX } from 'react';
import { Link as SitecoreLink, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, hasLink } from '@/lib/component-utils';
import { FieldImage } from '@/lib/field-image';

export interface HeroSlideFields {
  Image: ImageField;
  Link: LinkField;
  AltText: TextField;
}

const defaultFields: HeroSlideFields = {
  Image: { value: { src: '', alt: 'Hero slide' } },
  Link: { value: { href: '#', text: 'Learn more' } },
  AltText: { value: 'Hero slide' },
};

export type HeroSlideProps = ComponentProps & { fields?: HeroSlideFields };

export const Default = (props: HeroSlideProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const alt = fields.AltText?.value?.toString().trim();
  const imageField =
    alt && fields.Image
      ? { ...fields.Image, value: { ...fields.Image.value, alt } }
      : fields.Image;

  const media = <FieldImage field={imageField} mode="cover" className="bma-hero-slide__image" />;

  return (
    <div
      key={componentKey(props)}
      className={`bma-hero-slide ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {hasLink(fields.Link?.value) ? (
        <SitecoreLink field={fields.Link} className="bma-hero-slide__link">
          {media}
          <Text tag="span" className="u-sr-only" field={fields.AltText} />
        </SitecoreLink>
      ) : (
        media
      )}
    </div>
  );
};
