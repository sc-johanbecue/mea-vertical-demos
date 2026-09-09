'use client';

import type { JSX, RefObject } from 'react';
import { useEffect, useRef } from 'react';

export type HeaderProfileMenuItem = {
  key: string;
  label: string;
  href: string;
};

type HeaderProfileMenuProps = {
  items: HeaderProfileMenuItem[];
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
};

function isAuthRoute(href: string): boolean {
  return href.startsWith('/auth/');
}

export function HeaderProfileMenu({
  items,
  open,
  onClose,
  anchorRef,
}: HeaderProfileMenuProps): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);

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

  if (!open) {
    return null;
  }

  return (
    <div ref={menuRef} className="bc-header__profile-menu" role="menu" aria-label="Account menu">
      {items.map((item, index) => (
        <div key={item.key}>
          {index > 0 ? <div className="bc-header__profile-menu-sep" aria-hidden /> : null}
          <a
            href={item.href}
            role="menuitem"
            className="bc-header__profile-menu-item"
            onClick={(event) => {
              if (isAuthRoute(item.href)) {
                event.preventDefault();
                window.location.href = item.href;
                return;
              }
              onClose();
            }}
          >
            {item.label}
          </a>
        </div>
      ))}
    </div>
  );
}
