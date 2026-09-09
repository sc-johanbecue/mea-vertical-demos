'use client';

import React, { type JSX } from 'react';
import { TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialsSection Component
 * Trustpilot reviews widget section
 *
 * Features:
 * - Embedded Trustpilot widget via iframe
 * - Configurable locale, template, business unit, theme, and star filter
 * - White background section with padding
 */

interface Fields {
  /** Trustpilot locale, e.g. "en-GB" */
  Locale: TextField;
  /** Trustpilot template ID */
  TemplateId: TextField;
  /** Trustpilot business unit ID */
  BusinessUnitId: TextField;
  /** Widget height, e.g. "140px" */
  WidgetHeight: TextField;
  /** Widget theme: "light" or "dark" */
  Theme: TextField;
  /** Star filter, e.g. "4,5" for 4 and 5 star reviews */
  Stars: TextField;
  /** Review languages, e.g. "en" */
  ReviewLanguages: TextField;
}

const defaultFields: Fields = {
  Locale: { value: 'en-GB' },
  TemplateId: { value: '53aa8912dec7e10d38f59f36' },
  BusinessUnitId: { value: '5803fd7b0000ff0005962025' },
  WidgetHeight: { value: '140px' },
  Theme: { value: 'light' },
  Stars: { value: '4,5' },
  ReviewLanguages: { value: 'en' },
};

export type TestimonialsSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialsSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const locale = fields.Locale?.value || 'en-GB';
  const templateId = fields.TemplateId?.value || '53aa8912dec7e10d38f59f36';
  const businessUnitId = fields.BusinessUnitId?.value || '5803fd7b0000ff0005962025';
  const widgetHeight = fields.WidgetHeight?.value || '140px';
  const theme = fields.Theme?.value || 'light';
  const stars = fields.Stars?.value || '4,5';
  const reviewLanguages = fields.ReviewLanguages?.value || 'en';

  return (
    <section
      className={`component testimonials-section bg-white py-8 lg:py-12 ${styles || ''}`}
      id={id}
    >
      <div className="container mx-auto px-4">
        <div
          className="trustpilot-widget"
          data-locale={locale}
          data-template-id={templateId}
          data-businessunit-id={businessUnitId}
          data-style-height={widgetHeight}
          data-style-width="100%"
          data-theme={theme}
          data-stars={stars}
          data-review-languages={reviewLanguages}
        >
          <a
            href="https://uk.trustpilot.com/review/millerhomes.co.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </section>
  );
};
