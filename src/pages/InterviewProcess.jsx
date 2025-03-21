// src/pages/InterviewProcess.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResumeButton from "../components/ResumeButton.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Logos (adjust paths as needed)
import AmazonLogo from "../../Images/Amazon.png";
import FacebookLogo from "../../Images/facebook.png";
import GoogleLogo from "../../Images/Google.png";
import MicrosoftLogo from "../../Images/Microsoft.png";
import NetflixLogo from "../../Images/Netflix.png";

/* ----------------------------------
   THEME CONTEXT
---------------------------------- */
const ThemeContext = createContext();

function ThemeProvider({ children }) {
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
   INTERVIEW PROCESS PAGE
---------------------------------- */
function InterviewProcessPage() {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  // Toggle theme (optional, if Navbar doesn't handle it)
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const location = useLocation();
  const navigate = useNavigate();

  // ----- Original states/logic -----
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

  // Call OpenAI
  const generateInterviewQuestions = async () => {
    if (behavioralQuestions) return; // already generated
    setButtonText("Generating...");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Replace with your actual key:
          Authorization: `Bearer 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`,
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

  // If you want the fancy gradient & particle background:
  // (Same as in MatchAnalysisPage)
  // Otherwise, you can remove the motion divs and the #particle-container

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : ""
      } relative min-h-screen w-full overflow-hidden transition-all duration-500 flex flex-col`}
    >
      {/* Particle container (optional) */}
      <div
        id="particle-container"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      {/* Gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
            : "bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100"
        }`}
      />
      {/* Optional glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={toggleTheme} />

      {/* Main Content (flex-grow pushes footer to bottom) */}
      <main className="flex-grow z-10 w-full max-w-6xl mx-auto p-6 md:p-10 relative">
        <div
          className={`bg-white shadow-2xl rounded-2xl p-8 md:p-10 ${
            darkMode ? "text-gray-900" : "text-gray-900"
          }`}
        >
          {/* Header */}
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
            Interview Process
          </h1>
          <p className="text-gray-700 mb-4">
            Upload your resume (optional) for <strong>{company}</strong> and get
            behavioral questions for the <strong>{position}</strong> role along
            with a relevant LeetCode link.
          </p>

          {/* Resume Importer */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">Upload Resume</h2>
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

          {/* Company Logos */}
          <div className="mt-10 flex flex-wrap justify-center items-end gap-6 h-24">
            <img
              src={AmazonLogo}
              alt="Amazon"
              className="h-12 animate-bounce"
            />
            <img
              src={FacebookLogo}
              alt="Facebook"
              className="h-12 animate-bounce"
            />
            <img
              src={GoogleLogo}
              alt="Google"
              className="h-12 animate-bounce"
            />
            <img
              src={MicrosoftLogo}
              alt="Microsoft"
              className="h-12 animate-bounce"
            />
            <img
              src={NetflixLogo}
              alt="Netflix"
              className="h-12 animate-bounce"
            />
          </div>
        </div>
      </main>

      {/* Footer at the bottom */}
      <Footer darkMode={darkMode} />
    </div>
  );
}

/* ----------------------------------
   EXPORT (WITH THEME PROVIDER)
---------------------------------- */
export default function InterviewProcess() {
  return (
    <ThemeProvider>
      <InterviewProcessPage />
    </ThemeProvider>
  );
}
