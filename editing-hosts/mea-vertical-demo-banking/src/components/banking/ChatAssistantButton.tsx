'use client';

import type { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ChatCircleDots } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';

export interface ChatAssistantButtonFields {
  Label?: TextField;
  Link?: LinkField;
}

const defaultFields: ChatAssistantButtonFields = {
  Label: { value: 'Ask DEB Assistant' },
  Link: { value: { href: '#', text: 'Assistant' } },
};

export type ChatAssistantButtonProps = ComponentProps & { fields?: ChatAssistantButtonFields };

export const Default = (props: ChatAssistantButtonProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  return (
    <button
      type="button"
      key={componentKey(props)}
      className={`assistant-launch ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <ChatCircleDots size={27} />
      {fields.Label ? <Text tag="span" field={fields.Label} /> : <FieldLink field={fields.Link} />}
    </button>
  );
};
