import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { motion } from "framer-motion";
import { Upload, CheckCircle, RefreshCw } from "lucide-react";

// Dynamically set the worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * ResumeUploadArea - A reusable component for handling resume uploads
 *
 * @param {Object} props
 * @param {Function} props.onResumeParsed - Callback function when resume is successfully parsed
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 */
const ResumeUploadArea = ({ onResumeParsed, darkMode = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

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
          setFileName(file.name);
          setResumeUploaded(true);
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

  const handleReset = () => {
    setResumeUploaded(false);
    setFileName("");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-8 rounded-xl ${
        darkMode
          ? "bg-gray-700 bg-opacity-40 border border-gray-600"
          : "bg-gray-50 border-2 border-dashed border-gray-300"
      }`}
    >
      {/* Initial Upload State */}
      {!resumeUploaded && (
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
            {isLoading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Upload Resume</span>
              </>
            )}
          </motion.label>
        </div>
      )}

      {/* Success State */}
      {resumeUploaded && !isLoading && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-500 rounded-full mb-4">
            <CheckCircle size={32} />
          </div>
          <p
            className={`text-lg font-medium ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Resume uploaded successfully!
          </p>
          <p
            className={`mt-2 text-center ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            File: {fileName}
          </p>

          {/* Upload a different resume button */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`mt-6 flex items-center space-x-2 px-4 py-2 rounded-full 
                        ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        } transition`}
          >
            <RefreshCw size={16} />
            <span>Upload a different resume</span>
          </motion.button>
        </motion.div>
      )}

      {/* Loading spinner (shown only when processing) */}
      {isLoading && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-t-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Analyzing your resume...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUploadArea;
