'use client';

import { ReactNode } from 'react';
import { ReservationWizardProvider } from '@/contexts/ReservationWizardContext';

export function Providers({ children }: { children: ReactNode }) {
  return <ReservationWizardProvider>{children}</ReservationWizardProvider>;
}
