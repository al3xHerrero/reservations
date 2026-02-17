'use client';

import React from 'react';

type HeaderCrumb = {
  label: string;
  onNavigate?: () => void;
};

type ReservationWizardHeaderProps = {
  title: string;
  crumbs: HeaderCrumb[];
  children?: React.ReactNode;
};

const Breadcrumb = ({ crumbs }: { crumbs: HeaderCrumb[] }) => {
  return (
    <p
      style={{
        fontSize: '14px',
        color: 'var(--palette-neutral-white)',
        margin: '0 0 4px 0',
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        const crumbContent = crumb.onNavigate ? (
          <span
            key={crumb.label + index}
            role="button"
            tabIndex={0}
            onClick={crumb.onNavigate}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                crumb.onNavigate?.();
              }
            }}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              color: 'var(--palette-neutral-white)',
            }}
          >
            {crumb.label}
          </span>
        ) : (
          <span
            key={crumb.label + index}
            style={{
              color: 'var(--text-secondary-on-dark)',
              fontWeight: 600,
            }}
          >
            {crumb.label}
          </span>
        );

        return (
          <React.Fragment key={crumb.label + index}>
            {crumbContent}
            {!isLast && (
              <span style={{ color: 'var(--text-secondary-on-dark)' }}>/</span>
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default function ReservationWizardHeader({
  crumbs,
  title,
  children,
}: ReservationWizardHeaderProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--palette-neutral-700)',
        padding: 'var(--space-6)',
        marginTop: '40px',
      }}
    >
      <Breadcrumb crumbs={crumbs} />
      <h1
        style={{
          fontSize: 'var(--size-h2)',
          lineHeight: 'var(--leading-h2)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--palette-neutral-white)',
          fontFamily: 'var(--font-body)',
          margin: 0,
        }}
      >
        {title}
      </h1>
      {children && <div style={{ marginTop: 'var(--space-4)' }}>{children}</div>}
    </div>
  );
}
