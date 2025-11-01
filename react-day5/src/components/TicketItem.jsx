import React, { useState } from "react";

export default function TicketItem({ ticket, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(ticket);

  const save = () => {
    onUpdate(local);
    setEditing(false);
  };

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
      <div style={{ flex: 1 }}>
        {editing ? (
          <>
            <input
              value={local.title}
              onChange={(e) => setLocal({ ...local, title: e.target.value })}
            />
            <textarea
              value={local.description}
              onChange={(e) =>
                setLocal({ ...local, description: e.target.value })
              }
              rows={2}
            />
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <strong>{ticket.title}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>
                {ticket.assignee}
              </span>
            </div>
            <p style={{ margin: "8px 0" }}>{ticket.description}</p>
          </>
        )}
        <div style={{ fontSize: 12, color: "#777" }}>
          <span>Priority: {ticket.priority}</span> •{" "}
          <span>Status: {ticket.status}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {editing ? (
          <>
            <button onClick={save}>Save</button>
            <button
              onClick={() => {
                setLocal(ticket);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
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
