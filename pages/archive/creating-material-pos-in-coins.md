# Creating Material POs in COINS
Platform: COINS
Status: Archived

## When This Is Used

Legacy material POs for service orders and jobs.

## Steps

1. Go to Procurement, then Material Orders, and click Add.
2. Service Order Related: usually Yes. If not, enter the job number.
3. Supplier: must match the email thread and the attachment.
4. Office: type M to find MAIN, unless told otherwise.
5. Description: the first initial and last name of each Southland person on the email thread.
6. Save, then add a line:
   - Code: MATL
   - Description: matches the request
   - Cost Type: NAB, AEX, or APM. Never ACR.
   - Cat: M
   - Qty: 1, unless you know the real quantity
   - Price: the pre-tax price, or 1 until you have it
7. Add a FREIGHT line if there are shipping costs.
8. Save, then email the PO number to the technician and copy NorCal Service. Use the New PO template in [Email Templates](email-templates).
9. Upload the quote and any other documents. Name each file what it is: Quote, Order Confirmation, Invoice, or Receipt.

> Note: If the supplier isn't valid, check Accounts Payable, Inquiry, Suppliers Inquiry. If it's marked Dormant, collect a new W9.

### For jobs instead of service orders

Look up the WBS code: click the three dots, filter the search to Description, and search for "material."

## Related Articles

- [Creating Subcontractor POs in COINS](creating-subcontractor-pos-in-coins)
