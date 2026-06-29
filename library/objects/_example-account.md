<!-- EXAMPLE: This is a sample object guide showing the format. Replace or delete this file when starting your own dash. -->

# Object Guide: Account

**TL;DR:** An **Account** is the top-level container for an organization's workspace in the platform. It owns all Projects, Members, and billing configuration. See also: [Project](project.md), [Member](member.md).

---

## Definition

An **Account** is the organizational unit that owns a workspace, holds a subscription plan, and controls access permissions for all members and projects within it.

---

## SIP Validation

| Criterion | Result | Evidence |
| --- | --- | --- |
| **Structure** | ✅ | Has a name, plan tier, owner, member list, billing details, creation date, and status — easily supports a dedicated detail/settings page |
| **Instances** | ✅ | "Acme Corp workspace", "Freelancer Jane Doe workspace", "Startup Team Beta workspace" |
| **Purpose** | ✅ | Users navigate to Account Settings to manage members, update billing, configure SSO, and set organization-wide defaults |

**Verdict:** Core system object — every authenticated user belongs to at least one Account, and all Projects exist within an Account.

---

## Synonyms / Also Known As

| Term | Context | Notes |
| --- | --- | --- |
| Organization | Some internal docs and API endpoints | Used interchangeably in older code; prefer "Account" in UI copy |
| Workspace | Informal / onboarding copy | Used in marketing and empty-state messaging to feel friendlier |
| Team | Legacy admin panel | Deprecated; being phased out in Q3 migration |

---

## Attributes

| # | Attribute | Data Type | Required | Source | Description |
| --- | --- | --- | --- | --- | --- |
| 1 | **Account name** | String | Yes | Manual | Display name set by the Account owner during signup. Shown in the nav header and on all shared links. Max 80 chars. Editable by: Admin only. |
| 2 | **Plan tier** | Enum (Free, Pro, Business, Enterprise) | Yes | System / Billing API | Current subscription tier. Determines feature availability and seat limits. Updated automatically on billing events. |
| 3 | **Owner** | Reference → Member | Yes | System | The Member who created the Account or has been explicitly transferred ownership. Cannot be removed while owner status is held. |
| 4 | **Status** | Enum (Active, Suspended, Cancelled, Trial) | Yes | System | Lifecycle state of the Account. Drives access gating across the entire workspace. |
| 5 | **Member count** | Number (Computed) | Yes | Computed | Live count of all Members with any role. Used to enforce seat limits and display on the billing page. |
| 6 | **Created date** | Date | Yes | System | UTC timestamp when the Account was first created. Immutable. Shown on the billing and admin pages. |
| 7 | **SSO enabled** | Boolean | No | Manual / Admin | Whether SAML/SSO is configured and enforced for login. Requires Enterprise plan. Editable by: Admin only. |
| 8 | **Avatar / logo** | Image | No | Manual | Account-level logo shown in nav and on shared project links. Accepts PNG/SVG, max 2 MB. Editable by: Admin only. |

---

## Nested Objects

| Nested Object | Relationship | How It Gets There |
| --- | --- | --- |
| [**Member**](member.md) | One Account → many Members | User-initiated invite, or SSO provisioning for Enterprise accounts |
| [**Project**](project.md) | One Account → many Projects | User-created; Project inherits Account-level permissions |
| [**Notification Settings**](notification-settings.md) | One Account → one Notification Settings | System-generated at Account creation; configurable per Admin |
| [**Billing Record**](billing-record.md) | One Account → one Billing Record | System-created on first plan selection; linked to payment processor |

---

## Calls-to-Action (CTAs)

| # | CTA | User Roles | Permission | Cross-Object? | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **View account settings** | Admin, Owner | Read | No | Primary entry point to the Account detail page. Available in the nav dropdown for eligible roles. |
| 2 | **Invite member** | Admin, Owner | Write | Yes → Member | Triggers invitation email flow. Seat limit enforced before invite is sent. Shows upgrade prompt if at limit. |
| 3 | **Update account name** | Admin, Owner | Write | No | Inline edit on Settings page. Change is propagated to nav header immediately. Audit log entry created. |
| 4 | **Update settings** | Admin, Owner | Write | No | Umbrella action for toggling SSO, notification defaults, and other org-level config. Plan-gated where applicable. |
| 5 | **View billing** | Owner | Admin | Yes → Billing Record | Opens billing portal (Stripe-hosted or in-app). Restricted to Owner role only; Admins see a disabled state with contact prompt. |
| 6 | **Export account data** | Owner | Admin | No | Downloads a ZIP of all account data (members, projects, activity log) for compliance or migration. Async job; user notified by email when ready. |
| 7 | **View activity log** | Admin, Owner | Read | No | Paginated log of all account-level events: member changes, plan changes, settings updates. Filterable by date and actor. |
| 8 | **Archive account** | Owner | Admin | No | Soft-delete. Sets status to Suspended. All Projects become read-only. Members cannot log in. Reversible within 30 days. |
| 9 | **Delete account** | Owner | Admin | No | Permanent. Requires typed confirmation ("delete [account-name]"). Cascades: deletes all Projects, Members, and Billing Records. Irreversible after 30-day grace period. |

---

## Relationship Specs (MCSFD)

### Account - [Project](project.md)

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Projects are created by Members within an Account. Each Project stores its `account_id` as a foreign key. Relationship is established at Project creation and cannot be changed. |
| **C - Cardinality** | One Account → zero to many Projects. Typical active account: 5–50 projects. Plan-based limits apply on Free tier (max 3 projects). |
| **S - Sorts** | Default: last modified descending. Available sorts: alphabetical, created date, last modified, status. |
| **F - Filters** | By status (Active / Archived), by Member (owner or collaborator), by date range (created or last modified). |
| **D - Dependencies** | Archiving an Account sets all child Projects to read-only. Deleting an Account permanently deletes all Projects after the 30-day grace period. |

### Account - [Member](member.md)

| Dimension | Specification |
| --- | --- |
| **M - Mechanics** | Members are added via invite (email link) or SSO provisioning. Each Member has one role per Account: Owner, Admin, or Member. Role is stored on the Account–Member join record. |
| **C - Cardinality** | One Account → one to many Members. Free tier: max 5 Members. Pro: max 25. Business/Enterprise: unlimited. |
| **S - Sorts** | Default: join date ascending. Available: alphabetical by name, by role, by last active date. |
| **F - Filters** | By role (Owner / Admin / Member), by status (Active / Invited / Deactivated), by last-active date range. |
| **D - Dependencies** | Removing a Member from an Account revokes all Project access. Ownership must be transferred before the current Owner can leave. Deactivated Members cannot log in but their content (comments, tasks) is retained. |

---

## User Stories

### Admin invites a new team member

> As an [**Admin**],
> I want to **invite a member** to an **Account**
> so that my colleague can access our shared projects immediately.
>
> When I enter their email address and select a role,
> I should see a confirmation that the invite was sent and the member appears as "Invited" in the member list.

### Owner exports account data

> As an [**Owner**],
> I want to **export account data** from my **Account**
> so that I can migrate our workspace or retain records for compliance.
>
> When I trigger the export,
> I should see a confirmation message and receive an email with a download link when the ZIP is ready.

### Admin views the activity log

> As an [**Admin**],
> I want to **view the activity log** for my **Account**
> so that I can audit who made changes and when.
>
> When I open the activity log and filter by date,
> I should see a paginated, chronological list of account-level events with actor names and timestamps.

---

## Business Rules

1. **Single owner per account**: Every Account must have exactly one Owner at all times. Ownership can be transferred to another Admin, but the outgoing Owner must confirm the transfer. Ownership cannot be deleted.
2. **Seat limit enforcement**: Invitations are blocked when the Member count equals or exceeds the plan's seat limit. The invite UI shows a disabled state with an upgrade prompt rather than silently failing.
3. **Cascading archive**: Archiving an Account immediately sets all child Projects to read-only. Members are notified by email. The Account can be reactivated by the Owner within 30 days; after that, it requires contacting support.
4. **Deletion grace period**: After a delete is confirmed, all account data is retained for 30 days before permanent removal. A recovery link is emailed to the Owner. After 30 days, deletion is irreversible and all data is purged per the data retention policy.
5. **SSO enforcement**: When SSO is enabled and enforced (Enterprise only), password-based login is disabled for all Members. Existing sessions are invalidated within 24 hours. The Owner always retains a break-glass password login as a fallback.
6. **Name uniqueness**: Account names do not need to be globally unique (they are identified by `account_id`), but the name must be non-empty and cannot consist solely of whitespace.

---

## Status / Lifecycle

```
[Trial] ──► [Active] ──► [Suspended / Archived] ──► [Cancelled / Deleted]
              ▲                   │
              └───────────────────┘  (reactivated within 30-day window)
```

| Status | Description | Triggers |
| --- | --- | --- |
| **Trial** | Account created; full features available for trial period. Billing not yet required. | Account signup without payment |
| **Active** | Fully operational. All features available per plan tier. | Plan selected or trial converted |
| **Suspended** | Owner or system has soft-archived the account. All Projects are read-only. Members cannot log in. | Owner action (Archive) or payment failure (auto-suspend after 7 days) |
| **Cancelled** | Account is in the 30-day deletion grace period. Data retained but inaccessible. | Owner confirms deletion |
| **Deleted** | All data permanently purged. Irreversible. | 30-day grace period expires after cancellation |

---

## Object Card Specification

| Element | Specification |
| --- | --- |
| **Distinguishing Attributes** | Account name, Plan tier badge, Member count, Status indicator |
| **Visual Signature** | Account avatar/logo (fallback: auto-generated monogram). Plan tier shown as a colored badge (Free = grey, Pro = blue, Business = purple, Enterprise = gold). |
| **Contextual CTAs** | Primary: "Open workspace". Secondary (Admin+): "Manage members". Owner only: "View billing". |
| **Nested Object Indicators** | Member count badge, Project count badge. On hover: shows last-active date. |

---

## Shapeshifter Matrix

| Context / View | Name | Plan tier | Status | Member count | Owner | Created date | SSO enabled | CTAs | Card Shape |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Account switcher (nav dropdown) | ✓ | ✓ | | ✓ | | | | Open, Switch | Compact row |
| Admin panel — account list | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | View settings, Suspend | Full-width table row |
| Account Settings page | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | All CTAs | Full page |
| Billing portal | ✓ | ✓ | | ✓ | ✓ | ✓ | | View billing, Export data | Full page |
| Shared project link (public) | ✓ | | | | | | | (none) | Logo + name only |

---

## Open Questions

| # | Question | Type | Confidence | Validation method |
| --- | --- | --- | --- | --- |
| OQ-001 | Should Admins be able to view billing information (read-only), or is billing truly Owner-only? Some enterprise customers have a dedicated Finance Admin persona who manages billing but is not the workspace Owner. | assumed | Low | Interview 3–5 enterprise account admins; check support ticket volume for "can't see billing" requests |
| OQ-002 | What is the right grace-period duration for cancelled accounts? 30 days is borrowed from analogous SaaS products (Notion, Linear) but has not been validated against our users' actual data-recovery behavior or legal/compliance requirements. | borrowed | Low | Review data retention policy with Legal; survey churned accounts on recovery expectations |

---

## See Also

* [Object Library](../) — All objects at a glance
* [Glossary](../../templates/glossary.md) — OOUX terminology
* [Member](member.md) — Individual user within an Account
* [Project](project.md) — Primary work container owned by an Account
* [Billing Record](billing-record.md) — Subscription and payment history for an Account
