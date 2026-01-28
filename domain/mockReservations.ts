import { Reservation, ReservationStatus, PaymentStatus } from '@/domain/reservation';

const STORAGE_KEY = 'reservations_store_v1';
let inMemoryReservations: Reservation[] | null = null;

/**
 * Helper function to map PaymentStatus enum to paymentStatus string
 */
function mapPaymentStatus(status: PaymentStatus): 'paid' | 'to_be_paid' | 'cancelled' | 'expired' {
  switch (status) {
    case PaymentStatus.PAID:
      return 'paid';
    case PaymentStatus.PARTIAL:
    case PaymentStatus.PENDING:
      return 'to_be_paid';
    case PaymentStatus.REFUNDED:
      return 'cancelled';
    default:
      return 'to_be_paid';
  }
}

/**
 * Mock reservations data
 * Contains at least 5 reservations with various statuses
 * Aligned with docs/states.md contract
 */
export const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '+1-555-0101',
    experienceName: 'Luxury Suite Experience',
    dateTime: new Date('2024-02-01').toISOString(),
    status: ReservationStatus.PAID,
    totalAmount: 1200.00,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.PAID),
    depositEnabled: true,
    depositAmount: 300.00,
    remainingAmount: 900.00,
    reservationDate: new Date('2024-01-15'),
    checkInDate: new Date('2024-02-01'),
    checkOutDate: new Date('2024-02-05'),
    payment: {
      id: 'pay-001',
      amount: 1200.00,
      currency: 'USD',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-001',
      paidAt: new Date('2024-01-15'),
    },
    deposit: {
      id: 'dep-001',
      amount: 300.00,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2024-01-15'),
      refunded: false,
    },
    numberOfGuests: 2,
    specialRequests: 'Late check-in requested',
    bookingAgentName: 'Sarah Martinez',
    bookingAgentType: 'internal',
    eventName: 'Luxury Suite Experience',
    numberOfTickets: 2,
    attendanceConfirmed: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'res-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1-555-0102',
    experienceName: 'Standard Room Experience',
    dateTime: new Date('2024-02-10').toISOString(),
    status: ReservationStatus.TO_BE_PAID,
    totalAmount: 800.00,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.PARTIAL),
    depositEnabled: true,
    depositAmount: 200.00,
    remainingAmount: 600.00,
    reservationDate: new Date('2024-01-20'),
    checkInDate: new Date('2024-02-10'),
    checkOutDate: new Date('2024-02-12'),
    payment: {
      id: 'pay-002',
      amount: 800.00,
      currency: 'USD',
      status: PaymentStatus.PARTIAL,
      method: 'bank_transfer',
      paidAt: new Date('2024-01-20'),
    },
    deposit: {
      id: 'dep-002',
      amount: 200.00,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2024-01-20'),
      refunded: false,
    },
    numberOfGuests: 1,
    notes: 'Awaiting full payment',
    bookingAgentName: 'Michael Thompson',
    bookingAgentType: 'internal',
    eventName: 'Standard Room Experience',
    numberOfTickets: 1,
    attendanceConfirmed: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'res-003',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@example.com',
    customerPhone: '+1-555-0103',
    experienceName: 'Premium Suite Experience',
    dateTime: new Date('2024-01-05').toISOString(),
    status: ReservationStatus.EXPIRED,
    totalAmount: 1500.00,
    currency: 'USD',
    paymentStatus: 'expired',
    depositEnabled: true,
    depositAmount: 375.00,
    remainingAmount: 1125.00,
    reservationDate: new Date('2023-12-10'),
    checkInDate: new Date('2024-01-05'),
    checkOutDate: new Date('2024-01-08'),
    payment: {
      id: 'pay-003',
      amount: 1500.00,
      currency: 'USD',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-003',
      paidAt: new Date('2023-12-10'),
    },
    deposit: {
      id: 'dep-003',
      amount: 375.00,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2023-12-10'),
      refunded: false,
    },
    numberOfGuests: 3,
    specialRequests: 'High floor preferred',
    bookingAgentName: 'Emma Wilson',
    bookingAgentType: 'partner',
    eventName: 'Premium Suite Experience',
    numberOfTickets: 3,
    attendanceConfirmed: true,
    createdAt: new Date('2023-12-10'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'res-004',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    customerPhone: '+1-555-0104',
    experienceName: 'Deluxe Room Experience',
    dateTime: new Date('2024-02-15').toISOString(),
    status: ReservationStatus.CANCELLED,
    totalAmount: 900.00,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.REFUNDED),
    depositEnabled: true,
    depositAmount: 225.00,
    remainingAmount: 675.00,
    reservationDate: new Date('2024-01-12'),
    checkInDate: new Date('2024-02-15'),
    checkOutDate: new Date('2024-02-18'),
    payment: {
      id: 'pay-004',
      amount: 900.00,
      currency: 'USD',
      status: PaymentStatus.REFUNDED,
      method: 'credit_card',
      transactionId: 'txn-004',
      paidAt: new Date('2024-01-12'),
    },
    deposit: {
      id: 'dep-004',
      amount: 225.00,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2024-01-12'),
      refunded: true,
      refundedAt: new Date('2024-01-18'),
    },
    numberOfGuests: 2,
    notes: 'Cancelled by customer',
    bookingAgentName: 'David Lee',
    bookingAgentType: 'external',
    eventName: 'Deluxe Room Experience',
    numberOfTickets: 2,
    attendanceConfirmed: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'res-005',
    customerName: 'Robert Wilson',
    customerEmail: 'r.wilson@example.com',
    customerPhone: '+1-555-0105',
    experienceName: 'Family Suite Experience',
    dateTime: new Date('2024-03-01').toISOString(),
    status: ReservationStatus.TO_BE_PAID,
    totalAmount: 1800.00,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.PENDING),
    depositEnabled: true,
    depositAmount: 450.00,
    remainingAmount: 1350.00,
    reservationDate: new Date('2024-01-25'),
    checkInDate: new Date('2024-03-01'),
    checkOutDate: new Date('2024-03-07'),
    payment: {
      id: 'pay-005',
      amount: 1800.00,
      currency: 'USD',
      status: PaymentStatus.PENDING,
      method: 'credit_card',
    },
    deposit: {
      id: 'dep-005',
      amount: 450.00,
      currency: 'USD',
      required: true,
      paid: false,
      refunded: false,
    },
    numberOfGuests: 4,
    specialRequests: 'Family room with extra beds',
    bookingAgentName: 'Jessica Brown',
    bookingAgentType: 'internal',
    eventName: 'Family Suite Experience',
    numberOfTickets: 4,
    attendanceConfirmed: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'res-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@example.com',
    customerPhone: '+1-555-0106',
    experienceName: 'Standard Room Experience',
    dateTime: new Date('2024-01-20').toISOString(),
    status: ReservationStatus.EXPIRED,
    totalAmount: 600.00,
    currency: 'USD',
    paymentStatus: 'expired',
    depositEnabled: true,
    depositAmount: 150.00,
    remainingAmount: 450.00,
    reservationDate: new Date('2024-01-08'),
    checkInDate: new Date('2024-01-20'),
    checkOutDate: new Date('2024-01-22'),
    payment: {
      id: 'pay-006',
      amount: 600.00,
      currency: 'USD',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-006',
      paidAt: new Date('2024-01-08'),
    },
    deposit: {
      id: 'dep-006',
      amount: 150.00,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2024-01-08'),
      refunded: false,
    },
    numberOfGuests: 1,
    notes: 'Customer did not show up',
    bookingAgentName: 'Alex Rodriguez',
    bookingAgentType: 'internal',
    eventName: 'Standard Room Experience',
    numberOfTickets: 1,
    attendanceConfirmed: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
  },
];

const cloneReservations = (reservations: Reservation[]) =>
  reservations.map((reservation) => ({
    ...reservation,
    payment: { ...reservation.payment },
    deposit: { ...reservation.deposit },
  }));

const toDate = (value: Date | string | undefined) => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

const reviveReservation = (reservation: Reservation): Reservation => ({
  ...reservation,
  reservationDate: new Date(reservation.reservationDate),
  checkInDate: new Date(reservation.checkInDate),
  checkOutDate: new Date(reservation.checkOutDate),
  createdAt: new Date(reservation.createdAt),
  updatedAt: new Date(reservation.updatedAt),
  payment: {
    ...reservation.payment,
    paidAt: toDate(reservation.payment.paidAt),
  },
  deposit: {
    ...reservation.deposit,
    paidAt: toDate(reservation.deposit.paidAt),
    refundedAt: toDate(reservation.deposit.refundedAt),
  },
});

const readStoredReservations = (): Reservation[] | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Reservation[];
    return parsed.map(reviveReservation);
  } catch {
    return null;
  }
};

const persistReservations = (reservations: Reservation[]) => {
  inMemoryReservations = reservations;
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

const getReservationsStore = (): Reservation[] => {
  if (inMemoryReservations) return inMemoryReservations;
  const stored = readStoredReservations();
  if (stored) {
    inMemoryReservations = stored;
    return stored;
  }
  const seeded = cloneReservations(mockReservations);
  persistReservations(seeded);
  return seeded;
};

/**
 * Get reservation by ID
 */
export function getReservationById(id: string): Reservation | undefined {
  return getReservationsStore().find((res) => res.id === id);
}

/**
 * Get all reservations
 */
export function getAllReservations(): Reservation[] {
  return getReservationsStore();
}

/**
 * Create or update a reservation in the store
 */
export function upsertReservation(reservation: Reservation): Reservation {
  const reservations = getReservationsStore();
  const existingIndex = reservations.findIndex((item) => item.id === reservation.id);
  if (existingIndex >= 0) {
    reservations[existingIndex] = reservation;
  } else {
    reservations.unshift(reservation);
  }
  persistReservations(reservations);
  return reservation;
}

/**
 * Mark reservation as paid
 */
export function markReservationPaid(reservationId: string): Reservation | undefined {
  const reservations = getReservationsStore();
  const reservationIndex = reservations.findIndex((item) => item.id === reservationId);
  if (reservationIndex === -1) {
    return undefined;
  }

  const current = reservations[reservationIndex];
  const updated: Reservation = {
    ...current,
    status: ReservationStatus.PAID,
    paymentStatus: 'paid',
    payment: {
      ...current.payment,
      status: PaymentStatus.PAID,
      paidAt: new Date(),
      transactionId: current.payment.transactionId || `txn-${reservationId}`,
    },
    updatedAt: new Date(),
  };

  reservations[reservationIndex] = updated;
  persistReservations(reservations);
  return updated;
}
