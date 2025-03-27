import { render, screen, fireEvent } from "@testing-library/react";
import ResumeButton from "../../src/components/ResumeButton";

describe("ResumeButton", () => {
  it("renders button with correct text", () => {
    render(<ResumeButton>Analyze Resume</ResumeButton>);
    expect(screen.getByText("Analyze Resume")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<ResumeButton onClick={handleClick}>Click Me</ResumeButton>);

    fireEvent.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
