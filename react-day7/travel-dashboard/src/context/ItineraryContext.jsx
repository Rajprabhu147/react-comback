import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const LOCAL_KEY = "tripItineraryItems";

export const ItineraryContext = createContext({
  items: [],
  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
  toggleComplete: () => {},
  openEditor: () => {},
});

export const ItineraryProvider = ({ children, tripStartISO = null }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Failed to parse itinerary from localStorage", e);
      return [];
    }
  });

  const [openItemId, setOpenItemId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save itinerary", e);
    }
  }, [items]);

  const addItem = useCallback((item) => {
    const id = item.id ?? Date.now();
    const newItem = { ...item, id };
    setItems((prev) => [newItem, ...prev]);
    return id;
  }, []);

  const updateItem = useCallback((updated) => {
    setItems((prev) =>
      prev.map((it) => (it.id === updated.id ? { ...it, ...updated } : it))
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, completed: !it.completed } : it
      )
    );
  }, []);

  const dayToISO = useCallback(
    (day) => {
      if (!tripStartISO) return null;
      const start = new Date(tripStartISO);
      if (isNaN(start)) return null;
      const d = new Date(start);
      d.setDate(d.getDate() + (Number(day) - 1));
      return d.toISOString().slice(0, 10);
    },
    [tripStartISO]
  );

  const openEditor = useCallback((id) => setOpenItemId(id), []);
  const closeEditor = useCallback(() => setOpenItemId(null), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateItem,
      deleteItem,
      toggleComplete,
      openItemId,
      openEditor,
      closeEditor,
      dayToISO,
    }),
    [
      items,
      addItem,
      updateItem,
      deleteItem,
      toggleComplete,
      openItemId,
      openEditor,
      closeEditor,
      dayToISO,
    ]
  );

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};

export default ItineraryProvider;
