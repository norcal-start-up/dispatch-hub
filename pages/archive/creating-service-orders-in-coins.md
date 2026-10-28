# Creating Service Orders in COINS
Platform: COINS
Status: Archived

## When This Is Used

The first half of opening a legacy job: the service order in COINS. The job was then created in ServiceTrade.

## Steps

1. Go to Service Management, then Service Orders, and click Add.
2. Location Name: type the customer name and press Tab to fill in the fields.
3. Customer Name: type, select, and press Tab. If the customer isn't valid, look them up under Accounts Receivable, Inquiries, Customers.
4. Fill in the defaults. The department, group, and allowable work codes are in the Cost Code Reference in the [Onboarding Folder](onboarding-folder). Never use the controls work code. Controls handles its own jobs.
   - Response Type: NRML
   - Service Order Type: QUOTE, T&M, or T&MNTE
   - Coverage Zone: NORCAL
   - Primary Trade: 10-HVAC
   - Problem Code: HVAC
5. Customer PO: the PO. If you don't have one yet, use the customer's first and last name, or "NEEDS PO." Never leave it blank.
6. Sales Rep: always fill this in so they get credit.
7. For a QUOTE, fill in Quoted Price. For T&M or T&MNTE, leave it alone. Someone else fills in the not-to-exceed amount.
8. Problem Description: the quote number and subject. Keep it short and clear, and match the quote. Copy it for use in ServiceTrade.
9. Upload every attachment with the paperclip in the upper right.

## Related Articles

- [Creating Jobs in ServiceTrade](creating-jobs-in-servicetrade)
- [Service Order Lifecycle](service-order-lifecycle)
