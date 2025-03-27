import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResumeUploadArea from "../../src/components/ResumeUploadArea";

describe("ResumeUploadArea", () => {
  it("renders upload area correctly", () => {
    render(<ResumeUploadArea />);
    expect(screen.getByText(/upload your resume/i)).toBeInTheDocument();
  });

  it("handles file upload", async () => {
    const mockOnUpload = jest.fn();
    render(<ResumeUploadArea onUpload={mockOnUpload} />);

    const file = new File(["resume content"], "resume.pdf", {
      type: "application/pdf",
    });
    const dropzone = screen.getByTestId("upload-area");

    await userEvent.upload(dropzone, file);

    expect(mockOnUpload).toHaveBeenCalledWith(file);
  });
});
