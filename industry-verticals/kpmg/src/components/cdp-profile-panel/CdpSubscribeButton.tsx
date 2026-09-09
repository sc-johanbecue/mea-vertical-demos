'use client';

import { useState, type JSX } from 'react';
import { cn } from '@/shadcn/lib/utils';
import { displayNameFromEmail, EMAIL_REGEX, identifyVisitorByEmail } from '@/lib/cdp/cdp-identity';

export type CdpSubscribeButtonProps = {
  onSubscribed?: (email: string, displayName: string) => void;
  subscribeLabel?: string;
  subscribedLabel?: string;
  variant?: 'default' | 'whb';
  className?: string;
};

export function CdpSubscribeButton({
  onSubscribed,
  subscribeLabel = 'Subscribe',
  subscribedLabel = 'Subscribed!',
  variant = 'default',
  className,
}: CdpSubscribeButtonProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubscribe = async () => {
    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setBusy(true);

    try {
      await identifyVisitorByEmail(value);
      setSubscribed(true);
      onSubscribed?.(value, displayNameFromEmail(value));
    } catch (e) {
      if (e instanceof Error && e.message.includes('valid email')) {
        setError(e.message);
      } else {
        console.debug('Identity event failed:', e);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    variant === 'whb'
      ? 'mb-2 w-full rounded-sm border border-[#e8e8e8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] placeholder:text-[#999] focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none'
      : 'mb-2 w-full rounded-[30px] bg-white px-4 py-2 text-[14px] text-[#1a1a1a] placeholder:text-gray-500 focus:ring-2 focus:ring-white focus:outline-none';

  const buttonClass =
    variant === 'whb'
      ? 'w-full rounded-sm bg-[#4a6fa5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d5f94] disabled:opacity-60'
      : 'w-full rounded-[30px] bg-white px-4 py-2 text-[14px] font-bold text-[#006FB7] transition-colors hover:bg-gray-100 disabled:opacity-60';

  const successClass =
    variant === 'whb'
      ? 'w-full rounded-sm bg-[#e8f5e9] px-4 py-2.5 text-sm font-semibold text-[#2d6a3e]'
      : 'w-full rounded-[30px] bg-green-100 px-4 py-2 text-[14px] font-bold text-green-700';

  if (subscribed) {
    return (
      <button type="button" disabled className={cn(successClass, className)}>
        {subscribedLabel}
      </button>
    );
  }

  return (
    <div className={className}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') void handleSubscribe();
        }}
        placeholder="Enter your email"
        autoComplete="email"
        className={inputClass}
      />
      {error ? (
        <p
          className={cn(
            'mb-2 text-[12px]',
            variant === 'whb' ? 'text-[#c0392b]' : 'text-yellow-200'
          )}
        >
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void handleSubscribe()}
        disabled={busy}
        className={buttonClass}
      >
        {busy ? '…' : subscribeLabel}
      </button>
    </div>
  );
}
