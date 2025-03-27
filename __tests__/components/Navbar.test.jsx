import { render, screen } from "@testing-library/react";
import Navbar from "../../src/components/Navbar";
import { BrowserRouter } from "react-router-dom";

describe("Navbar", () => {
  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    // Check for other navigation links
  });
});
