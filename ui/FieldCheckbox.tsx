'use client';

import React, { useState } from 'react';

const iconCheckboxCheckDefault = '/icons/checkbox-check.svg';
const iconCheckboxCheckContrast = '/icons/checkbox-check-contrast.svg';
const iconCheckboxCheckFocusDefault = '/icons/checkbox-check.svg';
const iconCheckboxCheckFocusContrast = '/icons/checkbox-check-contrast.svg';
const iconCheckboxCheckDisabledDefault = '/icons/checkbox-check-disabled.svg';
const iconCheckboxCheckDisabledContrast = '/icons/checkbox-check-disabled.svg';

type CheckboxSize = 'base' | 'small';
type CheckboxSentiment = 'default' | 'danger';

interface FieldCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  contrast?: boolean;
  size?: CheckboxSize;
  sentiment?: CheckboxSentiment;
  testId?: string;
  className?: string;
}

export function FieldCheckbox({
  checked,
  onChange,
  disabled = false,
  label = '',
  showLabel = true,
  contrast = false,
  size = 'base',
  sentiment = 'default',
  testId,
  className = '',
}: FieldCheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const visualState = disabled ? 'disable' : isFocused ? 'focus' : 'rest';

  const labelClasses = [
    'text-left font-[var(--weight-regular)]',
    size === 'small'
      ? 'text-[length:var(--size-small)] leading-[var(--leading-small)]'
      : 'text-[length:var(--size-base)] leading-[var(--leading-base)]',
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = [
    'flex items-start gap-[var(--checkbox/dimensions/gap)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputWrapperClasses = [
    'flex items-center',
    size === 'small' ? 'pt-[3px]' : 'pt-[5px]',
  ].join(' ');

  const getBackgroundColor = () => {
    if (visualState === 'disable') {
      return checked
        ? contrast
          ? 'var(--checkbox/input/color/bg/active/disable/contrast)'
          : 'var(--checkbox/input/color/bg/active/disable/default)'
        : contrast
          ? 'var(--checkbox/input/color/bg/disable/contrast)'
          : 'var(--checkbox/input/color/bg/disable/default)';
    }
    if (checked) {
      if (visualState === 'focus') {
        return contrast
          ? 'var(--checkbox/input/color/bg/active/focus/contrast)'
          : 'var(--checkbox/input/color/bg/active/focus/default)';
      }
      return contrast
        ? 'var(--checkbox/input/color/bg/active/contrast)'
        : 'var(--checkbox/input/color/bg/active/default)';
    }
    if (sentiment === 'danger') {
      if (visualState === 'focus') {
        return contrast
          ? 'var(--checkbox/input/color/bg/danger/focus/contrast)'
          : 'var(--checkbox/input/color/bg/danger/focus/default)';
      }
      return contrast
        ? 'var(--checkbox/input/color/bg/danger/contrast)'
        : 'var(--checkbox/input/color/bg/danger/default)';
    }
    if (visualState === 'focus') {
      return contrast
        ? 'var(--checkbox/input/color/bg/focus/contrast)'
        : 'var(--checkbox/input/color/bg/focus/default)';
    }
    return contrast
      ? 'var(--checkbox/input/color/bg/contrast)'
      : 'var(--checkbox/input/color/bg/default)';
  };

  const getBorderColor = () => {
    if (visualState === 'disable' || checked) return 'transparent';
    if (sentiment === 'danger') {
      return contrast
        ? 'var(--checkbox/input/color/border/danger/contrast)'
        : 'var(--checkbox/input/color/border/danger/default)';
    }
    if (visualState === 'focus') {
      return contrast
        ? 'var(--checkbox/input/color/border/focus/contrast)'
        : 'var(--checkbox/input/color/border/focus/default)';
    }
    return contrast
      ? 'var(--checkbox/input/color/border/contrast)'
      : 'var(--checkbox/input/color/border/default)';
  };

  const getLabelColor = () => {
    if (visualState === 'disable') {
      return contrast
        ? 'var(--checkbox/label/color/disable/contrast)'
        : 'var(--checkbox/label/color/disable/default)';
    }
    if (checked) {
      if (visualState === 'focus') {
        return contrast
          ? 'var(--checkbox/label/color/active/focus/contrast)'
          : 'var(--checkbox/label/color/active/focus/default)';
      }
      return contrast
        ? 'var(--checkbox/label/color/active/contrast)'
        : 'var(--checkbox/label/color/active/default)';
    }
    if (sentiment === 'danger') {
      if (visualState === 'focus') {
        return contrast
          ? 'var(--checkbox/label/color/danger/focus/contrast)'
          : 'var(--checkbox/label/color/danger/focus/default)';
      }
      return contrast
        ? 'var(--checkbox/label/color/danger/contrast)'
        : 'var(--checkbox/label/color/danger/default)';
    }
    if (visualState === 'focus') {
      return contrast
        ? 'var(--checkbox/label/color/focus/contrast)'
        : 'var(--checkbox/label/color/focus/default)';
    }
    return contrast
      ? 'var(--checkbox/label/color/contrast)'
      : 'var(--checkbox/label/color/default)';
  };

  const getFocusShadow = () => {
    if (visualState !== 'focus' || disabled) return 'none';
    return sentiment === 'danger'
      ? contrast
        ? 'var(--shadow/accessibility/danger/focus/contrast)'
        : 'var(--shadow/accessibility/danger/focus/default)'
      : contrast
        ? 'var(--shadow/accessibility/primary/focus/contrast)'
        : 'var(--shadow/accessibility/primary/focus/default)';
  };

  const getCheckIcon = () => {
    if (!checked || visualState === 'disable') {
      return contrast ? iconCheckboxCheckDisabledContrast : iconCheckboxCheckDisabledDefault;
    }
    if (visualState === 'focus') {
      return contrast ? iconCheckboxCheckFocusContrast : iconCheckboxCheckFocusDefault;
    }
    return contrast ? iconCheckboxCheckContrast : iconCheckboxCheckDefault;
  };

  return (
    <label className={wrapperClasses} data-testid={testId}>
      <span className={inputWrapperClasses}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <span
          aria-hidden="true"
          className="flex items-center justify-center"
          style={{
            width: 'var(--checkbox/input/dimensions/width)',
            height: 'var(--checkbox/input/dimensions/height)',
            borderRadius: 'var(--checkbox/input/dimensions/radius)',
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: checked || visualState === 'disable' ? 0 : 1,
            borderStyle: 'solid',
            boxShadow: getFocusShadow(),
          }}
        >
          {checked && (
            <img
              alt=""
              src={getCheckIcon()}
              style={{
                width: 'var(--checkbox/input/dimensions/icon-width)',
                height: 'var(--checkbox/input/dimensions/icon-height)',
              }}
            />
          )}
        </span>
      </span>
      {showLabel && (
        <span className={labelClasses} style={{ color: getLabelColor() }}>
          {label}
        </span>
      )}
    </label>
  );
}
