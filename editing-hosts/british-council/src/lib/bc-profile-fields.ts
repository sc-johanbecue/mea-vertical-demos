import type { TextField } from '@sitecore-content-sdk/nextjs';
import {
  bcRegisterAnnualTurnoverOptions,
  bcRegisterJobRoleOptions,
  bcRegisterSectorOptions,
  joinMultilineOptions,
} from './bc-register-options';
import { fieldText, parseMultilineOptions } from './bc-register-fields';

export { fieldText, parseMultilineOptions };

export interface BcProfileFields {
  PageTitle: TextField;
  PageIntro: TextField;
  SignInPrompt: TextField;
  SignInButtonLabel: TextField;
  FirstNameLabel: TextField;
  LastNameLabel: TextField;
  EmailLabel: TextField;
  CompanyLabel: TextField;
  SectorLabel: TextField;
  JobRoleLabel: TextField;
  BusinessPostcodeLabel: TextField;
  AnnualTurnoverLabel: TextField;
  TopicsSectionTitle: TextField;
  TopicsIntro: TextField;
  TopicOptions: TextField;
  MarketingLabel: TextField;
  SubmitButtonLabel: TextField;
  SubmittingLabel: TextField;
  ErrorMessage: TextField;
  SuccessMessage: TextField;
  SectorOptions: TextField;
  JobRoleOptions: TextField;
  AnnualTurnoverOptions: TextField;
}

export const defaultBcProfileFields: BcProfileFields = {
  PageTitle: { value: 'My Account' },
  PageIntro: {
    value: 'Update your organisation details and topic preferences for the Digital Library.',
  },
  SignInPrompt: { value: 'Sign in to manage your account.' },
  SignInButtonLabel: { value: 'Sign in' },
  FirstNameLabel: { value: 'First name' },
  LastNameLabel: { value: 'Last name' },
  EmailLabel: { value: 'Email address' },
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
  MarketingLabel: {
    value: 'I would like to receive communications from the British Council.',
  },
  SubmitButtonLabel: { value: 'Save changes' },
  SubmittingLabel: { value: 'Saving…' },
  ErrorMessage: { value: 'We could not save your changes. Please try again.' },
  SuccessMessage: { value: 'Your account has been updated.' },
  SectorOptions: { value: joinMultilineOptions(bcRegisterSectorOptions) },
  JobRoleOptions: { value: joinMultilineOptions(bcRegisterJobRoleOptions) },
  AnnualTurnoverOptions: { value: joinMultilineOptions(bcRegisterAnnualTurnoverOptions) },
};
