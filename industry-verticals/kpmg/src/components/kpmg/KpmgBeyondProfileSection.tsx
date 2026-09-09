'use client';

import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ComponentProps } from '@/lib/component-props';
import {
  buildKpmgAuth0AccountProfile,
  dummyKpmgAuth0AccountProfile,
  parseMultilineOptions,
  type KpmgAuth0AccountProfile,
} from '@/lib/kpmg-auth0-account';
import { buildLoginUrl } from '@/lib/kpmg-auth0-profile';
import { logAuth0ClaimsDebugClient } from '@/lib/auth0-debug';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  defaultKpmgBeyondProfileSectionFields,
  fieldText,
  type KpmgBeyondProfileSectionFields,
  type KpmgBeyondProfileTabId,
} from './kpmg-beyond-profile-fields';
import {
  KpmgBeyondProfileAvatar,
  KpmgBeyondProfileFieldLabel,
  KpmgBeyondProfileNavItem,
  KpmgBeyondProfileReadOnlyValue,
  KpmgBeyondProfileSelect,
  KpmgBeyondProfileSubmitButton,
  KpmgBeyondProfileTextInput,
  KpmgBeyondProfileToggle,
} from './KpmgBeyondProfileUi';

export type KpmgBeyondProfileSectionProps = ComponentProps & {
  fields: KpmgBeyondProfileSectionFields;
};

async function saveProfileTab(
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch('/api/kpmg-beyond/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: body?.error || 'Save failed' };
  }

  return { ok: true };
}

function TopicChip({
  label,
  selected,
  onToggle,
  disabled,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white disabled:opacity-60',
        selected ? 'border-white bg-transparent' : 'border-transparent bg-kpmg-bgCard',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'inline-flex h-4 w-4 items-center justify-center rounded-full border',
          selected ? 'border-white text-xs' : 'border-white/50',
        ].join(' ')}
      >
        {selected ? '×' : ''}
      </span>
      {label}
    </button>
  );
}

export const Default = (props: KpmgBeyondProfileSectionProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { styles } = props.params;
  const fields = props.fields || defaultKpmgBeyondProfileSectionFields;
  const { page } = useSitecore();
  const { user, isLoading, invalidate } = useUser();
  const editingHydration = useEditingHydrationProps();
  const isEditing = Boolean(page.mode?.isEditing);

  const [activeTab, setActiveTab] = useState<KpmgBeyondProfileTabId>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<'success' | 'error' | null>(null);

  // Stable key so local edits reset only when Auth0 data actually changes (not every render).
  const profileSyncKey = useMemo(() => {
    if (isEditing) {
      return 'editing';
    }
    if (!user?.sub) {
      return 'anonymous';
    }

    const record = user as Record<string, unknown>;
    return [
      user.sub,
      user.email ?? '',
      record.given_name ?? '',
      record.family_name ?? '',
      JSON.stringify(record.user_metadata ?? {}),
    ].join('|');
  }, [isEditing, user]);

  const sourceProfile = useMemo((): KpmgAuth0AccountProfile | null => {
    if (isEditing) {
      return { ...dummyKpmgAuth0AccountProfile };
    }
    if (!user?.sub) {
      return null;
    }
    return buildKpmgAuth0AccountProfile(user);
  }, [isEditing, user]);

  const [form, setForm] = useState<KpmgAuth0AccountProfile | null>(sourceProfile);
  const [formSourceKey, setFormSourceKey] = useState(profileSyncKey);

  if (formSourceKey !== profileSyncKey) {
    setFormSourceKey(profileSyncKey);
    setForm(sourceProfile);
  }

  useEffect(() => {
    if (isEditing || isLoading) {
      return;
    }
    logAuth0ClaimsDebugClient('profile-section/useUser', user ?? null);
  }, [isEditing, isLoading, user]);

  const sectorOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.SectorOptions)),
    [fields.SectorOptions]
  );
  const turnoverOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.AnnualTurnoverOptions)),
    [fields.AnnualTurnoverOptions]
  );
  const jobRoleOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.JobRoleOptions)),
    [fields.JobRoleOptions]
  );
  const topicOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.TopicOptions)),
    [fields.TopicOptions]
  );

  const tabs = useMemo(
    () =>
      [
        { id: 'profile' as const, label: fieldText(fields.TabMyProfile, 'My profile') },
        { id: 'topics' as const, label: fieldText(fields.TabTopicPreferences, 'Topic preferences') },
        {
          id: 'notifications' as const,
          label: fieldText(fields.TabNotificationSettings, 'Notification settings'),
        },
        {
          id: 'marketing' as const,
          label: fieldText(fields.TabMarketingPreferences, 'Marketing preferences'),
        },
      ] satisfies Array<{ id: KpmgBeyondProfileTabId; label: string }>,
    [fields]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!form || isEditing) {
        return;
      }

      setIsSaving(true);
      setSaveMessage(null);

      let payload: Record<string, unknown> = { tab: activeTab };
      if (activeTab === 'profile') {
        payload = {
          tab: 'profile',
          profile: {
            firstName: form.firstName,
            lastName: form.lastName,
            company: form.company,
            sector: form.sector,
            jobRole: form.jobRole,
            businessPostcode: form.businessPostcode,
            annualTurnover: form.annualTurnover,
          },
        };
      } else if (activeTab === 'topics') {
        payload = { tab: 'topics', topicPreferences: form.topicPreferences };
      } else if (activeTab === 'notifications') {
        payload = { tab: 'notifications', notifications: form.notifications };
      } else {
        payload = { tab: 'marketing', marketing: form.marketing };
      }

      const result = await saveProfileTab(payload);
      setIsSaving(false);
      setSaveMessage(result.ok ? 'success' : 'error');

      if (result.ok) {
        await invalidate();
      }
    },
    [activeTab, form, invalidate, isEditing]
  );

  const toggleTopic = (topic: string) => {
    if (!form) {
      return;
    }
    const selected = new Set(form.topicPreferences);
    if (selected.has(topic)) {
      selected.delete(topic);
    } else {
      selected.add(topic);
    }
    setForm({ ...form, topicPreferences: [...selected] });
  };

  const updateForm = (patch: Partial<KpmgAuth0AccountProfile>) => {
    if (!form) {
      return;
    }
    setForm({ ...form, ...patch });
  };

  const notAvailable = fieldText(fields.NotAvailableText, 'N/A');
  const submitLabel = fieldText(fields.SubmitButtonLabel, 'Submit');
  const savingLabel = fieldText(fields.SavingLabel, 'Saving…');

  return (
    <section
      key={id ?? props.rendering?.uid}
      {...editingHydration}
      id={id}
      data-cy="profile-section"
      className={['component kpmg-beyond-profile w-full px-5 py-8 text-white xl:px-[60px]', styles || ''].join(' ')}
    >
      <Text tag="h1" field={fields.PageTitle} className="m-0 text-4xl font-semibold text-white" />
      <Text tag="p" field={fields.PageIntro} className="mt-3 max-w-3xl text-base text-white/80" />

      {isEditing ? (
        <p className="mt-3 text-sm text-white/60">Editing preview — sample account data is shown below.</p>
      ) : null}

      {isLoading && !isEditing ? <p className="mt-8 text-sm text-white/70">Loading profile…</p> : null}

      {!isLoading && !form && !isEditing ? (
        <div className="mt-8 space-y-4">
          <Text tag="p" field={fields.SignInPrompt} className="m-0 text-base text-white/80" />
          <a
            href={buildLoginUrl('/profile')}
            className="inline-flex rounded-full bg-kpmg-purple px-8 py-3 text-sm font-semibold text-white no-underline hover:opacity-90"
          >
            <Text tag="span" field={fields.SignInButtonLabel} />
          </a>
        </div>
      ) : null}

      {form ? (
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
          <nav className="w-full shrink-0 lg:w-[320px]" aria-label="Account sections">
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <KpmgBeyondProfileNavItem
                  key={tab.id}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSaveMessage(null);
                  }}
                />
              ))}
            </div>
          </nav>

          <form onSubmit={handleSubmit} className="min-w-0 flex-1">
            {activeTab === 'profile' ? (
              <div>
                <Text
                  tag="h2"
                  field={fields.ProfileSectionTitle}
                  className="m-0 text-3xl font-semibold text-white"
                />
                <Text tag="p" field={fields.ProfileIntro} className="mt-4 max-w-3xl text-sm text-white/75" />

                <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <KpmgBeyondProfileAvatar firstName={form.firstName} lastName={form.lastName} />
                  <div>
                    <button
                      type="button"
                      disabled={isEditing}
                      className="rounded-full bg-kpmg-purple px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      <Text tag="span" field={fields.ManagePhotoLabel} />
                    </button>
                    <Text tag="p" field={fields.PhotoHint} className="mt-2 text-xs text-white/60" />
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.FirstNameLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileReadOnlyValue>{form.firstName || notAvailable}</KpmgBeyondProfileReadOnlyValue>
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.LastNameLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileReadOnlyValue>{form.lastName || notAvailable}</KpmgBeyondProfileReadOnlyValue>
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.BusinessEmailLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileReadOnlyValue>{form.email || notAvailable}</KpmgBeyondProfileReadOnlyValue>
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.PhoneNumberLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileReadOnlyValue>{form.phoneNumber || notAvailable}</KpmgBeyondProfileReadOnlyValue>
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.CompanyLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileTextInput
                      value={form.company}
                      disabled={isEditing}
                      onChange={(company) => updateForm({ company })}
                    />
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.SectorLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileSelect
                      value={form.sector}
                      options={sectorOptions}
                      disabled={isEditing}
                      placeholder="Select sector"
                      onChange={(sector) => updateForm({ sector })}
                    />
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.JobRoleLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileSelect
                      value={form.jobRole}
                      options={jobRoleOptions}
                      disabled={isEditing}
                      placeholder="Select Role"
                      onChange={(jobRole) => updateForm({ jobRole })}
                    />
                  </div>
                  <div>
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.BusinessPostcodeLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileTextInput
                      value={form.businessPostcode}
                      disabled={isEditing}
                      onChange={(businessPostcode) => updateForm({ businessPostcode })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <KpmgBeyondProfileFieldLabel>
                      <Text tag="span" field={fields.AnnualTurnoverLabel} />
                    </KpmgBeyondProfileFieldLabel>
                    <KpmgBeyondProfileSelect
                      value={form.annualTurnover}
                      options={turnoverOptions}
                      disabled={isEditing}
                      placeholder="Select annual turnover"
                      onChange={(annualTurnover) => updateForm({ annualTurnover })}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'topics' ? (
              <div>
                <Text
                  tag="h2"
                  field={fields.TopicSectionTitle}
                  className="m-0 text-3xl font-semibold text-white"
                />
                <Text tag="p" field={fields.TopicIntro} className="mt-4 max-w-3xl text-sm text-white/75" />

                <div className="mt-8">
                  <Text tag="h3" field={fields.YourSelectionLabel} className="m-0 text-xl font-semibold text-white" />
                  <div className="mt-4 flex flex-wrap gap-3">
                    {form.topicPreferences.map((topic) => (
                      <TopicChip
                        key={topic}
                        label={topic}
                        selected
                        disabled={isEditing}
                        onToggle={() => toggleTopic(topic)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Text tag="h3" field={fields.MoreTopicsLabel} className="m-0 text-xl font-semibold text-white" />
                  <div className="mt-4 flex flex-wrap gap-3">
                    {topicOptions
                      .filter((topic) => !form.topicPreferences.includes(topic))
                      .map((topic) => (
                        <TopicChip
                          key={topic}
                          label={topic}
                          selected={false}
                          disabled={isEditing}
                          onToggle={() => toggleTopic(topic)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'notifications' ? (
              <div>
                <Text
                  tag="h2"
                  field={fields.NotificationSectionTitle}
                  className="m-0 text-3xl font-semibold text-white"
                />
                <div className="mt-6 border-b border-white/15">
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.ReceiveEmailNotificationsLabel)}
                    checked={form.notifications.emailEnabled}
                    disabled={isEditing}
                    onChange={(emailEnabled) =>
                      updateForm({ notifications: { ...form.notifications, emailEnabled } })
                    }
                  />
                </div>
                <Text tag="p" field={fields.NotificationIntro} className="mt-6 text-sm text-white/75" />
                <div className="divide-y divide-white/15">
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.NotifyMentionedLabel)}
                    checked={form.notifications.mentionedInPost}
                    disabled={isEditing}
                    onChange={(mentionedInPost) =>
                      updateForm({ notifications: { ...form.notifications, mentionedInPost } })
                    }
                  />
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.NotifyReplyLabel)}
                    checked={form.notifications.replyToMessage}
                    disabled={isEditing}
                    onChange={(replyToMessage) =>
                      updateForm({ notifications: { ...form.notifications, replyToMessage } })
                    }
                  />
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.NotifyDiscussionLabel)}
                    checked={form.notifications.newDiscussion}
                    disabled={isEditing}
                    onChange={(newDiscussion) =>
                      updateForm({ notifications: { ...form.notifications, newDiscussion } })
                    }
                  />
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.NotifyLikesLabel)}
                    checked={form.notifications.messageLiked}
                    disabled={isEditing}
                    onChange={(messageLiked) =>
                      updateForm({ notifications: { ...form.notifications, messageLiked } })
                    }
                  />
                  <KpmgBeyondProfileToggle
                    label={fieldText(fields.NotifyDeclinedLabel)}
                    checked={form.notifications.applicationDeclined}
                    disabled={isEditing}
                    onChange={(applicationDeclined) =>
                      updateForm({ notifications: { ...form.notifications, applicationDeclined } })
                    }
                  />
                </div>
              </div>
            ) : null}

            {activeTab === 'marketing' ? (
              <div>
                <Text
                  tag="h2"
                  field={fields.MarketingSectionTitle}
                  className="m-0 text-3xl font-semibold text-white"
                />
                <div className="mt-6 space-y-2 divide-y divide-white/15">
                  <div className="pb-4">
                    <KpmgBeyondProfileToggle
                      label={fieldText(fields.SubscribeEmailsLabel)}
                      checked={form.marketing.subscribeEmails}
                      disabled={isEditing}
                      onChange={(subscribeEmails) =>
                        updateForm({ marketing: { ...form.marketing, subscribeEmails } })
                      }
                    />
                    <Text tag="p" field={fields.SubscribeEmailsDescription} className="text-sm text-white/60" />
                  </div>
                  <div className="py-4">
                    <KpmgBeyondProfileToggle
                      label={fieldText(fields.MarketingEmailsLabel)}
                      checked={form.marketing.marketingEmails}
                      disabled={isEditing}
                      onChange={(marketingEmails) =>
                        updateForm({ marketing: { ...form.marketing, marketingEmails } })
                      }
                    />
                    <Text tag="p" field={fields.MarketingEmailsDescription} className="text-sm text-white/60" />
                  </div>
                  <div className="py-4">
                    <KpmgBeyondProfileToggle
                      label={fieldText(fields.NewslettersLabel)}
                      checked={form.marketing.newsletters}
                      disabled={isEditing}
                      onChange={(newsletters) => updateForm({ marketing: { ...form.marketing, newsletters } })}
                    />
                    <Text tag="p" field={fields.NewslettersDescription} className="text-sm text-white/60" />
                  </div>
                  <div className="py-4">
                    <KpmgBeyondProfileToggle
                      label={fieldText(fields.MarketingNotificationEmailsLabel)}
                      checked={form.marketing.notificationEmails}
                      disabled={isEditing}
                      onChange={(notificationEmails) =>
                        updateForm({ marketing: { ...form.marketing, notificationEmails } })
                      }
                    />
                    <Text
                      tag="p"
                      field={fields.MarketingNotificationEmailsDescription}
                      className="text-sm text-white/60"
                    />
                  </div>
                </div>
                <div className="mt-8 border-t border-white/15 pt-6">
                  <Text tag="p" field={fields.MarketingFooterTitle} className="m-0 text-sm font-semibold text-white" />
                  <Text tag="p" field={fields.MarketingFooterText} className="mt-2 text-sm text-white/70" />
                </div>
              </div>
            ) : null}

            {!isEditing ? (
              <>
                <KpmgBeyondProfileSubmitButton
                  label={submitLabel}
                  savingLabel={savingLabel}
                  isSaving={isSaving}
                />
                {saveMessage === 'success' ? (
                  <Text tag="p" field={fields.SaveSuccessMessage} className="mt-3 text-sm text-kpmg-label" />
                ) : null}
                {saveMessage === 'error' ? (
                  <Text tag="p" field={fields.SaveErrorMessage} className="mt-3 text-sm text-red-300" />
                ) : null}
              </>
            ) : null}
          </form>
        </div>
      ) : null}
    </section>
  );
};
