import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeButton from "../components/ResumeButton.jsx";

const InterviewProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the job object from route state
  const job = location.state?.job || {};

  // States for resume import
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Fallback values if job object doesn't exist
  const defaultCompany = "Amazon";
  const defaultPosition = "Software Developer Internship";

  // Use the job data if available, otherwise fall back
  const company = job.employer_nam || defaultCompany;
  const position = job.job_title || defaultPosition;
  const jobDescription = job.description || "";

  // States for interview question generation
  const [behavioralQuestions, setBehavioralQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [leetcodeLink, setLeetcodeLink] = useState("");
  const [buttonText, setButtonText] = useState("Generate Questions");

  // Handle resume upload callback
  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
    console.log("Extracted Resume Text:", extractedText);
  };

  // A helper function to parse and style each line of the AI's response
  const formatBehavioralQuestions = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Skip lines that start with "LeetCode is a great resource"
      if (
        line.trim().toLowerCase().startsWith("leetcode is a great resource")
      ) {
        return null; // Omit this line from rendering
      }
      // Bold lines that look like a question: "1. Question:", "2. Question:", etc.
      if (/^\s*\d+\.\s*question:/i.test(line)) {
        return (
          <p key={index} className="font-bold text-indigo-700">
            {line}
          </p>
        );
      }
      // Style lines that start with "Rationale:" or "Answer:"
      if (/^\s*(rationale:|answer:)/i.test(line)) {
        return (
          <p key={index} className="text-green-600 font-semibold">
            {line}
          </p>
        );
      }
      // Default line style
      return <p key={index}>{line}</p>;
    });
  };

  // Generate interview questions using OpenAI API
  const generateInterviewQuestions = async () => {
    setButtonText("Generating...");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Replace with your actual API key or environment variable
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional interview coach who provides the most common behavioral interview questions for a specified company and position, along with a brief rationale for why each question is asked.",
              },
              {
                role: "user",
                content: `
                The user is interviewing at ${company} for the ${position} role.
                Salary: ${job.salary || "N/A"}
                
                They have a resume (see below) which may or may not be relevant:
                Resume Text: 
                ${resumeText}

                Here's the official job description (if any):
                ${jobDescription}

                1. Provide the top 5 most frequent behavioral questions for ${company} for the ${position} position.
                2. Explain briefly why each question is asked.
                3. At the end, give a link to the relevant LeetCode resources (if any).
              `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;
        setBehavioralQuestions(output);

        // Construct a dummy LeetCode link for the constant company
        setLeetcodeLink(
          `https://leetcode.com/company/${company.toLowerCase()}`
        );
        setButtonText("Questions Generated");
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating interview questions:", error);
      alert(
        "Failed to generate interview questions. Check console for details."
      );
      setButtonText("Generate Questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-10 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 text-gray-900">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Interview Process
        </h1>
        <p className="text-gray-700 mb-4">
          Upload your resume (optional) for {company} and get behavioral
          questions for the {position} role along with a relevant LeetCode link.
        </p>

        {/* Resume Importer */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">
            Upload Resume
          </h2>
          <ResumeButton onResumeParsed={handleResumeParsed} />
          {uploadedFileName && (
            <p className="mt-2 text-sm text-gray-600">
              Uploaded File:{" "}
              <span className="font-medium">{uploadedFileName}</span>
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateInterviewQuestions}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {buttonText}
        </button>

        {/* Display Behavioral Questions */}
        {behavioralQuestions && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Behavioral Interview Questions
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md text-gray-800 max-h-80 overflow-y-auto">
              {formatBehavioralQuestions(behavioralQuestions)}
            </div>
          </div>
        )}

        {/* LeetCode Link */}
        {leetcodeLink && (
          <div className="mt-4">
            <a
              href={leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline font-semibold"
            >
              {`Visit LeetCode for ${company} problems`}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewProcess;
