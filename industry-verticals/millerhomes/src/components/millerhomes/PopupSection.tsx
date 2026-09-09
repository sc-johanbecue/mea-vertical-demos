'use client';

import React, { type JSX, useEffect, useState } from 'react';
import { TextField, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { X } from 'lucide-react';

/**
 * PopupSection Component
 * A flexible modal/popup container with dynamic placeholder for content
 *
 * Variants (via params.Variant):
 * - "branded" (default): Dark blue background with Miller Home logo and close button
 * - "choice": Transparent container for choice cards, click outside to close
 *
 * Features:
 * - Timeout: Number of milliseconds before the popup appears (0 = immediate)
 * - In editing mode: grayed placeholder always shown, button to preview modal
 *
 * The placeholder renders ChoiceCard, EmailSignupCard, or any other card components
 */

interface Fields {
  /** Optional title for the popup (used in branded variant) */
  Title: TextField;
  /** Logo text parts */
  LogoPrefix: TextField;
  LogoText: TextField;
  LogoHighlight: TextField;
  /** Dictionary key: Popup_CloseButton */
  CloseButtonText: TextField;
}

const defaultFields: Fields = {
  Title: { value: '' },
  LogoPrefix: { value: 'my' },
  LogoText: { value: 'miller' },
  LogoHighlight: { value: 'home' },
  CloseButtonText: { value: 'Close' },
};

export type PopupSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PopupSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles, DynamicPlaceholderId, Variant, Timeout } = props.params;
  const fields = props.fields || defaultFields;

  // Get Sitecore context to check if we're in editing mode
  const { page } = useSitecore();
  const isEditing = page?.mode.isEditing === true;

  // Get rendering parameter values
  // Timeout: number of milliseconds before popup appears (default 0 = immediate)
  const timeout = Timeout ? parseInt(Timeout, 10) : 0;

  // Start closed, will open after timeout (not in editing mode) or manually via button (in editing mode)
  const [isOpen, setIsOpen] = useState(false);

  // Determine variant - "branded" (default) or "choice"
  const variant = Variant || 'branded';
  const isBranded = variant === 'branded';

  const phPopupContent = `popupContent-${DynamicPlaceholderId}`;

  // Handle opening logic - only for non-editing mode
  useEffect(() => {
    // In editing mode: don't auto-open, editor must click button to preview
    if (isEditing) {
      return;
    }

    // Not in editing mode: show after timeout (0 = immediate)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, isEditing]);

  // Handle escape key and body scroll lock - only when modal is open
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // In editing mode: show collapsible version for editing
  // By default shows a small grayed box, click to expand and show modal overlay
  // IMPORTANT: Placeholder must ALWAYS be in DOM for Sitecore editing - use CSS hidden, not conditional render
  if (isEditing) {
    return (
      <>
        {/* Small grayed box - always visible in editing mode */}
        <div
          className={`component popup-section my-4 rounded-lg border-2 border-dashed border-gray-400 bg-gray-200 p-4 ${styles || ''}`}
          id={id}
        >
          <div className="flex items-center justify-between text-gray-500">
            <div>
              <div className="text-sm font-medium">Popup Section</div>
              <div className="text-xs">
                Popup will appear as modal after {timeout}ms on the live site
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="rounded bg-[#003057] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003057]/90"
            >
              Edit Popup Content
            </button>
          </div>
        </div>

        {/* Modal overlay for editing - contains the Placeholder */}
        {/* Using relative positioning instead of fixed so Sitecore can still edit */}
        <div
          className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 z-[9999] flex items-center justify-center`}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#003057]/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            className={`relative mx-4 max-h-[90vh] w-full overflow-y-auto rounded-lg shadow-2xl ${
              isBranded ? 'max-w-4xl bg-[#003057]' : 'max-w-5xl bg-transparent'
            }`}
          >
            {/* Header - Only for branded variant */}
            {isBranded && (
              <div className="flex items-center justify-between p-6 pb-0">
                {/* Logo */}
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-light text-white">{fields.LogoPrefix?.value}</span>
                  <span className="text-2xl font-bold text-white">{fields.LogoText?.value}</span>
                  <span className="text-2xl font-light text-[#0072CE]">
                    {fields.LogoHighlight?.value}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-white transition-colors hover:text-white/80"
                >
                  <span className="text-sm font-medium">{fields.CloseButtonText?.value}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0072CE]">
                    <X className="h-5 w-5 text-[#0072CE]" />
                  </div>
                </button>
              </div>
            )}

            {/* Editable Placeholder Content - ALWAYS in DOM for Sitecore editing */}
            <div className={`${isBranded ? 'p-6' : 'p-4'} flex`}>
              <Placeholder name={phPopupContent} rendering={props.rendering} />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Not in editing mode and not open: don't render anything (page scrolling remains normal)
  if (!isOpen) return <></>;

  return (
    <div
      className={`component popup-section fixed inset-0 z-50 flex items-center justify-center ${styles || ''}`}
      id={id}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#003057]/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative mx-4 max-h-[90vh] w-full overflow-y-auto rounded-lg shadow-2xl ${
          isBranded ? 'max-w-4xl bg-[#003057]' : 'max-w-5xl bg-transparent'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {/* Header - Only for branded variant */}
        {isBranded && (
          <div className="flex items-center justify-between p-6 pb-0">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-light text-white">{fields.LogoPrefix?.value}</span>
              <span className="text-2xl font-bold text-white">{fields.LogoText?.value}</span>
              <span className="text-2xl font-light text-[#0072CE]">
                {fields.LogoHighlight?.value}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-white transition-colors hover:text-white/80"
              aria-label={fields.CloseButtonText?.value as string}
            >
              <span className="text-sm font-medium">{fields.CloseButtonText?.value}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0072CE]">
                <X className="h-5 w-5 text-[#0072CE]" />
              </div>
            </button>
          </div>
        )}

        {/* Dynamic Placeholder Content */}
        <div className={`${isBranded ? 'p-6' : 'p-4'} flex`}>
          {/* Wrapper for choice cards - displays them in a row */}
          <Placeholder name={phPopupContent} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
