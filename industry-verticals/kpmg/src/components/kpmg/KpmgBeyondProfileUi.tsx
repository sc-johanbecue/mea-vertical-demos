'use client';

import type { JSX, ReactNode } from 'react';

export function KpmgBeyondProfileToggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}): JSX.Element {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
      <span className="text-base text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors disabled:opacity-50',
          checked ? 'justify-end bg-kpmg-purple' : 'justify-start bg-white/20',
        ].join(' ')}
      >
        <span className="block h-6 w-6 shrink-0 rounded-full bg-white" aria-hidden />
      </button>
    </label>
  );
}

export function KpmgBeyondProfileSubmitButton({
  label,
  savingLabel,
  isSaving,
  disabled,
}: {
  label: string;
  savingLabel: string;
  isSaving: boolean;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      type="submit"
      disabled={disabled || isSaving}
      className="mt-8 w-full rounded-full bg-kpmg-purple px-8 py-4 text-base font-semibold text-white disabled:opacity-60"
    >
      {isSaving ? savingLabel : label}
    </button>
  );
}

export function KpmgBeyondProfileNavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between border border-white/10 px-5 py-4 text-left text-base text-white transition-colors',
        active ? 'bg-kpmg-bgCard' : 'bg-transparent hover:bg-white/5',
      ].join(' ')}
    >
      <span>{label}</span>
      <span aria-hidden className="text-white/70">
        ›
      </span>
    </button>
  );
}

export function KpmgBeyondProfileFieldLabel({ children }: { children: ReactNode }): JSX.Element {
  return <p className="m-0 text-sm text-white/80">{children}</p>;
}

export function KpmgBeyondProfileReadOnlyValue({ children }: { children: ReactNode }): JSX.Element {
  return <p className="m-0 mt-1 text-lg text-white">{children}</p>;
}

export function KpmgBeyondProfileTextInput({
  value,
  onChange,
  disabled,
  type = 'text',
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
}): JSX.Element {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full border border-white/20 bg-transparent px-3 py-2 text-base text-white outline-none focus:border-kpmg-purple disabled:opacity-60"
    />
  );
}

export function KpmgBeyondProfileSelect({
  value,
  onChange,
  options,
  disabled,
  placeholder = '—',
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
}): JSX.Element {
  const mergedOptions =
    value && !options.includes(value) ? [value, ...options] : options;

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 w-full border border-white/20 bg-[#120c2a] px-3 py-2 text-base text-white outline-none focus:border-kpmg-purple disabled:opacity-60"
    >
      <option value="">{placeholder}</option>
      {mergedOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function KpmgBeyondProfileAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): JSX.Element {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4832cb] text-3xl font-semibold text-white">
      {initials}
    </div>
  );
}
