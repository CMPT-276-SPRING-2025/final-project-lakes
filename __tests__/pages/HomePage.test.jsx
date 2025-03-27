import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/HomePage";
import { BrowserRouter } from "react-router-dom";

describe("HomePage", () => {
  it("renders welcome message", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading")).toHaveTextContent(/welcome/i);
  });
});
