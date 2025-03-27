import { render, screen } from "@testing-library/react";
import InterviewProcess from "../../pages/InterviewProcess";
import { BrowserRouter } from "react-router-dom";

describe("InterviewProcess", () => {
  it("renders interview process steps", () => {
    render(
      <BrowserRouter>
        <InterviewProcess />
      </BrowserRouter>
    );

    expect(screen.getByText(/interview process/i)).toBeInTheDocument();
  });
});
