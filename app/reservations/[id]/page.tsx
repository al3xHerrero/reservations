'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Reservation, ReservationStatus } from '@/domain/reservation';
import { getReservationById } from '@/domain/mockReservations';
import { AppShell, Button, Cart, FlowHeader, Link as ActionLink } from '@/ui';

const iconChevronDown = 'http://localhost:3845/assets/8937964187a6ee4f5b2b36cdfcd464738bb496e9.svg';
const iconCalendarDay = 'http://localhost:3845/assets/293022f5cb6f46c3274bf32009fa2c798308b047.svg';
const iconUserPlus = 'http://localhost:3845/assets/b55027ebf06a83418298b66603309de7a6cc2af6.svg';
const iconBan = 'http://localhost:3845/assets/4661e023818ceef3911352e7ec12f200120c6cc0.svg';
const iconWarningTriangle = 'http://localhost:3845/assets/7d913068ddf67c42fdd7d48ef7b4e7171743ef62.svg';
const iconChevronUp = 'http://localhost:3845/assets/709af32c9db42672c2bd86620b371c80e8855a4e.svg';
const iconAngleDown = 'http://localhost:3845/assets/8b17d2a3c04ea2269b77d364e7de71efbbbcde12.svg';
const iconOverride = 'http://localhost:3845/assets/a8c6f62ee3bbe404c3c5d4d09c858b49324515d5.svg';
const iconLink = 'http://localhost:3845/assets/7303df969179d46894ef8e0350dbf84e31791c6b.svg';
const iconNotes = 'http://localhost:3845/assets/0af2915e0ce543a27e867947c50403263a9182d6.svg';
const iconUserCircle = 'http://localhost:3845/assets/1598b482ee16195446fb0f7e27bb0de46b8c5662.svg';
const iconStatusWarning = 'http://localhost:3845/assets/7d913068ddf67c42fdd7d48ef7b4e7171743ef62.svg';
const footerLogo = 'http://localhost:3845/assets/cbba367b76987cdc24d0470e05ee6249a7308ddc.svg';

export default function ReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [showOriginalPrices, setShowOriginalPrices] = useState(true);
  const [overrideEnabled, setOverrideEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shellProps = {
    className: 'bg-[var(--bg-page)]',
    mainClassName: 'p-0',
  };

  const hero = (reservationId: string) => (
    <FlowHeader
      breadcrumb={[
        { label: 'Reservations', href: '/reservations', underline: true },
        { label: reservationId },
      ]}
      title="Reservation details"
    />
  );

  const footer = (
    <footer className="mt-6 bg-[var(--bg-contrast)] px-7 py-8 text-[var(--text-on-dark)]">
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <div className="flex justify-center">
          <img alt="Fever" className="h-9" src={footerLogo} />
        </div>
        <div className="flex flex-wrap justify-center gap-24 text-sm">
          <div className="space-y-1">
            <p className="font-semibold">How fever works</p>
            <p>How to view the status of my plans</p>
            <p>Billing Manual</p>
            <p>How to validate tickets</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Support Contact</p>
            <p>+34 911 87 66 36</p>
            <p>Monday to Friday (09:30 to 18:30)</p>
            <p>Send us a message</p>
          </div>
        </div>
        <div className="border-t border-[var(--text-secondary-on-dark)]/40 pt-4 text-xs text-[var(--text-secondary-on-dark)]">
          <div className="flex items-center justify-between">
            <span>©2019 - Fever l Made in Madrid & NYC</span>
            <span>v 0.00001</span>
          </div>
        </div>
      </div>
    </footer>
  );

  if (isLoading) {
    return (
      <AppShell {...shellProps}>
        {hero(id)}
        <div className="px-6 py-6">
          <div className="mx-auto w-full max-w-[1136px]">
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted">Loading reservation details...</p>
              </div>
            </div>
          </div>
        </div>
        {footer}
      </AppShell>
    );
  }

  if (error || !reservation) {
    return (
      <AppShell {...shellProps}>
        {hero(id)}
        <div className="px-6 py-6">
          <div className="mx-auto w-full max-w-[1136px]">
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-xl font-semibold text-error mb-2">Error</h2>
              <p className="text-text mb-4">{error || 'Reservation not found'}</p>
              <NextLink href="/reservations">
                <Button variant="primary">← Back to Reservations</Button>
              </NextLink>
            </div>
          </div>
        </div>
        {footer}
      </AppShell>
    );
  }

  const eventTitle = reservation.eventName || reservation.experienceName;
  const eventDateTime = reservation.dateTime ? new Date(reservation.dateTime) : reservation.checkInDate;
  const eventAddress = '2001 Rodeo Drive, Bolingbrook';
  const ticketCount = reservation.numberOfTickets || reservation.numberOfGuests;
  const lineItemAmount = reservation.totalAmount / Math.max(ticketCount, 1);
  const bookingFee = 38.12;
  const cartItems = Array.from({ length: 2 }, (_, index) => ({
    id: `${index}`,
    quantity: ticketCount,
    title: eventTitle,
    price: lineItemAmount,
    feePerTicket: bookingFee,
    feeTotal: bookingFee * ticketCount,
  }));
  const reservationValueDetail = -(reservation.totalAmount * 0.046);
  const overrideValue = -(reservation.totalAmount * 0.0435);

  const statusLabelMap: Record<ReservationStatus, string> = {
    [ReservationStatus.PAID]: 'Paid',
    [ReservationStatus.TO_BE_PAID]: 'To be paid',
    [ReservationStatus.CANCELLED]: 'Cancelled',
    [ReservationStatus.EXPIRED]: 'Expired',
  };

  const shouldShowPayment = reservation.status === ReservationStatus.TO_BE_PAID;

  return (
    <AppShell {...shellProps}>
      {hero(reservation.id)}
      <div className="px-6 py-6">
        <div className="mx-auto w-full max-w-[1136px] rounded-lg border border-border bg-white p-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text-default)]">{eventTitle}</h2>
                <div className="space-y-1">
                  <div className="border-l border-[var(--primary-500)] px-2 py-1 text-[var(--text-secondary)]">
                    {eventAddress}
                  </div>
                  <div className="border-l border-[var(--primary-500)] px-2 text-sm text-muted">
                    {formatDateTime(eventDateTime)}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-default)]">
                  <img alt="" className="h-5 w-5" src={iconUserCircle} />
                  <span className="font-semibold">{reservation.customerName}</span>
                  <img alt="" className="h-5 w-5" src={iconWarningTriangle} />
                </div>
                <p className="text-sm text-[var(--text-default)]">{reservation.customerEmail}</p>
              </div>
              <div className="space-y-4 text-right">
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button variant="tertiary" size="sm">
                    Get delivery note
                  </Button>
                  <Button variant="tertiary" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="tertiary" size="sm">
                    Increase reservation items
                  </Button>
                  <Button variant="tertiary" size="sm">
                    Reduce reservation items
                  </Button>
                  <Button variant="tertiary" size="sm" sentiment="danger">
                    Cancel
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--text-default)]">
                    <span className="text-[var(--text-secondary)]">Reservation ID:</span> {reservation.id}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-sm text-[var(--text-default)]">
                    <span className="text-[var(--text-secondary)]">Status:</span>
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs text-white bg-[var(--status-warning)]">
                      <img alt="" className="h-3 w-3" src={iconStatusWarning} />
                      {statusLabelMap[reservation.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img alt="" className="h-5 w-5" src={iconNotes} />
                      <p className="text-lg font-semibold text-text">Notes</p>
                    </div>
                    <ActionLink className="text-sm font-semibold">Add new</ActionLink>
                  </div>
                </div>

                <Cart
                  title="Purchase details"
                  dateLabel={formatDateTime(eventDateTime)}
                  items={cartItems}
                  showOriginalPricesCheckbox
                  originalPricesChecked={showOriginalPrices}
                  onOriginalPricesChange={setShowOriginalPrices}
                  showOverrideModule
                  overrideEnabled={overrideEnabled}
                  onOverrideToggle={() => setOverrideEnabled((value) => !value)}
                  breakdown={{
                    reservationValue: reservation.totalAmount,
                    reservationValueDetail: {
                      label: 'Real value of the chosen tickets',
                      value: reservationValueDetail,
                    },
                    override: {
                      label: 'Override price',
                      value: overrideValue,
                      note: 'Comp. Tickets for HR department.',
                      noteValue: reservationValueDetail,
                    },
                    outstandingAmount: reservation.totalAmount,
                    breakdownLinkLabel: 'Hide breakdown',
                  }}
                />

                <div className="rounded-lg border border-border bg-white p-4 flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-default)]">Promo code</span>
                  <img alt="" className="h-2 w-4" src={iconAngleDown} />
                </div>
              </div>

              {shouldShowPayment && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-white">
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--text-default)]">
                        Payment required to secure your reservation
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        You must complete the payment to keep this reservation.
                      </p>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="rounded-lg bg-[var(--warning-bg)] px-3 py-2 text-sm text-[var(--warning-text)] border border-[#df7b00]">
                        <div className="flex gap-2">
                          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center">
                            <img alt="" className="h-3 w-3" src={iconOverride} />
                          </span>
                          <div>
                            <p>
                              Please, complete the payment before the deadline to avoid cancellation.
                            </p>
                            <p>
                              Deposit deadline (Event time): Tue, 04 Nov 2025, 10:59 AM (UTC+11).
                            </p>
                            <p>Time left: 3d 4h 3m</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-6">
                      <div className="rounded border border-border p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <p className="text-lg font-semibold text-[var(--text-default)]">Get your tickets now</p>
                            <p className="text-base text-[var(--text-default)]">
                              ${reservation.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">
                              You will complete the payment in the checkout. The reservation will be
                              confirmed once the payment is successful.
                            </p>
                          </div>
                          <Button
                            className="shrink-0"
                            variant="primary"
                            onClick={() => router.push('/reservations/new/checkout')}
                          >
                            Pay reservation
                          </Button>
                        </div>
                        <div className="border-t border-border pt-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 flex-1 items-start gap-4">
                              <img alt="" className="h-4 w-5 mt-1" src={iconLink} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[var(--text-default)]">
                                  Send payment link
                                </p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  Share a link so another person can complete the payment. The reservation will only be
                                  secured once the payment is made.
                                </p>
                              </div>
                            </div>
                            <ActionLink className="shrink-0 text-xs font-semibold underline">Send link</ActionLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {footer}
    </AppShell>
  );
}
