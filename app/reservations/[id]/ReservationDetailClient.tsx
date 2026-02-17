'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Reservation, ReservationStatus } from '@/domain/reservation';
import { getReservationById } from '@/domain/mockReservations';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import {
  Button,
  Cart,
  Sidebar,
  Alert,
  Tag,
  FieldCheckbox,
  // Icons from centralized DS
  IconCircleCheck,
  IconCircleExclamation,
  IconCircleCheckFull,
  IconFileLines,
  IconCalendar,
  IconUserPlus,
  IconBan,
  IconLink,
  IconTriangleExclamation,
  IconUser,
  IconBadgePercent,
  IconAngleDown,
  IconPrint,
  IconPen,
  IconTicket,
  IconQrcode,
  IconPaperPlane,
  IconCheck,
  IconChevronDown,
  IconRotateRight,
} from '@/ui';
import { TOPBAR_HEIGHT } from '@/ui/TopBar';
import type { CartDateGroup, CartBreakdown } from '@/ui';

export default function ReservationDetailPage() {
  const router = useRouter();
  const { requestCheckoutTransition } = useReservationWizard();
  const params = useParams();
  const id = params.id as string;
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true);
  const [showOriginalPrices, setShowOriginalPrices] = useState(true);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = getReservationById(id);
        if (!data) {
          setError('Reservation not found');
          return;
        }
        setReservation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reservation');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id]);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');
  };

  // Derived values - compute even when reservation is null
  const eventTitle = reservation?.eventName || reservation?.experienceName || '';
  const eventDateTime = reservation?.dateTime ? new Date(reservation.dateTime) : (reservation?.checkInDate || new Date());
  const eventAddress = '2001 Rodeo Drive, Bolingbrook';
  const ticketCount = reservation?.numberOfTickets || reservation?.numberOfGuests || 2;
  const ticketPrice = 626.91;
  const bookingFee = 38.12;
  const cartDateLabel = formatDateTime(eventDateTime);

  // Build cart date groups - originalPrice always present when there's an override
  const cartDateGroups: CartDateGroup[] = useMemo(() => {
    if (!reservation) return [];
    return [{
      date: cartDateLabel,
      items: [
        {
          id: '1',
          quantity: 2,
          title: 'Fanstand | 3-Day Pass (August 8 - 10)',
          price: 1253.82,
          originalPrice: 1350.00, // Always present - Cart handles visibility
          feePerTicket: bookingFee,
          feeTotal: 76.24,
        },
        {
          id: '2',
          quantity: 2,
          title: 'Fanstand | 3-Day Pass (August 8 - 10)',
          price: 1253.82,
          originalPrice: 1350.00, // Always present - Cart handles visibility
          feePerTicket: bookingFee,
          feeTotal: 76.24,
        },
      ],
    }];
  }, [reservation, cartDateLabel, bookingFee]);

  // Build breakdown
  const breakdown: CartBreakdown = useMemo(() => {
    const reservationValue = 2297.47;
    const overrideValue = -100.00;
    const totalToPay = reservationValue + overrideValue;

    return {
      reservationValue: reservationValue,
      override: {
        label: 'Override price',
        value: overrideValue,
        description: 'Comp. Tickets for HR department.',
      },
      totalToPay: totalToPay,
      totalLabel: 'Total to pay',
      isExpanded: isBreakdownExpanded,
      onToggleExpanded: () => setIsBreakdownExpanded((prev) => !prev),
    };
  }, [isBreakdownExpanded]);

  // Status tag helper - same as overview
  const getStatusTag = (status: ReservationStatus): { 
    label: string; 
    sentiment: 'positive' | 'warning' | 'danger' | 'disabled';
    icon: React.ReactNode;
  } => {
    if (status === ReservationStatus.PAID) {
      return { 
        label: 'Paid', 
        sentiment: 'positive',
        icon: <IconCircleCheck color="#ffffff" />,
      };
    }
    if (status === ReservationStatus.TO_BE_PAID) {
      return { 
        label: 'to be paid', 
        sentiment: 'warning',
        icon: <IconCircleExclamation color="#ffffff" />,
      };
    }
    if (status === ReservationStatus.CANCELLED) {
      return { 
        label: 'Cancelled', 
        sentiment: 'disabled',
        icon: null,
      };
    }
    return { 
      label: 'Expired', 
      sentiment: 'disabled',
      icon: null,
    };
  };

  const isPaid = reservation?.status === ReservationStatus.PAID;
  const shouldShowPayment = reservation?.status === ReservationStatus.TO_BE_PAID;
  const totalToPay = 2197.47;
  const formattedTotalToPay = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(totalToPay),
    [totalToPay]
  );

  // Mock data for tickets in paid orders
  const [ticketGroups, setTicketGroups] = useState([
    {
      id: 'group1',
      date: '8 Aug 2025 10:00',
      tickets: [
        {
          id: 'ticket1',
          quantity: 2,
          title: 'Fanstand | 3-Day Pass (August 8 - 10)',
          ticketId: '89240070',
          price: 1200.00,
          unitPrice: 600.00,
          qrCodes: [
            { id: 'qr1', code: '01591995325386315', label: 'Fanstand | 3-Day Pass (August 8 - 10)', expiration: 'Nov 9, 2031, 1:02 AM', selected: true },
            { id: 'qr2', code: '25386315015919953', label: 'Fanstand | 3-Day Pass (August 8 - 10)', expiration: 'Nov 9, 2031, 1:02 AM', selected: true },
          ],
          validated: 0,
          expanded: true,
        },
        {
          id: 'ticket2',
          quantity: 1,
          title: 'Ground Pass | Friday (August 8)',
          ticketId: '00708924',
          price: 215.00,
          unitPrice: 215.00,
          qrCodes: [
            { id: 'qr3', code: '63150159199532538', label: 'Fanstand | 3-Day Pass (August 8 - 10)', expiration: 'Nov 9, 2031, 1:02 AM', selected: true },
          ],
          validated: 0,
          expanded: true,
        },
      ],
    },
  ]);

  const toggleTicketExpanded = (groupId: string, ticketId: string) => {
    setTicketGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tickets: group.tickets.map(ticket => {
            if (ticket.id === ticketId) {
              return { ...ticket, expanded: !ticket.expanded };
            }
            return ticket;
          }),
        };
      }
      return group;
    }));
  };

  const toggleQrSelection = (groupId: string, ticketId: string, qrId: string) => {
    setTicketGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tickets: group.tickets.map(ticket => {
            if (ticket.id === ticketId) {
              return {
                ...ticket,
                qrCodes: ticket.qrCodes.map(qr => {
                  if (qr.id === qrId) {
                    return { ...qr, selected: !qr.selected };
                  }
                  return qr;
                }),
              };
            }
            return ticket;
          }),
        };
      }
      return group;
    }));
  };

  const toggleSelectAll = (groupId: string, ticketId: string) => {
    setTicketGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tickets: group.tickets.map(ticket => {
            if (ticket.id === ticketId) {
              const allSelected = ticket.qrCodes.every(qr => qr.selected);
              return {
                ...ticket,
                qrCodes: ticket.qrCodes.map(qr => ({ ...qr, selected: !allSelected })),
              };
            }
            return ticket;
          }),
        };
      }
      return group;
    }));
  };

  // Mock Order ID for paid reservations
  const orderId = isPaid ? 'GXE3OZO8Q' : null;
  const totalValidated = isPaid ? 0 : 0;
  const totalTickets = isPaid ? ticketGroups.reduce((acc, g) => acc + g.tickets.reduce((a, t) => a + t.qrCodes.length, 0), 0) : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeItem="reservations" activeChild="overview" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--palette-neutral-50)' }}>
        <div
          style={{
            backgroundColor: 'var(--palette-neutral-700)',
            padding: 'var(--space-6)',
            paddingTop: `calc(var(--space-6) + ${TOPBAR_HEIGHT}px)`,
          }}
        >
              <p style={{ fontSize: '14px', color: 'var(--palette-neutral-white)', marginBottom: '4px' }}>
                <span style={{ textDecoration: 'underline' }}>Overview</span> / {id}
              </p>
              <h1 style={{ fontSize: 'var(--size-h2)', fontWeight: 'var(--weight-semibold)', color: 'var(--palette-neutral-white)', margin: 0 }}>
                Reservation details
              </h1>
            </div>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', padding: 'var(--space-6)', textAlign: 'center' }}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-subtle-default)' }}>Loading reservation details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !reservation) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeItem="reservations" activeChild="overview" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--palette-neutral-50)' }}>
            <div
              style={{
                backgroundColor: 'var(--palette-neutral-700)',
                padding: 'var(--space-6)',
                paddingTop: `calc(var(--space-6) + ${TOPBAR_HEIGHT}px)`,
              }}
            >
              <p style={{ fontSize: '14px', color: 'var(--palette-neutral-white)', marginBottom: '4px' }}>
                <span style={{ textDecoration: 'underline' }}>Overview</span> / {id}
              </p>
              <h1 style={{ fontSize: 'var(--size-h2)', fontWeight: 'var(--weight-semibold)', color: 'var(--palette-neutral-white)', margin: 0 }}>
                Reservation details
              </h1>
            </div>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', padding: 'var(--space-6)' }}>
                <h2 style={{ color: 'var(--palette-danger-500)', marginBottom: '8px' }}>Error</h2>
                <p style={{ marginBottom: '16px' }}>{error || 'Reservation not found'}</p>
                <Button variant="primary" onClick={() => router.push('/reservations')}>← Back to Reservations</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeItem="reservations" activeChild="overview" />

      <div className="flex flex-1 flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--palette-neutral-50)' }}>
          {/* Hero Header */}
          <div
            style={{
              backgroundColor: 'var(--palette-neutral-700)',
              padding: 'var(--space-6)',
              paddingTop: `calc(var(--space-6) + ${TOPBAR_HEIGHT}px)`,
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--palette-neutral-white)', marginBottom: '4px' }}>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => router.push('/reservations')}>Overview</span>
              <span style={{ color: 'var(--text-secondary-on-dark)' }}> / {reservation.id}</span>
            </p>
            <h1 style={{ fontSize: 'var(--size-h2)', lineHeight: 'var(--leading-h2)', fontWeight: 'var(--weight-semibold)', color: 'var(--palette-neutral-white)', fontFamily: 'var(--font-body)', margin: 0 }}>
              Reservation details
            </h1>
          </div>

          {/* Content */}
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ maxWidth: '1136px', backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', padding: 'var(--space-6)' }}>
              
              {/* Event Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                {/* Left: Event title */}
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-main-default)', margin: 0 }}>
                  {eventTitle || 'LIV Golf Chicago 2025 - Hospitality'}
                </h2>
                
                {/* Right: Action links - different for Paid vs To Be Paid */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--action-text-primary-default)', textTransform: 'uppercase' }}>
                    <span style={{ color: 'var(--action-text-primary-default)' }}><IconFileLines size={14} /></span>
                    DELIVERY NOTE
                  </button>
                  {isPaid && (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--action-text-primary-default)', textTransform: 'uppercase' }}>
                      <span style={{ color: 'var(--action-text-primary-default)' }}><IconPrint size={16} /></span>
                      PRINT ORDER
                    </button>
                  )}
                  {isPaid && (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--action-text-primary-default)', textTransform: 'uppercase' }}>
                      <span style={{ color: 'var(--action-text-primary-default)' }}><IconPen size={16} /></span>
                      MODIFY
                    </button>
                  )}
                  {!isPaid && (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--action-text-primary-default)', textTransform: 'uppercase' }}>
                      <span style={{ color: 'var(--action-text-primary-default)' }}><IconCalendar size={14} /></span>
                      RESCHEDULE
                    </button>
                  )}
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--action-text-primary-default)', textTransform: 'uppercase' }}>
                    <span style={{ color: 'var(--action-text-primary-default)' }}><IconTicket size={18} /></span>
                    ADD TICKETS
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--palette-danger-500)', textTransform: 'uppercase' }}>
                    <span style={{ color: 'var(--palette-danger-500)' }}><IconBan size={16} /></span>
                    CANCEL
                  </button>
                </div>
              </div>

              {/* Event Details Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                {/* Left: Location and date */}
                <div>
                  <div style={{ borderLeft: '2px solid var(--palette-primary-500)', paddingLeft: '8px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: 0 }}>{eventAddress}</p>
                  </div>
                  <div style={{ borderLeft: '2px solid var(--palette-primary-500)', paddingLeft: '8px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-subtle-default)', margin: 0 }}>{formatDateTime(eventDateTime)}</p>
                  </div>
                </div>
                
                {/* Right: Reservation ID, Order ID and Status */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: '0 0 4px 0' }}>
                    RESERVATION ID: <strong>{reservation.id}</strong>
                  </p>
                  {isPaid && orderId && (
                    <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: '0 0 4px 0' }}>
                      ORDER ID: <strong>{orderId}</strong>
                    </p>
                  )}
                  {isPaid && (
                    <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: '0 0 4px 0' }}>
                      Validated <strong>{totalValidated}/{totalTickets}</strong>
                    </p>
                  )}
                  {!isPaid && (
                    <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      STATUS:
                      <Tag
                        sentiment={getStatusTag(reservation.status).sentiment}
                        tagStyle="solid"
                        startIcon={getStatusTag(reservation.status).icon}
                      >
                        {getStatusTag(reservation.status).label}
                      </Tag>
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-subtle-default)' }}><IconUser size={16} /></span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main-default)' }}>
                    {reservation.customerName}
                  </span>
                  <span style={{ color: '#FFA639' }}><IconTriangleExclamation size={18} color="#FFA639" /></span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: 0 }}>
                  {reservation.customerEmail}
                </p>
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'flex', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ width: '400px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {/* Notes Card */}
                  <div style={{ backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-subtle-default)' }}><IconFileLines size={14} /></span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main-default)' }}>Notes</span>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--action-text-primary-default)' }}>
                      Add new
                    </button>
                  </div>

                  {/* Cart - THE SAME COMPONENT */}
                  <Cart
                    title="Purchase details"
                    collapsible={true}
                    defaultCollapsed={false}
                    showOriginalPricesCheckbox={true}
                    originalPricesChecked={showOriginalPrices}
                    onOriginalPricesChange={setShowOriginalPrices}
                    dateGroups={cartDateGroups}
                    breakdown={breakdown}
                  />

                  {/* Purchase Metadata - Only for Paid Orders */}
                  {isPaid && (
                    <div style={{ borderTop: '1px dashed var(--border-main-default)', paddingTop: 'var(--space-4)' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main-default)', margin: '0 0 8px 0' }}>
                        Purchase metadata
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: 0 }}>
                          Date: <strong>06 May, 2025 - 7:35PM</strong>
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: 0 }}>
                          Payment method: <strong>Credit</strong>
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: 0 }}>
                          Channel: <strong>Reseller sales representative</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Promo Code Card - Only for unpaid */}
                  {!isPaid && (
                    <div style={{ backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-subtle-default)' }}><IconBadgePercent size={16} /></span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main-default)' }}>Promo code</span>
                      </div>
                      <span style={{ color: 'var(--text-subtle-default)' }}><IconAngleDown size={12} /></span>
                    </div>
                  )}
                </div>

                {/* Right Column - Payment Section (for To Be Paid) */}
                {shouldShowPayment && (
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid var(--border-main-default)',
                        borderRadius: '8px',
                        padding: 'var(--space-6)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-3)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: 600,
                          color: 'var(--text-main-default)',
                          margin: 0,
                        }}
                      >
                        Payment required to secure your reservation
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-subtle-default)',
                          margin: '0',
                          lineHeight: '22px',
                        }}
                      >
                        You must complete the payment to keep this reservation.
                      </p>

                      <Alert
                        title="Please, complete the payment before the deadline to avoid cancellation."
                        description={
                          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '20px', gap: '4px' }}>
                            <span>
                              <span style={{ fontWeight: 600 }}>Deposit deadline:</span> (Event time) Tue, 04 Nov 2025, 10:59 AM (UTC+11).
                            </span>
                            <span>
                              <span style={{ fontWeight: 600 }}>Time left:</span> 3d 4h 3m
                            </span>
                          </div>
                        }
                        sentiment="warning"
                        showCloseButton={false}
                        titleWeight={400}
                      />

                      <div
                        style={{
                          marginTop: 'var(--space-3)',
                          borderRadius: '12px',
                          border: '1px solid #ccd2d8',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-3)',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--text-main-default)',
                                margin: '0 0 8px 0',
                              }}
                            >
                              Get your tickets now
                            </h4>
                            <p
                              style={{
                                fontSize: '16px',
                                fontWeight: 300,
                                color: 'var(--text-main-default)',
                                margin: '0 0 8px 0',
                                lineHeight: '20px',
                              }}
                            >
                              {formattedTotalToPay}
                            </p>
                            <p
                              style={{
                                fontSize: '14px',
                                color: 'var(--text-subtle-default)',
                                margin: 0,
                                maxWidth: '320px',
                              }}
                            >
                              You will complete the payment in the checkout. The reservation will be confirmed once the payment is successful.
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => {
                              requestCheckoutTransition(false);
                              router.push('/reservations/new/checkout');
                            }}
                            style={{
                              borderRadius: '999px',
                              padding: '10px 32px',
                              fontSize: '14px',
                              fontWeight: 600,
                              textTransform: 'none',
                              minWidth: '160px',
                              whiteSpace: 'nowrap',
                              backgroundColor: 'var(--palette-primary-500)',
                              borderColor: 'var(--palette-primary-500)',
                              color: '#ffffff',
                            }}
                          >
                            Pay reservation
                          </Button>
                        </div>

                        <div style={{ borderTop: '1px solid #d5dbe5', paddingTop: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <span style={{ color: '#536b75', marginTop: '2px' }}><IconLink size={16} /></span>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main-default)', margin: '0 0 4px 0' }}>
                                  Send payment link
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: 0 }}>
                                  Share a link so another person can complete the payment. The reservation will only be secured once the payment is made.
                                </p>
                              </div>
                            </div>
                            <button
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--action-text-primary-default)',
                                textDecoration: 'underline',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Send link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column - Tickets Section (for Paid Orders) */}
                {isPaid && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Deposit Paid Module - UI only, no logic */}
                    <div style={{ 
                      backgroundColor: '#f6f7f7', 
                      borderRadius: '8px', 
                      padding: '16px 24px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px', color: 'var(--text-main-default)' }}>Deposit paid</span>
                            <IconCircleCheckFull size={18} color="#24a865" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-main-default)', margin: 0 }}>$150.00</p>
                            <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-subtle-default)', margin: 0 }}>
                              Paid on Jan 15, 2025 via card (···· 3345)
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', height: '100%', width: '145px' }}>
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            height: '32px',
                            minWidth: '64px',
                            padding: '0 12px',
                            border: '2px solid #ccd2d8',
                            borderRadius: '64px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            lineHeight: '20px',
                            color: '#eb0052',
                          }}>
                            Refund
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tickets by Date */}
                    {ticketGroups.map((group) => (
                      <div key={group.id}>
                        {/* Date Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                          <span style={{ color: 'var(--text-main-default)' }}><IconCalendar size={14} /></span>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main-default)' }}>{group.date}</span>
                        </div>

                        {/* Ticket Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          {group.tickets.map((ticket) => {
                            const selectedCount = ticket.qrCodes.filter(qr => qr.selected).length;
                            const allSelected = ticket.qrCodes.every(qr => qr.selected);

                            return (
                              <div key={ticket.id} style={{ backgroundColor: 'white', border: '1px solid var(--border-main-default)', borderRadius: '8px', overflow: 'hidden' }}>
                                {/* Ticket Header */}
                                <div style={{ padding: 'var(--space-4)', borderBottom: ticket.expanded ? '1px solid var(--border-main-default)' : 'none' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ color: 'var(--text-subtle-default)' }}><IconTicket size={18} /></span>
                                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main-default)' }}>
                                        {ticket.quantity} x {ticket.title}
                                      </span>
                                      <span style={{ fontSize: '12px', color: 'var(--text-subtle-default)' }}>
                                        Ticket ID {ticket.ticketId}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Tag sentiment="positive" tagStyle="outline">Active</Tag>
                                      <button
                                        onClick={() => toggleTicketExpanded(group.id, ticket.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: ticket.expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                      >
                                        <IconChevronDown size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--action-text-primary-default)' }}>
                                        <IconPaperPlane size={14} /> Resend
                                      </button>
                                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--action-text-primary-default)' }}>
                                        <IconPrint size={16} /> Print
                                      </button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <span style={{ fontSize: '14px', color: 'var(--text-main-default)' }}>
                                        Validated <strong>{ticket.validated}/{ticket.qrCodes.length}</strong>
                                      </span>
                                      <FieldCheckbox
                                        checked={allSelected}
                                        onChange={() => toggleSelectAll(group.id, ticket.id)}
                                        label="Select all"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* QR Codes List - Expandable */}
                                {ticket.expanded && (
                                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--palette-neutral-50)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                      {ticket.qrCodes.map((qr) => (
                                        <div key={qr.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-main-default)' }}>
                                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <span style={{ color: 'var(--text-subtle-default)', marginTop: '2px' }}><IconQrcode size={14} /></span>
                                            <div>
                                              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main-default)', margin: '0 0 2px 0' }}>
                                                QR ID {qr.code}
                                              </p>
                                              <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: '0 0 2px 0' }}>
                                                {qr.label}
                                              </p>
                                              <p style={{ fontSize: '12px', color: 'var(--text-subtle-default)', margin: 0 }}>
                                                Expiration date: {qr.expiration}
                                              </p>
                                            </div>
                                          </div>
                                          <FieldCheckbox
                                            checked={qr.selected}
                                            onChange={() => toggleQrSelection(group.id, ticket.id, qr.id)}
                                          />
                                        </div>
                                      ))}
                                    </div>

                                    {/* Price and Validate */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-main-default)' }}>
                                      <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: 0 }}>
                                        Price: <strong style={{ color: 'var(--palette-primary-500)' }}>${ticket.price.toFixed(2)}</strong>{' '}
                                        <span style={{ color: 'var(--text-subtle-default)' }}>({ticket.quantity} x ${ticket.unitPrice.toFixed(2)})</span>
                                      </p>
                                      <Button variant="primary" disabled={selectedCount === 0}>
                                        Validate {selectedCount}/{ticket.qrCodes.length}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ backgroundColor: 'var(--palette-neutral-700)', padding: '32px 28px', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1136px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'white', fontStyle: 'italic' }}>fever</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '96px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 8px 0' }}>How fever works</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>How to view the status of my plans</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>Billing Manual</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: 0 }}>How to validate tickets</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 8px 0' }}>Support Contact</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>+34 911 87 66 36</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>Monday to Friday (09:30 to 18:30)</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: 0 }}>Send us a message</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--text-secondary-on-dark)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary-on-dark)' }}>©2019 - Fever l Made in Madrid & NYC</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary-on-dark)' }}>v 0.00001</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
