'use client';

import React, { useState } from 'react';

interface FieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  wrapperClassName?: string;
  label?: string;
}

export function FieldTextarea({
  error,
  disabled,
  wrapperClassName = '',
  className = '',
  label,
  value,
  onFocus,
  onBlur,
  ...props
}: FieldTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const hasValue = value !== undefined && value !== '';
  const showFloatingLabel = label && (isFocused || hasValue);

  const textareaClasses = [
    'h-[var(--textarea-height)] w-full resize-none rounded-[var(--dimensions-radii)] border',
    'bg-[var(--background-main-default)] px-[var(--textarea-padding-inline)]',
    label ? 'pt-[24px] pb-[8px]' : 'py-[var(--textarea-padding-block)]',
    'text-[length:var(--size-base)] font-[var(--weight-regular)] leading-[var(--leading-base)]',
    disabled ? 'text-[var(--text-subtle-default)]' : 'text-[var(--text-main-default)]',
    'placeholder:text-[var(--text-subtle-default)]',
    hasError ? 'border-[var(--select-border-danger)]' : 'border-[var(--border-main-default)]',
    disabled ? 'bg-[var(--action-background-disable-default)]' : '',
    'focus:border-[var(--select-border-focus)] outline-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative w-full ${wrapperClassName}`}>
      {/* Floating label */}
      {showFloatingLabel && (
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '8px',
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
            color: '#536b75',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {label}
        </span>
      )}
      <textarea
        {...props}
        value={value}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={textareaClasses}
        placeholder={!showFloatingLabel && label ? label : props.placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div
        className="pointer-events-none absolute bottom-[var(--textarea-handle-offset)] right-[var(--textarea-handle-offset)] size-[var(--textarea-handle-size-1)]"
        aria-hidden="true"
      >
        <span className="absolute left-[var(--textarea-handle-offset-1)] top-[var(--textarea-handle-offset-1)] size-[var(--textarea-handle-size-1)]">
          <span className="absolute left-0 top-0 flex size-[var(--textarea-handle-size-1)] items-center justify-center">
            <span className="block h-[var(--textarea-handle-line-1)] w-[var(--textarea-handle-line-width)] rotate-45 rounded-[var(--textarea-handle-line-radius)] bg-[var(--palette-neutral-300)]" />
          </span>
        </span>
        <span className="absolute left-[var(--textarea-handle-offset-2)] top-[var(--textarea-handle-offset-2)] size-[var(--textarea-handle-size-2)]">
          <span className="absolute left-0 top-0 flex size-[var(--textarea-handle-size-2)] items-center justify-center">
            <span className="block h-[var(--textarea-handle-line-2)] w-[var(--textarea-handle-line-width)] rotate-45 rounded-[var(--textarea-handle-line-radius)] bg-[var(--palette-neutral-300)]" />
          </span>
        </span>
        <span className="absolute left-[var(--textarea-handle-offset-3)] top-[var(--textarea-handle-offset-3)] size-[var(--textarea-handle-size-3)]">
          <span className="absolute left-0 top-0 flex size-[var(--textarea-handle-size-3)] items-center justify-center">
            <span className="block h-[var(--textarea-handle-line-3)] w-[var(--textarea-handle-line-width)] rotate-45 rounded-[var(--textarea-handle-line-radius)] bg-[var(--palette-neutral-300)]" />
          </span>
        </span>
        <span className="absolute left-[var(--textarea-handle-offset-4)] top-[var(--textarea-handle-offset-4)] size-[var(--textarea-handle-size-4)]">
          <span className="absolute left-0 top-0 flex size-[var(--textarea-handle-size-4)] items-center justify-center">
            <span className="block h-[var(--textarea-handle-line-4)] w-[var(--textarea-handle-line-width)] rotate-45 rounded-[var(--textarea-handle-line-radius)] bg-[var(--palette-neutral-300)]" />
          </span>
        </span>
      </div>
    </div>
  );
}
