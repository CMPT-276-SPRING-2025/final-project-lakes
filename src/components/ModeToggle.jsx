import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full ${
          theme === "light"
            ? "linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%)"
            : ""
        }`}
      >
        <Sun className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full ${
          theme === "dark"
            ? "linear-gradient(135deg, #1f1f3f 0%, #331f3f 100%)"
            : ""
        }`}
      >
        <Moon className="h-5 w-5 text-yellow-300" />
      </button>
    </div>
  );
};

export default ModeToggle;
