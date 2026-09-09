'use client';

import type { JSX } from 'react';
import { Text, Link, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey } from '@/lib/component-utils';

export interface InsightsGuidanceSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: InsightsGuidanceSectionFields = {
  Eyebrow: { value: 'Eyebrow' },
  Title: { value: 'Title' },
  ViewAllLink: { value: { href: '#', text: 'ViewAllLink' } },
};

export type InsightsGuidanceSectionProps = ComponentProps & { fields?: InsightsGuidanceSectionFields };

export const Default = (props: InsightsGuidanceSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const featuredInsightPh = dynamicPlaceholderKey('featured-insight', params);
  const insightTopicsPh = dynamicPlaceholderKey('insight-topics', params);
  const faqItemsPh = dynamicPlaceholderKey('faq-items', params);

  return (
    <div
      key={componentKey(props)}
      className={`deb-insights-guidance-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Eyebrow ? <Text tag="span" field={fields.Eyebrow} className="deb-insights-guidance-section__eyebrow" /> : null}
      {fields.Title ? <Text tag="span" field={fields.Title} className="deb-insights-guidance-section__title" /> : null}
      {fields.ViewAllLink ? <Link field={fields.ViewAllLink} className="deb-insights-guidance-section__view-all-link" /> : null}
      <div className="deb-insights-guidance-section__featured-insight">
        <Placeholder name={featuredInsightPh} rendering={rendering} />
      </div>
      <div className="deb-insights-guidance-section__insight-topics">
        <Placeholder name={insightTopicsPh} rendering={rendering} />
      </div>
      <div className="deb-insights-guidance-section__faq-items">
        <Placeholder name={faqItemsPh} rendering={rendering} />
      </div>
    </div>
  );
};
