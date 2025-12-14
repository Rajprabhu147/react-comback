// src/components/TripPlanner/constants.js

export const CATEGORIES = [
  { value: "sightseeing", label: "🏛️ Sightseeing", color: "#05668d" },
  { value: "dining", label: "🍽️ Dining", color: "#ffd166" },
  { value: "accommodation", label: "🏨 Accommodation", color: "#02c39a" },
  { value: "transport", label: "🚗 Transport", color: "#ef4444" },
  { value: "shopping", label: "🛍️ Shopping", color: "#10b981" },
  { value: "activity", label: "⚡ Activity", color: "#8b5cf6" },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const INITIAL_ACTIVITIES = [
  {
    id: 1,
    day: 15,
    time: "09:00",
    activity: "Eiffel Tower Visit",
    location: "Eiffel Tower",
    category: "sightseeing",
    budget: 25,
    travelers: 2,
    notes: "Book tickets online",
    completed: false,
  },
  {
    id: 2,
    day: 15,
    time: "13:00",
    activity: "Lunch Date",
    location: "Latin Quarter",
    category: "dining",
    budget: 40,
    travelers: 2,
    notes: "",
    completed: false,
  },
  {
    id: 3,
    day: 16,
    time: "10:00",
    activity: "Louvre Museum",
    location: "Louvre Museum",
    category: "sightseeing",
    budget: 30,
    travelers: 2,
    notes: "",
    completed: false,
  },
];

export const getCategoryIcon = (category, categories = CATEGORIES) => {
  const cat = categories.find((c) => c.value === category);
  return cat ? cat.label.split(" ")[0] : "📌";
};

export const getCategoryColor = (category, categories = CATEGORIES) => {
  const cat = categories.find((c) => c.value === category);
  return cat ? cat.color : "#666";
};

export const getCategoryLabel = (category, categories = CATEGORIES) => {
  const cat = categories.find((c) => c.value === category);
  return cat ? cat.label : category;
};
