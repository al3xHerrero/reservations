import { Reservation, ReservationStatus, PaymentStatus } from '@/domain/reservation';

const STORAGE_KEY = 'reservations_store_v1';
const VERSION_KEY = 'reservations_store_version';
const DATA_VERSION = 'v2026.01';
let inMemoryReservations: Reservation[] | null = null;

export type EventProfile = {
  id: string;
  name: string;
  city: string;
  venue: string;
  venueAddress: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  state: 'active' | 'not_for_sale';
};

export type BusinessProfile = {
  id: string;
  name: string;
  email: string;
  bookingAgentType: string;
  balanceAllowed: boolean;
};

export type TicketOption = {
  id: string;
  title: string;
  price: number;
  availability: number;
};

const VAN_GOGH_IMAGE =
  'https://applications-media.feverup.com/image/upload/f_auto,w_720,h_720/fever2/plan/photo/977e38cc-1f0d-11ee-82d1-120342c26c11.jpg';
const MONET_IMAGE =
  'https://images.feverup.com/plan/photo/433c6d42-3f9f-11f0-8f81-aad6a9c3e2dc.jpg';
const CANDLELIGHT_NY_IMAGE =
  'https://applications-media.feverup.com/image/upload/f_auto,w_720,h_720/fever2/plan/photo/2226d752-139c-11f0-a13b-a290fe7a90ab.jpg';

const VAN_GOGH_PROFILE: EventProfile = {
  id: 'van-gogh-madrid',
  name: 'Van Gogh: The Immersive Experience',
  city: 'Madrid',
  venue: 'IDEAL Centro de Artes Digitales',
  venueAddress: 'Calle Valenzuela 5, 28012 Madrid',
  thumbnail: VAN_GOGH_IMAGE,
  startDate: '2026-02-08T19:00:00',
  endDate: '2026-04-15T21:00:00',
  state: 'active',
};

const MONET_PROFILE: EventProfile = {
  id: 'monet-madrid',
  name: 'Monet: The Immersive Experience',
  city: 'Madrid',
  venue: 'Fundación Telefónica',
  venueAddress: 'Calle Fuencarral 3, 28004 Madrid',
  thumbnail: MONET_IMAGE,
  startDate: '2026-03-05T10:00:00',
  endDate: '2026-05-31T20:00:00',
  state: 'active',
};

const CANDLELIGHT_NY_PROFILE: EventProfile = {
  id: 'candlelight-nyc',
  name: 'Candlelight: Tribute to Coldplay',
  city: 'New York',
  venue: 'The Sheen Center for Thought & Culture',
  venueAddress: '18 Bleecker Street, New York, NY 10012',
  thumbnail: CANDLELIGHT_NY_IMAGE,
  startDate: '2026-03-15T19:00:00',
  endDate: '2026-05-10T21:00:00',
  state: 'active',
};

export const EVENT_PROFILES: EventProfile[] = [
  VAN_GOGH_PROFILE,
  MONET_PROFILE,
  CANDLELIGHT_NY_PROFILE,
];

export const BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'agency-horizonte',
    name: 'Agencia Horizonte',
    email: 'maria.castillo@agenciahorizonte.es',
    bookingAgentType: 'Agency',
    balanceAllowed: true,
  },
  {
    id: 'global-trade',
    name: 'Global Trade Collective',
    email: 'events@globaltrade.es',
    bookingAgentType: 'Corporate',
    balanceAllowed: true,
  },
  {
    id: 'colegio-mediterraneo',
    name: 'Colegio Mediterráneo',
    email: 'colegio@mediterraneo.edu',
    bookingAgentType: 'Educational',
    balanceAllowed: false,
  },
  {
    id: 'museo-vivo',
    name: 'Fundación Museo Vivo',
    email: 'contacto@museovivo.es',
    bookingAgentType: 'Cultural',
    balanceAllowed: true,
  },
  {
    id: 'guias-madrid',
    name: 'Guías Oficiales de Madrid',
    email: 'reservas@guiasmadrid.com',
    bookingAgentType: 'Guide',
    balanceAllowed: false,
  },
  {
    id: 'grupo-magna',
    name: 'Grupo Magna',
    email: 'magna@largogroup.es',
    bookingAgentType: 'Large Group',
    balanceAllowed: true,
  },
  {
    id: 'premier-hospitality',
    name: 'Premier Hospitality NYC',
    email: 'hospitality@premier-nyc.com',
    bookingAgentType: 'Premium Services',
    balanceAllowed: true,
  },
  {
    id: 'brooklyn-arts',
    name: 'Brooklyn Arts Coalition',
    email: 'tickets@brooklynarts.org',
    bookingAgentType: 'Partnerships',
    balanceAllowed: false,
  },
  {
    id: 'fever-ops',
    name: 'Fever Internal Ops',
    email: 'ops@feverup.com',
    bookingAgentType: 'Internal Operations',
    balanceAllowed: true,
  },
];

export const EVENT_TICKETS: Record<string, TicketOption[]> = {
  [VAN_GOGH_PROFILE.id]: [
    { id: 'van-gogh-standard', title: 'General Admission', price: 35.0, availability: 250 },
    { id: 'van-gogh-vip', title: 'VIP Immersive Experience', price: 68.0, availability: 40 },
    { id: 'van-gogh-group', title: 'Group Experience (10+)', price: 310.0, availability: 10 },
  ],
  [MONET_PROFILE.id]: [
    { id: 'monet-standard', title: 'General Admission', price: 32.0, availability: 220 },
    { id: 'monet-guided', title: 'Guided Tour + Audio', price: 58.0, availability: 65 },
    { id: 'monet-family', title: 'Family Pack (4 pax)', price: 120.0, availability: 12 },
  ],
  [CANDLELIGHT_NY_PROFILE.id]: [
    { id: 'candlelight-tier1', title: 'Tier 1 Seating', price: 48.0, availability: 180 },
    { id: 'candlelight-tier2', title: 'Tier 2 Seating', price: 68.0, availability: 110 },
    { id: 'candlelight-hospitality', title: 'Hospitality Package', price: 190.0, availability: 30 },
  ],
};

export const DEFAULT_EVENT_ID = EVENT_PROFILES[0].id;

export function getEventTicketOptions(eventId?: string): TicketOption[] {
  if (!eventId) return EVENT_TICKETS[DEFAULT_EVENT_ID];
  return EVENT_TICKETS[eventId] || EVENT_TICKETS[DEFAULT_EVENT_ID];
}

const EVENT_IMAGE_MAP: Record<string, string> = EVENT_PROFILES.reduce((acc, profile) => {
  acc[profile.name] = profile.thumbnail;
  return acc;
}, {} as Record<string, string>);

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

const createPayment = (params: {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  transactionId?: string;
  paidAt?: Date;
}) => {
  const payment: any = {
    id: params.id,
    amount: params.amount,
    currency: params.currency,
    status: params.status,
    method: params.method,
  };
  if (params.transactionId) {
    payment.transactionId = params.transactionId;
  }
  if (params.paidAt) {
    payment.paidAt = params.paidAt;
  }
  return payment;
};

const createDeposit = (params: {
  id: string;
  amount: number;
  currency: string;
  required: boolean;
  paid: boolean;
  paidAt?: Date;
  refunded?: boolean;
  refundedAt?: Date;
}) => ({
  id: params.id,
  amount: params.amount,
  currency: params.currency,
  required: params.required,
  paid: params.paid,
  paidAt: params.paidAt,
  refunded: params.refunded ?? false,
  refundedAt: params.refundedAt,
});

export const mockReservations: Reservation[] = [
  {
    id: 'L3627001',
    customerName: 'María Castillo Pérez',
    customerEmail: 'maria.castillo@agenciahorizonte.es',
    customerPhone: '+34 611 222 333',
    experienceName: VAN_GOGH_PROFILE.name,
    dateTime: '2026-02-08T19:30:00',
    status: ReservationStatus.PAID,
    totalAmount: 1780.0,
    currency: 'EUR',
    paymentStatus: mapPaymentStatus(PaymentStatus.PAID),
    depositEnabled: true,
    depositAmount: 445.0,
    remainingAmount: 0,
    reservationDate: new Date('2026-01-09'),
    checkInDate: new Date('2026-02-08'),
    checkOutDate: new Date('2026-02-08'),
    payment: createPayment({
      id: 'pay-1001',
      amount: 1780.0,
      currency: 'EUR',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-L3627001',
      paidAt: new Date('2026-01-10'),
    }),
    deposit: createDeposit({
      id: 'dep-1001',
      amount: 445.0,
      currency: 'EUR',
      required: true,
      paid: true,
      paidAt: new Date('2026-01-09'),
    }),
    numberOfGuests: 40,
    notes: 'Private after-hours tour with rooftop welcome reception.',
    bookingAgentName: 'Agencia Horizonte',
    bookingAgentType: 'Agency',
    eventName: VAN_GOGH_PROFILE.name,
    numberOfTickets: 40,
    attendanceConfirmed: true,
    city: VAN_GOGH_PROFILE.city,
    venue: VAN_GOGH_PROFILE.venue,
    venueAddress: VAN_GOGH_PROFILE.venueAddress,
    eventImage: VAN_GOGH_PROFILE.thumbnail,
    createdAt: new Date('2026-01-09'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: 'L3627002',
    customerName: 'Global Trade Collective',
    customerEmail: 'events@globaltrade.es',
    customerPhone: '+34 622 334 556',
    experienceName: VAN_GOGH_PROFILE.name,
    dateTime: '2026-02-20T10:00:00',
    status: ReservationStatus.TO_BE_PAID,
    totalAmount: 980.0,
    currency: 'EUR',
    paymentStatus: mapPaymentStatus(PaymentStatus.PENDING),
    depositEnabled: true,
    depositAmount: 245.0,
    remainingAmount: 980.0,
    reservationDate: new Date('2026-01-14'),
    checkInDate: new Date('2026-02-20'),
    checkOutDate: new Date('2026-02-20'),
    payment: createPayment({
      id: 'pay-1002',
      amount: 980.0,
      currency: 'EUR',
      status: PaymentStatus.PENDING,
      method: 'bank_transfer',
    }),
    deposit: createDeposit({
      id: 'dep-1002',
      amount: 245.0,
      currency: 'EUR',
      required: true,
      paid: false,
    }),
    numberOfGuests: 28,
    notes: 'Corporate leadership training with dinner upgrade pending payment.',
    bookingAgentName: 'Global Trade Collective',
    bookingAgentType: 'Corporate',
    eventName: VAN_GOGH_PROFILE.name,
    numberOfTickets: 28,
    attendanceConfirmed: false,
    city: VAN_GOGH_PROFILE.city,
    venue: VAN_GOGH_PROFILE.venue,
    venueAddress: VAN_GOGH_PROFILE.venueAddress,
    eventImage: VAN_GOGH_PROFILE.thumbnail,
    createdAt: new Date('2026-01-14'),
    updatedAt: new Date('2026-01-14'),
  },
  {
    id: 'L3627003',
    customerName: 'Colegio Mediterráneo',
    customerEmail: 'colegio@mediterraneo.edu',
    customerPhone: '+34 644 556 778',
    experienceName: VAN_GOGH_PROFILE.name,
    dateTime: '2026-03-02T09:45:00',
    status: ReservationStatus.CANCELLED,
    totalAmount: 650.0,
    currency: 'EUR',
    paymentStatus: 'cancelled',
    depositEnabled: false,
    depositAmount: 0,
    remainingAmount: 0,
    reservationDate: new Date('2026-01-21'),
    checkInDate: new Date('2026-02-02'),
    checkOutDate: new Date('2026-02-02'),
    payment: createPayment({
      id: 'pay-1003',
      amount: 650.0,
      currency: 'EUR',
      status: PaymentStatus.REFUNDED,
      method: 'credit_card',
      transactionId: 'txn-L3627003',
    }),
    deposit: createDeposit({
      id: 'dep-1003',
      amount: 0,
      currency: 'EUR',
      required: false,
      paid: false,
      refunded: true,
      refundedAt: new Date('2026-01-25'),
    }),
    numberOfGuests: 20,
    notes: 'Educational cancellation due to schedule conflict.',
    bookingAgentName: 'Colegio Mediterráneo',
    bookingAgentType: 'Educational',
    eventName: VAN_GOGH_PROFILE.name,
    numberOfTickets: 20,
    attendanceConfirmed: false,
    city: VAN_GOGH_PROFILE.city,
    venue: VAN_GOGH_PROFILE.venue,
    venueAddress: VAN_GOGH_PROFILE.venueAddress,
    eventImage: VAN_GOGH_PROFILE.thumbnail,
    createdAt: new Date('2026-01-21'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: 'L3627004',
    customerName: 'Fundación Museo Vivo',
    customerEmail: 'contacto@museovivo.es',
    customerPhone: '+34 600 111 222',
    experienceName: MONET_PROFILE.name,
    dateTime: '2026-03-12T18:30:00',
    status: ReservationStatus.PAID,
    totalAmount: 1340.0,
    currency: 'EUR',
    paymentStatus: mapPaymentStatus(PaymentStatus.PAID),
    depositEnabled: true,
    depositAmount: 335.0,
    remainingAmount: 0,
    reservationDate: new Date('2026-02-03'),
    checkInDate: new Date('2026-03-12'),
    checkOutDate: new Date('2026-03-12'),
    payment: createPayment({
      id: 'pay-2001',
      amount: 1340.0,
      currency: 'EUR',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-L3627004',
      paidAt: new Date('2026-02-04'),
    }),
    deposit: createDeposit({
      id: 'dep-2001',
      amount: 335.0,
      currency: 'EUR',
      required: true,
      paid: true,
      paidAt: new Date('2026-02-03'),
    }),
    numberOfGuests: 45,
    notes: 'Private cultural society visit with audio guides.',
    bookingAgentName: 'Fundación Museo Vivo',
    bookingAgentType: 'Cultural',
    eventName: MONET_PROFILE.name,
    numberOfTickets: 45,
    attendanceConfirmed: true,
    city: MONET_PROFILE.city,
    venue: MONET_PROFILE.venue,
    venueAddress: MONET_PROFILE.venueAddress,
    eventImage: MONET_PROFILE.thumbnail,
    createdAt: new Date('2026-02-03'),
    updatedAt: new Date('2026-02-04'),
  },
  {
    id: 'L3627005',
    customerName: 'Guías Oficiales de Madrid',
    customerEmail: 'reservas@guiasmadrid.com',
    customerPhone: '+34 633 887 445',
    experienceName: MONET_PROFILE.name,
    dateTime: '2026-03-19T11:00:00',
    status: ReservationStatus.TO_BE_PAID,
    totalAmount: 900.0,
    currency: 'EUR',
    paymentStatus: mapPaymentStatus(PaymentStatus.PARTIAL),
    depositEnabled: false,
    depositAmount: 0,
    remainingAmount: 900.0,
    reservationDate: new Date('2026-02-10'),
    checkInDate: new Date('2026-03-19'),
    checkOutDate: new Date('2026-03-19'),
    payment: createPayment({
      id: 'pay-2002',
      amount: 900.0,
      currency: 'EUR',
      status: PaymentStatus.PARTIAL,
      method: 'bank_transfer',
    }),
    deposit: createDeposit({
      id: 'dep-2002',
      amount: 0,
      currency: 'EUR',
      required: false,
      paid: false,
    }),
    numberOfGuests: 30,
    notes: 'Guide-led experience with two classrooms on hold.',
    bookingAgentName: 'Guías Oficiales de Madrid',
    bookingAgentType: 'Guide',
    eventName: MONET_PROFILE.name,
    numberOfTickets: 30,
    attendanceConfirmed: false,
    city: MONET_PROFILE.city,
    venue: MONET_PROFILE.venue,
    venueAddress: MONET_PROFILE.venueAddress,
    eventImage: MONET_PROFILE.thumbnail,
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
  },
  {
    id: 'L3627006',
    customerName: 'Grupo Magna',
    customerEmail: 'magna@largogroup.es',
    customerPhone: '+34 699 222 333',
    experienceName: MONET_PROFILE.name,
    dateTime: '2026-04-02T12:00:00',
    status: ReservationStatus.EXPIRED,
    totalAmount: 2160.0,
    currency: 'EUR',
    paymentStatus: 'expired',
    depositEnabled: true,
    depositAmount: 540.0,
    remainingAmount: 2160.0,
    reservationDate: new Date('2026-02-20'),
    checkInDate: new Date('2026-04-02'),
    checkOutDate: new Date('2026-04-02'),
    payment: createPayment({
      id: 'pay-2003',
      amount: 2160.0,
      currency: 'EUR',
      status: PaymentStatus.PENDING,
      method: 'credit_card',
    }),
    deposit: createDeposit({
      id: 'dep-2003',
      amount: 540.0,
      currency: 'EUR',
      required: true,
      paid: false,
    }),
    numberOfGuests: 60,
    notes: 'Large group booking expired after payment hold.',
    bookingAgentName: 'Grupo Magna',
    bookingAgentType: 'Large Group',
    eventName: MONET_PROFILE.name,
    numberOfTickets: 60,
    attendanceConfirmed: false,
    city: MONET_PROFILE.city,
    venue: MONET_PROFILE.venue,
    venueAddress: MONET_PROFILE.venueAddress,
    eventImage: MONET_PROFILE.thumbnail,
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: 'L3627007',
    customerName: 'Premier Hospitality NYC',
    customerEmail: 'hospitality@premier-nyc.com',
    customerPhone: '+1 646 555 0133',
    experienceName: CANDLELIGHT_NY_PROFILE.name,
    dateTime: '2026-03-20T18:45:00',
    status: ReservationStatus.PAID,
    totalAmount: 3120.0,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.PAID),
    depositEnabled: true,
    depositAmount: 780.0,
    remainingAmount: 0,
    reservationDate: new Date('2026-02-08'),
    checkInDate: new Date('2026-03-20'),
    checkOutDate: new Date('2026-03-20'),
    payment: createPayment({
      id: 'pay-3001',
      amount: 3120.0,
      currency: 'USD',
      status: PaymentStatus.PAID,
      method: 'credit_card',
      transactionId: 'txn-L3627007',
      paidAt: new Date('2026-02-09'),
    }),
    deposit: createDeposit({
      id: 'dep-3001',
      amount: 780.0,
      currency: 'USD',
      required: true,
      paid: true,
      paidAt: new Date('2026-02-08'),
    }),
    numberOfGuests: 52,
    notes: 'Hospitality dinner for premium services package.',
    bookingAgentName: 'Premier Hospitality NYC',
    bookingAgentType: 'Premium Services',
    eventName: CANDLELIGHT_NY_PROFILE.name,
    numberOfTickets: 52,
    attendanceConfirmed: true,
    city: CANDLELIGHT_NY_PROFILE.city,
    venue: CANDLELIGHT_NY_PROFILE.venue,
    venueAddress: CANDLELIGHT_NY_PROFILE.venueAddress,
    eventImage: CANDLELIGHT_NY_PROFILE.thumbnail,
    createdAt: new Date('2026-02-08'),
    updatedAt: new Date('2026-02-09'),
  },
  {
    id: 'L3627008',
    customerName: 'Brooklyn Arts Coalition',
    customerEmail: 'tickets@brooklynarts.org',
    customerPhone: '+1 917 555 0298',
    experienceName: CANDLELIGHT_NY_PROFILE.name,
    dateTime: '2026-04-12T20:00:00',
    status: ReservationStatus.TO_BE_PAID,
    totalAmount: 1485.0,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.PENDING),
    depositEnabled: false,
    depositAmount: 0,
    remainingAmount: 1485.0,
    reservationDate: new Date('2026-03-01'),
    checkInDate: new Date('2026-04-12'),
    checkOutDate: new Date('2026-04-12'),
    payment: createPayment({
      id: 'pay-3002',
      amount: 1485.0,
      currency: 'USD',
      status: PaymentStatus.PENDING,
      method: 'bank_transfer',
    }),
    deposit: createDeposit({
      id: 'dep-3002',
      amount: 0,
      currency: 'USD',
      required: false,
      paid: false,
    }),
    numberOfGuests: 29,
    notes: 'Partnership activation for upcoming cultural residency.',
    bookingAgentName: 'Brooklyn Arts Coalition',
    bookingAgentType: 'Partnerships',
    eventName: CANDLELIGHT_NY_PROFILE.name,
    numberOfTickets: 29,
    attendanceConfirmed: false,
    city: CANDLELIGHT_NY_PROFILE.city,
    venue: CANDLELIGHT_NY_PROFILE.venue,
    venueAddress: CANDLELIGHT_NY_PROFILE.venueAddress,
    eventImage: CANDLELIGHT_NY_PROFILE.thumbnail,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-02'),
  },
  {
    id: 'L3627009',
    customerName: 'Fever Internal Ops',
    customerEmail: 'ops@feverup.com',
    customerPhone: '+1 646 555 0199',
    experienceName: CANDLELIGHT_NY_PROFILE.name,
    dateTime: '2026-04-05T10:00:00',
    status: ReservationStatus.CANCELLED,
    totalAmount: 950.0,
    currency: 'USD',
    paymentStatus: mapPaymentStatus(PaymentStatus.REFUNDED),
    depositEnabled: false,
    depositAmount: 0,
    remainingAmount: 0,
    reservationDate: new Date('2026-03-05'),
    checkInDate: new Date('2026-04-05'),
    checkOutDate: new Date('2026-04-05'),
    payment: createPayment({
      id: 'pay-3003',
      amount: 950.0,
      currency: 'USD',
      status: PaymentStatus.REFUNDED,
      method: 'credit_card',
      transactionId: 'txn-L3627009',
    }),
    deposit: createDeposit({
      id: 'dep-3003',
      amount: 0,
      currency: 'USD',
      required: false,
      paid: false,
      refunded: true,
      refundedAt: new Date('2026-03-10'),
    }),
    numberOfGuests: 18,
    notes: 'Internal cancellation due to double-booking.',
    bookingAgentName: 'Fever Internal Ops',
    bookingAgentType: 'Internal Operations',
    eventName: CANDLELIGHT_NY_PROFILE.name,
    numberOfTickets: 18,
    attendanceConfirmed: false,
    city: CANDLELIGHT_NY_PROFILE.city,
    venue: CANDLELIGHT_NY_PROFILE.venue,
    venueAddress: CANDLELIGHT_NY_PROFILE.venueAddress,
    eventImage: CANDLELIGHT_NY_PROFILE.thumbnail,
    createdAt: new Date('2026-03-05'),
    updatedAt: new Date('2026-03-10'),
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

const reviveReservation = (reservation: Reservation): Reservation => {
  const withDates = {
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
  };

  if (withDates.eventImage) {
    return withDates;
  }

  const eventKey = withDates.eventName || withDates.experienceName;
  const fallbackImage = EVENT_IMAGE_MAP[eventKey];
  if (fallbackImage) {
    return { ...withDates, eventImage: fallbackImage };
  }

  return withDates;
};

const readStoredReservations = (): Reservation[] | null => {
  if (typeof window === 'undefined') return null;
  const version = window.localStorage.getItem(VERSION_KEY);
  if (version !== DATA_VERSION) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(VERSION_KEY);
    return null;
  }

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
  window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
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
 * Get catalog of available events
 */
export function getAvailableEvents(): EventProfile[] {
  return EVENT_PROFILES;
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
