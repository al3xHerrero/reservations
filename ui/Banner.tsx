import React from 'react';

type BannerVariant = 'info' | 'warning' | 'danger' | 'success';

interface BannerProps {
  children: React.ReactNode;
  variant?: BannerVariant;
  className?: string;
}

export function Banner({ children, variant = 'info', className = '' }: BannerProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'warning':
        return 'var(--banner/color/bg/warning)';
      case 'danger':
        return 'var(--banner/color/bg/danger)';
      case 'success':
        return 'var(--banner/color/bg/success)';
      default:
        return 'var(--banner/color/bg/info)';
    }
  };

  const getForegroundColor = () => {
    switch (variant) {
      case 'warning':
        return 'var(--banner/color/fg/warning)';
      case 'danger':
        return 'var(--banner/color/fg/danger)';
      case 'success':
        return 'var(--banner/color/fg/success)';
      default:
        return 'var(--banner/color/fg/info)';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'warning':
        return 'var(--banner/color/border/warning)';
      case 'danger':
        return 'var(--banner/color/border/danger)';
      case 'success':
        return 'var(--banner/color/border/success)';
      default:
        return 'var(--banner/color/border/info)';
    }
  };

  return (
    <div
      className={className}
      style={{
        padding: 'var(--banner/dimensions/padding)',
        borderRadius: 'var(--banner/dimensions/radii)',
        backgroundColor: getBackgroundColor(),
        color: getForegroundColor(),
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: getBorderColor(),
      }}
    >
      {children}
    </div>
  );
}
