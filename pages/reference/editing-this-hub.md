# Editing This Hub
Status: Active

You don't need to know code to update this site. Every page is a plain text file. Type it the way you'd type a Word document, and the site handles the design. Each example below shows what to type, then what it turns into.

## New to GitHub? Start here

GitHub is where the site's files live. Editing a page there is like editing a shared document: open it, change the text, and save.

### What is a .md file?

A Markdown file. It's plain text with a few symbols for formatting, like a `#` for a title or a `-` for a bullet. You can open one in any text editor, but the easiest place to edit it is right on GitHub.

### Do I need an account?

Yes. Create a free GitHub account, then ask the hub owner to add you as a collaborator. You'll get an email invite.

### How do I find a page's file name?

Look at the address bar while you're on the page. Everything after `#/` is the page's location:

```
norcal-start-up.github.io/dispatch-hub/#/kb/job-tagging
```

That page's file is `pages/kb/job-tagging.md`. Its link name is the last part, `job-tagging`. Every page also shows its link name and file at the bottom, with a Copy button.

### How do I find a picture's file name?

Click Edit this page and look for the line that starts with `![`. The file name is inside the parentheses at the end. You can also right-click a picture, choose Open image in new tab, and read the end of the address.

### What does "commit" mean?

It means save. When you click Commit changes, keep the default option, which commits straight to the main branch.

### How long until my change shows up?

About one to two minutes. If you don't see it, refresh the page. If it still looks old, hold Shift and click refresh.

### What if I break something?

Nothing is ever lost. Every saved version of every file is kept. Open the file on GitHub and click History to see older versions. If you're not sure how to fix it, tell the hub owner which page you changed.

## Accounts and access

Every editor needs their own GitHub account. Readers don't need one, because the site is public.

### Adding a new editor (hub owner)

1. Ask the person to create a free GitHub account and send you their username.
2. On GitHub, open the dispatch-hub repository. Click Settings, then Collaborators, then Add people.
3. Type their username, pick them from the list, and click Add.
4. They get an email invite. It expires after 7 days, so ask them to accept it soon.
5. Send them this page, and ask them to set up the two steps below (private email and two-factor sign-in).

> Note: Every collaborator can edit every page. There's no view-only or single-page level, so only invite people who will edit.

### Removing an editor (hub owner)

1. Open Settings, then Collaborators.
2. Find the person and click Remove.

Do this the same day someone leaves the team or stops editing. Their past changes stay in the history, with their name on them.

### Why everyone needs their own login

- Every save is stamped with who made it. A shared login makes every change look like the same person, so nobody can tell who to ask about a mistake.
- The failed-check email goes to the account that saved. With a shared login, nobody knows it's theirs.
- Removing one person would mean changing a password that everyone knows.
- GitHub's terms allow one person per account. A shared account can be locked or suspended, which locks everyone out at once.

### Keep your email address private (each editor, once)

Every save is also stamped with an email address, and anyone can see it in the history. Turn this on before your first edit:

1. Click your profile picture in the top right, then Settings, then Emails.
2. Tick Keep my email addresses private.
3. Tick Block command line pushes that expose my email.

GitHub then uses a private stand-in address on your saves instead of your real one.

### Two-factor sign-in (optional, recommended)

Your account can change a public site, so a password alone is one leak away from trouble. Two-factor sign-in adds a code from your phone. GitHub may ask you to turn it on anyway.

1. Install a free authenticator app on your phone, like Microsoft Authenticator or Google Authenticator.
2. On GitHub, click your profile picture, then Settings, then Password and authentication.
3. Click Enable two-factor authentication and choose the authenticator app option.
4. Scan the code on screen with the app, then type the 6-digit code it shows.
5. Download the recovery codes and keep them somewhere safe, like a password manager. Never put them on this site. They're how you get back in if you lose your phone.

## How to edit a page

1. Open the page on the site and click Edit this page, under the title.
2. Sign in to GitHub if asked.
3. Make your changes. Click the Preview tab to check them.
4. Click Commit changes, then Commit changes again in the box that opens.

## When a save doesn't go live

Every save runs a check before it publishes. It takes about one to two minutes.

- **Passes:** the site publishes on its own.
- **Finds a problem:** nothing publishes. The live site keeps showing the last good version, so readers never see a broken page.

### What the email looks like

If the check finds a problem, GitHub emails the person who saved. It comes from GitHub, and the subject reads something like "Run failed: Check and publish - main." The wording is GitHub's own, so it sounds more alarming than it is. You'll also see a red X next to your save in the file's History.

### How to fix it

1. In the email, click View workflow run. Or open the repository on GitHub, click Actions, and open the newest run with a red X.
2. Scroll down to "The site was NOT published." The table there lists the file, the line, and what to fix.
3. Open that file, click the pencil to edit, and fix the line.
4. Commit. The check runs again on its own. A green check means the site is live within a minute.

### Common messages

| The table says | What to do |
| --- | --- |
| The menu links to a page that doesn't exist | Check the spelling in `nav.md`, or add the page |
| This links to a page that doesn't exist | Check the link name in parentheses against the page's file name |
| The image can't be found | Check the file name in `assets/img`. Capital letters count. |
| This image comes from another website | Download the picture and upload it to `assets/img` instead |
| This looks like an email address or phone number | Remove it and link to SharePoint instead |
| Pages can't contain code | Take out the code. Pages only need plain text and the symbols on this page. |

A "Worth a look" table may also appear, for example for an image over 600 KB. Those notes don't stop publishing.

### Allowing a public business number or email

The check blocks every email address and phone number, because personal contact details must never go on this public site. If a number truly is public, like a vendor's published customer service line, ask the hub owner first. Then add it on its own line in `.github/checks/allowed.txt` and save. The check runs again on its own.

### Still stuck

Open the file you changed, click History, and copy the text from the last version that worked. Paste it back in and commit. Then tell the hub owner which page you changed.

## Titles and badges

**Type this:**

```
# Creating Purchase Orders
Platform: ServiceTitan
Status: Active
```

**You get:** the page title, with ServiceTitan and Active badges under it. The `#` line comes first and is used once per page. The Platform and Status lines go right under it.

## Sections

Start a section with `##` and a space. These exact names get their own look:

| Type this | You get |
| --- | --- |
| `## When This Is Used` | An intro with an orange bar |
| `## Steps` | Numbered step markers on a line |
| `## Required Information` | A grid of checkmarks |
| `## Common Errors` | An amber warning card |
| `## Related Articles` | Link cards |

Any other name, like `## Response times`, becomes a plain white card. Use `###` for a smaller heading inside a section.

## Lists

**Type this:**

```
- Job Type: Quoted
- Business Unit: Norcal Bay Area - HVAC
- Upload the quote to the job
```

**You get:**

- Job Type: Quoted
- Business Unit: Norcal Bay Area - HVAC
- Upload the quote to the job

A short label followed by a colon turns bold on its own. For numbered steps, use `1.` `2.` `3.` instead of dashes.

### Breaking up a long numbered list

Put a `###` heading between groups, and start the next group at the number where the last one stopped. The site keeps counting.

```
### Right away

1. Answer hotline calls.
2. Respond to customer emails.

### Next

3. Create POs for account reps.
4. Order parts and materials.
```

[Task Prioritization](task-prioritization) uses this.

## Callout boxes

**Type this:**

```
> Tip: Press the slash key to jump to search.
> Warning: Never leave Customer PO blank.
```

**You get:**

> Tip: Press the slash key to jump to search.

> Warning: Never leave Customer PO blank.

You can also use `> Note:`, `> Important:`, and `> Example:`. Leave a blank line between two callouts.

## Email templates

A `>` line without a label becomes a template card with a Copy button.

**Type this:**

```
> Hello,
> Your service request has been received.
> Thank you for your patience.
```

**You get:**

> Hello,
> Your service request has been received.
> Thank you for your patience.

## Checklists

**Type this:**

```
- [ ] Customer PO is filled in
- [ ] All POs are received
- [ ] Notes say the job is complete
```

**You get:**

- [ ] Customer PO is filled in
- [ ] All POs are received
- [ ] Notes say the job is complete

Ticks are saved in each person's own browser. Pages with four or more boxes also get a progress bar and a Clear all button.

## Quiz questions

A `###` heading that ends in a question mark, followed by checkbox answers, becomes a quiz question. Mark the right answer with `[x]`. A `> Why:` line under the answers appears after someone picks one.

**Type this:**

```
### Which button saves your changes on GitHub?

- [ ] Preview
- [x] Commit changes
- [ ] Edit

> Why: Committing is how GitHub saves. Preview only shows you how it will look.
```

**You get:**

### Which button saves your changes on GitHub?

- [ ] Preview
- [x] Commit changes
- [ ] Edit

> Why: Committing is how GitHub saves. Preview only shows you how it will look.

## Decision trees

A line that ends in a question mark, followed by two or more `### If` headings, becomes a branching diagram. An `### In every case` heading after the branches joins them back together.

**Type this:**

```
Did the parts arrive?

### If yes

1. Tell the technician.
2. Schedule the job.

### If no

1. Check the tracking.
2. Update the customer.

### In every case

1. Update the job notes.
```

**You get:**

Did the parts arrive?

### If yes

1. Tell the technician.
2. Schedule the job.

### If no

1. Check the tracking.
2. Update the customer.

### In every case

1. Update the job notes.

[Direct Line](direct-line) uses this.

## Fillable forms

Add `Type: Form` under the title. Then any bullet that ends in three underscores becomes a box people can type in. Eight or more underscores make a bigger box. Form pages get a Print or save as PDF button, and nothing typed is saved.

```
# Service Request Intake Form
Type: Form

- Company name: ___
- Description of the issue: ________
```

See the [Intake Form](intake-form) for a full example.

## Links

To link to another page, put the words in square brackets and the page's link name in parentheses:

```
See [Job Tagging](job-tagging) for the tag list.
```

You get: See [Job Tagging](job-tagging) for the tag list.

For SharePoint, add the link to [Shared Links](shared-links) first, then use its name in lowercase with dashes. SharePoint links get a lock badge on their own:

```
The directory is in the [Onboarding Folder](onboarding-folder).
```

You get: The directory is in the [Onboarding Folder](onboarding-folder).

## Pictures

1. On GitHub, open the `assets/img` folder.
2. Click Add file, then Upload files, and drag your picture in. Name it in lowercase with dashes, like `receiving-pos-01.png`.
3. Click Commit changes.
4. In the article, add a line with the caption and file name:

```
![Click Receive, then upload the invoice](receiving-pos-01.png)
```

Put two or more picture lines back to back and they become a slideshow with arrows:

![The Supervisor Dashboard workflow](supervisor-dashboard-overview-01.png)
![The parts ordering workflow](parts-ordering-workflow-01.png)

> Warning: Before uploading a screenshot, blur names, emails, phone numbers, account numbers, customer details, and dollar amounts. This site is public.

## Archiving a page

Change its status line to `Status: Archived`. That's all. The page leaves the menu and moves to the Archive page on its own. Archive, Deprecated, Retired, and Legacy all work, in any capitals.

To bring it back, change the line to `Status: Active`.

## Adding a new page

1. On GitHub, open the right folder under `pages`, like `pages/kb`.
2. Click Add file, then Create new file.
3. Name it in lowercase with dashes, ending in `.md`, like `ordering-filters.md`.
4. Start it with `#`, a space, and the title. Then commit.
5. Ask the hub owner to add it to the menu.

## Extra space

Leave two or more blank lines between paragraphs to add extra space on the page.
