import React, { useState } from "react";
// ✅ Imports React and useState hook for managing local edit state.

// ---------------------------------------------------------------------------
// COMPONENT: TicketItem
// ---------------------------------------------------------------------------
// Displays a single ticket with title, description, priority, and status.
// Allows inline editing of title/description, and deleting ticket.
// Props:
//   - ticket: the ticket object { id, title, description, ... }
//   - onUpdate(updatedTicket): callback to update the ticket
//   - onDelete(id): callback to delete the ticket
// ---------------------------------------------------------------------------

export default function TicketItem({ ticket, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  // ^ Local boolean flag to toggle edit mode.

  const [local, setLocal] = useState(ticket);
  // ^ Local copy of ticket data used for temporary edits.
  //   Prevents mutating parent state directly before saving.

  const save = () => {
    onUpdate(local);
    // ^ Calls parent callback with the edited ticket data.
    setEditing(false);
    // ^ Exit edit mode after saving.
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <li
      style={{
        borderBottom: "1px solid #eee",
        padding: 12,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      {/* Left column — main ticket info */}
      <div style={{ flex: 1 }}>
        {editing ? (
          // If editing = true → show inputs
          <>
            <input
              value={local.title}
              onChange={(e) => setLocal({ ...local, title: e.target.value })}
            />
            {/* ^ Controlled input for editing title */}

            <textarea
              value={local.description}
              onChange={(e) =>
                setLocal({ ...local, description: e.target.value })
              }
              rows={2}
            />
            {/* ^ Controlled textarea for editing description */}
          </>
        ) : (
          // Otherwise → read-only display mode
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <strong>{ticket.title}</strong>
              {/* ^ Ticket title */}

              <span style={{ fontSize: 12, color: "#666" }}>
                {ticket.assignee}
              </span>
              {/* ^ Ticket assignee shown next to title */}
            </div>

            <p style={{ margin: "8px 0" }}>{ticket.description}</p>
            {/* ^ Ticket description paragraph */}
          </>
        )}

        {/* Priority + Status */}
        <div style={{ fontSize: 12, color: "#777" }}>
          <span>Priority: {ticket.priority}</span> •{" "}
          <span>Status: {ticket.status}</span>
        </div>
      </div>

      {/* Right column — buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {editing ? (
          // In edit mode → show Save + Cancel
          <>
            <button onClick={save}>Save</button>

            <button
              onClick={() => {
                setLocal(ticket); // revert unsaved changes
                setEditing(false); // exit edit mode
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          // Default mode → show Edit + Delete
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button
              onClick={() => onDelete(ticket.id)}
              style={{ background: "#f44336", color: "white" }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
