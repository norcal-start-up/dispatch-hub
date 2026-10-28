# Submitting Technician Timecards
Platform: ServiceTrade
Status: Archived

## When This Is Used

Moving approved time from ServiceTrade, through the Accounting Connector, into COINS payroll.

## Steps

### Export from ServiceTrade

1. Select all the checkboxes.
2. Click More Actions, then Export All Time. Convert or don't, either works.

### Run the Accounting Connector

1. Open the ServiceTrade Accounting Connector and click COINS Payroll.
2. Upload the export file and click Apply Recipe.

### Validate in COINS

1. Go to Payroll, Weekly Payroll, Input, then Load Timesheets.
2. Upload the payroll file from the Connector.
3. Upload Mode: Validate. Always Validate, never Load.
4. Period Type: Future.
5. Period: delete the default and choose the NorCal period.
6. Click Next. If the message says one file selected, click OK.
7. Hover over the printer icon until the status says Complete, then open the file.
8. If it lists errors, fix them and run it again. See [Troubleshooting Timecard Errors](troubleshooting-timecard-errors).

### Send to payroll

1. Email the payroll accountant using the Timesheets template below.
2. Attach the payroll file.
3. Paste a screenshot of the no-errors report into the email body.

> Subject: Timesheet for Week of [Sunday Date]
> Good morning,
> Submitting hours for technicians for the week of [Sunday Date].
> The payroll document from the ServiceTrade connector is attached.
> A screenshot of the COINS upload with no errors is below.

> Note: The date is the last day of the pay period, a Sunday. Pay periods run Monday through Sunday.
