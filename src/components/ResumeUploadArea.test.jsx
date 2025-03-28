// src/__tests__/components/ResumeUploadArea.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResumeUploadArea from "./ResumeUploadArea";

// Mock the PDF.js library
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn().mockImplementation(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: vi.fn().mockImplementation(() => ({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: "Sample resume text" }],
        }),
      })),
    }),
  })),
  GlobalWorkerOptions: {
    workerSrc: "",
  },
}));

describe("ResumeUploadArea", () => {
  it("renders upload area correctly", () => {
    render(<ResumeUploadArea onResumeParsed={() => {}} />);
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
  });

  // More test cases...
});
