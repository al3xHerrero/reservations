import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ children, className = '', title, header, footer }: CardProps) {
  return (
    <div
      className={`bg-[var(--card/color/bg/default)] border border-[var(--card/color/border/default)] rounded-[var(--card/dimensions/radii)] ${className}`}
    >
      {(title || header) && (
        <div
          className="border-b border-[var(--card/color/border/default)]"
          style={{
            paddingInline: 'var(--card/dimensions/padding/inline)',
            paddingBlock: 'var(--card/dimensions/padding/block)',
          }}
        >
          {header || (
            title && (
              <h2 className="text-[length:var(--font-h4-size)] font-[var(--weight-semibold)] leading-[var(--font-h4-line-height)] text-[var(--text/main/default)]">
                {title}
              </h2>
            )
          )}
        </div>
      )}
      <div
        style={{
          paddingInline: 'var(--card/dimensions/padding/inline)',
          paddingBlock: 'var(--card/dimensions/padding/block)',
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          className="border-t border-[var(--card/color/border/default)]"
          style={{
            paddingInline: 'var(--card/dimensions/padding/inline)',
            paddingBlock: 'var(--card/dimensions/padding/block)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
