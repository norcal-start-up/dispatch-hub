# Creating Truck Stock POs in COINS
Platform: COINS
Status: Archived

## When This Is Used

For truck stock: parts that don't belong to a specific job. All other POs are created in ServiceTitan.

## Steps

1. Go to Procurement, More Orders, then Overhead Orders.
2. Dept: the Service Field department code, from the Cost Code Reference in the [Onboarding Folder](onboarding-folder).
3. Supplier: always fill this in.
4. Description: the requester's first initial and last name. For example, JSmith.
5. Sales/Use Tax: always fill this in.
6. Explanation: Truck Stock
7. Add a line:
   - Code: OH-TOOL
   - Cost Type: click the three dots and choose AEX for agreement work or NAB for non-agreement work
   - Include the sales and use tax code

## Required Information

- Supplier name
- Parts list
- Requester name

## Common Errors

- Forgetting to add a line.
- Forgetting to upload the invoice.

## Related Articles

- [Purchase Order Overview](purchase-order-overview)
