/* eslint-disable react-refresh/only-export-components */
//importing all hooks
import React, { createContext, useContext, useState } from "react";

// creating a global container to hold data like theme info so any component can use it with useContext
const ThemeContext = createContext();

// React provide component which wraps children props like a parent
export function ThemeProvider({ children }) {
  //creating state variable and a function to update with useState hook
  const [theme, setTheme] = useState("light");
  // this is the function that toggles the theme between light and dark
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    //by using the provider which belongs to the context which takes prop as value
    //which you want ot share globally so passing theme and toggle theme so child can access it
    //nesting children means all nested components will be rendered inside the provider

    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
