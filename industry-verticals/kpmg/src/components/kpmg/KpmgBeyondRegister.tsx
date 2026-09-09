'use client';

import type { FormEvent, JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Image, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { buildLoginUrl } from '@/lib/kpmg-auth0-profile';
import { useEditingHydrationProps } from './kpmg-editing-hydration';
import {
  defaultKpmgBeyondRegisterFields,
  fieldText,
  parseMultilineOptions,
  type KpmgBeyondRegisterFields,
} from './kpmg-beyond-register-fields';
import {
  KpmgBeyondProfileFieldLabel,
  KpmgBeyondProfileSelect,
  KpmgBeyondProfileSubmitButton,
  KpmgBeyondProfileTextInput,
  KpmgBeyondProfileToggle,
} from './KpmgBeyondProfileUi';

export type KpmgBeyondRegisterProps = ComponentProps & {
  fields: KpmgBeyondRegisterFields;
};

type RegisterFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  sector: string;
  jobRole: string;
  businessPostcode: string;
  annualTurnover: string;
  topicPreferences: string[];
  acceptTerms: boolean;
  marketingOptIn: boolean;
};

const emptyForm: RegisterFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  company: '',
  sector: '',
  jobRole: '',
  businessPostcode: '',
  annualTurnover: '',
  topicPreferences: [],
  acceptTerms: false,
  marketingOptIn: false,
};

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
        selected ? 'border-white bg-transparent' : 'border-transparent bg-kpmg-card',
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

export const Default = (props: KpmgBeyondRegisterProps): JSX.Element => {
  const fields = props.fields || defaultKpmgBeyondRegisterFields;
  const editingHydration = useEditingHydrationProps();
  const [form, setForm] = useState<RegisterFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const sectorOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.SectorOptions)),
    [fields.SectorOptions]
  );
  const jobRoleOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.JobRoleOptions)),
    [fields.JobRoleOptions]
  );
  const turnoverOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.AnnualTurnoverOptions)),
    [fields.AnnualTurnoverOptions]
  );
  const topicOptions = useMemo(
    () => parseMultilineOptions(fieldText(fields.TopicOptions)),
    [fields.TopicOptions]
  );

  const updateForm = (patch: Partial<RegisterFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const toggleTopic = (topic: string) => {
    setForm((current) => {
      const selected = new Set(current.topicPreferences);
      if (selected.has(topic)) {
        selected.delete(topic);
      } else {
        selected.add(topic);
      }
      return { ...current, topicPreferences: [...selected] };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/kpmg-beyond/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(body?.error || fieldText(fields.ErrorMessage));
        return;
      }

      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      {...editingHydration}
      data-cy="register-section"
      className="component kpmg-beyond-register px-5 py-10 xl:px-8 xl:py-16"
    >
      <div className="mx-auto max-w-[760px]">
        <Text tag="h1" field={fields.PageTitle} className="m-0 text-[32px] font-semibold text-white xl:text-[40px]" />
        <Text tag="p" field={fields.PageIntro} className="mt-4 text-base leading-7 text-white/80" />

        <p className="mt-6 text-sm text-white/70">
          <Text tag="span" field={fields.LoginPrompt} className="inline" />{' '}
          <Link
            href={buildLoginUrl('/home')}
            className="font-semibold text-kpmg-label no-underline hover:underline"
          >
            {fields.LoginLink?.value?.text?.toString() || 'Login'}
          </Link>
        </p>

        {success ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-kpmg-elevated p-6">
            <Text tag="p" field={fields.SuccessMessage} className="m-0 text-base leading-7 text-white" />
            <Link
              href={buildLoginUrl('/home')}
              className="mt-6 inline-flex rounded-full bg-kpmg-purple px-8 py-3 text-base font-semibold text-white no-underline"
            >
              {fields.LoginLink?.value?.text?.toString() || 'Login'}
            </Link>
          </div>
        ) : (
          <form className="mt-10 space-y-6" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.FirstNameLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileTextInput
                  value={form.firstName}
                  onChange={(firstName) => updateForm({ firstName })}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.LastNameLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileTextInput
                  value={form.lastName}
                  onChange={(lastName) => updateForm({ lastName })}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <KpmgBeyondProfileFieldLabel>
                <Text tag="span" field={fields.EmailLabel} />
              </KpmgBeyondProfileFieldLabel>
              <KpmgBeyondProfileTextInput
                type="email"
                value={form.email}
                onChange={(email) => updateForm({ email })}
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.PasswordLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileTextInput
                  type="password"
                  value={form.password}
                  onChange={(password) => updateForm({ password })}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.ConfirmPasswordLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileTextInput
                  type="password"
                  value={form.confirmPassword}
                  onChange={(confirmPassword) => updateForm({ confirmPassword })}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <KpmgBeyondProfileFieldLabel>
                <Text tag="span" field={fields.CompanyLabel} />
              </KpmgBeyondProfileFieldLabel>
              <KpmgBeyondProfileTextInput
                value={form.company}
                onChange={(company) => updateForm({ company })}
                autoComplete="organization"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.SectorLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileSelect
                  value={form.sector}
                  onChange={(sector) => updateForm({ sector })}
                  options={sectorOptions}
                />
              </div>
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.JobRoleLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileSelect
                  value={form.jobRole}
                  onChange={(jobRole) => updateForm({ jobRole })}
                  options={jobRoleOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.BusinessPostcodeLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileTextInput
                  value={form.businessPostcode}
                  onChange={(businessPostcode) => updateForm({ businessPostcode })}
                  autoComplete="postal-code"
                />
              </div>
              <div>
                <KpmgBeyondProfileFieldLabel>
                  <Text tag="span" field={fields.AnnualTurnoverLabel} />
                </KpmgBeyondProfileFieldLabel>
                <KpmgBeyondProfileSelect
                  value={form.annualTurnover}
                  onChange={(annualTurnover) => updateForm({ annualTurnover })}
                  options={turnoverOptions}
                />
              </div>
            </div>

            <div>
              <Text
                tag="h2"
                field={fields.TopicsSectionTitle}
                className="m-0 text-xl font-semibold text-white"
              />
              <Text tag="p" field={fields.TopicsIntro} className="mt-2 text-sm leading-6 text-white/70" />
              <div className="mt-4 flex flex-wrap gap-3">
                {topicOptions.map((topic) => (
                  <TopicChip
                    key={topic}
                    label={topic}
                    selected={form.topicPreferences.includes(topic)}
                    onToggle={() => toggleTopic(topic)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <KpmgBeyondProfileToggle
                checked={form.acceptTerms}
                disabled={isSubmitting}
                onChange={(acceptTerms) => updateForm({ acceptTerms })}
                label={fieldText(fields.TermsLabel)}
              />
              <KpmgBeyondProfileToggle
                checked={form.marketingOptIn}
                disabled={isSubmitting}
                onChange={(marketingOptIn) => updateForm({ marketingOptIn })}
                label={fieldText(fields.MarketingLabel)}
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-kpmg-card p-4">
              {fields.CaptchaImage?.value?.src ? (
                <Image field={fields.CaptchaImage} className="h-auto max-h-20 w-auto" />
              ) : (
                <div className="flex h-20 items-center justify-center rounded bg-white/5 text-sm text-white/50">
                  Captcha placeholder
                </div>
              )}
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-300" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <KpmgBeyondProfileSubmitButton
              label={fieldText(fields.SubmitButtonLabel, 'Create an account')}
              savingLabel={fieldText(fields.SubmittingLabel, 'Creating account…')}
              isSaving={isSubmitting}
            />
          </form>
        )}
      </div>
    </section>
  );
};
