import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full ${theme === "light" ? "bg-gray-300" : ""}`}
      >
        <Sun className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-600" : ""}`}
      >
        <Moon className="h-5 w-5 text-yellow-300" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full ${
          theme === "system" ? "bg-gray-400" : ""
        }`}
      >
        Auto
      </button>
    </div>
  );
};

export default ModeToggle;
