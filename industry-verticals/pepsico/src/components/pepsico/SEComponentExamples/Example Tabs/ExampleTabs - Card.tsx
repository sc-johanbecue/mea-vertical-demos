'use client';

import React, { useState, type JSX } from 'react';
import {
  Field,
  TextField,
  Text,
  LinkField,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * PricingCard Component
 * A pricing plan card for the PricingTab placeholder.
 *
 * Layout:
 * - Badge top-left
 * - Plan name, subtitle, prices
 * - Dropdown selector
 * - Options (checkbox items from Sitecore multilist)
 * - CTA button
 * - Attributes (check/cross list items from Sitecore multilist)
 * - Expandable CheckoutOptions section (from Sitecore multilist)
 *
 * The Attributes, Options, and CheckoutOptions are modeled as RichTextField
 * arrays (multilists in Sitecore). Each item in the multilist is a
 * referenced Sitecore item with its own fields. In the component we
 * represent them as JSON-serialized arrays inside TextField values
 * so defaults can be rendered standalone.
 */

// Types for the multilist items (TreeList references from Sitecore)
interface PricingAttribute {
  fields: {
    Text: TextField;
    Sublabel: TextField;
    Included: Field<boolean>; // boolean as string
    IsBold: Field<boolean>; // boolean as string
  };
}

interface PricingOption {
  fields: {
    Label: TextField;
    Sublabel: TextField;
    Badge: TextField;
    Checked: Field<boolean>; // boolean as string
  };
}

interface CheckoutOption {
  fields: {
    Label: TextField;
  };
}

interface Fields {
  Badge: TextField;
  PlanName: TextField;
  PlanSubtext: TextField;
  OriginalPrice: TextField;
  Price: TextField;
  Currency: TextField;
  PriceNote: TextField;
  DropdownLabel: TextField;
  CTAText: TextField;
  CTALink: LinkField;
  /** Array of PricingAttribute items from TreeList */
  Attributes: PricingAttribute[];
  /** Array of PricingOption items from TreeList */
  Options: PricingOption[];
  /** Array of CheckoutOption items from TreeList */
  CheckoutOptions: CheckoutOption[];
  CheckoutOptionsLabel: TextField;
  CheckoutOptionsNote: TextField;
}

const defaultFields: Fields = {
  Badge: { value: 'AI-POWERED TASK AUTOMATION' },
  PlanName: { value: 'TeamViewer Premium' },
  PlanSubtext: { value: 'Access up to 300 unattended devices' },
  OriginalPrice: { value: '\u20AC76.90' },
  Price: { value: '61.52' },
  Currency: { value: '\u20AC' },
  PriceNote: { value: 'per month / billed yearly / excl. tax' },
  DropdownLabel: { value: 'Additional concurrent connections' },
  CTAText: { value: 'Buy now' },
  CTALink: { value: { href: '#buy' } },
  Attributes: [
    {
      fields: {
        Text: { value: '15 licensed users' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: '1 concurrent connection (channel)' },
        Sublabel: { value: 'Up to 10 concurrent sessions per channel (in tabs)' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: '300 managed devices' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Phone support (in 33 languages)' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: true },
      },
    },
    {
      fields: {
        Text: { value: 'TeamViewer AI' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Google Meet integration' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Unlimited devices to connect to' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Unlimited devices to connect from' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Outgoing connection reporting' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Mobile device support (add-on)' },
        Sublabel: { value: '' },
        Included: { value: true },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Incoming connection reporting' },
        Sublabel: { value: '' },
        Included: { value: false },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: { value: 'Mass deployment' },
        Sublabel: { value: '' },
        Included: { value: false },
        IsBold: { value: false },
      },
    },
    {
      fields: {
        Text: {
          value:
            'Standard Integrations Package (add-on including ServiceNow, Freshworks, Zendesk, Jamf, Miradore, and others)',
        },
        Sublabel: { value: '' },
        Included: { value: false },
        IsBold: { value: false },
      },
    },
  ],
  Options: [
    {
      fields: {
        Label: { value: 'DEX Essentials' },
        Sublabel: { value: 'Proactively identify and fix IT issues' },
        Badge: { value: '30-DAY FREE TRIAL' },
        Checked: { value: false },
      },
    },
    {
      fields: {
        Label: { value: 'Support for mobile devices' },
        Sublabel: { value: '' },
        Badge: { value: '' },
        Checked: { value: false },
      },
    },
  ],
  CheckoutOptions: [
    { fields: { Label: { value: 'Asset Management' } } },
    { fields: { Label: { value: 'Device Monitoring' } } },
    { fields: { Label: { value: 'TeamViewer Assist AR Lite' } } },
    { fields: { Label: { value: 'Endpoint Protection' } } },
    { fields: { Label: { value: 'Mobile Device Management' } } },
  ],
  CheckoutOptionsLabel: { value: 'View available add-ons (5)' },
  CheckoutOptionsNote: { value: 'Add-ons can be selected at checkout.' },
};

export type PricingCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PricingCardProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;
  const styles = props.params?.styles || '';
  const fields = props.fields || defaultFields;

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Get arrays from TreeList fields
  const attributes = fields.Attributes || [];
  const options = fields.Options || [];
  const checkoutOptions = fields.CheckoutOptions || [];

  return (
    <div key={id ?? props.rendering?.uid} className={`component pricing-card ${styles}`} id={id}>
      <div
        className="flex h-full flex-col overflow-hidden rounded-xl"
        style={{ border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}
      >
        <div className="flex flex-1 flex-col p-6 lg:p-8">
          {/* Badge */}
          {fields.Badge?.value && (
            <div className="mb-3">
              <span
                className="inline-block rounded px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase"
                style={{ backgroundColor: '#0d1b3e' }}
              >
                <Text field={fields.Badge} />
              </span>
            </div>
          )}

          {/* Plan name */}
          <h3 className="text-xl font-bold lg:text-2xl" style={{ color: '#0d1b3e' }}>
            <Text field={fields.PlanName} />
          </h3>

          {/* Subtitle */}
          <p className="mt-1 mb-4 text-sm text-gray-500">
            <Text field={fields.PlanSubtext} />
          </p>

          {/* Original price (strikethrough) */}
          {fields.OriginalPrice?.value && (
            <p className="text-sm font-semibold line-through" style={{ color: '#d64545' }}>
              <span className="text-lg font-medium">
                <Text field={fields.Currency} />
              </span>
              <Text field={fields.OriginalPrice} />
            </p>
          )}

          {/* Current price */}
          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-lg font-medium" style={{ color: '#0d1b3e' }}>
              <Text field={fields.Currency} />
            </span>
            <span className="text-5xl font-extrabold tracking-tight" style={{ color: '#0d1b3e' }}>
              <Text field={fields.Price} />
            </span>
          </div>

          {/* Price note */}
          <p className="mb-6 text-xs text-gray-500">
            <Text field={fields.PriceNote} />
          </p>

          {/* Dropdown selector */}
          {fields.DropdownLabel?.value && (
            <div
              className="mb-4 flex items-center justify-between rounded-lg px-4 py-3"
              style={{ border: '1px solid #d0d0d0' }}
            >
              <span className="text-sm text-gray-600">
                <Text field={fields.DropdownLabel} />
              </span>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}

          {/* Options (checkbox items) */}
          {options.length > 0 && (
            <div className="mb-4 flex flex-col gap-3">
              {options.map((option, idx) => {
                const label = option.fields.Label?.value || '';
                const sublabel = option.fields.Sublabel?.value || '';
                const badge = option.fields.Badge?.value || '';
                const checked = option.fields.Checked;

                return (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3 rounded-lg px-4 py-3"
                    style={{
                      border: badge ? '2px solid #6b21a8' : '1px solid #d0d0d0',
                      backgroundColor: badge ? '#f9f5ff' : 'transparent',
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                      style={{ border: '2px solid #d0d0d0' }}
                    >
                      {checked && (
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-800">{label}</span>
                      {sublabel && <span className="block text-xs text-gray-500">{sublabel}</span>}
                    </div>
                    {/* Badge */}
                    {badge && (
                      <span
                        className="absolute top-2 right-3 rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase"
                        style={{ backgroundColor: '#0d6e4f' }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Button */}
          <SitecoreLink
            field={fields.CTALink}
            className="mb-6 block w-full rounded-lg py-3.5 text-center text-sm font-bold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#0d1b3e' }}
          >
            <Text field={fields.CTAText} />
          </SitecoreLink>

          {/* Attributes (check/cross list) */}
          {attributes.length > 0 && (
            <div className="flex flex-col gap-3">
              {attributes.map((attr, idx) => {
                const text = attr.fields.Text?.value || '';
                const sublabel = attr.fields.Sublabel?.value || '';
                const included = attr.fields.Included?.value || false;
                const isBold = attr.fields.IsBold?.value || false;

                return (
                  <div key={idx} className="flex items-start gap-3">
                    {/* Check or Cross icon */}
                    {included ? (
                      <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M3 10.5L7.5 15L17 5"
                          stroke="#1a56db"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M5 5L15 15M15 5L5 15"
                          stroke="#d64545"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex-1">
                      <span
                        className="text-sm"
                        style={{
                          color: '#333333',
                          fontWeight: isBold ? '700' : '400',
                        }}
                      >
                        {text}
                      </span>
                      {sublabel && <span className="block text-xs text-gray-400">{sublabel}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Checkout Options (expandable add-ons) */}
          {checkoutOptions.length > 0 && (
            <div className="mt-6" style={{ borderTop: '1px solid #e0e0e0' }}>
              <button
                type="button"
                onClick={() => setCheckoutOpen(!checkoutOpen)}
                className="flex w-full items-center justify-between py-4 text-left"
                style={{ borderBottom: checkoutOpen ? '1px solid #e0e0e0' : 'none' }}
              >
                <span className="text-sm font-semibold" style={{ color: '#6b21a8' }}>
                  <Text field={fields.CheckoutOptionsLabel} />
                </span>
                <svg
                  className="h-4 w-4 text-gray-400 transition-transform"
                  style={{ transform: checkoutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {checkoutOpen && (
                <div className="flex flex-col gap-3 py-4">
                  {checkoutOptions.map((opt, idx) => {
                    const label = opt.fields.Label?.value || '';

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        {/* Sparkle icon */}
                        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 2L12 7L17 7.5L13.5 11L14.5 16L10 13.5L5.5 16L6.5 11L3 7.5L8 7L10 2Z"
                            fill="#6b21a8"
                          />
                        </svg>
                        <span className="text-sm text-gray-800">{label}</span>
                      </div>
                    );
                  })}

                  {fields.CheckoutOptionsNote?.value && (
                    <p
                      className="mt-2 text-xs text-gray-400"
                      style={{ borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}
                    >
                      <Text field={fields.CheckoutOptionsNote} />
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
