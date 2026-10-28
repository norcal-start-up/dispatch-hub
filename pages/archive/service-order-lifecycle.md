# Service Order Lifecycle
Platform: COINS
Status: Archived

## When This Is Used

How legacy service orders moved from New to Billed, and how the Open SO List tracked them.

## The lifecycle

1. The service order and ServiceTrade job are created.
2. Sales or technicians request parts.
3. POs are generated and parts ordered.
4. Parts are received, and the warehouse usually emails a confirmation.
5. Dispatch notifies the technicians and schedules the work.
6. Job boards and notes are updated until the job is done.
7. Dispatch collects customer POs and reconciles PCards.

## Details needed at creation

- Service order number
- Location name
- Agreement number, if any
- Date the entry was created
- Service order description
- Service order type: Quote, T&M, or T&MNTE
- Quoted price, if any
- Any relevant notes

## When to update the Open SO List

- A customer PO comes in
- Parts are ordered
- Parts are received
- The status changes

> Important: The goal isn't to maintain a list. It's to move every service order from New to Billed. Check the list often and look for the next push: parts on order, a visit scheduled, technician notes, or a customer PO.
