'use client';

import { useCallback, useEffect, useState, type JSX } from 'react';
import { Star } from '@phosphor-icons/react';

/** Lightweight toast for demo chrome interactions (search, messages, chat). */
export function useDemoNotify(durationMs = 2400) {
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), durationMs);
    return () => window.clearTimeout(id);
  }, [toast, durationMs]);

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  const Toast = (): JSX.Element | null =>
    toast ? (
      <div className="toast" role="status">
        <Star weight="fill" aria-hidden="true" />
        {toast}
      </div>
    ) : null;

  return { notify, Toast };
}
