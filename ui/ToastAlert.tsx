'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertSentiment } from './Alert';

export interface ToastAlertProps {
  /** The title/message of the toast */
  title: string;
  /** Optional description text */
  description?: React.ReactNode;
  /** The visual style variant */
  sentiment?: AlertSentiment;
  /** Use contrasting solid background */
  contrast?: boolean;
  /** Whether the toast is visible */
  visible: boolean;
  /** Callback when toast is closed (either by user or auto-dismiss) */
  onClose?: () => void;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  autoDismissMs?: number;
  /** Position from top edge */
  topOffset?: number;
  /** Position from right edge */
  rightOffset?: number;
}

export function ToastAlert({
  title,
  description,
  sentiment = 'positive',
  contrast = false,
  visible,
  onClose,
  autoDismissMs = 3000,
  topOffset = 24,
  rightOffset = 24,
}: ToastAlertProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true);
        });
      });
    } else {
      setIsAnimatingIn(false);
    }
  }, [visible]);

  // Auto-dismiss timer
  useEffect(() => {
    if (visible && autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismissMs, onClose]);

  const handleTransitionEnd = () => {
    if (!visible && !isAnimatingIn) {
      setShouldRender(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        position: 'fixed',
        top: `${topOffset}px`,
        right: `${rightOffset}px`,
        zIndex: 9999,
        transform: isAnimatingIn ? 'translateX(0)' : 'translateX(calc(100% + 48px))',
        opacity: isAnimatingIn ? 1 : 0,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(6, 24, 44, 0.15)',
        borderRadius: '8px',
      }}
    >
      <Alert
        title={title}
        description={description}
        sentiment={sentiment}
        contrast={contrast}
        showCloseButton={true}
        onClose={handleClose}
      />
    </div>
  );
}
