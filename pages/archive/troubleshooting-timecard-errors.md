# Troubleshooting Timecard Errors
Platform: ServiceTrade
Status: Archived

## When This Is Used

When the COINS validation report comes back Complete with errors.

## Steps

1. Read the report. It tells you which row has the problem.
2. Open the payroll file and find that row.
3. Start with Column F. It holds the tags added when the job was created in ServiceTrade.
4. Look for the cause:
   - Extra numbers or characters
   - A wrong job or service order number
   - A misspelled or wrong cost type class
5. In ServiceTrade, go to Jobs, All Jobs, and search the tag.
6. Open the job and retype the tag correctly.
7. Run the report again until it comes back clean.

> Example: A tag with an extra period at the start caused the error in one row.

> Note: Some PM tags look odd at a glance. PMs are allowed to use a special code in place of a cost code.
