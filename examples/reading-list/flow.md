# Flow — Team reading list

**Synthetic example.** One scenario, one page. Express records a single concept and does not score alternatives.

**Concept:** One shared list on one page. Add a title, see it, mark it, or remove it. No feed, no follows, no accounts.

**Page:** Reading list. Hub object: List.

## Scenario: Add a title and find it later

**Actor:** Team member
**Trigger:** Someone mentions a book or article the team should not lose.

1. Open the reading list.
2. If it has no titles, read the empty message and use the add form (see empty state).
3. Enter a title. Add a note if it helps. Leave status at To read, or set Reading or Finished.
4. Save.
5. Find the title on the list with its note and status.
6. Later, mark it Reading or Finished, or remove it.

**Success:** The title is on the shared list, and any team member can find it without searching chat.

### Empty

The list has zero titles. The page says what is missing (“No titles yet”), why it matters (“so the team can find it later”), and shows the add form. It does not show sample titles that look saved.

### Error

Save fails because the connection drops. The draft stays in the form. The list does not gain the unsaved title. The message names the failure and the next step: “Not saved. The list did not change. Check the connection and try again.”

### Not rendered here

- **Loading.** A slow save is handled as the error above if it fails. A spinner is not drawn.
- **Permission denied.** There is one role, and the page only shows this team’s list. A second role would leave Express (A-003).
- **At scale.** The reach is under 30 people and a short list. A list that needs search or paging is a reason to rerun the tier checklist.

Wireframe: [wireframe.html](wireframe.html).
