import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InterviewProcess from "./InterviewProcess";

// Stub components used inside InterviewProcess
vi.mock("../../components/ResumeUploadArea", () => ({
  default: () => <div data-testid="resume-upload">Resume Upload Stub</div>,
}));

vi.mock("../../components/Navbar", () => ({
  default: ({ darkMode }) => (
    <nav data-testid="navbar">Navbar (darkMode: {String(darkMode)})</nav>
  ),
}));

vi.mock("../../components/Footer", () => ({
  default: ({ darkMode }) => (
    <footer data-testid="footer">Footer (darkMode: {String(darkMode)})</footer>
  ),
}));

describe("InterviewProcess Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing and displays expected elements", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/interview", state: {} }]}>
        <InterviewProcess />
      </MemoryRouter>
    );

    // Check for headings and key content
    expect(
      screen.getByRole("heading", { name: /interview process/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/generate interview questions/i)
    ).toBeInTheDocument();
  });
});
