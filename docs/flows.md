# Reservations - Flows

This document describes the functional flow of the Reservations domain in Fever Zone (B2B Resellers), focusing on the standard reservation creation journey and the underlying business logic (reservation rules, expiration, permissions, payment methods). Deposits, upgrades/reschedules/refunds can be documented in separate flows.

## 1. Core Concepts

### 1.1 Entities

- **Business**: the customer/business account a booking is made for.
- **Reservation**: a temporary hold of inventory (tickets) that may require payment before being confirmed.
- **Order**: a paid reservation (conceptually). Once payment succeeds, the reservation becomes paid and tickets/QRs can be issued.

### 1.2 Reservation Status (UI truth)

Reservation status visible in Fever Zone is one of:

- **To be paid**: inventory is held, payment not completed yet.
- **Paid**: payment completed successfully.
- **Cancelled**: reservation was cancelled.
- **Expired**: reservation expired due to expiration rules / timeouts.

These are the only statuses used by the UI. Any additional internal lifecycle nuance must map back to one of the above.

## 2. Actors & Permissions

### 2.1 Actors

- **Partner / Booking Agent**: Fever Zone users operating on behalf of a business (reseller partners).
- **Business user**: users from the business portal (restricted compared to partners/admins).
- **Admin**: elevated privileges (e.g. cart price override).

### 2.2 High-level permissions (normal flow)

**For a Reservation (To be paid):**
- Partner can: create, modify tickets (within constraints), reschedule (out of scope here), cancel, trigger payment, create payment link, annotate/notes.
- Business user can: create (in their portal), modify tickets (within constraints), cancel, pay (card/balance/payment link).

**For a Reservation (Paid):**
- Partner can: view, print tickets, validate arrival; cancellations/modifications may exist but are out of scope for this "normal flow".
- Business user can: view and print tickets; limited operations compared to partner.

## 3. Reservation Rules & Expiration Logic

### 3.1 Reservation Rules engine (concept)

Reservation Rules determine:
- Whether a reservation can be created without immediate payment.
- The expiration time for a reservation created in "To be paid".
- Constraints based on event date/time, ticket type, business settings, and channel (partner vs business).

### 3.2 Expiration principles

- A **To be paid** reservation must have an expiration policy; otherwise it would block inventory indefinitely.
- If the user tries to reserve outside the allowed expiration window, the system may require **immediate payment**.

### 3.3 Channel differences (Partner vs Business)

- **Business portal** is restricted by expiration rules. If the business tries to reserve when expiration rules do not allow a hold, they must pay immediately.
- **Partner/Booking Agent** may bypass some expiration restrictions (e.g. can reserve closer to the event than the business is allowed to).

### 3.4 Expiration outcome

When a reservation reaches its expiration time:
- Status transitions from **To be paid** → **Expired**
- Inventory is released.
- Payment attempts after expiration should be blocked (TBD: exact UI behavior).

## 4. Standard Reservation Creation Flow (UI Journey)

This is the standard flow when a user creates a reservation from Fever Zone and ends up in Reservation Detail.

### 4.1 Entry point: Reservations Overview (List)

**Route:** `/reservations`

Purpose:
- View existing reservations and their status (Paid / To be paid / Cancelled / Expired).
- Start a new reservation (CTA).

Key UI:
- Table of reservations (filters may apply).
- Primary CTA: **Make a reservation**.

User actions:
- Open an existing reservation detail.
- Start new reservation.

Transitions:
- CTA → `Business selection` step.
- Row click → `Reservation detail`.

### 4.2 Step 1: Business selection

Purpose:
- Choose the business account for which the reservation will be created (partner flow).
- If the user is a business user, this step may be skipped (TBD).

Validations:
- Cannot proceed without selecting a business.

Transition:
- Continue → `Event selection`.

### 4.3 Step 2: Event selection

Purpose:
- Choose the event/session for the reservation.

Key logic:
- Availability and purchase constraints may depend on reservation rules and event schedule.

Validations:
- Must select an event/session.
- If no availability, user must select another option (TBD exact messaging).

Transition:
- Continue → `Ticket selection`.

### 4.4 Step 3: Ticket selection

Purpose:
- Select ticket types and quantities (build the cart).

Validations:
- Cart cannot be empty.
- Quantity cannot exceed availability.
- If availability changes, user may need to adjust quantities (TBD).

Transition:
- Continue → `Contact details`.

### 4.5 Step 4: Contact details + Cart override (optional)

Purpose:
- Provide contact information for the reservation.
- This is the only step where **cart price override** can be applied (admin-only).
- Override is only available on this Contact Details screen.

Key UI:
- Contact details form.
- Optional "Override booking price" section.

Validations:
- Contact fields required according to business rules (TBD: exact requirements by channel).
- If override enabled: require override value + concept/reason.

#### 4.5.1 Cart price override rules (admin-only)

- Only available in Contact Details step.
- Enabled via an "Override booking price" toggle/checkbox.
- Supports:
  - Fixed or Percentage
  - Add / Reduce / Set final value (depending on DS implementation)
- Requires:
  - Amount value
  - Concept / reason text
- Price breakdown shows:
  - Reservation value
  - Adjustment
  - Final total
- When override is enabled and has a value, show a warning banner (e.g. "This reservation has a modified price").
- The adjustment is applied across tickets; rounding residuals may exist.
- Once a reservation has an override, future modifications should preserve it; changes may be constrained to editing the adjustment, not removing it (TBD in "normal flow").

#### 4.5.2 Conditional branch: Override confirmation modal

If (override applied) AND user clicks Continue:
- Show **Confirm changes** modal with:
  - Warning banner that the reservation has a modified price
  - Breakdown of new total price
  - Confirmation CTA

If (no override):
- Skip modal.

Transition:
- Confirm (or no override) → `Checkout`.

### 4.6 Step 5: Checkout (no deposits)

Purpose:
- Pay the reservation or leave it in **To be paid** depending on rules.
- In the standard flow (no deposit), the checkout shows full amount.

Supported payment methods (conceptual):
- Card
- Balance
- Payment link

Partner may have additional options (out of scope unless present in UI):
- Mark as paid manually
- Pay at box office

Validations:
- Payment must succeed to set status to **Paid**.
- If payment is not completed, reservation remains **To be paid** (if rules allow hold).

Transitions:
- Successful payment → Reservation status becomes **Paid** → go to `Reservation detail`.
- Payment link created → reservation stays **To be paid** until link paid.
- Cancel checkout → may return to detail with **To be paid** (TBD exact behavior).

#### 4.6.1 Payment methods and resulting status

- Payment methods that immediately finalize the reservation:
  - Card
  - Business balance
  - Mark as paid
  Outcome:
  - Reservation status becomes "Paid"
  - Tickets are issued/generated immediately

- Payment methods that do NOT finalize the reservation immediately:
  - Pay later
  - Payment link
  Outcome:
  - Reservation status remains "To be paid"
  - Tickets are NOT issued yet
  - Reservation can later become "Expired" if it reaches its expiration deadline without payment
  - If the payment link is completed successfully later, the reservation transitions to "Paid" and tickets are issued

Note: Expiration deadline is what eventually transitions "To be paid" -> "Expired" (details elsewhere / TBD).

## 5. Reservation Detail (Standard)

Purpose:
- Central place to view reservation information.
- Actions depend on status and actor.

Displayed data (typical):
- Status badge: Paid / To be paid / Cancelled / Expired
- Cart / tickets summary
- Contact info
- Price breakdown (including override if applied)
- Payment info and actions (if To be paid)

Behavior by status:

### 5.1 To be paid
- Allowed actions (depending on permissions):
  - Pay now (card/balance)
  - Generate / resend payment link
  - Cancel reservation
  - Modify tickets (within constraints)
- Reservation may expire at any time based on expiration policy.

### 5.2 Paid
- Allowed actions:
  - View / print tickets
  - Arrival validation (partner-side)
  - Further modifications/cancellations are out of scope for this normal flow.

### 5.3 Cancelled
- Read-only record.
- No payment actions.

### 5.4 Expired
- Read-only record.
- Payment must be blocked; user may need to create a new reservation.

## 6. Status Transitions (State machine)

### 6.1 Main transitions

- Create reservation (no payment yet) → **To be paid**
- Pay successfully → **Paid**
- Cancel reservation → **Cancelled**
- Expiration reached while To be paid → **Expired**

### 6.2 Notes / invariants

- **Expired** and **Cancelled** are terminal in the normal flow.
- Any internal "order" concept must map back to the UI status **Paid**.
- Any attempt to pay an expired reservation must be blocked (TBD exact UI handling).

## 7. Notifications (conceptual)

Trigger events (examples):
- Reservation created (To be paid)
- Payment link created
- Payment succeeded (Paid)
- About to expire warning (To be paid)
- Reservation expired (Expired)
- Reservation cancelled (Cancelled)

Exact templates, channels, and recipients are documented elsewhere (TBD).

## 8. Out of scope (for now)

This flows.md version intentionally excludes:
- Deposits and partial payments
- Reschedules and upgrades
- Refunds / cancellations after payment (beyond status mapping)
- Advanced inventory/price reconciliation edge cases
- Detailed Reservation Rules configuration UI and evaluation algorithm

Add these in separate sections/files when those features are implemented and documented.
# Reservations - Flows

This document describes the functional flow of the Reservations domain in Fever Zone (B2B Resellers), focusing on the standard reservation creation journey and the underlying business logic (reservation rules, expiration, permissions, payment methods). Deposits, upgrades/reschedules/refunds can be documented in separate flows.

## 1. Core Concepts

### 1.1 Entities

- **Business**: the customer/business account a booking is made for.
- **Reservation**: a temporary hold of inventory (tickets) that may require payment before being confirmed.
- **Order**: a paid reservation (conceptually). Once payment succeeds, the reservation becomes paid and tickets/QRs can be issued.

### 1.2 Reservation Status (UI truth)

Reservation status visible in Fever Zone is one of:

- **To be paid**: inventory is held, payment not completed yet.
- **Paid**: payment completed successfully.
- **Cancelled**: reservation was cancelled.
- **Expired**: reservation expired due to expiration rules / timeouts.

These are the only statuses used by the UI. Any additional internal lifecycle nuance must map back to one of the above.

## 2. Actors & Permissions

### 2.1 Actors

- **Partner / Booking Agent**: Fever Zone users operating on behalf of a business (reseller partners).
- **Business user**: users from the business portal (restricted compared to partners/admins).
- **Admin**: elevated privileges (e.g. cart price override).

### 2.2 High-level permissions (normal flow)

**For a Reservation (To be paid):**
- Partner can: create, modify tickets (within constraints), reschedule (out of scope here), cancel, trigger payment, create payment link, annotate/notes.
- Business user can: create (in their portal), modify tickets (within constraints), cancel, pay (card/balance/payment link).

**For a Reservation (Paid):**
- Partner can: view, print tickets, validate arrival; cancellations/modifications may exist but are out of scope for this "normal flow".
- Business user can: view and print tickets; limited operations compared to partner.

## 3. Reservation Rules & Expiration Logic

### 3.1 Reservation Rules engine (concept)

Reservation Rules determine:
- Whether a reservation can be created without immediate payment.
- The expiration time for a reservation created in "To be paid".
- Constraints based on event date/time, ticket type, business settings, and channel (partner vs business).

### 3.2 Expiration principles

- A **To be paid** reservation must have an expiration policy; otherwise it would block inventory indefinitely.
- If the user tries to reserve outside the allowed expiration window, the system may require **immediate payment**.

### 3.3 Channel differences (Partner vs Business)

- **Business portal** is restricted by expiration rules. If the business tries to reserve when expiration rules do not allow a hold, they must pay immediately.
- **Partner/Booking Agent** may bypass some expiration restrictions (e.g. can reserve closer to the event than the business is allowed to).

### 3.4 Expiration outcome

When a reservation reaches its expiration time:
- Status transitions from **To be paid** → **Expired**
- Inventory is released.
- Payment attempts after expiration should be blocked (TBD: exact UI behavior).

## 4. Standard Reservation Creation Flow (UI Journey)

This is the standard flow when a user creates a reservation from Fever Zone and ends up in Reservation Detail.

### 4.1 Entry point: Reservations Overview (List)

**Route:** `/reservations`

Purpose:
- View existing reservations and their status (Paid / To be paid / Cancelled / Expired).
- Start a new reservation (CTA).

Key UI:
- Table of reservations (filters may apply).
- Primary CTA: **Make a reservation**.

User actions:
- Open an existing reservation detail.
- Start new reservation.

Transitions:
- CTA → `Business selection` step.
- Row click → `Reservation detail`.

### 4.2 Step 1: Business selection

Purpose:
- Choose the business account for which the reservation will be created (partner flow).
- If the user is a business user, this step may be skipped (TBD).

Validations:
- Cannot proceed without selecting a business.

Transition:
- Continue → `Event selection`.

### 4.3 Step 2: Event selection

Purpose:
- Choose the event/session for the reservation.

Key logic:
- Availability and purchase constraints may depend on reservation rules and event schedule.

Validations:
- Must select an event/session.
- If no availability, user must select another option (TBD exact messaging).

Transition:
- Continue → `Ticket selection`.

### 4.4 Step 3: Ticket selection

Purpose:
- Select ticket types and quantities (build the cart).

Validations:
- Cart cannot be empty.
- Quantity cannot exceed availability.
- If availability changes, user may need to adjust quantities (TBD).

Transition:
- Continue → `Contact details`.

### 4.5 Step 4: Contact details + Cart override (optional)

Purpose:
- Provide contact information for the reservation.
- This is the only step where **cart price override** can be applied (admin-only).
- Override is only available on this Contact Details screen.

Key UI:
- Contact details form.
- Optional "Override booking price" section.

Validations:
- Contact fields required according to business rules (TBD: exact requirements by channel).
- If override enabled: require override value + concept/reason.

#### 4.5.1 Cart price override rules (admin-only)

- Only available in Contact Details step.
- Enabled via an "Override booking price" toggle/checkbox.
- Supports:
  - Fixed or Percentage
  - Add / Reduce / Set final value (depending on DS implementation)
- Requires:
  - Amount value
  - Concept / reason text
- Price breakdown shows:
  - Reservation value
  - Adjustment
  - Final total
- When override is enabled and has a value, show a warning banner (e.g. "This reservation has a modified price").
- The adjustment is applied across tickets; rounding residuals may exist.
- Once a reservation has an override, future modifications should preserve it; changes may be constrained to editing the adjustment, not removing it (TBD in "normal flow").

#### 4.5.2 Conditional branch: Override confirmation modal

If (override applied) AND user clicks Continue:
- Show **Confirm changes** modal with:
  - Warning banner that the reservation has a modified price
  - Breakdown of new total price
  - Confirmation CTA

If (no override):
- Skip modal.

Transition:
- Confirm (or no override) → `Checkout`.

### 4.6 Step 5: Checkout (no deposits)

Purpose:
- Pay the reservation or leave it in **To be paid** depending on rules.
- In the standard flow (no deposit), the checkout shows full amount.

Supported payment methods (conceptual):
- Card
- Balance
- Payment link

Partner may have additional options (out of scope unless present in UI):
- Mark as paid manually
- Pay at box office

Validations:
- Payment must succeed to set status to **Paid**.
- If payment is not completed, reservation remains **To be paid** (if rules allow hold).

Transitions:
- Successful payment → Reservation status becomes **Paid** → go to `Reservation detail`.
- Payment link created → reservation stays **To be paid** until link paid.
- Cancel checkout → may return to detail with **To be paid** (TBD exact behavior).

#### 4.6.1 Payment methods and resulting status

- Payment methods that immediately finalize the reservation:
  - Card
  - Business balance
  - Mark as paid
  Outcome:
  - Reservation status becomes "Paid"
  - Tickets are issued/generated immediately

- Payment methods that do NOT finalize the reservation immediately:
  - Pay later
  - Payment link
  Outcome:
  - Reservation status remains "To be paid"
  - Tickets are NOT issued yet
  - Reservation can later become "Expired" if it reaches its expiration deadline without payment
  - If the payment link is completed successfully later, the reservation transitions to "Paid" and tickets are issued

Note: Expiration deadline is what eventually transitions "To be paid" -> "Expired" (details elsewhere / TBD).

## 5. Reservation Detail (Standard)

Purpose:
- Central place to view reservation information.
- Actions depend on status and actor.

Displayed data (typical):
- Status badge: Paid / To be paid / Cancelled / Expired
- Cart / tickets summary
- Contact info
- Price breakdown (including override if applied)
- Payment info and actions (if To be paid)

Behavior by status:

### 5.1 To be paid
- Allowed actions (depending on permissions):
  - Pay now (card/balance)
  - Generate / resend payment link
  - Cancel reservation
  - Modify tickets (within constraints)
- Reservation may expire at any time based on expiration policy.

### 5.2 Paid
- Allowed actions:
  - View / print tickets
  - Arrival validation (partner-side)
  - Further modifications/cancellations are out of scope for this normal flow.

### 5.3 Cancelled
- Read-only record.
- No payment actions.

### 5.4 Expired
- Read-only record.
- Payment must be blocked; user may need to create a new reservation.

## 6. Status Transitions (State machine)

### 6.1 Main transitions

- Create reservation (no payment yet) → **To be paid**
- Pay successfully → **Paid**
- Cancel reservation → **Cancelled**
- Expiration reached while To be paid → **Expired**

### 6.2 Notes / invariants

- **Expired** and **Cancelled** are terminal in the normal flow.
- Any internal "order" concept must map back to the UI status **Paid**.
- Any attempt to pay an expired reservation must be blocked (TBD exact UI handling).

## 7. Notifications (conceptual)

Trigger events (examples):
- Reservation created (To be paid)
- Payment link created
- Payment succeeded (Paid)
- About to expire warning (To be paid)
- Reservation expired (Expired)
- Reservation cancelled (Cancelled)

Exact templates, channels, and recipients are documented elsewhere (TBD).

## 8. Out of scope (for now)

This flows.md version intentionally excludes:
- Deposits and partial payments
- Reschedules and upgrades
- Refunds / cancellations after payment (beyond status mapping)
- Advanced inventory/price reconciliation edge cases
- Detailed Reservation Rules configuration UI and evaluation algorithm

Add these in separate sections/files when those features are implemented and documented.
