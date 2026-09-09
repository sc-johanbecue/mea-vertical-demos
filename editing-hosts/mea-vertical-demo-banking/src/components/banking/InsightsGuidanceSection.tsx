'use client';

import type { JSX } from 'react';
import { Text, Placeholder } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey, dynamicPlaceholderKey, hasLinkField } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface InsightsGuidanceSectionFields {
  Eyebrow?: TextField;
  Title?: TextField;
  ViewAllLink?: LinkField;
}

const defaultFields: InsightsGuidanceSectionFields = {
  Eyebrow: { value: "GUIDANCE FOR WHAT'S NEXT" },
  Title: { value: 'Ideas, answers and a little inspiration.' },
  ViewAllLink: { value: { href: '#', text: 'View all insights' } },
};

function hasText(field?: TextField): boolean {
  return Boolean(String(field?.value ?? '').trim());
}

export type InsightsGuidanceSectionProps = ComponentProps & { fields?: InsightsGuidanceSectionFields };

export const Default = (props: InsightsGuidanceSectionProps): JSX.Element => {
  const { params, fields = defaultFields, rendering } = props;
  const featuredInsightPh = dynamicPlaceholderKey('featured-insight', params);
  const insightTopicsPh = dynamicPlaceholderKey('insight-topics', params);
  const faqItemsPh = dynamicPlaceholderKey('faq-items', params);

  return (
    <section
      key={componentKey(props)}
      className={`content-section learn-section ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div className="section-title">
        <div>
          {hasText(fields.Eyebrow) ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
          {hasText(fields.Title) ? <Text tag="h2" field={fields.Title} /> : null}
        </div>
        {hasLinkField(fields.ViewAllLink) ? (
          <FieldLink field={fields.ViewAllLink}>
            <ArrowRight aria-hidden="true" />
          </FieldLink>
        ) : null}
      </div>
      <div className="learn-grid">
        <Placeholder name={featuredInsightPh} rendering={rendering} />
        <div className="article-list">
          <Placeholder name={insightTopicsPh} rendering={rendering} />
        </div>
        <div className="faq-card">
          <p className="overline">COMMON QUESTIONS</p>
          <h3>Here when you need clarity.</h3>
          <Placeholder name={faqItemsPh} rendering={rendering} />
        </div>
      </div>
    </section>
  );
};
