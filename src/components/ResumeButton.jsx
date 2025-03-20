import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

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
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items
              .map((item) => item.str)
              .join(" ");
          }

          console.log("Extracted PDF Text:", extractedText);
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
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hidden File Input */}
      <input
        id="resume-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isLoading}
      />

      {/* Styled Upload Button */}
      <motion.label
        htmlFor="resume-upload"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-6 py-3 rounded-full 
                   bg-purple-500 text-white font-medium shadow-lg
                   hover:bg-purple-600 transition cursor-pointer"
      >
        <Upload size={20} />
        <span>{isLoading ? "Processing..." : "Upload Resume"}</span>
      </motion.label>
    </div>
  );
};

export default ResumeButton;
