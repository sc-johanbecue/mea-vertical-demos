'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * TestimonialCard Component
 * A single client testimonial with quote and author, designed to be placed
 * inside the TestimonialCarouselSection placeholder.
 *
 * Features:
 * - Large quote text (styled for white-on-dark)
 * - Author name + title below
 * - Optional "See case study" link
 * - Full-width flex-shrink-0 so it acts as a carousel slide
 *
 * Must be wrapped with the class "testimonial-card" for the parent
 * MutationObserver slide count to detect it.
 */

interface Fields {
  /** The client quote (rich text for bold/italic formatting) */
  Quote: RichTextField;
  /** Author name and title, e.g. "Traci Memmott, Global Head of Payroll, PayPal" */
  Author: TextField;
  Function: TextField;
  Company: TextField;
  /** Optional link to case study */
  CaseStudyLink: LinkField;
  CaseStudyText: TextField;
}

const defaultFields: Fields = {
  Quote: {
    value:
      '<p>&ldquo;99.9% of our employees are now paid on ADP, and our payroll problems are at an all-time low &hellip; Our recent employee survey saw significant improvement.&rdquo;</p>',
  },
  Author: { value: 'Traci Memmott' },
  Function: { value: 'Global Head of Payroll' },
  Company: { value: 'PayPal' },
  CaseStudyLink: { value: { href: '', text: '' } },
  CaseStudyText: { value: 'See case study' },
};

export type TestimonialCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: TestimonialCardProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const hasContent = fields.Quote?.value || fields.Author?.value;
  if (!hasContent) return null;

  return (
    <div
      key={id ?? props.rendering?.uid}
      className={`component testimonial-card w-full shrink-0 text-center ${styles || ''}`}
      id={id}
    >
      {/* Quote */}
      <RichText
        className="mb-8 text-xl leading-relaxed text-[#1A1A2E] lg:text-2xl lg:leading-relaxed"
        field={fields.Quote}
      />

      {/* Author */}
      <p className="text-sm text-[#1A1A2E]">
        <Text tag="span" className="font-extrabold" field={fields.Author} />{' '}
        <Text tag="span" field={fields.Function} /> , <Text tag="span" field={fields.Company} />
      </p>

      {/* Case Study Link */}
      {fields.CaseStudyLink?.value?.href && (
        <SitecoreLink
          field={fields.CaseStudyLink}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D0271D] transition-colors hover:text-[#b8221a]"
        >
          <Text field={fields.CaseStudyText} />
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </SitecoreLink>
      )}
    </div>
  );
};
