'use client';

import React, { useState } from 'react';

const searchIcon = '/icons/search.svg';
const calendarIcon = '/icons/calendar.svg';
const errorIcon = '/icons/error.svg';
const visaLogo = '/icons/visa.svg';
const mastercardLogo = '/icons/mastercard.svg';
const amexLogo = '/icons/amex.svg';

type InputVariant = 'text' | 'search' | 'payment' | 'date';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  optional?: boolean;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
}

export function Input({
  label,
  optional = false,
  helperText,
  error,
  variant = 'text',
  className = '',
  disabled,
  readOnly,
  placeholder,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const showError = Boolean(error);
  const showSearchIcon = variant === 'search';
  const showCalendarIcon = variant === 'date';
  const showPaymentIcons = variant === 'payment';
  const inputPlaceholder = placeholder ?? '';

  const getFieldBackground = () => {
    if (disabled) return 'var(--input/color/bg/disabled)';
    if (readOnly) return 'var(--input/color/bg/readonly)';
    return 'var(--input/color/bg/default)';
  };

  const getFieldBorder = () => {
    if (showError) return 'var(--input/color/border/error)';
    if (isFocused) return 'var(--input/color/border/focus)';
    return 'var(--input/color/border/default)';
  };

  const getLabelColor = () => {
    if (showError) return 'var(--input/color/fg/label/error)';
    return 'var(--input/color/fg/label)';
  };

  const getTextColor = () => {
    if (disabled) return 'var(--input/color/fg/disabled)';
    return 'var(--input/color/fg/default)';
  };

  const helperId = props.id ? `${props.id}-helper` : undefined;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div
        className={`relative flex items-center transition-colors ${showCalendarIcon ? 'pr-11' : ''}`}
        style={{
          height: 'var(--input/dimensions/height)',
          borderRadius: 'var(--input/dimensions/radii)',
          backgroundColor: getFieldBackground(),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: getFieldBorder(),
          paddingInline: 'var(--input/dimensions/padding/inline)',
        }}
      >
        {showSearchIcon && (
          <span className="mr-2 flex h-6 w-6 items-center justify-center">
            <img
              alt=""
              src={searchIcon}
              style={{
                width: 'var(--icon/dimension/width/base)',
                height: 'var(--icon/dimension/height/base)',
              }}
            />
          </span>
        )}
        <div className="relative flex-1">
          {label && (
            <span
              className="pointer-events-none absolute left-0 top-1 text-[length:var(--size-caption)] leading-[var(--leading-caption)]"
              style={{ color: getLabelColor() }}
            >
              {label}
              {optional && <span className="ml-1">(Optional)</span>}
            </span>
          )}
          <input
            className="peer w-full bg-transparent text-[length:var(--size-base)] leading-[var(--leading-base)] outline-none pt-4 pb-1"
            style={{
              color: getTextColor(),
            }}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={label}
            aria-invalid={showError || undefined}
            aria-describedby={helperId}
            placeholder={inputPlaceholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
        {showPaymentIcons && (
          <div className="ml-2 flex items-center gap-1">
            <span
              className="flex items-center justify-center bg-[var(--input/color/bg/default)] border border-[var(--input/color/border/default)]"
              style={{ height: '16px', width: '24px', borderRadius: '4px' }}
            >
              <img alt="Visa" className="h-[4.5px] w-[14px]" src={visaLogo} />
            </span>
            <span
              className="flex items-center justify-center bg-[var(--input/color/bg/default)] border border-[var(--input/color/border/default)]"
              style={{ height: '16px', width: '24px', borderRadius: '4px' }}
            >
              <img alt="Mastercard" className="h-4 w-[22px]" src={mastercardLogo} />
            </span>
            <span
              className="flex items-center justify-center bg-[var(--input/color/bg/default)] border border-[var(--input/color/border/default)]"
              style={{ height: '16px', width: '24px', borderRadius: '4px' }}
            >
              <img alt="Amex" className="h-[11.5px] w-[11.5px]" src={amexLogo} />
            </span>
          </div>
        )}
        {showCalendarIcon && (
          <span className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full">
              <img alt="" className="h-4 w-3.5" src={calendarIcon} />
            </span>
          </span>
        )}
      </div>
      {showError ? (
        <div
          className="flex items-start"
          style={{
            gap: 'var(--select-helper-gap)',
            paddingLeft: 'var(--select-helper-padding-inline-start)',
          }}
        >
          <span
            className="relative shrink-0 mt-0.5"
            style={{
              width: 'var(--icon-dimension-width-caption)',
              height: 'var(--icon-dimension-height-caption)',
            }}
          >
            <img alt="" className="block h-full w-full" src={errorIcon} />
          </span>
          <p className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--input/color/border/error)]">
            {error}
          </p>
        </div>
      ) : helperText ? (
        <p
          className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text/main/default)]"
          style={{ paddingLeft: 'var(--select-helper-padding-inline-start)' }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
