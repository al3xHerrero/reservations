'use client';

import React, { useState } from 'react';

type LinkProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Link({ children, href, className = '', onClick, ...props }: LinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getColor = () => {
    if (isHovered) return 'var(--link-primary-hover)';
    if (isFocused) return 'var(--link-primary-focus)';
    return 'var(--link-primary)';
  };

  const baseClasses = [
    'inline-flex items-center gap-1 px-1 py-0',
    'text-[length:var(--size-base)] font-[var(--weight-semibold)] leading-[var(--leading-base)]',
    'transition-colors',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = { color: getColor() };

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
