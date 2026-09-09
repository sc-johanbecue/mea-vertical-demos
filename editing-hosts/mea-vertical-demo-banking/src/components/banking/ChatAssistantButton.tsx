'use client';

import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ChatCircleDots, PaperPlaneTilt, X } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { useDemoNotify } from '@/lib/demo-notify';

export interface ChatAssistantButtonFields {
  Label?: TextField;
  Link?: LinkField;
}

const defaultFields: ChatAssistantButtonFields = {
  Label: { value: 'Ask DEB Assistant' },
  Link: { value: { href: '#', text: 'Assistant' } },
};

type ChatMessage = { role: 'bot' | 'user'; text: string };

const starterMessages: ChatMessage[] = [
  { role: 'bot', text: 'Hi Sarah! How can I help you today?' },
  {
    role: 'bot',
    text: 'Your new salary makes you eligible for Premium Banking. Would you like a quick benefits summary?',
  },
];

export type ChatAssistantButtonProps = ComponentProps & { fields?: ChatAssistantButtonFields };

export const Default = (props: ChatAssistantButtonProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const { page } = useSitecore();
  const isEditing = Boolean(page?.mode?.isEditing);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { notify, Toast } = useDemoNotify();

  useEffect(() => {
    if (!open || !bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [open, messages]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'bot',
        text: "Thanks — I've noted that. A Premium specialist can follow up, or ask me about travel rewards, savings goals, or account upgrades.",
      },
    ]);
    setMessage('');
    notify('Message sent to DEB Assistant.');
  };

  return (
    <>
      <button
        type="button"
        key={componentKey(props)}
        className={`assistant-launch ${params?.styles ?? ''}`.trim()}
        id={params?.RenderingIdentifier}
        aria-haspopup="dialog"
        aria-expanded={!isEditing && open}
        disabled={isEditing}
        onClick={() => {
          if (isEditing) return;
          setOpen(true);
        }}
      >
        <ChatCircleDots size={27} />
        {fields.Label ? <Text tag="span" field={fields.Label} /> : <span>Ask DEB Assistant</span>}
      </button>

      {!isEditing && open ? (
        <aside className="chat-panel" aria-label="DEB Assistant" role="dialog">
          <div className="chat-head">
            <div className="bot-avatar">DEB</div>
            <div>
              <strong>DEB Assistant</strong>
              <small>
                <i aria-hidden="true" /> Online
              </small>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((entry, index) => (
              <div key={`${entry.role}-${index}`} className={`bubble ${entry.role}`}>
                {entry.text}
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
              aria-label="Message DEB Assistant"
            />
            <button type="submit" aria-label="Send">
              <PaperPlaneTilt size={18} />
            </button>
          </form>
        </aside>
      ) : null}
      <Toast />
    </>
  );
};
