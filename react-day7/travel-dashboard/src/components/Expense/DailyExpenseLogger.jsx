// src/components/Expense/DailyExpenseLogger.jsx
import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import "../../styles/daily-expense-logger.css";

/**
 * DailyExpenseLogger Component
 * Logs daily expenses and tracks spending with edit capability
 */

const EXPENSE_CATEGORIES = [
  { value: "food", label: "🍽️ Food", color: "#ffd166" },
  { value: "transport", label: "🚗 Transport", color: "#ef4444" },
  { value: "accommodation", label: "🏨 Accommodation", color: "#02c39a" },
  { value: "activities", label: "⚡ Activities", color: "#8b5cf6" },
  { value: "shopping", label: "🛍️ Shopping", color: "#10b981" },
  { value: "other", label: "📌 Other", color: "#05668d" },
];

const DailyExpenseLogger = ({ onExpenseChange }) => {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem("dailyExpenses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("food");
  const [selectedDay, setSelectedDay] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Save expenses to localStorage and notify parent
  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    try {
      localStorage.setItem("dailyExpenses", JSON.stringify(newExpenses));
    } catch (e) {
      console.warn("Could not save expenses to localStorage", e);
    }
    if (onExpenseChange) {
      onExpenseChange(newExpenses);
    }
  };

  const handleAddExpense = () => {
    if (!expenseName.trim() || expenseAmount === "") return;
    const newExpense = {
      id: Date.now(),
      name: expenseName.trim(),
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      day: Number(selectedDay),
      date: new Date().toISOString().split("T")[0],
    };
    saveExpenses([...expenses, newExpense]);
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("food");
  };

  const handleDeleteExpense = (id) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
  };

  const saveEdit = (id) => {
    if (!editName.trim() || editAmount === "") return;
    const updatedExpenses = expenses.map((e) =>
      e.id === id
        ? {
            ...e,
            name: editName.trim(),
            amount: parseFloat(editAmount),
            category: editCategory,
          }
        : e
    );
    saveExpenses(updatedExpenses);
    setEditingId(null);
    setEditName("");
    setEditAmount("");
    setEditCategory("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditAmount("");
    setEditCategory("");
  };

  // Always show days 1-7
  const daysToShow = [1, 2, 3, 4, 5, 6, 7];

  // Filter expenses for selected day
  const dayExpenses = expenses.filter(
    (e) => Number(e.day) === Number(selectedDay)
  );
  const dayTotal = dayExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Return emoji and label separately from category label string
  const getCategoryParts = (categoryValue) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.value === categoryValue);
    if (!cat) return { emoji: "📌", text: "Other" };
    const parts = cat.label.split(" ");
    const emoji = parts.shift();
    const text = parts.join(" ").trim();
    return { emoji, text };
  };

  return (
    <div className="daily-expense-logger">
      <div className="logger-header">
        <h3 className="logger-title">💳 Daily Expense Logger</h3>
        <div className="header-stats">
          <span className="stat-badge">Total: ${totalExpenses.toFixed(2)}</span>
          <span className="stat-badge">Today: ${dayTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Day Selector */}
      <div className="day-selector">
        <div className="day-buttons">
          {daysToShow.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`day-btn ${
                Number(selectedDay) === Number(day) ? "active" : ""
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Expense Input */}
      <div className="expense-input-section">
        <input
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddExpense()}
          placeholder="Expense name"
          className="expense-input"
        />
        <input
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddExpense()}
          placeholder="Amount"
          className="expense-input amount"
          step="0.01"
          min="0"
        />
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          className="expense-select"
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddExpense}
          className="add-expense-btn"
          title="Add expense"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Expenses List */}
      <div className="expenses-list-container">
        {dayExpenses.length > 0 ? (
          <div className="expenses-list">
            {dayExpenses.map((expense) => {
              const { emoji, text } = getCategoryParts(expense.category);
              const isEditing = editingId === expense.id;

              return (
                <div key={expense.id} className="expense-item">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="edit-input"
                        placeholder="Expense name"
                      />
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="edit-input amount"
                        placeholder="Amount"
                        step="0.01"
                        min="0"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="edit-select"
                      >
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveEdit(expense.id)}
                        className="save-edit-btn"
                        title="Save changes"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="cancel-edit-btn"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="expense-icon">{emoji}</div>
                      <div className="expense-info">
                        <span className="expense-name">{expense.name}</span>
                        <span className="expense-category">{text}</span>
                      </div>
                      <span className="expense-amount">
                        ${(expense.amount || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => startEdit(expense)}
                        className="edit-btn"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            <div className="day-total">
              <span>Day {selectedDay} Total:</span>
              <strong>${dayTotal.toFixed(2)}</strong>
            </div>
          </div>
        ) : (
          <p className="empty-expenses">No expenses for Day {selectedDay}</p>
        )}
      </div>
    </div>
  );
};

export default DailyExpenseLogger;
