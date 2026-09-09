'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface ProductSolutionExplorerFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Intro?: RichTextField;
}

const defaultFields: ProductSolutionExplorerFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  Intro: { value: '<p>Intro</p>' },
};

export type ProductSolutionExplorerProps = ComponentProps & { fields?: ProductSolutionExplorerFields };

export const Default = (props: ProductSolutionExplorerProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const solutionTabsPh = dynamicPlaceholderKey('solution-tabs', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-product-solution-explorer ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-product-solution-explorer__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-product-solution-explorer__title" /> : null}
      {fields.Intro ? <div className="deb-product-solution-explorer__intro"><RichText field={fields.Intro} /></div> : null}
      <div className="deb-product-solution-explorer__solution-tabs">
        <Placeholder name={solutionTabsPh} rendering={rendering} />
      </div>
    </div>
  );
};
