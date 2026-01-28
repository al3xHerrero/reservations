'use client';

import { ReservationWizardProvider } from '@/contexts/ReservationWizardContext';

export default function ReservationWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReservationWizardProvider>{children}</ReservationWizardProvider>;
}
