'use client';

import type { JSX } from 'react';
import { TextField, ImageField, Text, Image as SitecoreImage } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { parseWordColor } from './pepsico-corporate-utils';
import { PEPSICO_WORD_COLORS } from './pepsico-corporate-tokens';

export interface PepsiCoCorporateWordTileFields {
  Word: TextField;
  /** blue | green | yellow | peach | orange */
  Color: TextField;
  Image: ImageField;
  /** image | word — when image, renders a square lifestyle thumb instead of text */
  TileType: TextField;
}

const defaultFields: PepsiCoCorporateWordTileFields = {
  Word: { value: 'SMILES' },
  Color: { value: 'blue' },
  Image: { value: { src: '', alt: '' } },
  TileType: { value: 'word' },
};

export type PepsiCoCorporateWordTileProps = ComponentProps & {
  fields: PepsiCoCorporateWordTileFields;
};

export const Default = (props: PepsiCoCorporateWordTileProps): JSX.Element => {
  const id = props.params.RenderingIdentifier ?? props.rendering?.uid;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;
  const colorKey = parseWordColor(fields.Color);
  const color = PEPSICO_WORD_COLORS[colorKey];
  const isImage = String(fields.TileType?.value ?? 'word').toLowerCase() === 'image';
  const imageSrc = fields.Image?.value?.src?.trim();

  if (isImage && imageSrc) {
    return (
      <span
        data-pepsico-word-tile
        className={`component pepsico-corporate-word-tile inline-block overflow-hidden rounded-md align-middle ${styles || ''}`}
        id={id}
      >
        <SitecoreImage
          field={fields.Image}
          className="aspect-square h-[clamp(2.5rem,8vw,4.5rem)] w-[clamp(2.5rem,8vw,4.5rem)] object-cover md:h-[clamp(3rem,6vw,5.5rem)] md:w-[clamp(3rem,6vw,5.5rem)]"
          alt={fields.Image?.value?.alt ?? ''}
        />
      </span>
    );
  }

  return (
    <span
      data-pepsico-word-tile
      className={`component pepsico-corporate-word-tile inline-block align-middle leading-[0.9] font-black tracking-tight uppercase ${styles || ''}`}
      id={id}
      style={{ color }}
    >
      <Text
        tag="span"
        field={fields.Word}
        className="text-[clamp(2rem,9vw,4.25rem)] md:text-[clamp(2.5rem,5.5vw,5rem)]"
      />
    </span>
  );
};
