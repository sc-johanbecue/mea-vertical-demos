'use client';

import type { FormEvent, JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Image, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { buildLoginUrl } from '@/lib/auth0-profile';
import {
  defaultBcRegisterFields,
  fieldText,
  parseMultilineOptions,
  type BcRegisterFields,
} from '@/lib/bc-register-fields';
import {
  BcRegisterFieldLabel,
  BcRegisterSelect,
  BcRegisterSubmitButton,
  BcRegisterTextInput,
  BcRegisterToggle,
} from '@/lib/bc-register-ui';

export type BcRegisterProps = ComponentProps & {
  fields?: BcRegisterFields;
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
      className={`bc-register__chip${selected ? ' is-selected' : ''}`}
    >
      <span className="bc-register__chip-mark" aria-hidden>
        {selected ? '×' : '+'}
      </span>
      {label}
    </button>
  );
}

export const Default = (props: BcRegisterProps): JSX.Element => {
  const fields = props.fields || defaultBcRegisterFields;
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
      const response = await fetch('/api/bc/register', {
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

  const loginHref = buildLoginUrl('/Portal');

  return (
    <section
      key={componentKey(props)}
      data-cy="register-section"
      className={`bc-register component ${props.params?.styles ?? ''}`.trim()}
      id={props.params?.RenderingIdentifier}
    >
      <div className="bc-register__inner">
        <Text tag="h1" field={fields.PageTitle} className="bc-register__title" />
        <Text tag="p" field={fields.PageIntro} className="bc-register__intro" />

        <p className="bc-register__login-prompt">
          <Text tag="span" field={fields.LoginPrompt} className="inline" />{' '}
          <Link href={loginHref} className="bc-register__login-link">
            {fields.LoginLink?.value?.text?.toString() || 'Login'}
          </Link>
        </p>

        {success ? (
          <div className="bc-register__success">
            <Text tag="p" field={fields.SuccessMessage} className="bc-register__success-text" />
            <Link href={loginHref} className="bc-btn bc-btn--primary">
              {fields.LoginLink?.value?.text?.toString() || 'Login'}
            </Link>
          </div>
        ) : (
          <form className="bc-register__form" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="bc-register__row">
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.FirstNameLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput
                  value={form.firstName}
                  onChange={(firstName) => updateForm({ firstName })}
                  autoComplete="given-name"
                />
              </div>
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.LastNameLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput
                  value={form.lastName}
                  onChange={(lastName) => updateForm({ lastName })}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="bc-register__field">
              <BcRegisterFieldLabel>
                <Text tag="span" field={fields.EmailLabel} />
              </BcRegisterFieldLabel>
              <BcRegisterTextInput
                type="email"
                value={form.email}
                onChange={(email) => updateForm({ email })}
                autoComplete="email"
              />
            </div>

            <div className="bc-register__row">
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.PasswordLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput
                  type="password"
                  value={form.password}
                  onChange={(password) => updateForm({ password })}
                  autoComplete="new-password"
                />
              </div>
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.ConfirmPasswordLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput
                  type="password"
                  value={form.confirmPassword}
                  onChange={(confirmPassword) => updateForm({ confirmPassword })}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="bc-register__field">
              <BcRegisterFieldLabel>
                <Text tag="span" field={fields.CompanyLabel} />
              </BcRegisterFieldLabel>
              <BcRegisterTextInput
                value={form.company}
                onChange={(company) => updateForm({ company })}
                autoComplete="organization"
              />
            </div>

            <div className="bc-register__row">
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.SectorLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterSelect
                  value={form.sector}
                  onChange={(sector) => updateForm({ sector })}
                  options={sectorOptions}
                />
              </div>
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.JobRoleLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterSelect
                  value={form.jobRole}
                  onChange={(jobRole) => updateForm({ jobRole })}
                  options={jobRoleOptions}
                />
              </div>
            </div>

            <div className="bc-register__row">
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.BusinessPostcodeLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput
                  value={form.businessPostcode}
                  onChange={(businessPostcode) => updateForm({ businessPostcode })}
                  autoComplete="postal-code"
                />
              </div>
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.AnnualTurnoverLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterSelect
                  value={form.annualTurnover}
                  onChange={(annualTurnover) => updateForm({ annualTurnover })}
                  options={turnoverOptions}
                />
              </div>
            </div>

            <div className="bc-register__topics">
              <Text tag="h2" field={fields.TopicsSectionTitle} className="bc-register__topics-title" />
              <Text tag="p" field={fields.TopicsIntro} className="bc-register__topics-intro" />
              <div className="bc-register__chips">
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

            <div className="bc-register__agreements">
              <BcRegisterToggle
                checked={form.acceptTerms}
                disabled={isSubmitting}
                onChange={(acceptTerms) => updateForm({ acceptTerms })}
                label={fieldText(fields.TermsLabel)}
              />
              <BcRegisterToggle
                checked={form.marketingOptIn}
                disabled={isSubmitting}
                onChange={(marketingOptIn) => updateForm({ marketingOptIn })}
                label={fieldText(fields.MarketingLabel)}
              />
            </div>

            <div className="bc-register__captcha">
              {fields.CaptchaImage?.value?.src ? (
                <Image field={fields.CaptchaImage} className="bc-register__captcha-image" />
              ) : (
                <div className="bc-register__captcha-placeholder">Captcha placeholder</div>
              )}
            </div>

            {errorMessage ? (
              <p className="bc-register__error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <BcRegisterSubmitButton
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
