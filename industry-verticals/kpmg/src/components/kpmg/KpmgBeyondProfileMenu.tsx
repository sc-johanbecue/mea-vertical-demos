'use client';

import type { JSX, RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

export type KpmgBeyondProfileMenuItem = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

type KpmgBeyondProfileMenuProps = {
  items: KpmgBeyondProfileMenuItem[];
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
};

type MenuPosition = {
  top: number;
  right: number;
};

function isAuthRoute(href: string | undefined): boolean {
  return href?.startsWith('/auth/') === true;
}

function navigateWithFullPageLoad(href: string): void {
  window.location.href = href;
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export function KpmgBeyondProfileMenu({
  items,
  open,
  onClose,
  anchorRef,
  className = '',
}: KpmgBeyondProfileMenuProps): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const [position, setPosition] = useState<MenuPosition>({ top: 0, right: 0 });

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (anchorRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      onClose();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', onDocumentClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocumentClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorRef, onClose, open]);

  if (!open || !isClient) {
    return null;
  }

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Profile menu"
      style={{ top: position.top, right: position.right }}
      className={[
        'fixed z-9999 min-w-[220px] overflow-hidden rounded-bl-2xl bg-kpmg-chip-active py-2 shadow-lg',
        className,
      ].join(' ')}
    >
      {items.map((item, index) => (
        <div key={item.key}>
          {index > 0 ? <div className="mx-5 border-t border-white/15" aria-hidden /> : null}
          {item.href && isAuthRoute(item.href) ? (
            <a
              href={item.href}
              role="menuitem"
              className="block px-5 py-3 text-base text-white no-underline hover:bg-white/5"
              onClick={(event) => {
                event.preventDefault();
                navigateWithFullPageLoad(item.href!);
              }}
            >
              {item.label}
            </a>
          ) : item.href ? (
            <a
              href={item.href}
              role="menuitem"
              className="block px-5 py-3 text-base text-white no-underline hover:bg-white/5"
              onClick={onClose}
            >
              {item.label}
            </a>
          ) : (
            <button
              type="button"
              role="menuitem"
              className="block w-full cursor-pointer border-0 bg-transparent px-5 py-3 text-left text-base text-white hover:bg-white/5"
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return createPortal(menu, document.body);
}
