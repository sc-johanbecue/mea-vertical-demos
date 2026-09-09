'use client';

import type { FormEvent, JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { User } from '@auth0/nextjs-auth0/types';
import { ComponentProps } from '@/lib/component-props';
import { componentKey } from '@/lib/component-utils';
import { buildLoginUrl } from '@/lib/auth0-profile';
import {
  buildBcAuth0AccountProfile,
  dummyBcAuth0AccountProfile,
  type BcAuth0AccountProfile,
} from '@/lib/bc-auth0-account';
import {
  defaultBcProfileFields,
  fieldText,
  parseMultilineOptions,
  type BcProfileFields,
} from '@/lib/bc-profile-fields';
import {
  BcRegisterFieldLabel,
  BcRegisterSelect,
  BcRegisterSubmitButton,
  BcRegisterTextInput,
  BcRegisterToggle,
} from '@/lib/bc-register-ui';
import { isAuth0AuthenticatedUser } from '@/lib/auth0-user';

export type BcProfileProps = ComponentProps & {
  fields?: BcProfileFields;
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

export const Default = (props: BcProfileProps): JSX.Element => {
  const fields = props.fields || defaultBcProfileFields;
  const { page } = useSitecore();
  const { user, isLoading, invalidate } = useUser();
  const editing = Boolean(page?.mode?.isEditing);

  const [form, setForm] = useState<BcAuth0AccountProfile | null>(
    editing ? { ...dummyBcAuth0AccountProfile } : null
  );
  const [isHydrating, setIsHydrating] = useState(!editing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  useEffect(() => {
    if (editing) {
      setForm({ ...dummyBcAuth0AccountProfile });
      setIsHydrating(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setIsHydrating(true);
      try {
        const response = await fetch('/api/bc/profile');
        if (response.status === 401) {
          if (!cancelled) {
            setForm(null);
          }
          return;
        }
        if (!response.ok) {
          return;
        }
        const apiUser = (await response.json()) as User;
        if (!cancelled) {
          setForm(buildBcAuth0AccountProfile(apiUser));
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [editing, user?.sub]);

  const updateForm = (patch: Partial<BcAuth0AccountProfile>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  const toggleTopic = (topic: string) => {
    setForm((current) => {
      if (!current) {
        return current;
      }
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
    if (!form || editing) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bc/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.company,
          sector: form.sector,
          jobRole: form.jobRole,
          businessPostcode: form.businessPostcode,
          annualTurnover: form.annualTurnover,
          topicPreferences: form.topicPreferences,
          marketingOptIn: form.marketing.subscribeEmails || form.marketing.marketingEmails,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(body?.error || fieldText(fields.ErrorMessage));
        return;
      }

      setSuccessMessage(fieldText(fields.SuccessMessage));
      await invalidate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginHref = buildLoginUrl('/Portal/Profile');
  const showSignIn =
    !editing && !isLoading && !isHydrating && (!isAuth0AuthenticatedUser(user) || !form);

  return (
    <section
      key={componentKey(props)}
      data-cy="profile-section"
      className={`bc-register bc-profile component ${props.params?.styles ?? ''}`.trim()}
      id={props.params?.RenderingIdentifier}
    >
      <div className="bc-register__inner">
        <Text tag="h1" field={fields.PageTitle} className="bc-register__title" />
        <Text tag="p" field={fields.PageIntro} className="bc-register__intro" />

        {showSignIn ? (
          <div className="bc-register__success">
            <Text tag="p" field={fields.SignInPrompt} className="bc-register__success-text" />
            <Link href={loginHref} className="bc-btn bc-btn--primary">
              {fieldText(fields.SignInButtonLabel, 'Sign in')}
            </Link>
          </div>
        ) : null}

        {!showSignIn && (isHydrating || !form) ? (
          <p className="bc-register__intro">Loading account…</p>
        ) : null}

        {!showSignIn && form ? (
          <form
            className="bc-register__form"
            onSubmit={(event) => void handleSubmit(event)}
            noValidate
          >
            <div className="bc-register__row">
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.FirstNameLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput value={form.firstName} onChange={() => undefined} disabled />
              </div>
              <div className="bc-register__field">
                <BcRegisterFieldLabel>
                  <Text tag="span" field={fields.LastNameLabel} />
                </BcRegisterFieldLabel>
                <BcRegisterTextInput value={form.lastName} onChange={() => undefined} disabled />
              </div>
            </div>

            <div className="bc-register__field">
              <BcRegisterFieldLabel>
                <Text tag="span" field={fields.EmailLabel} />
              </BcRegisterFieldLabel>
              <BcRegisterTextInput
                type="email"
                value={form.email}
                onChange={() => undefined}
                disabled
              />
            </div>

            <div className="bc-register__field">
              <BcRegisterFieldLabel>
                <Text tag="span" field={fields.CompanyLabel} />
              </BcRegisterFieldLabel>
              <BcRegisterTextInput
                value={form.company}
                onChange={(company) => updateForm({ company })}
                autoComplete="organization"
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                checked={form.marketing.subscribeEmails || form.marketing.marketingEmails}
                disabled={isSubmitting}
                onChange={(marketingOptIn) =>
                  updateForm({
                    marketing: {
                      subscribeEmails: marketingOptIn,
                      marketingEmails: marketingOptIn,
                    },
                  })
                }
                label={fieldText(fields.MarketingLabel)}
              />
            </div>

            {errorMessage ? (
              <p className="bc-register__error" role="alert">
                {errorMessage}
              </p>
            ) : null}
            {successMessage ? (
              <p className="bc-register__success-text" role="status">
                {successMessage}
              </p>
            ) : null}

            <BcRegisterSubmitButton
              label={fieldText(fields.SubmitButtonLabel, 'Save changes')}
              savingLabel={fieldText(fields.SubmittingLabel, 'Saving…')}
              isSaving={isSubmitting}
              disabled={editing}
            />
          </form>
        ) : null}
      </div>
    </section>
  );
};
