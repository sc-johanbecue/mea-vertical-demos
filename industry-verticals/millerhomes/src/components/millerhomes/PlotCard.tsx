'use client';

import type { JSX } from 'react';
import { TextField, LinkField, Text, Link as SitecoreLink } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Compass, Calendar, MapPin } from 'lucide-react';

/**
 * PlotCard Component
 * Card for displaying an available plot
 *
 * Features:
 * - Plot number
 * - Price
 * - Key details (orientation, completion date)
 * - Status badge
 * - CTA button
 */

interface Fields {
  /** Plot number */
  PlotNumber: TextField;
  /** Price */
  Price: TextField;
  /** House type name */
  HouseTypeName: TextField;
  /** Orientation (e.g., "South-facing garden") */
  Orientation: TextField;
  /** Completion date */
  CompletionDate: TextField;
  /** Status (Available, Reserved, Sold) */
  Status: TextField;
  /** Position on site */
  Position: TextField;
  /** CTA link */
  CTALink: LinkField;
  /** Dictionary key: PlotCard_PlotPrefix */
  PlotPrefix: TextField;
  /** Dictionary key: PlotCard_ViewDetails */
  ViewDetailsText: TextField;
}

const defaultFields: Fields = {
  PlotNumber: { value: '1' },
  Price: { value: '£TBA' },
  HouseTypeName: { value: 'Hampton' },
  Orientation: { value: 'South-facing garden' },
  CompletionDate: { value: 'Q2 2026' },
  Status: { value: 'Available' },
  Position: { value: 'Corner plot' },
  CTALink: { value: { href: '#' } },
  PlotPrefix: { value: 'Plot' },
  ViewDetailsText: { value: 'View plot details' },
};

export type PlotCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PlotCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  const status = (fields.Status?.value as string).toLowerCase() || 'available';
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
  };
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.available;

  return (
    <div
      className={`component plot-card rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg ${styles || ''}`}
      id={id}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#003057]">
            <Text field={fields.PlotPrefix} /> <Text field={fields.PlotNumber} />
          </h3>
          <p className="text-sm text-[#0072CE]">
            <Text field={fields.HouseTypeName} />
          </p>
        </div>
        {/* Status Badge */}
        <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor}`}>
          <Text field={fields.Status} />
        </span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-[#003057]">
          <Text field={fields.Price} />
        </p>
      </div>

      {/* Details */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
          <Compass className="h-4 w-4 text-[#0072CE]" />
          <Text field={fields.Orientation} />
        </div>
        <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
          <Calendar className="h-4 w-4 text-[#0072CE]" />
          <Text field={fields.CompletionDate} />
        </div>
        <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
          <MapPin className="h-4 w-4 text-[#0072CE]" />
          <Text field={fields.Position} />
        </div>
      </div>

      {/* CTA */}
      <SitecoreLink
        field={fields.CTALink}
        className="block w-full rounded bg-[#003057] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#002040]"
      >
        <Text field={fields.ViewDetailsText} />
      </SitecoreLink>
    </div>
  );
};
