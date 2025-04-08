import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";

const ResumeButton = ({ onResumeParsed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Dynamically import PDF.js when component mounts
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Dynamic import of PDF.js
        const pdfjsLib = await import("pdfjs-dist");

        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        // Store in window for access in event handlers
        window.pdfjsLib = pdfjsLib;
<<<<<<< HEAD
=======
       
>>>>>>> 63da993d401fa1cf1c94b59317d866ff0341463c
      } catch (error) {
        console.error("Failed to load PDF.js:", error);
        setErrorMessage(
          "PDF processing library failed to load. Please refresh the page."
        );
      }
    };

    loadPdfJs();

    // Clean up
    return () => {
      delete window.pdfjsLib;
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset error state
    setErrorMessage(null);

    if (file.type === "application/pdf") {
      setIsLoading(true);
      setFileName(file.name);

      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const pdfData = new Uint8Array(e.target.result);

          try {
            if (!window.pdfjsLib) {
              throw new Error("PDF.js library not loaded");
            }

            // Load the PDF document
            const pdf = await window.pdfjsLib.getDocument({ data: pdfData })
              .promise;
            let extractedText = "";

            // Extract text from each page
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              extractedText += textContent.items
                .map((item) => item.str)
                .join(" ");
            }

            // Check if we got enough text to analyze
            if (extractedText.length < 100) {
              setErrorMessage(
                "This PDF contains too little text to analyze. Please try another file."
              );
            } else {
              // Pass the extracted text to the parent component
              onResumeParsed(extractedText);
            }
          } catch (pdfError) {
            console.error("Error parsing PDF:", pdfError);
            setErrorMessage(
              "Failed to read this PDF. Please ensure it's not encrypted or password-protected."
            );
          }
        };

        reader.onerror = () => {
          setErrorMessage("Failed to read the file. Please try again.");
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("File reading error:", error);
        setErrorMessage("Error reading the file. Please try again.");
      } finally {
        setIsLoading(false);
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      setErrorMessage("Please upload a PDF file only.");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Function to manually trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current && !isLoading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        ref={fileInputRef}
        id="resume-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isLoading}
      />

      <button
        onClick={triggerFileInput}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full 
                   ${
                     isLoading
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                   } 
                   text-white font-medium shadow-lg
                   transition`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : fileName ? (
          <FileText size={20} />
        ) : (
          <Upload size={20} />
        )}
        <span>
          {isLoading
            ? "Processing..."
            : fileName
            ? `Replace ${fileName.substring(0, 15)}${
                fileName.length > 15 ? "..." : ""
              }`
            : "Upload Resume"}
        </span>
      </button>

      {isLoading && (
        <p className="mt-2 text-sm text-gray-500">
          Analyzing your resume... This may take a moment
        </p>
      )}

      {errorMessage && (
        <div className="mt-3 flex items-center text-red-500 text-sm">
          <AlertCircle size={16} className="mr-1" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeButton;
