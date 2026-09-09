'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import {
  TextField,
  ImageField,
  LinkField,
  Image as SitecoreImage,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronDown } from 'lucide-react';

/**
 * FloorplanSection Component
 * Interactive floorplan viewer for house type pages (Hampton style)
 *
 * Features:
 * - Plan style selector (Link/Main)
 * - Floor selector tabs (Ground Floor, First Floor)
 * - Dimensions dropdown with expandable table
 * - Download button
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Dictionary key: Floorplan_TitleSuffix */
  TitleSuffix: TextField;
  /** Ground floor image */
  GroundFloorImage: ImageField;
  /** First floor image */
  FirstFloorImage: ImageField;
  /** Second floor image (if applicable) */
  SecondFloorImage: ImageField;
  /** Download link */
  DownloadLink: LinkField;
  /** Dictionary key: Floorplan_PlanStyleLabel */
  PlanStyleLabel: TextField;
  /** Dictionary key: Floorplan_LinkOption */
  LinkOptionText: TextField;
  /** Dictionary key: Floorplan_MainOption */
  MainOptionText: TextField;
  /** Dictionary key: Floorplan_FloorLabel */
  FloorLabel: TextField;
  /** Dictionary key: Floorplan_GroundFloor */
  GroundFloorText: TextField;
  /** Dictionary key: Floorplan_FirstFloor */
  FirstFloorText: TextField;
  /** Dictionary key: Floorplan_Dimensions */
  DimensionsText: TextField;
  /** Dictionary key: Floorplan_Room */
  RoomLabel: TextField;
  /** Dictionary key: Floorplan_Imperial */
  ImperialLabel: TextField;
  /** Dictionary key: Floorplan_Metric */
  MetricLabel: TextField;
  /** Dictionary key: Floorplan_Disclaimer */
  DisclaimerText: TextField;
  /** Dictionary key: Floorplan_ViewFullFloorplan */
  ViewFullFloorplanText: TextField;
  /** Dictionary key: Floorplan_ImagePlaceholder */
  ImagePlaceholderText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Floor plans' },
  TitleSuffix: { value: '& dimensions' },
  GroundFloorImage: { value: { src: '', alt: 'Ground Floor' } },
  FirstFloorImage: { value: { src: '', alt: 'First Floor' } },
  SecondFloorImage: { value: { src: '', alt: 'Second Floor' } },
  DownloadLink: { value: { href: '/floorplan.pdf', text: 'View full floorplan' } },
  PlanStyleLabel: { value: 'Plan Style:' },
  LinkOptionText: { value: 'Link' },
  MainOptionText: { value: 'Main' },
  FloorLabel: { value: 'Floor:' },
  GroundFloorText: { value: 'Ground Floor' },
  FirstFloorText: { value: 'First Floor' },
  DimensionsText: { value: 'Dimensions' },
  RoomLabel: { value: 'Room' },
  ImperialLabel: { value: 'Imperial' },
  MetricLabel: { value: 'Metric' },
  DisclaimerText: {
    value:
      'Floor plans are for illustration purposes only. They are not drawn to scale and are intended as a guide only. Plot specific details should be confirmed prior to reservation.',
  },
  ViewFullFloorplanText: { value: 'View full floorplan' },
  ImagePlaceholderText: { value: 'Floorplan image' },
};

export type FloorplanSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: FloorplanSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props || defaultFields;
  const [planStyle, setPlanStyle] = useState<'link' | 'main'>('link');
  const [activeFloor, setActiveFloor] = useState<'ground' | 'first'>('ground');
  const [showDimensions, setShowDimensions] = useState(false);

  return (
    <div className={`component floorplan-section bg-white py-12 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-light md:text-3xl">
          <span className="text-[#003057]">Floor plans</span>
          <span className="text-[#0072CE]"> & </span>
          <span className="text-[#0072CE]">dimensions</span>
        </h2>

        {/* Plan Style Selector */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-[#4a4a4a]">Plan Style:</label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="planStyle"
                checked={planStyle === 'link'}
                onChange={() => setPlanStyle('link')}
                className="h-4 w-4 border-gray-300 text-[#0072CE] focus:ring-[#0072CE]"
              />
              <span className="text-sm text-[#003057]">Link</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="planStyle"
                checked={planStyle === 'main'}
                onChange={() => setPlanStyle('main')}
                className="h-4 w-4 border-gray-300 text-[#0072CE] focus:ring-[#0072CE]"
              />
              <span className="text-sm text-[#003057]">Main</span>
            </label>
          </div>
        </div>

        {/* Floor Tabs */}
        <div className="mb-6">
          <label className="mb-2 block text-sm text-[#4a4a4a]">Floor:</label>
          <div className="flex">
            <button
              onClick={() => setActiveFloor('ground')}
              className={`rounded-l px-6 py-2.5 text-sm font-medium transition-colors ${
                activeFloor === 'ground'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              Ground Floor
            </button>
            <button
              onClick={() => setActiveFloor('first')}
              className={`rounded-r px-6 py-2.5 text-sm font-medium transition-colors ${
                activeFloor === 'first'
                  ? 'bg-[#003057] text-white'
                  : 'bg-gray-100 text-[#003057] hover:bg-gray-200'
              }`}
            >
              First Floor
            </button>
          </div>
        </div>

        {/* Dimensions Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="flex w-full items-center justify-between rounded bg-gray-100 px-4 py-2.5 text-sm font-medium text-[#003057] transition-colors hover:bg-gray-200 md:w-auto md:min-w-[200px]"
          >
            <span>Dimensions</span>
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${showDimensions ? 'rotate-180' : ''}`}
            />
          </button>

          {showDimensions && (
            <div className="mt-4 max-w-md overflow-hidden rounded-lg bg-gray-50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-[#003057]">Room</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#003057]">Imperial</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#003057]">Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-[#4a4a4a]">Lounge</td>
                    <td className="px-4 py-3 text-center text-[#003057]">17&apos; x 11&apos;</td>
                    <td className="px-4 py-3 text-center text-[#003057]">5.2 x 3.4</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[#4a4a4a]">Kitchen/Dining</td>
                    <td className="px-4 py-3 text-center text-[#003057]">16&apos; x 10&apos;</td>
                    <td className="px-4 py-3 text-center text-[#003057]">4.9 x 3.1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[#4a4a4a]">Principal Bedroom</td>
                    <td className="px-4 py-3 text-center text-[#003057]">13&apos; x 11&apos;</td>
                    <td className="px-4 py-3 text-center text-[#003057]">4.1 x 3.5</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[#4a4a4a]">Bedroom 2</td>
                    <td className="px-4 py-3 text-center text-[#003057]">12&apos; x 10&apos;</td>
                    <td className="px-4 py-3 text-center text-[#003057]">3.7 x 3.1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[#4a4a4a]">Bedroom 3</td>
                    <td className="px-4 py-3 text-center text-[#003057]">10&apos; x 9&apos;</td>
                    <td className="px-4 py-3 text-center text-[#003057]">3.0 x 2.7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Floorplan Image */}
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white">
          {activeFloor === 'ground' && fields.GroundFloorImage ? (
            <SitecoreImage
              field={fields.GroundFloorImage}
              className="h-auto w-full object-contain"
            />
          ) : activeFloor === 'first' && fields.FirstFloorImage ? (
            <SitecoreImage
              field={fields.FirstFloorImage}
              className="h-auto w-full object-contain"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gray-50 text-[#4a4a4a]">
              <p>Floorplan image</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-[#4a4a4a]">
          Floor plans are for illustration purposes only. They are not drawn to scale and are
          intended as a guide only. Plot specific details should be confirmed prior to reservation.
        </p>

        {/* Download Button */}
        <div className="mt-6 text-center">
          {fields.DownloadLink ? (
            <SitecoreLink
              field={fields.DownloadLink}
              className="inline-flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005ba3]"
            />
          ) : (
            <button className="inline-flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005ba3]">
              View full floorplan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
