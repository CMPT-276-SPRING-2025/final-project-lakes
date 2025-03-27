import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { BrowserRouter } from "react-router-dom";

// Mock fetch API
global.fetch = jest.fn();

describe("Resume Analysis Flow", () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        skills: ["React", "JavaScript"],
        improvements: ["Add more detail to work experience"],
      }),
    });
  });

  it("completes full resume upload and analysis flow", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to upload page if necessary
    // Upload a file
    // Check results appear
  });
});
