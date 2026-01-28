import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSentiment = 'default' | 'danger' | 'success' | 'sharp';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  sentiment?: ButtonSentiment;
  contrast?: boolean;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children: React.ReactNode;
}

const resolveVariant = (variant: ButtonVariant) => (variant === 'ghost' ? 'tertiary' : variant);

export function Button({
  variant = 'primary',
  sentiment = 'default',
  contrast = false,
  size = 'md',
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const resolvedVariant = resolveVariant(variant);
  const resolvedSize = size === 'sm' ? 'sm' : 'lg';
  const suffix = contrast ? '-contrast' : '';
  const prefix = sentiment === 'default' ? '' : `${sentiment}-`;
  const token = (name: string) => `var(--button-${prefix}${name}${suffix})`;
  const style = {
    '--btn-bg': token(`${resolvedVariant}-bg`),
    '--btn-fg': token(`${resolvedVariant}-fg`),
    '--btn-border': token(`${resolvedVariant}-border`),
    '--btn-hover-bg': token(`${resolvedVariant}-bg-hover`),
    '--btn-hover-fg': token(`${resolvedVariant}-fg-hover`),
    '--btn-hover-border': token(`${resolvedVariant}-border-hover`),
    '--btn-focus-bg': token(`${resolvedVariant}-bg-focus`),
    '--btn-focus-fg': token(`${resolvedVariant}-fg-focus`),
    '--btn-focus-border': token(`${resolvedVariant}-border-focus`),
    '--btn-disabled-bg': token(`${resolvedVariant}-bg-disabled`),
    '--btn-disabled-fg': token(`${resolvedVariant}-fg-disabled`),
    '--btn-disabled-border': token(`${resolvedVariant}-border-disabled`),
  } as React.CSSProperties;

  const sizeClasses =
    resolvedSize === 'sm'
      ? 'h-[var(--button-height-sm)] min-w-[var(--button-min-width-sm)] px-[var(--button-padding-inline-sm)] text-sm leading-[var(--text-sm-line-height)]'
      : 'h-[var(--button-height-lg)] min-w-[var(--button-min-width-lg)] px-[var(--button-padding-inline-lg)] text-base leading-[var(--text-base-line-height)]';

  const baseClasses = [
    'inline-flex items-center justify-center gap-1 rounded-[var(--button-radius)] font-semibold whitespace-nowrap',
    'border bg-[var(--btn-bg)] text-[var(--btn-fg)] border-[var(--btn-border)]',
    'hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-fg)] hover:border-[var(--btn-hover-border)]',
    'focus-visible:bg-[var(--btn-focus-bg)] focus-visible:text-[var(--btn-focus-fg)] focus-visible:border-[var(--btn-focus-border)] focus-visible:outline-none',
    'disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-fg)] disabled:border-[var(--btn-disabled-border)] disabled:cursor-not-allowed',
    'transition-colors',
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={baseClasses} disabled={disabled} style={style} {...props}>
      {leadingIcon && <span className="flex h-5 w-5 items-center justify-center">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="flex h-5 w-5 items-center justify-center">{trailingIcon}</span>}
    </button>
  );
}
