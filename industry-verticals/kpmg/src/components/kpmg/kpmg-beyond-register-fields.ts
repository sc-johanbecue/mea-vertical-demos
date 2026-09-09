import type { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import {
  joinMultilineOptions,
  kpmgBeyondAnnualTurnoverOptions,
  kpmgBeyondJobRoleOptions,
  kpmgBeyondSectorOptions,
} from './kpmg-beyond-profile-options';

export interface KpmgBeyondRegisterFields {
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

export const defaultKpmgBeyondRegisterFields: KpmgBeyondRegisterFields = {
  PageTitle: { value: 'Create an account' },
  PageIntro: {
    value: 'Join Beyond for free access to expertise, events, and personalised content.',
  },
  LoginPrompt: { value: 'Already have an account?' },
  LoginLink: { value: { href: '/auth/login', text: 'Login' } },
  FirstNameLabel: { value: 'First name' },
  LastNameLabel: { value: 'Last name' },
  EmailLabel: { value: 'Business email address' },
  PasswordLabel: { value: 'Password' },
  ConfirmPasswordLabel: { value: 'Confirm password' },
  CompanyLabel: { value: 'Company' },
  SectorLabel: { value: 'Sector' },
  JobRoleLabel: { value: 'Role' },
  BusinessPostcodeLabel: { value: 'Business postcode' },
  AnnualTurnoverLabel: { value: 'Annual turnover' },
  TopicsSectionTitle: { value: 'Topic preferences' },
  TopicsIntro: {
    value: 'Select three or more topics to personalise your Beyond experience.',
  },
  TopicOptions: {
    value:
      'Cyber Security\nDigital Transformation\nLeadership and Personal Development\nLegal\nOperational Resilience\nPublic Service and Policy\nFunding Investment and Acquisitions\nGrowth and Internationalisation\nStrategy and Planning\nTax\nWorkforce\nSustainability',
  },
  TermsLabel: {
    value: 'I agree to the Terms of Use and Privacy Policy.',
  },
  MarketingLabel: {
    value: 'I would like to receive marketing communications from KPMG.',
  },
  CaptchaImage: { value: { src: '', alt: 'Captcha placeholder' } },
  SubmitButtonLabel: { value: 'Create an account' },
  SubmittingLabel: { value: 'Creating account…' },
  ErrorMessage: { value: 'We could not create your account. Please check your details and try again.' },
  SuccessMessage: {
    value: 'Your account has been created. You can now sign in.',
  },
  SectorOptions: { value: joinMultilineOptions(kpmgBeyondSectorOptions) },
  JobRoleOptions: { value: joinMultilineOptions(kpmgBeyondJobRoleOptions) },
  AnnualTurnoverOptions: { value: joinMultilineOptions(kpmgBeyondAnnualTurnoverOptions) },
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
