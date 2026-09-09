'use client';

import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * DevelopmentGridSection Component
 * Container for displaying development cards in a responsive grid
 * Uses dynamic placeholder for DevelopmentCard components
 *
 * Layout:
 * - Desktop: 3 columns
 * - Tablet: 2 columns
 * - Mobile: 1 column
 */

export type DevelopmentGridSectionProps = ComponentProps;

export const Default = (props: DevelopmentGridSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId } = props.params;

  const phDevelopments = `developments-${DynamicPlaceholderId}`;

  return (
    <div className={`component development-grid-section bg-white py-8 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Placeholder name={phDevelopments} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
