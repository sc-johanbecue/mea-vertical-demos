'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  Text,
  RichText,
  Link as SitecoreLink,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, Navigation, Share2, Calendar, MessageSquare, Download } from 'lucide-react';

/**
 * DevelopmentInfoSection Component
 * Main info section for development pages with title, address, register interest, and contact
 *
 * Two-column layout:
 * - Left: Development name, address, directions, share, register interest, description
 * - Right: Opening hours, contact buttons, brochure download
 */

interface Fields {
  /** Development name */
  Name: TextField;
  /** Address */
  Address: TextField;
  /** Get directions link */
  DirectionsLink: LinkField;
  /** Section heading (e.g., "Register Your Interest Today") */
  RegisterHeading: TextField;
  /** Release info heading */
  ReleaseHeading: TextField;
  /** Main description */
  Description: RichTextField;
  /** Read more link */
  ReadMoreLink: LinkField;
  /** Opening hours heading */
  OpeningHoursHeading: TextField;
  /** Weekday hours */
  WeekdayHours: TextField;

  /** Weekend hours */
  WeekendHours: TextField;
  /** Call button link */
  CallLink: LinkField;
  /** Appointment button link */
  AppointmentLink: LinkField;
  /** Question button link */
  QuestionLink: LinkField;
  /** WhatsApp link */
  WhatsAppLink: LinkField;
  /** Brochure download link */
  BrochureLink: LinkField;
  /** Personalised brochure link */
  PersonalisedBrochureLink: LinkField;
}

export type DevelopmentInfoSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: DevelopmentInfoSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const { fields } = props;

  return (
    <div className={`component development-info-section bg-white py-8 ${styles || ''}`} id={id}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left Column */}
          <div className="flex-1">
            {/* Title */}
            {fields.Name && (
              <h1 className="mb-3 text-3xl font-bold text-[#003057] md:text-4xl">
                <Text field={fields.Name} />
              </h1>
            )}

            {/* Address & Actions */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
              {fields.Address && (
                <span className="text-foreground-light">
                  <Text field={fields.Address} />
                </span>
              )}
              {fields.DirectionsLink && (
                <SitecoreLink
                  field={fields.DirectionsLink}
                  className="flex items-center gap-1 text-[#0072CE] hover:underline"
                >
                  <Navigation className="h-4 w-4" />
                </SitecoreLink>
              )}
              <button className="flex items-center gap-1 text-[#0072CE] hover:underline">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Register Interest Heading */}
            {fields.RegisterHeading && (
              <h2 className="mb-2 text-xl font-bold text-[#003057]">
                <Text field={fields.RegisterHeading} />
              </h2>
            )}

            {/* Release Heading */}
            {fields.ReleaseHeading && (
              <h3 className="mb-4 text-lg font-semibold text-[#0072CE]">
                <Text field={fields.ReleaseHeading} />
              </h3>
            )}

            {/* Description */}
            {fields.Description && (
              <RichText
                tag="div"
                field={fields.Description}
                className="prose prose-sm text-foreground-light mb-4 max-w-none [&_a]:text-[#0072CE]"
              />
            )}

            {/* Read More */}
            {fields.ReadMoreLink && (
              <SitecoreLink
                field={fields.ReadMoreLink}
                className="text-sm font-medium text-[#0072CE] hover:underline"
              />
            )}
          </div>

          {/* Right Column */}
          <div className="shrink-0 lg:w-[320px]">
            {/* Opening Hours */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-[#003057]">
                {fields.OpeningHoursHeading ? (
                  <Text field={fields.OpeningHoursHeading} />
                ) : (
                  'Our opening hours are:'
                )}
              </h4>
              <div className="text-foreground-light space-y-1 text-sm">
                {fields.WeekdayHours && (
                  <p>
                    <strong>Monday - Friday:</strong> <Text field={fields.WeekdayHours} />
                  </p>
                )}
                {fields.WeekendHours && (
                  <p>
                    <strong>Saturday & Sunday:</strong> <Text field={fields.WeekendHours} />
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Register for updates */}
              <button className="flex w-full items-center justify-center gap-2 rounded bg-[#0072CE] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005ba3]">
                <MapPin className="h-4 w-4" />
                Register for updates
              </button>

              {/* Book appointment */}
              {fields.AppointmentLink ? (
                <SitecoreLink
                  field={fields.AppointmentLink}
                  className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white"
                />
              ) : (
                <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                  <Calendar className="h-4 w-4" />
                  Book an appointment
                </button>
              )}

              {/* Ask a question */}
              <button className="flex w-full items-center justify-center gap-2 rounded border border-[#003057] bg-transparent px-4 py-3 text-sm font-medium text-[#003057] transition-colors hover:bg-[#003057] hover:text-white">
                <MessageSquare className="h-4 w-4" />
                Ask a Question
              </button>

              {/* WhatsApp */}
              <button className="flex w-full items-center justify-center gap-2 rounded border border-[#25D366] bg-transparent px-4 py-3 text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white">
                <MessageSquare className="h-4 w-4" />
                Launch WhatsApp
              </button>
            </div>

            {/* Downloads */}
            <div className="mt-6 space-y-2">
              <button className="flex items-center gap-2 text-sm font-medium text-[#003057] transition-colors hover:text-[#0072CE]">
                <Download className="h-4 w-4" />
                Download Brochure
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-[#003057] transition-colors hover:text-[#0072CE]">
                <Download className="h-4 w-4" />
                Create Personalised Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
