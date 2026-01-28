'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'var(--modal/color/overlay)' }}
      onClick={onClose}
    >
      <div
        className="mx-4 flex max-h-[90vh] w-full flex-col overflow-hidden"
        style={{
          maxWidth: 'var(--modal/dimensions/max-width)',
          borderRadius: 'var(--modal/dimensions/radii)',
          backgroundColor: 'var(--modal/color/bg/default)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--modal/color/border/default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            className="border-b border-[var(--modal/color/border/default)]"
            style={{
              paddingInline: 'var(--modal/dimensions/padding/inline)',
              paddingBlock: 'var(--modal/dimensions/padding/block)',
            }}
          >
            <h2 className="text-[length:var(--font-h3-size)] font-[var(--weight-semibold)] leading-[var(--font-h3-line-height)] text-[var(--text/main/default)]">
              {title}
            </h2>
          </div>
        )}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            paddingInline: 'var(--modal/dimensions/padding/inline)',
            paddingBlock: 'var(--modal/dimensions/padding/block)',
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            className="border-t border-[var(--modal/color/border/default)]"
            style={{
              paddingInline: 'var(--modal/dimensions/padding/inline)',
              paddingBlock: 'var(--modal/dimensions/padding/block)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
