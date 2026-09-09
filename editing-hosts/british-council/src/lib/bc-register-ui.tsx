'use client';

import type { JSX, ReactNode } from 'react';

export function BcRegisterFieldLabel({ children }: { children: ReactNode }): JSX.Element {
  return <p className="bc-register__label">{children}</p>;
}

export function BcRegisterTextInput({
  value,
  onChange,
  disabled,
  type = 'text',
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
}): JSX.Element {
  return (
    <input
      className="bc-register__input"
      type={type}
      value={value}
      disabled={disabled}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function BcRegisterSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}): JSX.Element {
  return (
    <select
      className="bc-register__input bc-register__select"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Select…</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function BcRegisterToggle({
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
    <label className="bc-register__toggle">
      <span className="bc-register__toggle-label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`bc-register__switch${checked ? ' is-on' : ''}`}
      >
        <span className="bc-register__switch-knob" aria-hidden />
      </button>
    </label>
  );
}

export function BcRegisterSubmitButton({
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
      className="bc-btn bc-btn--primary bc-register__submit"
    >
      {isSaving ? savingLabel : label}
    </button>
  );
}
