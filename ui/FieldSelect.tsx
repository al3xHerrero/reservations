'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { FieldCheckbox } from './FieldCheckbox';
import { assetPath } from '@/lib/assetPath';

const chevronDownIcon = assetPath('/icons/chevron-down.svg');
const chevronDownDisabledIcon = assetPath('/icons/chevron-down-disabled.svg');
const errorIcon = assetPath('/icons/error.svg');

export type FieldSelectOption = { value: string; label: string };

interface FieldSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  options: FieldSelectOption[];
  multiple?: boolean;
  error?: string;
  disabled?: boolean;
  helperText?: string;
  name?: string;
  required?: boolean;
  defaultOpen?: boolean;
  testId?: string;
  className?: string;
  /** Custom display value to override the auto-generated one */
  displayValue?: string;
}

export function FieldSelect({
  id,
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  multiple = false,
  error,
  disabled = false,
  helperText,
  name,
  required = false,
  defaultOpen = false,
  testId,
  className = '',
  displayValue,
}: FieldSelectProps) {
  const internalId = id ?? useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedValues = useMemo((): string[] => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return typeof value === 'string' && value ? [value] : [];
  }, [multiple, value]);

  const selectedLabels = useMemo(() => {
    const labels = options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
    return labels.join(', ');
  }, [options, selectedValues]);

  // Use displayValue if provided, otherwise use auto-generated labels or placeholder
  const displayText = displayValue ?? (selectedLabels || placeholder);
  const isPlaceholder = !displayValue && selectedLabels.length === 0;

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => {
    if (disabled) return;
    setIsOpen((open) => !open);
  };

  const handleSelect = (option: FieldSelectOption) => {
    if (multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((val) => val !== option.value)
        : [...selectedValues, option.value];
      onChange(next);
      return;
    }
    onChange(option.value);
    closeMenu();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = options.findIndex((option) => selectedValues.includes(option.value));
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [isOpen, options, selectedValues]);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const option = options[activeIndex];
      if (option) handleSelect(option);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
  };

  const hasError = Boolean(error);
  const chevronSrc = disabled ? chevronDownDisabledIcon : chevronDownIcon;
  const labelColor = disabled
    ? 'text-[var(--select-text-disabled)]'
    : hasError
      ? 'text-[var(--select-label-danger)]'
      : 'text-[var(--select-label)]';
  const valueColor = disabled
    ? 'text-[var(--select-text-disabled)]'
    : isPlaceholder
      ? 'text-[var(--select-placeholder)]'
      : 'text-[var(--select-value)]';

  const fieldClasses = [
    'relative flex h-[var(--dimensions-height)] w-full items-center rounded-[var(--dimensions-radii)] border bg-[var(--select-bg)]',
    'pl-[var(--dimensions-padding-inline)] pr-[var(--dimensions-padding-inline-icon)]',
    disabled ? 'border-[var(--select-bg-disabled)] bg-[var(--select-bg-disabled)]' : '',
    hasError ? 'border-[var(--select-border-danger)]' : 'border-[var(--select-border)]',
    isOpen && !hasError ? 'border-2 border-[var(--select-border-focus)]' : '',
    isOpen && hasError ? 'border-2 border-[var(--select-border-danger-focus)]' : '',
    isOpen ? 'z-20' : '',
    !disabled && !hasError ? 'hover:border-[var(--select-border-hover)]' : '',
    'transition-colors',
  ]
    .filter(Boolean)
    .join(' ');

  const valuePadding = label ? 'pt-4' : '';

  return (
    <div className={`w-full space-y-2 ${className}`} ref={wrapperRef}>
      <div className="relative">
        <button
          type="button"
          className={fieldClasses}
          onClick={toggleMenu}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError || undefined}
          aria-labelledby={label ? `${internalId}-label` : undefined}
          aria-controls={`${internalId}-listbox`}
          name={name}
          data-testid={testId}
          style={{
            boxShadow: isOpen
              ? hasError
                ? 'var(--shadow/accessibility/danger/focus/default)'
                : 'var(--select-shadow-focus)'
              : undefined,
          }}
        >
          <div className="relative flex-1 min-w-0 text-left overflow-hidden">
            {label && (
              <span
                id={`${internalId}-label`}
                className={`absolute top-0 text-[length:var(--size-caption)] font-[var(--weight-semibold)] leading-[var(--leading-caption)] ${labelColor}`}
              >
                {label}
                {required && <span className="ml-1 text-[var(--select-border-danger)]">*</span>}
              </span>
            )}
            <span
              className={`block overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--size-base)] font-[var(--weight-regular)] leading-[var(--leading-base)] ${valueColor} ${valuePadding}`}
            >
              {displayText}
            </span>
          </div>
          <span
            className="absolute"
            style={{
              right: isOpen ? '10px' : '11px',
              top: isOpen ? '16px' : '17px',
              width: 'var(--icon-dimension-width-base)',
              height: 'var(--icon-dimension-height-base)',
            }}
          >
            <img
              alt=""
              className={`block ${isOpen ? 'rotate-180' : ''}`}
              src={chevronSrc}
              data-testid={testId ? `${testId}-chevron` : undefined}
              style={{ width: '100%', height: '100%' }}
            />
          </span>
        </button>

        {isOpen && !disabled && (
          <div
            className="absolute left-[-12px] right-[-12px] top-[-12px] z-10 border border-[var(--select-border)] bg-[var(--select-bg)]"
            role="listbox"
            id={`${internalId}-listbox`}
            aria-multiselectable={multiple || undefined}
            style={{
              borderRadius: 'var(--select-container-radius)',
              padding: 'var(--select-container-padding)',
              paddingTop: 'var(--select-divider-padding-block-start)',
              boxShadow: 'var(--select-shadow-menu)',
            }}
          >
            <div className="flex max-h-72 flex-col gap-[var(--dimensions/gap)] overflow-y-auto">
              {options.map((option, index) => {
                const selected = selectedValues.includes(option.value);
                const isActive = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center text-left text-[length:var(--size-base)] leading-[var(--leading-base)] text-[var(--select-item-text)]"
                    style={{
                      gap: 'var(--select-item-gap)',
                      paddingInline: 'var(--select-item-padding-inline)',
                      paddingBlock: 'var(--select-item-padding-block)',
                      borderRadius: 'var(--select-item-radius)',
                      backgroundColor: selected
                        ? 'var(--palette-primary-100, #e6f4ff)'
                        : isActive
                          ? 'var(--palette-neutral-100)'
                          : 'transparent',
                    }}
                  >
                    {multiple && (
                      <FieldCheckbox
                        checked={selected}
                        onChange={() => {}}
                        showLabel={false}
                        size="small"
                      />
                    )}
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasError ? (
        <div
          className="flex items-start"
          style={{
            gap: 'var(--select-helper-gap)',
            paddingLeft: 'var(--select-helper-padding-inline-start)',
            paddingTop: 'var(--select-helper-padding-block-start)',
          }}
        >
          <span
            className="relative shrink-0"
            style={{
              width: 'var(--icon-dimension-width-caption)',
              height: 'var(--icon-dimension-height-caption)',
            }}
          >
            <img alt="" className="block h-full w-full" src={errorIcon} />
          </span>
          <p
            className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--select-helper-danger)]"
          >
            {error}
          </p>
        </div>
      ) : helperText ? (
        <p
          className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--select-helper-foreground)]"
          style={{
            paddingLeft: 'var(--select-helper-padding-inline-start)',
            paddingTop: 'var(--select-helper-padding-block-start)',
          }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
