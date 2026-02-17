'use client';

import React from 'react';

const bgColor = 'var(--palette-neutral-75, #f6f7f7)';
const borderColor = 'var(--border-main-default, #ccd2d8)';

const Keyframes = () => (
  <style>
    {`
      @keyframes skeletonPulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
      }
    `}
  </style>
);

const Block = ({
  width = '100%',
  height = 24,
  radius = '8px',
  style,
}: {
  width?: string;
  height?: number;
  radius?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      backgroundColor: bgColor,
      animation: 'skeletonPulse 1.6s ease-in-out infinite',
      ...style,
    }}
  />
);

export default function CheckoutSkeleton() {
  return (
    <>
      <Keyframes />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* Top bar */}
        <Block height={40} width="100%" radius="8px" />

        {/* Fieldset section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section label */}
          <Block height={26} width="190px" radius="8px" />

          {/* First row of 3 radio-like cards */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {[0, 1, 2].map((value) => (
              <Block key={value} height={72} width="100%" radius="8px" />
            ))}
          </div>

          {/* Second row of 3 radio-like cards */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {[0, 1, 2].map((value) => (
              <Block key={value} height={72} width="100%" radius="8px" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            borderTop: `1px solid ${borderColor}`,
          }}
        />
      </div>
    </>
  );
}
