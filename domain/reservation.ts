/**
 * Reservation Status enum
 * Represents the current state of a reservation
 */
export enum ReservationStatus {
  PAID = 'paid',
  TO_BE_PAID = 'to_be_paid',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Payment Status enum
 * Represents the payment state
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

/**
 * Payment information
 */
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string; // e.g., 'credit_card', 'cash', 'bank_transfer'
  transactionId?: string;
  paidAt?: Date;
  // TODO: Add payment gateway integration logic
}

/**
 * Deposit information
 */
export interface Deposit {
  id: string;
  amount: number;
  currency: string;
  required: boolean;
  paid: boolean;
  paidAt?: Date;
  refunded: boolean;
  refundedAt?: Date;
  // TODO: Add deposit refund logic
}

/**
 * Reservation domain model
 * Aligned with docs/states.md and specs.md requirements
 */
export interface Reservation {
  id: string;
  // Customer information
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Reservation details (aligned with docs/states.md)
  experienceName: string;
  dateTime: string; // ISO string format
  status: ReservationStatus;
  totalAmount: number;
  currency: string;
  
  // Payment information (aligned with docs/states.md)
  paymentStatus: 'paid' | 'to_be_paid' | 'cancelled' | 'expired';
  
  // Deposit information (aligned with docs/states.md - placeholder v0)
  depositEnabled: boolean;
  depositAmount: number;
  remainingAmount: number;
  
  // Legacy fields (kept for backward compatibility with existing UI)
  reservationDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  payment: Payment;
  deposit: Deposit;
  
  // Additional details
  numberOfGuests: number;
  specialRequests?: string;
  notes?: string;
  
  // Reservations Overview fields (aligned with docs/flows.md)
  bookingAgentName?: string;
  bookingAgentType?: string; // e.g., 'internal', 'external', 'partner'
  eventName?: string; // Event name (can use experienceName as fallback)
  numberOfTickets?: number; // Number of tickets (can use numberOfGuests as fallback)
  attendanceConfirmed?: boolean; // Whether arrival has been confirmed
  
  // Location fields
  city?: string; // City where the event takes place
  venue?: string; // Venue name
  eventImage?: string; // Event image URL
  venueAddress?: string; // Optional full venue address
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  // TODO: Add cancellation policy logic
  // TODO: Add modification logic
}
