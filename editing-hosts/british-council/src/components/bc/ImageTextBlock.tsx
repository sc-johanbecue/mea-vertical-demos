'use client';

import type { JSX } from 'react';
import { Image, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { ImageField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';


export interface ImageTextBlockFields {
  Image: ImageField;
  Title: TextField;
  Body: RichTextField;
}

const defaultFields: ImageTextBlockFields = {
  Image: { value: { src: '', alt: '' } },
  Title: { value: 'Section title' },
  Body: { value: '' },
};

export type ImageTextBlockProps = ComponentProps & { fields?: ImageTextBlockFields };

function Layout(props: ImageTextBlockProps, extra = ''): JSX.Element {
  const { params, fields = defaultFields } = props;
  return (
    <section
      key={componentKey(props)}
      className={`bc-image-text component ${extra} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="bc-image-text__media">
        <Image field={fields.Image} />
      </div>
      <Text tag="h2" className="bc-image-text__title" field={fields.Title} />
      <RichText className="bc-image-text__body" field={fields.Body} />
    </section>
  );
}

export const Default = (p: ImageTextBlockProps): JSX.Element => Layout(p);
export const Inversed = (p: ImageTextBlockProps): JSX.Element => Layout(p, 'component--inversed');
export const Animated = (p: ImageTextBlockProps): JSX.Element => Layout(p, 'component--animated');
export const InversedAnimated = (p: ImageTextBlockProps): JSX.Element =>
  Layout(p, 'component--inversed component--animated');
