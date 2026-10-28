# Cost Code Structure
Platform: COINS
Status: Archived

## When This Is Used

How legacy cost codes were built, and how they were written as ServiceTrade tags. Real codes are in the [Onboarding Folder](onboarding-folder).

## COINS cost codes

A service order cost code has four parts, separated by periods:

| Part | Example | Meaning |
| --- | --- | --- |
| Costing number | 1234567 | 7 digits, the same for all service orders |
| Service order number | 12345678 | 8 digits, created in COINS |
| Cost type class | AEX | AEX, APM, or NAB |
| Cost category | L | L for labor, M for materials, O for overhead |

Put together: 1234567.12345678AEX.L

## ServiceTrade tags

1. Add CC to the start.
2. Replace the periods with underscores.
3. For construction jobs, leave out the cost type class.

| Kind | Example |
| --- | --- |
| Service order | CC_1234567_12345678AEX_L |
| Job | CC_1234567_1234567_L |

> Note: To find a service order's cost type class, open Service Order Details, then Allowable Work, then Cost Types.
