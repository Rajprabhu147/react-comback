import React from "react";
// react functional component
export default function TicketFilters({ filter, setFilter }) {
  //So this component doesn’t own the filter data itself — it just displays and updates what the parent provides.
  return (
    <div style={{ minWidth: 240 }}>
      {/**this lets the user type in a search box, and the parent 
    (TicketManager) receives the updated search query. */}
      <input
        placeholder="Search..."
        value={filter.q}
        onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {/** <select> — dropdown menu for ticket status filter.
            controlled component; its value reflects the parent’s current status filter.
            Updates filter.status in the parent when a new option is chosen.
            Keeps other fields (q, priority) unchanged by spreading the previous state:
            f => ({ ...f, status: e.target.value }).
            When a user selects “open,” only open tickets 
            will appear in the list (based on filtering logic in the parent).
            */}
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="in-progress">In-progress</option>
          <option value="closed">Closed</option>
          {/**Selecting “high” will make the parent filter the tickets to show only those with high priority. */}
        </select>
        <select
          value={filter.priority}
          onChange={(e) =>
            setFilter((f) => ({ ...f, priority: e.target.value }))
          }
        >
          <option value="all">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}
