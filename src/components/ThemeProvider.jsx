import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "auto"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "auto") {
      const now = new Date();

      // Convert to Vancouver, Canada (Pacific Time Zone)
      const vancouverTime = now.toLocaleString("en-US", {
        timeZone: "America/Vancouver",
      });
      const hour = new Date(vancouverTime).getHours();

      // Set dark mode between 7PM - 7AM Vancouver time
      const isNight = hour >= 19 || hour < 7;
      root.classList.add(isNight ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
