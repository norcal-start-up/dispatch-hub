# PM Tracking Workbook
Status: Active

## When This Is Used

The PM tracking workbook turns the whole PM cycle into status codes, so you can see the next step for every customer at a glance. It also drafts the month's part order and PM emails for you.

## Job tracking

Found on the PM Emails sheet, under Part Ordering. Sort and filter these columns to plan your scheduling:

- Column A: Job Status
- Column D: PM Month
- Column G: Lead Technician
- Column I: Parts Info

### Before the visit is scheduled

| Status | Meaning | What to do |
| --- | --- | --- |
| INA | Inactive contract | Ignore until they renew |
| X | Job unscheduled | Schedule the job |
| ? | Questions exist | Resolve the questions |
| PN | Parts needed | Order parts |
| PO | Parts ordered | Coordinate pickup |
| CUST | Job on hold | Resolve the customer conflict |
| RDY | Ready for scheduling | Schedule the job |

### After the visit is scheduled

| Status | Meaning | What to do |
| --- | --- | --- |
| A past date | The visit date has passed | Review the job |
| A future date | Scheduled | Nothing yet |
| NOTES | Notes needed | Get the technician's notes |
| RTN | Return visit needed | Schedule a return visit |
| COM | Job complete | Tag Ready to Review and close out |

## Part tracking

On the PM sheet, Column I fills itself in from the PM Parts and PM Emails sheets. It's for reference only.

| Status | What to do |
| --- | --- |
| No Parts | Schedule right away |
| Questions | Resolve the part questions |
| Parts Needed | Order right away |
| Upon Request | Confirm before ordering |
| Ordered | Track and share the delivery date |
| WC Pickup | Schedule a will-call pickup. Try to group them. |
| UC Transit | Schedule pickup with the lead technician |
| Received | Receive the invoice on the PO |

> Warning: Typing over a Column I cell erases its formula. To fix it, copy a cell from elsewhere in the column and paste it back.

## Part ordering

On the PM Emails sheet, Column A tracks each order:

| Status | Meaning | What to do |
| --- | --- | --- |
| Send | Order not sent | Prepare the order |
| Sent | Order drafted | Review and place the order |
| WC Pickup | Parts at will call | Coordinate pickup |
| UC Transit | Parts at the warehouse | Coordinate pickup |
| Received | Parts in hand | Schedule the job |

### Prepare the order

1. Copy the Customer, Month, and Type cells from the PM sheet.
2. Paste them into the matching columns on the PM Emails sheet.
3. Drag the formulas in Columns F through L down to the new row.
   - Columns A, E, and L: update by hand
   - Columns B through D: pasted from the PM sheet
   - Columns F through K: calculated automatically
4. Before sending, confirm:
   - Column A says Send
   - Columns F through K aren't empty
   - Column J has the PO number
   - Column L says Will Call or the warehouse
5. Create the POs in ServiceTitan right before or right after you send.

### Send the order

1. Open Developer, then Visual Basic.
2. Under Modules, click OrderParts.
3. Click the green play button, select OrderParts, and click Run.
4. Review each email draft before sending:
   - The parts list is complete
   - Vendor emails are correct
   - The technician and SAM are copied
   - The PO is complete, 14 characters
   - The location says Will Call or UC Transit
   - ATTN is the lead technician, who is copied
   - The customer, month, and type are listed for reference

### Track the order

Once an order is sent, the statuses update on their own:

- PM Emails, Column A: Send becomes Sent
- PM sheet, Column A: PN becomes PO
- PM sheet, Column I: Parts Needed becomes Ordered

## Monthly PM emails

Two emails go out at the start of each month:

- Upcoming and Outstanding PMs: each technician's past and upcoming PMs
- All Upcoming PMs: every current PM, grouped by technician

### Send the emails

1. Open Developer, then Visual Basic.
2. Under Modules, click EmailMonthlyPMs.
3. Click the green play button, select EmailMonthlyPMs, and click Run.
4. Review the email drafts.
5. Repeat with EmailMonthlyPMsFullBlast for the second email.

## Related Articles

- [PM Overview](pm-overview)
- [PM Part Ordering](pm-part-ordering)
- [Identifying PM Visits](identifying-pm-visits)
