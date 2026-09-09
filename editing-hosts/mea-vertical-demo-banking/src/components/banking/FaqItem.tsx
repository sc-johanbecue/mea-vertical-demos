'use client';

import type { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FaqItemFields {
  Question?: TextField;
  Answer?: RichTextField;
}

const defaultFields: FaqItemFields = {
  Question: { value: 'Question' },
  Answer: { value: '<p>Answer</p>' },
};

export type FaqItemProps = ComponentProps & { fields?: FaqItemFields };

export const Default = (props: FaqItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-faq-item ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Question ? <Text tag="span" field={fields.Question} className="deb-faq-item__question" /> : null}
      {fields.Answer ? <div className="deb-faq-item__answer"><RichText field={fields.Answer} /></div> : null}

    </div>
  );
};
