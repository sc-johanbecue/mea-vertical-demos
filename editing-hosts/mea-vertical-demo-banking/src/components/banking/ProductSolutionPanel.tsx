'use client';

import type { JSX } from 'react';
import { useEffect } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { Wallet, CreditCard, House, ChartLineUp, ArrowRight } from '@phosphor-icons/react';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { FieldLink } from '@/components/banking/FieldLink';
import { useSolutionTabs } from '@/components/banking/SolutionTabsContext';

export interface ProductSolutionPanelFields {
  TabLabel?: TextField;
  TabIcon?: ImageField;
  Eyebrow?: TextField;
  Title?: TextField;
  Body?: RichTextField;
  Link?: LinkField;
  CardEyebrow?: TextField;
  CardIcon?: ImageField;
  CardItems?: RichTextField;
}

const defaultFields: ProductSolutionPanelFields = {
  TabLabel: { value: 'Accounts' },
  Eyebrow: { value: 'EVERYDAY BANKING' },
  Title: { value: 'An account that keeps life moving.' },
  Body: {
    value:
      '<p>Choose flexible everyday banking with easy international transfers, smart saving tools and support when you need it.</p>',
  },
  Link: { value: { href: '#', text: 'Explore accounts' } },
  CardEyebrow: { value: 'WHAT YOU CAN EXPECT' },
  CardItems: {
    value:
      '<p>Current and savings options</p><p>Multi-currency access</p><p>Digital onboarding in minutes</p>',
  },
};

const TAB_ICONS: Record<string, typeof Wallet> = {
  accounts: Wallet,
  cards: CreditCard,
  home: House,
  wealth: ChartLineUp,
};

function hasImage(field?: ImageField): boolean {
  const v = field?.value;
  if (!v) return false;
  return Boolean(v.src || (v as { mediaid?: string }).mediaid || (v as { mediaId?: string }).mediaId);
}

function iconForLabel(label?: string): typeof Wallet {
  const key = String(label ?? '')
    .trim()
    .toLowerCase();
  return TAB_ICONS[key] || Wallet;
}

export type ProductSolutionPanelProps = ComponentProps & { fields?: ProductSolutionPanelFields };

export const Default = (props: ProductSolutionPanelProps): JSX.Element => {
  const { params, fields = defaultFields } = props;
  const id = componentKey(props);
  const tabs = useSolutionTabs();
  const label = String(fields.TabLabel?.value ?? 'Accounts');
  const TabIconCmp = iconForLabel(label);
  const CardIconCmp = iconForLabel(label);

  useEffect(() => {
    tabs?.register(id);
  }, [id, tabs]);

  const isActive = tabs
    ? tabs.activeId === id || (tabs.activeId === null && /^accounts$/i.test(label))
    : true;

  return (
    <div
      key={id}
      className={`solution-panel${isActive ? ' is-active' : ''} ${params?.styles ?? ''}`.trim()}
      id={params?.RenderingIdentifier}
    >
      <button
        type="button"
        role="tab"
        className={isActive ? 'selected' : undefined}
        aria-pressed={isActive}
        aria-selected={isActive}
        onClick={() => tabs?.setActiveId(id)}
      >
        {hasImage(fields.TabIcon) && fields.TabIcon ? <Image field={fields.TabIcon} /> : <TabIconCmp />}
        {fields.TabLabel ? <Text field={fields.TabLabel} /> : null}
      </button>
      <div className="solution-detail" role="tabpanel" hidden={!isActive}>
        <div>
          {fields.Eyebrow ? <Text tag="p" field={fields.Eyebrow} className="overline" /> : null}
          {fields.Title ? <Text tag="h3" field={fields.Title} /> : null}
          {fields.Body ? <RichText field={fields.Body} /> : null}
          <FieldLink field={fields.Link} className="story-link">
            <ArrowRight aria-hidden="true" />
          </FieldLink>
        </div>
        <div className="solution-points">
          {hasImage(fields.CardIcon) && fields.CardIcon ? <Image field={fields.CardIcon} /> : <CardIconCmp />}
          {fields.CardEyebrow ? <Text tag="span" field={fields.CardEyebrow} /> : null}
          {fields.CardItems ? (
            <div className="solution-points-items">
              <RichText field={fields.CardItems} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
