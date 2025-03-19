// src/pages/InterviewProcess.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeButton from "../components/ResumeButton.jsx";

// 1) IMPORT THE FIVE COMPANY LOGOS (ADJUST PATHS IF NEEDED)
import AmazonLogo from "../../Images/Amazon.png";
import FacebookLogo from "../../Images/facebook.png";
import GoogleLogo from "../../Images/Google.png";
import MicrosoftLogo from "../../Images/Microsoft.png";
import NetflixLogo from "../../Images/Netflix.png";

/* ----------------------------------
   1) THEME LOGIC (no extra file)
---------------------------------- */
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  // Load from localStorage or default to "light"
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

/* ----------------------------------
   2) INTERVIEW PROCESS COMPONENT
---------------------------------- */
function InterviewProcessPage() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // ====== YOUR ORIGINAL STATES & LOGIC ======
  const job = location.state?.job || {};
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const defaultCompany = "Amazon";
  const defaultPosition = "Software Developer Internship";
  const company = job.employer_nam || defaultCompany;
  const position = job.job_title || defaultPosition;
  const jobDescription = job.description || "";

  const [behavioralQuestions, setBehavioralQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [leetcodeLink, setLeetcodeLink] = useState("");
  const [buttonText, setButtonText] = useState("Generate Questions");

  // Handle resume upload
  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
    console.log("Extracted Resume Text:", extractedText);
  };

  // Format AI response
  const formatBehavioralQuestions = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.trim().toLowerCase().startsWith("leetcode is a great resource")) {
        return null;
      }
      if (/^\s*\d+\.\s*question:/i.test(line)) {
        return (
          <p key={index} className="font-bold text-indigo-700">
            {line}
          </p>
        );
      }
      if (/^\s*(rationale:|answer:)/i.test(line)) {
        return (
          <p key={index} className="text-green-600 font-semibold">
            {line}
          </p>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  // OpenAI call
  const generateInterviewQuestions = async () => {
    if (behavioralQuestions) return;
    setButtonText("Generating...");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a professional interview coach who provides the most common behavioral interview questions for a specified company and position, along with a brief rationale for why each question is asked."
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
              `
            }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;
        setBehavioralQuestions(output);
        setLeetcodeLink(`https://leetcode.com/company/${company.toLowerCase()}`);
        setButtonText("Questions Generated");
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating interview questions:", error);
      alert("Failed to generate interview questions. Check console for details.");
      setButtonText("Generate Questions");
    } finally {
      setLoading(false);
    }
  };

  // ====== THEME TOGGLER (MOON/SUN) ======
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // ====== TAILWIND + THEME STYLING ======
  // We switch the gradient based on `theme`.
  const gradientClass =
    theme === "light"
      ? "bg-gradient-to-br from-pink-300 to-purple-300"
      : "bg-gradient-to-br from-blue-600 to-purple-700";

  // The color for text, etc.
  const toggleIcon = theme === "light" ? "🌙" : "🌞";

  return (
    <div
      className={`min-h-screen p-10 flex flex-col items-center justify-center relative ${gradientClass} text-white`}
    >
      {/* THEME TOGGLE BUTTON in top-right corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 text-2xl bg-transparent border-none cursor-pointer"
      >
        {toggleIcon}
      </button>

      {/* WHITE CONTAINER */}
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 text-gray-900">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Interview Process
        </h1>
        <p className="text-gray-700 mb-4">
          Upload your resume (optional) for {company} and get behavioral questions
          for the {position} role along with a relevant LeetCode link.
        </p>

        {/* Resume Importer */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Upload Resume</h2>
          <ResumeButton onResumeParsed={handleResumeParsed} />
          {uploadedFileName && (
            <p className="mt-2 text-sm text-gray-600">
              Uploaded File: <span className="font-medium">{uploadedFileName}</span>
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateInterviewQuestions}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          disabled={loading || behavioralQuestions !== ""}
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

        {/* 
          3) TOP COMPANIES LOGOS 
          - "items-end" + "h-24" to place logos at the bottom 
          - They will bounce from the "ground" 
        */}
        <div className="mt-2 flex flex-wrap justify-center items-end gap-6 h-24">
          <img src={AmazonLogo} alt="Amazon" className="h-12 animate-bounce" />
          <img src={FacebookLogo} alt="Facebook" className="h-12 animate-bounce" />
          <img src={GoogleLogo} alt="Google" className="h-12 animate-bounce" />
          <img src={MicrosoftLogo} alt="Microsoft" className="h-12 animate-bounce" />
          <img src={NetflixLogo} alt="Netflix" className="h-12 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------
   3) EXPORT A SINGLE COMPONENT
   (WRAPPED WITH THEME PROVIDER)
---------------------------------- */
export default function InterviewProcess() {
  return (
    <ThemeProvider>
      <InterviewProcessPage />
    </ThemeProvider>
  );
}
