'use client';

import type { JSX } from 'react';
import { Text, RichText, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';
import { SolutionTabsProvider } from '@/components/banking/SolutionTabsContext';

export interface ProductSolutionExplorerFields {
  Eyebrow?: TextField;
  Title?: TextField;
  Intro?: RichTextField;
}

const defaultFields: ProductSolutionExplorerFields = {
  Eyebrow: { value: "EXPLORE WHAT'S POSSIBLE" },
  Title: { value: 'Find the right solution for your next move.' },
  Intro: { value: "<p>Start with what you want to achieve. We'll help you narrow down the possibilities.</p>" },
};

export type ProductSolutionExplorerProps = ComponentProps & { fields?: ProductSolutionExplorerFields };

export const Default = (props: ProductSolutionExplorerProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const solutionTabsPh = dynamicPlaceholderKey('solution-tabs', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section solution-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="section-intro">
        {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
        {fields.Title ? <Text tag="h2" field={fields.Title} /> : null}
        {fields.Intro ? <RichText field={fields.Intro} /> : null}
      </div>
      <div className="solution-shell">
        <div className="solution-tabs" role="tablist">
          <SolutionTabsProvider>
            <Placeholder name={solutionTabsPh} rendering={rendering} />
          </SolutionTabsProvider>
        </div>
      </div>
    </section>
  );
};
