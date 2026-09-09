'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ShieldCheck, Headset, ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface ConfidenceCtaBarFields {
  LeftTitle?: TextField;
  LeftBody?: RichTextField;
  RightTitle?: TextField;
  RightBody?: RichTextField;
  PrimaryLink?: LinkField;
}

const defaultFields: ConfidenceCtaBarFields = {
  LeftTitle: { value: 'Built around your security' },
  LeftBody: { value: '<p>Industry-leading protection and privacy at every step.</p>' },
  RightTitle: { value: 'Human help, whenever you need it' },
  RightBody: { value: '<p>Priority specialists available 24 hours a day.</p>' },
  PrimaryLink: { value: { href: '/Premium', text: 'Start your upgrade' } },
};

export type ConfidenceCtaBarProps = ComponentProps & { fields?: ConfidenceCtaBarFields };

export const Default = (props: ConfidenceCtaBarProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <section
      key={componentKey(props)}
      className={`confidence ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <div>
        <ShieldCheck />
        <span>
          {fields.LeftTitle ? (
            <strong>
              <Text field={fields.LeftTitle} />
            </strong>
          ) : null}
          {fields.LeftBody ? <RichText field={fields.LeftBody} /> : null}
        </span>
      </div>
      <div>
        <Headset />
        <span>
          {fields.RightTitle ? (
            <strong>
              <Text field={fields.RightTitle} />
            </strong>
          ) : null}
          {fields.RightBody ? <RichText field={fields.RightBody} /> : null}
        </span>
      </div>
      <FieldLink field={fields.PrimaryLink} className="primary">
        <ArrowRight aria-hidden="true" />
      </FieldLink>
    </section>
  );
};
