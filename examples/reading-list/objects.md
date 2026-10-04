# Objects — Team reading list

**Synthetic example.** Names and relationships below are a teaching model, not a production schema.

Three objects. Status is an attribute of Title, not its own object. People are not modeled. The list does not store a name, email, or account.

## Objects

| Object | Definition | Attributes | Actions |
|---|---|---|---|
| List | The one shared collection for this team. | Name (“Reading list”) | Open |
| Title | A book or article the team might read. | Name (required), status | Add, mark Reading, mark Finished, remove |
| Note | Why a title is on the list, in one short text. | Text (optional) | Add with the title, edit, clear |

**Status values:** To read, Reading, Finished. A new title starts at To read.

## Relationships

| From | To | Rule |
|---|---|---|
| List | Title | One list contains zero or more titles. |
| Title | Note | A title has at most one note. |
| Title | Status | A title has exactly one status. |

Removing a title removes its note. The list itself has no per-person copy.

## Language

People say “a recommendation.” The system stores that as a Title plus its Note.

People also say “who suggested it.” The system does not store a person. The note can say why the title matters, not who typed it. That avoids personal data on an Express dash. The divergence is accepted here and tracked under A-003 in [assumptions.md](assumptions.md) until a reconciliation gate is run.
