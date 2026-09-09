'use client';

import type { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';

export interface ChatAssistantButtonFields {
  Label?: TextField;
  Icon?: ImageField;
  Link?: LinkField;
}

const defaultFields: ChatAssistantButtonFields = {
  Label: { value: 'Label' },
  Icon: { value: { src: '', alt: 'Icon' } },
  Link: { value: { href: '#', text: 'Link' } },
};

export type ChatAssistantButtonProps = ComponentProps & { fields?: ChatAssistantButtonFields };

export const Default = (props: ChatAssistantButtonProps): JSX.Element => {
  const { params, fields = defaultFields } = props;


  return (
    <div
      key={componentKey(props)}
      className={`deb-chat-assistant-button ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      {fields.Label ? <Text tag="span" field={fields.Label} className="deb-chat-assistant-button__label" /> : null}
      {fields.Icon?.value?.src ? <Image field={fields.Icon} className="deb-chat-assistant-button__icon" /> : null}
      {fields.Link ? <Link field={fields.Link} className="deb-chat-assistant-button__link" /> : null}

    </div>
  );
};
