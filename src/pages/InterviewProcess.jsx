// src/pages/InterviewProcess.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCode } from "react-icons/fi";
import ResumeUploadArea from "../components/ResumeUploadArea";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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

// Helper function to truncate text (reused from JobSearchPage)
const truncateText = (text, limit) => {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

// Variants for animations
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ----------------------------------
   INTERVIEW PROCESS PAGE
---------------------------------- */
function InterviewProcessPage() {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const location = useLocation();
  const navigate = useNavigate();

  // ----- Original states/logic -----
  // Get job data from location state (passed from search page)
  const job = location.state?.job || {};
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Default values in case job data is not passed correctly
  const defaultCompany = "Amazon";
  const defaultPosition = "Software Developer Internship";
  const defaultDescription =
    "Develop software applications and contribute to technical solutions.";

  // Use job data from navigation state or fallback to defaults
  const company = job.employer_name || defaultCompany;
  const position = job.job_title || defaultPosition;
  const jobDescription = job.description || defaultDescription;

  // Log job data received from search page (for debugging)
  useEffect(() => {}, [job]);

  const [behavioralQuestions, setBehavioralQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [leetcodeLink, setLeetcodeLink] = useState("");
  const [buttonText, setButtonText] = useState("Generate Questions");

  // Particle effect state
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  // Handle resume upload
  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
  };

  // Format AI response
  const formatBehavioralQuestions = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (
        line.trim().toLowerCase().startsWith("leetcode is a great resource")
      ) {
        return null;
      }
      if (/^\s*\d+\.\s*question:/i.test(line)) {
        return (
          <motion.p
            key={index}
            className={`font-bold text-xl mb-3 mt-5 ${
              darkMode ? "text-purple-300" : "text-indigo-700"
            }`}
            variants={itemVariants}
          >
            {line}
          </motion.p>
        );
      }
      if (/^\s*(rationale:|answer:)/i.test(line)) {
        return (
          <motion.p
            key={index}
            className={`font-semibold mb-4 ${
              darkMode ? "text-emerald-300" : "text-green-600"
            }`}
            variants={itemVariants}
          >
            {line}
          </motion.p>
        );
      }
      return (
        <motion.p key={index} className="mb-2" variants={itemVariants}>
          {line}
        </motion.p>
      );
    });
  };

  // Call OpenAI API
  const generateInterviewQuestions = async () => {
    if (behavioralQuestions) return; // already generated
    setButtonText("Generating...");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Replace with your actual key (ideally from environment variable):
            Authorization: `Bearer ${OPENAI_API_KEY}`,
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
        setLeetcodeLink(
          `https://leetcode.com/company/${company.toLowerCase()}`
        );
        setButtonText("Questions Generated");
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating interview questions:", error);

      // Fallback to mock data in case the API call fails
      const mockQuestions = `
1. Question: Tell me about a time when you had to solve a complex technical problem.
Rationale: This question helps assess your problem-solving skills and technical aptitude, which are core competencies for the ${position} role at ${company}.

2. Question: Describe a situation where you had to work with a difficult team member.
Rationale: ${company} values collaboration and teamwork. This question evaluates your interpersonal skills and ability to navigate challenging team dynamics.

3. Question: Share an example of a project where you had to meet a tight deadline.
Rationale: This question assesses your time management, prioritization, and ability to perform under pressure - critical skills in fast-paced environments like ${company}.

4. Question: Tell me about a time when you received constructive feedback and how you responded.
Rationale: ${company} has a strong culture of continuous improvement and learning. This question evaluates your receptiveness to feedback and growth mindset.

5. Question: Describe a situation where you had to learn a new technology quickly.
Rationale: The tech industry evolves rapidly, and ${company} values candidates who can adapt and learn quickly. This question assesses your ability to pick up new skills efficiently.
`;

      setBehavioralQuestions(mockQuestions);
      setLeetcodeLink(`https://leetcode.com/company/${company.toLowerCase()}`);
      setButtonText("Questions Generated");
    } finally {
      setLoading(false);
    }
  };

  // Set up particle effects
  useEffect(() => {
    setShowGlowEffect(true);
    const createParticles = () => {
      const particleContainer = document.getElementById("particle-container");
      if (!particleContainer) return;
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-white opacity-20 z-0";
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        const duration = Math.random() * 15 + 15;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particleContainer.appendChild(particle);
      }
    };
    createParticles();
    return () => {
      const particleContainer = document.getElementById("particle-container");
      if (particleContainer) particleContainer.innerHTML = "";
    };
  }, []);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : ""
      } relative min-h-screen w-full overflow-hidden transition-all duration-500 flex flex-col`}
    >
      {/* Particle container */}
      <div
        id="particle-container"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      {/* Gradient background and animated blobs */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
            : "bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100"
        }`}
      >
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-purple-700" : "bg-purple-300"
          } opacity-20`}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className={`absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-blue-700" : "bg-blue-300"
          } opacity-20`}
          animate={{ x: [0, -70, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className={`absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-rose-700" : "bg-rose-300"
          } opacity-20`}
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showGlowEffect ? 0.1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={toggleTheme} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pt-8 pb-16 relative z-10 flex-grow">
        {/* Page Heading */}
        <motion.div
          className="mb-10 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1
            className={`text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Interview Process
          </motion.h1>
          <motion.p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto md:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Upload your resume (optional) for <strong>{company}</strong> and get
            behavioral questions for the <strong>{position}</strong> role.
          </motion.p>
        </motion.div>

        {/* Main Content Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Resume Upload */}
          <motion.div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
            } shadow-xl p-6`}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Upload Resume
            </h2>
            <ResumeUploadArea
              onResumeParsed={handleResumeParsed}
              darkMode={darkMode}
            />
          </motion.div>

          {/* Middle Column - Generate Questions */}
          <motion.div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
            } shadow-xl p-6`}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Generate Interview Questions
            </h2>
            <div className="flex flex-col h-64 justify-between">
              <div
                className={`mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <p className="mb-4">
                  We'll analyze your resume and the job description to generate
                  targeted behavioral questions specifically for {company}.
                </p>
                <p>
                  This will help you prepare for the {position} interview
                  effectively.
                </p>
              </div>

              <motion.button
                onClick={generateInterviewQuestions}
                className={`px-6 py-3 rounded-full text-white font-medium shadow-lg flex items-center justify-center space-x-2 ${
                  darkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } ${
                  loading || behavioralQuestions
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                whileHover={
                  !(loading || behavioralQuestions) ? { scale: 1.05 } : {}
                }
                whileTap={
                  !(loading || behavioralQuestions) ? { scale: 0.95 } : {}
                }
                disabled={loading || behavioralQuestions !== ""}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Company Info */}
          <motion.div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
            } shadow-xl p-6`}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Company Resources
            </h2>
            <div className="h-64 flex flex-col justify-between">
              <div
                className={`mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <p className="mb-4">
                  We'll provide you with a direct link to {company}'s LeetCode
                  problems to help you prepare for the technical portion of your
                  interview.
                </p>
                <p>
                  Many top tech companies use similar coding challenges during
                  their interview process.
                </p>
              </div>

              {leetcodeLink ? (
                <motion.a
                  href={leetcodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-full text-white font-medium shadow-lg flex items-center justify-center space-x-2 ${
                    darkMode
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCode className="mr-2" />
                  <span>{`View LeetCode for ${company}`}</span>
                </motion.a>
              ) : (
                <div
                  className={`px-6 py-3 rounded-full text-white font-medium shadow-lg flex items-center justify-center space-x-2 opacity-50 ${
                    darkMode ? "bg-purple-600" : "bg-purple-500"
                  }`}
                >
                  <FiCode className="mr-2" />
                  <span>Generate questions first</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {behavioralQuestions && (
            <motion.div
              className={`mt-10 rounded-2xl overflow-hidden ${
                darkMode
                  ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                  : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
              } shadow-xl`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.3,
              }}
            >
              <div className="p-8">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Your Interview Questions
                </h2>
                <motion.div
                  className={`p-6 rounded-xl ${
                    darkMode ? "bg-gray-700 bg-opacity-50" : "bg-gray-100"
                  } max-h-[600px] overflow-y-auto`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {formatBehavioralQuestions(behavioralQuestions)}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Company Logos */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.img
            src={AmazonLogo}
            alt="Amazon"
            className="h-12 md:h-16"
            whileHover={{ scale: 1.1, rotate: -5 }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0,
              },
            }}
          />
          <motion.img
            src={FacebookLogo}
            alt="Facebook"
            className="h-12 md:h-16"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.4,
              },
            }}
          />
          <motion.img
            src={GoogleLogo}
            alt="Google"
            className="h-12 md:h-16"
            whileHover={{ scale: 1.1, rotate: -5 }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.8,
              },
            }}
          />
          <motion.img
            src={MicrosoftLogo}
            alt="Microsoft"
            className="h-12 md:h-16"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.2,
              },
            }}
          />
          <motion.img
            src={NetflixLogo}
            alt="Netflix"
            className="h-12 md:h-16"
            whileHover={{ scale: 1.1, rotate: -5 }}
            animate={{
              y: [0, -8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.6,
              },
            }}
          />
        </motion.div>
      </main>

      {/* Footer */}
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
