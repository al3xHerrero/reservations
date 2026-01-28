import React from 'react';

type BreadcrumbItem = {
  label: string;
  href?: string;
  underline?: boolean;
};

type FlowHeaderProps = {
  breadcrumb: BreadcrumbItem[];
  title: string;
};

export function FlowHeader({ breadcrumb, title }: FlowHeaderProps) {
  return (
    <div
      className="px-[var(--shell/dimensions/padding)] py-[var(--shell/dimensions/padding)]"
      style={{ backgroundColor: 'var(--bg-contrast)' }}
    >
      <div className="mx-auto w-full max-w-[1136px] space-y-2">
        <div
          className="flex items-center gap-1 text-[length:var(--size-base)] leading-[var(--leading-base)]"
          style={{ color: 'var(--text-on-dark)' }}
        >
          {breadcrumb.map((item, index) => {
            const isLink = Boolean(item.href);
            const isUnderlined = Boolean(item.underline);
            const className = `inline-flex items-center px-0 py-0 ${isUnderlined ? 'underline' : ''}`;
            const content = isLink ? (
              <a
                className={className}
                href={item.href}
                style={{ color: 'var(--text-on-dark)' }}
              >
                {item.label}
              </a>
            ) : (
              <span className={className} style={{ color: 'var(--text-on-dark)' }}>
                {item.label}
              </span>
            );

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                {content}
                {index < breadcrumb.length - 1 && <span>/</span>}
              </React.Fragment>
            );
          })}
        </div>
        <h1
          className="text-[length:var(--font-h2-size)] font-[var(--weight-semibold)] leading-[var(--font-h2-line-height)]"
          style={{ color: 'var(--text-on-dark)' }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
