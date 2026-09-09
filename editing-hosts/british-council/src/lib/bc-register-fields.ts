import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import {
  bcRegisterAnnualTurnoverOptions,
  bcRegisterJobRoleOptions,
  bcRegisterSectorOptions,
  joinMultilineOptions,
} from './bc-register-options';

export interface BcRegisterFields {
  PageTitle: TextField;
  PageIntro: TextField;
  LoginPrompt: TextField;
  LoginLink: LinkField;
  FirstNameLabel: TextField;
  LastNameLabel: TextField;
  EmailLabel: TextField;
  PasswordLabel: TextField;
  ConfirmPasswordLabel: TextField;
  CompanyLabel: TextField;
  SectorLabel: TextField;
  JobRoleLabel: TextField;
  BusinessPostcodeLabel: TextField;
  AnnualTurnoverLabel: TextField;
  TopicsSectionTitle: TextField;
  TopicsIntro: TextField;
  TopicOptions: TextField;
  TermsLabel: TextField;
  MarketingLabel: TextField;
  CaptchaImage: ImageField;
  SubmitButtonLabel: TextField;
  SubmittingLabel: TextField;
  ErrorMessage: TextField;
  SuccessMessage: TextField;
  SectorOptions: TextField;
  JobRoleOptions: TextField;
  AnnualTurnoverOptions: TextField;
}

export const defaultBcRegisterFields: BcRegisterFields = {
  PageTitle: { value: 'Create an account' },
  PageIntro: {
    value: 'Register for free access to the British Council Digital Library and learning resources.',
  },
  LoginPrompt: { value: 'Already have an account?' },
  LoginLink: { value: { href: '/auth/login', text: 'Login' } },
  FirstNameLabel: { value: 'First name' },
  LastNameLabel: { value: 'Last name' },
  EmailLabel: { value: 'Email address' },
  PasswordLabel: { value: 'Password' },
  ConfirmPasswordLabel: { value: 'Confirm password' },
  CompanyLabel: { value: 'Organisation' },
  SectorLabel: { value: 'Sector' },
  JobRoleLabel: { value: 'Role' },
  BusinessPostcodeLabel: { value: 'Postcode' },
  AnnualTurnoverLabel: { value: 'Organisation size' },
  TopicsSectionTitle: { value: 'Topic preferences' },
  TopicsIntro: {
    value: 'Select topics to personalise your library experience.',
  },
  TopicOptions: {
    value:
      'English learning\nAudiobooks\nFiction\nMagazines\nNewspapers\nComics\nMovies\nExams and assessment\nTeaching resources\nArts and culture',
  },
  TermsLabel: {
    value: 'I agree to the Terms of Use and Privacy Policy.',
  },
  MarketingLabel: {
    value: 'I would like to receive communications from the British Council.',
  },
  CaptchaImage: { value: { src: '', alt: 'Captcha placeholder' } },
  SubmitButtonLabel: { value: 'Create an account' },
  SubmittingLabel: { value: 'Creating account…' },
  ErrorMessage: { value: 'We could not create your account. Please check your details and try again.' },
  SuccessMessage: {
    value: 'Your account has been created. You can now sign in.',
  },
  SectorOptions: { value: joinMultilineOptions(bcRegisterSectorOptions) },
  JobRoleOptions: { value: joinMultilineOptions(bcRegisterJobRoleOptions) },
  AnnualTurnoverOptions: { value: joinMultilineOptions(bcRegisterAnnualTurnoverOptions) },
};

export function fieldText(field: TextField | undefined, fallback = ''): string {
  return field?.value?.toString().trim() || fallback;
}

export function parseMultilineOptions(value: string): string[] {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}
