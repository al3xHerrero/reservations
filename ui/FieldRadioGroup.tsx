'use client';

import React, { useState } from 'react';

const iconRadioDotDefault = '/icons/radio-dot.svg';
const iconRadioDotContrast = '/icons/radio-dot.svg';
const iconRadioDotFocusDefault = '/icons/radio-dot.svg';
const iconRadioDotFocusContrast = '/icons/radio-dot.svg';
const iconRadioDotDisabledDefault = '/icons/radio-dot-disabled.svg';
const iconRadioDotDisabledContrast = '/icons/radio-dot-disabled.svg';

export type FieldRadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioSize = 'base' | 'small';
type RadioSentiment = 'default' | 'danger';

interface FieldRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: FieldRadioOption[];
  disabled?: boolean;
  size?: RadioSize;
  contrast?: boolean;
  sentiment?: RadioSentiment;
  testId?: string;
  className?: string;
}

export function FieldRadioGroup({
  value,
  onChange,
  options,
  disabled = false,
  size = 'base',
  contrast = false,
  sentiment = 'default',
  testId,
  className = '',
}: FieldRadioGroupProps) {
  const [focusedValue, setFocusedValue] = useState<string | null>(null);

  return (
    <div
      className={className}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      data-testid={testId}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const isFocused = focusedValue === option.value;
        const visualState = isDisabled ? 'disable' : isFocused ? 'focus' : 'rest';
        const cardClasses = [
          'flex items-center gap-[var(--space-4)] rounded-[var(--dimensions-radii)] border-2',
          'bg-[var(--background-main-default)] px-[var(--dimensions-padding-inline)] py-[var(--space-4)]',
          isSelected
            ? 'border-[var(--action-border-primary-default)]'
            : 'border-[var(--border-main-default)]',
          isDisabled ? 'bg-[var(--action-background-disable-default)] cursor-not-allowed' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const labelClasses = [
          'flex-1 text-left font-[var(--weight-regular)]',
          size === 'small'
            ? 'text-[length:var(--size-small)] leading-[var(--leading-small)]'
            : 'text-[length:var(--size-base)] leading-[var(--leading-base)]',
        ]
          .filter(Boolean)
          .join(' ');

        const inputBackground = () => {
          if (visualState === 'disable') {
            return contrast
              ? 'var(--radio/input/color/bg/disable/contrast)'
              : 'var(--radio/input/color/bg/disable/default)';
          }
          if (isSelected) {
            if (visualState === 'focus') {
              return contrast
                ? 'var(--radio/input/color/bg/active/focus/contrast)'
                : 'var(--radio/input/color/bg/active/focus/default)';
            }
            return contrast
              ? 'var(--radio/input/color/bg/active/contrast)'
              : 'var(--radio/input/color/bg/active/default)';
          }
          if (sentiment === 'danger') {
            return contrast
              ? 'var(--radio/input/color/bg/danger/contrast)'
              : 'var(--radio/input/color/bg/danger/default)';
          }
          if (visualState === 'focus') {
            return contrast
              ? 'var(--radio/input/color/bg/focus/contrast)'
              : 'var(--radio/input/color/bg/focus/default)';
          }
          return contrast
            ? 'var(--radio/input/color/bg/contrast)'
            : 'var(--radio/input/color/bg/default)';
        };

        const inputBorder = () => {
          if (visualState === 'disable' || isSelected) return 'transparent';
          if (sentiment === 'danger') {
            if (visualState === 'focus') {
              return contrast
                ? 'var(--radio/input/color/border/danger/focus/contrast)'
                : 'var(--radio/input/color/border/danger/focus/default)';
            }
            return contrast
              ? 'var(--radio/input/color/border/danger/contrast)'
              : 'var(--radio/input/color/border/danger/default)';
          }
          if (visualState === 'focus') {
            return contrast
              ? 'var(--radio/input/color/border/focus/contrast)'
              : 'var(--radio/input/color/border/focus/default)';
          }
          return contrast
            ? 'var(--radio/input/color/border/contrast)'
            : 'var(--radio/input/color/border/default)';
        };

        const inputShadow = () => {
          if (visualState !== 'focus' || isDisabled) return 'none';
          return sentiment === 'danger'
            ? contrast
              ? 'var(--shadow/accessibility/danger/focus/contrast)'
              : 'var(--shadow/accessibility/danger/focus/default)'
            : contrast
              ? 'var(--shadow/accessibility/primary/focus/contrast)'
              : 'var(--shadow/accessibility/primary/focus/default)';
        };

        const labelColor = () => {
          if (visualState === 'disable') {
            return contrast
              ? 'var(--radio/label/color/disable/contrast)'
              : 'var(--radio/label/color/disable/default)';
          }
          if (isSelected) {
            if (visualState === 'focus') {
              return contrast
                ? 'var(--radio/label/color/active/focus/contrast)'
                : 'var(--radio/label/color/active/focus/default)';
            }
            return contrast
              ? 'var(--radio/label/color/active/contrast)'
              : 'var(--radio/label/color/active/default)';
          }
          if (sentiment === 'danger') {
            if (visualState === 'focus') {
              return contrast
                ? 'var(--radio/label/color/danger/focus/contrast)'
                : 'var(--radio/label/color/danger/focus/default)';
            }
            return contrast
              ? 'var(--radio/label/color/danger/contrast)'
              : 'var(--radio/label/color/danger/default)';
          }
          if (visualState === 'focus') {
            return contrast
              ? 'var(--radio/label/color/focus/contrast)'
              : 'var(--radio/label/color/focus/default)';
          }
          return contrast
            ? 'var(--radio/label/color/contrast)'
            : 'var(--radio/label/color/default)';
        };

        const dotIcon = () => {
          if (visualState === 'disable') {
            return contrast ? iconRadioDotDisabledContrast : iconRadioDotDisabledDefault;
          }
          if (visualState === 'focus') {
            return contrast ? iconRadioDotFocusContrast : iconRadioDotFocusDefault;
          }
          return contrast ? iconRadioDotContrast : iconRadioDotDefault;
        };

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
              if (isDisabled) return;
              onChange(option.value);
            }}
            onFocus={() => setFocusedValue(option.value)}
            onBlur={() => setFocusedValue(null)}
            className={cardClasses}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 'var(--radio/input/dimensions/width)',
                height: 'var(--radio/input/dimensions/height)',
                borderRadius: 'var(--radio/input/dimensions/radius)',
                backgroundColor: inputBackground(),
                borderColor: inputBorder(),
                borderWidth: isSelected || isDisabled ? 0 : 1,
                borderStyle: 'solid',
                boxShadow: inputShadow(),
              }}
            >
              {isSelected && (
                <img
                  alt=""
                  src={dotIcon()}
                  style={{
                    width: 'var(--radio/input/dimensions/dot)',
                    height: 'var(--radio/input/dimensions/dot)',
                  }}
                />
              )}
            </span>
            <span className={labelClasses} style={{ color: labelColor() }}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
