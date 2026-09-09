'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import { CaretDown } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface FaqItemFields {
  Question?: TextField;
  Answer?: RichTextField;
}

const defaultFields: FaqItemFields = {
  Question: { value: 'How quickly can I open an account?' },
  Answer: { value: '<p>A digital application can be started in minutes.</p>' },
};

export type FaqItemProps = ComponentProps & { fields?: FaqItemFields };

export const Default = (props: FaqItemProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const [open, setOpen] = useState(false);

  return (
    <div key={componentKey(props)} className={`faq-item ${params?.styles ?? ''}`.trim()} id={params?.RenderingIdentifier}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {fields.Question ? <Text tag="span" field={fields.Question} /> : null}
        <CaretDown />
      </button>
      {open && fields.Answer ? (
        <div className="faq-answer">
          <RichText field={fields.Answer} />
        </div>
      ) : null}
    </div>
  );
};
