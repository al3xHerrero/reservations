import { mockReservations } from '@/domain/mockReservations';
import ReservationDetailClient from './ReservationDetailClient';

// Generate static params for all known reservation IDs
export function generateStaticParams() {
  return mockReservations.map((reservation) => ({
    id: reservation.id,
  }));
}

// Enable dynamic params for IDs not in the static list
export const dynamicParams = true;

export default function ReservationDetailPage() {
  return <ReservationDetailClient />;
}
