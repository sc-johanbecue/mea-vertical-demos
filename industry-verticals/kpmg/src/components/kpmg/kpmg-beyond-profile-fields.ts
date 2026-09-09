import { TextField } from '@sitecore-content-sdk/nextjs';
import {
  joinMultilineOptions,
  kpmgBeyondAnnualTurnoverOptions,
  kpmgBeyondJobRoleOptions,
  kpmgBeyondSectorOptions,
} from './kpmg-beyond-profile-options';

export type KpmgBeyondProfileTabId = 'profile' | 'topics' | 'notifications' | 'marketing';

export interface KpmgBeyondProfileSectionFields {
  PageTitle: TextField;
  PageIntro: TextField;
  TabMyProfile: TextField;
  TabTopicPreferences: TextField;
  TabNotificationSettings: TextField;
  TabMarketingPreferences: TextField;
  ProfileSectionTitle: TextField;
  ProfileIntro: TextField;
  ManagePhotoLabel: TextField;
  PhotoHint: TextField;
  FirstNameLabel: TextField;
  LastNameLabel: TextField;
  BusinessEmailLabel: TextField;
  PhoneNumberLabel: TextField;
  CompanyLabel: TextField;
  SectorLabel: TextField;
  JobRoleLabel: TextField;
  JobRoleOptions: TextField;
  BusinessPostcodeLabel: TextField;
  AnnualTurnoverLabel: TextField;
  NotAvailableText: TextField;
  SectorOptions: TextField;
  AnnualTurnoverOptions: TextField;
  TopicSectionTitle: TextField;
  TopicIntro: TextField;
  YourSelectionLabel: TextField;
  MoreTopicsLabel: TextField;
  TopicOptions: TextField;
  NotificationSectionTitle: TextField;
  ReceiveEmailNotificationsLabel: TextField;
  NotificationIntro: TextField;
  NotifyMentionedLabel: TextField;
  NotifyReplyLabel: TextField;
  NotifyDiscussionLabel: TextField;
  NotifyLikesLabel: TextField;
  NotifyDeclinedLabel: TextField;
  MarketingSectionTitle: TextField;
  SubscribeEmailsLabel: TextField;
  SubscribeEmailsDescription: TextField;
  MarketingEmailsLabel: TextField;
  MarketingEmailsDescription: TextField;
  NewslettersLabel: TextField;
  NewslettersDescription: TextField;
  MarketingNotificationEmailsLabel: TextField;
  MarketingNotificationEmailsDescription: TextField;
  MarketingFooterTitle: TextField;
  MarketingFooterText: TextField;
  MarketingFooterLinkText: TextField;
  SubmitButtonLabel: TextField;
  SignInPrompt: TextField;
  SignInButtonLabel: TextField;
  SavingLabel: TextField;
  SaveSuccessMessage: TextField;
  SaveErrorMessage: TextField;
}

export const defaultKpmgBeyondProfileSectionFields: KpmgBeyondProfileSectionFields = {
  PageTitle: { value: 'My Account' },
  PageIntro: { value: 'View and update your details, preferences, and settings.' },
  TabMyProfile: { value: 'My profile' },
  TabTopicPreferences: { value: 'Topic preferences' },
  TabNotificationSettings: { value: 'Notification settings' },
  TabMarketingPreferences: { value: 'Marketing preferences' },
  ProfileSectionTitle: { value: 'My profile' },
  ProfileIntro: {
    value:
      'Please note that you can only edit some of your details by yourself. To make any other changes to your personal information please contact us.',
  },
  ManagePhotoLabel: { value: 'Manage Photo' },
  PhotoHint: { value: 'JPG or PNG. Max size of 8 MB' },
  FirstNameLabel: { value: 'First name' },
  LastNameLabel: { value: 'Last name' },
  BusinessEmailLabel: { value: 'Business email address' },
  PhoneNumberLabel: { value: 'Phone number' },
  CompanyLabel: { value: 'Company' },
  SectorLabel: { value: 'Sector' },
  JobRoleLabel: { value: 'Role' },
  JobRoleOptions: {
    value: joinMultilineOptions(kpmgBeyondJobRoleOptions),
  },
  BusinessPostcodeLabel: { value: 'Business Postcode' },
  AnnualTurnoverLabel: { value: 'Annual Turnover' },
  NotAvailableText: { value: 'N/A' },
  SectorOptions: {
    value: joinMultilineOptions(kpmgBeyondSectorOptions),
  },
  AnnualTurnoverOptions: {
    value: joinMultilineOptions(kpmgBeyondAnnualTurnoverOptions),
  },
  TopicSectionTitle: { value: 'Topic preferences' },
  TopicIntro: {
    value:
      'Please select 3 or more topics you’re interested in to help personalise your Beyond experience.',
  },
  YourSelectionLabel: { value: 'Your Selection' },
  MoreTopicsLabel: { value: 'More Topics' },
  TopicOptions: {
    value:
      'Cyber Security\nDigital Transformation\nLeadership and Personal Development\nLegal\nOperational Resilience\nPublic Service and Policy\nFunding Investment and Acquisitions\nGrowth and Internationalisation\nStrategy and Planning\nTax\nWorkforce\nSustainability',
  },
  NotificationSectionTitle: { value: 'Notification settings' },
  ReceiveEmailNotificationsLabel: { value: 'Receive email notifications' },
  NotificationIntro: {
    value: 'I would like to be notified by email when the following actions occur.',
  },
  NotifyMentionedLabel: { value: "I'm mentioned in a post" },
  NotifyReplyLabel: { value: 'Someone replies to my message' },
  NotifyDiscussionLabel: { value: 'New discussion in my community' },
  NotifyLikesLabel: { value: 'Someone likes my message' },
  NotifyDeclinedLabel: { value: 'My community application has been declined' },
  MarketingSectionTitle: { value: 'Marketing preferences' },
  SubscribeEmailsLabel: { value: 'Subscribe to emails' },
  SubscribeEmailsDescription: { value: 'Tell us what you would like to receive.' },
  MarketingEmailsLabel: { value: 'Marketing emails' },
  MarketingEmailsDescription: {
    value: 'By switching off this area you will no longer receive marketing emails from Beyond.',
  },
  NewslettersLabel: { value: 'Beyond newsletters' },
  NewslettersDescription: {
    value: 'Receive updates on new contents, events & assessments.',
  },
  MarketingNotificationEmailsLabel: { value: 'Notification emails' },
  MarketingNotificationEmailsDescription: {
    value: 'Receive daily updates about likes, new discussions, replies and more.',
  },
  MarketingFooterTitle: { value: 'KPMG' },
  MarketingFooterText: {
    value: 'If you wish to change your KPMG Beyond email preferences click here.',
  },
  MarketingFooterLinkText: { value: 'click here' },
  SubmitButtonLabel: { value: 'Submit' },
  SignInPrompt: { value: 'Sign in to view and update your account settings.' },
  SignInButtonLabel: { value: 'Sign in' },
  SavingLabel: { value: 'Saving…' },
  SaveSuccessMessage: { value: 'Your profile has been updated.' },
  SaveErrorMessage: { value: 'Unable to save your changes. Please try again.' },
};

export function fieldText(field: TextField | undefined, fallback = ''): string {
  return field?.value?.toString?.() || fallback;
}
