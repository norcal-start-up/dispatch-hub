# Closing Service Orders in COINS
Platform: COINS
Status: Archived

## When This Is Used

To get a legacy service order to Ready to Bill in COINS.

## Steps

### Download the service report

1. In ServiceTrade, open the Blank Paperwork tab.
2. Print it to PDF, named with the service order number.
3. Upload the PDF to the service order's attachments in COINS, with the description Service Report.

### Find open items

- Is Customer PO the real PO, or a placeholder?
- Have the labor hours, POs, and PCard charges hit?
- Are all invoices sent to Accounting labeled Invoice?
- Are the technician's notes complete?

### Resolve open items

1. In Service Management, Service Orders, open the service order and confirm the Customer PO.
2. On the Finance tab, check Material Orders for outstanding POs and Cost Transactions for costs that have hit.
3. Labor hours hit every Tuesday around midday. POs and PCard charges can hit any time.
4. Forward any open invoices to the PO accountant, with the service order and PO numbers. Copy NorCal Service.

> Warning: Accounting can only pay files labeled Invoice. If a vendor sends an Order Acknowledgement, ask them for the invoice.

### Update the stage

1. Click the Stages tab.
2. Click the folder icon for the stage you want.
3. Click the checkbox, and confirm the change in the upper right.

## Stage meanings

| Stage | Meaning |
| --- | --- |
| NEW | Freshly opened |
| GENHOLD | Open items to resolve |
| RTB | Ready to Bill |
| BILL COMPLETE | Billed, but charges can still be added |
| COMPLETE | Closed to new charges |

## Ready to Bill checklist

- [ ] The technician wrote Complete in their notes
- [ ] The ServiceTrade job is marked Complete
- [ ] The service report is downloaded, named, and uploaded to COINS
- [ ] Every GENHOLD item is resolved
- [ ] Customer PO is filled in
- [ ] All invoices are labeled Invoice
- [ ] All costs have hit
- [ ] PM tasking is complete and signed, for PMs only
- [ ] The stage is set to RTB
- [ ] For PMs, the PM spreadsheet is updated with the date, status, and notes
