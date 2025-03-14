import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Dynamically set the worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ResumeButton = ({ onResumeParsed }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setIsLoading(true);

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const pdfData = new Uint8Array(e.target.result);

          // Load the PDF
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let extractedText = "";

          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items
              .map((item) => item.str)
              .join(" ");
          }

          // Log the extracted text to the console
          console.log("Extracted PDF Text:", extractedText);

          // Pass the extracted text to the parent component
          onResumeParsed(extractedText, file.name);

          event.target.value = "";
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Failed to parse the PDF. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <label
        htmlFor="resume-upload"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer 
          hover:bg-blue-600 transition-all duration-300"
      >
        {isLoading ? "Processing..." : "Upload Resume (PDF)"}
      </label>
      <input
        id="resume-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isLoading}
      />
    </div>
  );
};

export default ResumeButton;
