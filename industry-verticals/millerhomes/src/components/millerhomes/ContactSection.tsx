'use client';

import type { JSX } from 'react';
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
  Text,
  RichText,
  Link as SitecoreLink,
  Image as SitecoreImage,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { MapPin, Phone, Calendar, Download, MessageSquare } from 'lucide-react';

/**
 * ContactSection Component
 * "Visit us anytime, no appointment needed" contact section
 *
 * Features:
 * - Large background image
 * - Opening hours
 * - Address with directions
 * - Contact buttons (call, appointment, brochure)
 */

interface Fields {
  /** Section title */
  Title: TextField;
  /** Subtitle */
  Subtitle: TextField;
  /** Opening hours text */
  OpeningHours: RichTextField;
  /** Address */
  Address: TextField;
  /** Get directions link */
  DirectionsLink: LinkField;
  /** Phone link */
  PhoneLink: LinkField;
  /** Ask question link */
  QuestionLink: LinkField;
  /** Brochure download link */
  BrochureLink: LinkField;
  /** Personalised brochure link */
  PersonalisedBrochureLink: LinkField;
  /** Appointment link */
  AppointmentLink: LinkField;
  /** Background image */
  BackgroundImage: ImageField;
  /** Dictionary key: Contact_OpeningHoursHeading */
  OpeningHoursHeading: TextField;
  /** Dictionary key: Contact_GetDirections */
  GetDirectionsText: TextField;
  /** Dictionary key: Contact_AskQuestion */
  AskQuestionText: TextField;
  /** Dictionary key: Contact_DownloadBrochure */
  DownloadBrochureText: TextField;
  /** Dictionary key: Contact_CreatePersonalisedBrochure */
  CreatePersonalisedBrochureText: TextField;
  /** Dictionary key: Contact_BookAppointment */
  BookAppointmentText: TextField;
  /** Phone display text */
  PhoneDisplayText: TextField;
}

const defaultFields: Fields = {
  Title: { value: 'Visit us anytime,' },
  Subtitle: { value: 'no appointment needed.' },
  OpeningHours: {
    value:
      '<p><strong>Monday - Friday:</strong> 10.30am to 5.30pm</p><p><strong>Saturday & Sunday:</strong> 10.30am to 5.30pm</p>',
  },
  Address: { value: 'Coventry Lane, Bramcote, Nottingham, NG9 3GJ' },
  DirectionsLink: { value: { href: '#directions' } },
  PhoneLink: { value: { href: 'tel:+441onal' } },
  QuestionLink: { value: { href: '/contact' } },
  BrochureLink: { value: { href: '/brochure' } },
  PersonalisedBrochureLink: { value: { href: '/personalised-brochure' } },
  AppointmentLink: { value: { href: '/book-appointment' } },
  BackgroundImage: { value: { src: '', alt: 'Contact Background' } },
  OpeningHoursHeading: { value: 'Our opening hours are:' },
  GetDirectionsText: { value: 'Get Directions' },
  AskQuestionText: { value: 'Ask a Question' },
  DownloadBrochureText: { value: 'Download Brochure' },
  CreatePersonalisedBrochureText: { value: 'Create Personalised Brochure' },
  BookAppointmentText: { value: 'Book an appointment' },
  PhoneDisplayText: { value: '01234567890' },
};

export type ContactSectionProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: ContactSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultFields;

  return (
    <div className={`component contact-section relative py-16 md:py-24 ${styles || ''}`} id={id}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <SitecoreImage field={fields.BackgroundImage} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#003057]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Title */}
          <h2 className="mb-2 text-3xl font-light text-white md:text-4xl lg:text-5xl">
            <Text field={fields.Title} />
          </h2>
          <p className="mb-8 text-2xl font-bold text-white md:text-3xl">
            <Text field={fields.Subtitle} />
          </p>

          {/* Opening Hours */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">
              <Text field={fields.OpeningHoursHeading} />
            </h3>
            <div className="text-sm text-white/80">
              <RichText field={fields.OpeningHours} />
            </div>
          </div>

          {/* Address */}
          <p className="mb-6 text-sm text-white/80">
            <Text field={fields.Address} />
          </p>

          {/* Action Buttons Row 1 */}
          <div className="mb-4 flex flex-wrap gap-3">
            <SitecoreLink
              field={fields.DirectionsLink}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" />
              <Text field={fields.GetDirectionsText} />
            </SitecoreLink>
            <SitecoreLink
              field={fields.PhoneLink}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              <Text field={fields.PhoneDisplayText} />
            </SitecoreLink>
            <SitecoreLink
              field={fields.QuestionLink}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <MessageSquare className="h-4 w-4" />
              <Text field={fields.AskQuestionText} />
            </SitecoreLink>
          </div>

          {/* Action Buttons Row 2 */}
          <div className="mb-6 flex flex-wrap gap-3">
            <SitecoreLink
              field={fields.BrochureLink}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              <Text field={fields.DownloadBrochureText} />
            </SitecoreLink>
            <SitecoreLink
              field={fields.PersonalisedBrochureLink}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              <Text field={fields.CreatePersonalisedBrochureText} />
            </SitecoreLink>
          </div>

          {/* Book Appointment */}
          <SitecoreLink
            field={fields.AppointmentLink}
            className="flex items-center gap-2 rounded bg-[#0072CE] px-6 py-3 font-medium text-white transition-colors hover:bg-[#005ba3]"
          >
            <Calendar className="h-5 w-5" />
            <Text field={fields.BookAppointmentText} />
          </SitecoreLink>
        </div>
      </div>
    </div>
  );
};
