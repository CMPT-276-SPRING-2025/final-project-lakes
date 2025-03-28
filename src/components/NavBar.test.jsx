import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";

// Mock window.innerWidth before rendering for responsiveness
const resizeWindow = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

describe("Navbar Component", () => {
  let darkMode, setDarkMode;

  beforeEach(() => {
    darkMode = false;
    setDarkMode = vi.fn();
  });

  it("renders correctly on desktop", () => {
    resizeWindow(1200);
    render(
      <MemoryRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    // Logo and links exist

    expect(screen.getByText("Search Postings")).toBeInTheDocument();
    expect(screen.getByText("Jobs For You")).toBeInTheDocument();

    // No hamburger menu on desktop
    expect(
      screen.queryByRole("button", { name: /menu/i })
    ).not.toBeInTheDocument();
  });

  it("toggles dark mode on button click", () => {
    resizeWindow(1200);
    render(
      <MemoryRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    const darkModeBtn = screen.getAllByRole("button")[0]; // First button is dark mode toggle
    fireEvent.click(darkModeBtn);
    expect(setDarkMode).toHaveBeenCalledWith(true);
  });

  it("closes mobile menu when a nav link is clicked", () => {
    resizeWindow(500);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </MemoryRouter>
    );

    const hamburgerBtn = screen.getAllByRole("button")[1];
    fireEvent.click(hamburgerBtn);
  });
});
