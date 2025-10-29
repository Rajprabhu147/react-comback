import React, { useState } from "react";

/**Defines an object defaultTicket that represents the initial/empty values for a new ticket form.
title and description empty strings
priority defaults to "medium"
status defaults to "open"
assignee empty string
Using a single defaultTicket constant makes it easy to reset the form to a known state. */
const defaultTicket = {
  title: "",
  description: "",
  priority: "medium",
  status: "open",
  assignee: "",
};

export default function TicketForm({ onAdd }) {
  /**form is the state object holding current form values. Initialized to defaultTicket.
setForm is the setter to update form.
err stores a string error message for simple validation feedback (empty string means no error).
setErr updates the err state. */
  const [form, setForm] = useState(defaultTicket);
  const [err, setErr] = useState("");
  //handleChange is an input change handler used for all input fields (text, textarea, select).

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  /*It receives an event e and updates the form state by:Taking the previous f (current form object), Spreading its properties, Overwriting the property with the key e.target.name to the new e.target.value.
This pattern makes all inputs controlled and keeps the code DRY (one handler for many fields).*/
  const handleSubmit = (e) => {
    //handleSubmit is the form submission handler.
    e.preventDefault(); //e.preventDefault() prevents the browser from performing a full page reload on submit.
    /**If validation passes:onAdd(form) — calls the parent-supplied onAdd function with the current form object (the parent will normally trigger the add mutation).
setForm(defaultTicket) — resets the form inputs back to the default empty state.
setErr("") — clears any error message. */
    if (!form.title.trim()) {
      setErr("Title is required");
      return;
    }
    onAdd(form);
    //calls the parent-supplied onAdd function with the current form object (the parent will normally trigger the add mutation).
    setForm(defaultTicket);
    //resets the form inputs back to the default empty state.
    setErr("");
    //clears any error message.
  };

  return (
    <form
      onSubmit={handleSubmit} //when submit button is clicked handleSubmit runs
      style={{
        minWidth: 320,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <input
        name="title" //handleChange updates form.title
        value={form.title} //binds input to state
        onChange={handleChange} //updates state when user types
        placeholder="Title" //helper text shown when input in empty
      />
      <textarea
        name="description" // controlled text area for description
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={4} //gives it height of 4 text rows
      />
      {/**A controlled <select> dropdown for ticket priority.
          Options presented: "low", "medium", "high".
          value={form.priority} keeps the select in sync with state. */}
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        name="assignee"
        value={form.assignee}
        onChange={handleChange}
        placeholder="Assignee"
      />
      {/**A small wrapper <div> around the submit button, styled with flex and gap (useful if you add more buttons later).
          <button type="submit">Create</button> — clicking this triggers the form onSubmit handler (handleSubmit). */}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Create</button>
      </div>
      {err && <div style={{ color: "red" }}>{err}</div>}
      {/**{err && <div style={{ color: "red" }}>{err}</div>} — conditional rendering:
            If err is a non-empty string, render a <div> showing the error text in red.
            If err is an empty string, render nothing.
            Close the <form> and the co */}
    </form>
  );
}
