'use client';

import type { JSX } from 'react';
import { Image } from '@sitecore-content-sdk/nextjs';
import type { ImageField } from '@sitecore-content-sdk/nextjs';

export type ImageDisplayMode = 'cover' | 'contain' | 'fill-width' | 'column-cover';

export interface FieldImageProps {
  field?: ImageField;
  mode: ImageDisplayMode;
  className?: string;
}

/** Renders a Sitecore Image field with layout-aware cropping (styles in bma.css when added). */
export function FieldImage({ field, mode, className = '' }: FieldImageProps): JSX.Element {
  const src = field?.value?.src;

  if (mode === 'cover') {
    return (
      <span className={`rai-img rai-img__cover-shell ${className}`.trim()} data-image-mode="cover">
        <span
          className="rai-img__cover-bg"
          style={src ? { backgroundImage: `url(${src})` } : undefined}
          aria-hidden="true"
        />
        <Image field={field} className="u-sr-only" />
      </span>
    );
  }

  const modeClass = `rai-img rai-img--${mode}`;
  return <Image field={field} className={`${modeClass} ${className}`.trim()} data-image-mode={mode} />;
}
