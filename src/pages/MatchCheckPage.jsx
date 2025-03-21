import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeButton from "../components/ResumeButton.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Variants for card animations
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const MatchAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const job = location.state ? location.state.job : undefined;

  // Instead of "theme", use a boolean darkMode for consistency
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Particle and glow effect state
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  // Your existing state and logic for resume analysis
  const [jobDetails, setJobDetails] = useState({
    title: job ? `${job.job_title}` : "",
    company: job ? `${job.employer_name}` : "",
    location: job ? `${job.job_city}` : "",
    description: job ? `${job.description}` : "",
  });
  const [resumeText, setResumeText] = useState("");
  const [matchRating, setMatchRating] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
    console.log("Extracted Resume Text:", extractedText);
  };

  const analyzeResumeMatch = async () => {
    if (!resumeText.trim() || !jobDetails.description.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI career assistant that evaluates how well a users resume matches a given job description.",
              },
              {
                role: "user",
                content: `
**Evaluate the resume against the job description.**

**Resume:**
${resumeText}

**Job Description:**
${jobDetails.description}

**Requirements:**
- Provide a match percentage (0-100%).
- List exactly **3 strengths**.
- List exactly **3 weaknesses**.
- List exactly **3 suggestions** for improvement.

**Output Format:**
**Match Rating:** <Match Score>%
**Strengths:**
1. <Strength 1>
2. <Strength 2>
3. <Strength 3>

**Weaknesses:**
1. <Weakness 1>
2. <Weakness 2>
3. <Weakness 3>

**Suggested Improvements:**
1. <Suggestion 1>
2. <Suggestion 2>
3. <Suggestion 3>
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        const ratingMatch = output.match(/\*\*Match Rating:\*\* (\d+)%/);
        const strengthsMatch = output.match(
          /\*\*Strengths:\*\*\s*([\s\S]+?)\n\s*\*\*Weaknesses:/
        );
        const weaknessesMatch = output.match(
          /\*\*Weaknesses:\*\*\s*([\s\S]+?)\n\s*\*\*Suggested Improvements:/
        );
        const suggestionsMatch = output.match(
          /\*\*Suggested Improvements:\*\*\s*([\s\S]+)/
        );

        const extractList = (match, defaultText) => {
          if (!match || !match[1])
            return [defaultText, defaultText, defaultText];

          const items = match[1]
            .trim()
            .split("\n")
            .map((s) => s.replace(/^\d+\.\s+/, "").trim())
            .filter((s) => s);

          while (items.length < 3) {
            items.push(defaultText);
          }

          return items.slice(0, 3);
        };

        setMatchRating(ratingMatch ? ratingMatch[1] : "N/A");
        setStrengths(extractList(strengthsMatch, "No strength identified."));
        setWeaknesses(extractList(weaknessesMatch, "No weakness identified."));
        setSuggestions(
          extractList(suggestionsMatch, "No suggestion available.")
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error analyzing resume match:", error);
      alert("Failed to analyze resume match. Check console for details.");
    }
    setLoading(false);
  };

  // Particle and glow effects (similar to friend’s file)
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

  // Toggle function for dark mode
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : ""
      } relative min-h-screen w-full overflow-hidden transition-all duration-500`}
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
      {/* Navbar (uses your friend’s common component) */}
      <Navbar darkMode={darkMode} setDarkMode={toggleTheme} />
      <main className="max-w-7xl mx-auto px-8 pt-8 pb-16 relative z-10">
        {/* Page Heading */}
        <motion.div
          className="mb-16 text-center md:text-left"
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
            Match Analysis
          </motion.h1>
          <motion.p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto md:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Evaluate your resume against a job description and get personalized
            feedback.
          </motion.p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Resume Upload & Job Details */}
          <motion.div
            className="lg:w-1/3"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {/* Resume Upload Card */}
            <motion.div
              className={`rounded-2xl overflow-hidden ${
                darkMode
                  ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                  : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
              } shadow-xl`}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-8">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Upload Resume
                </h2>
                <motion.div
                  className={`flex flex-col items-center justify-center py-16 px-8 rounded-xl ${
                    darkMode
                      ? "bg-gray-700 bg-opacity-40 border border-gray-600"
                      : "bg-gray-50 border-2 border-dashed border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ResumeButton onResumeParsed={handleResumeParsed} />
                  </motion.div>
                  {uploadedFileName && (
                    <p
                      className={`mt-2 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Uploaded:{" "}
                      <span className="font-medium">{uploadedFileName}</span>
                    </p>
                  )}
                </motion.div>
                <p
                  className={`mt-8 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No sign up required. Your data is only used to match you with
                  relevant jobs.
                </p>
              </div>
            </motion.div>
            {/* Job Details Card */}
            <motion.div
              className="mt-8"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                    : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
                } shadow-xl`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-8">
                  <h2
                    className={`text-2xl font-bold mb-6 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Job Details
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      value={jobDetails.title}
                      onChange={handleInputChange}
                      placeholder="Job Title"
                      className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                    />
                    <input
                      type="text"
                      name="company"
                      value={jobDetails.company}
                      onChange={handleInputChange}
                      placeholder="Company"
                      className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                    />
                    <input
                      type="text"
                      name="location"
                      value={jobDetails.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                    />
                    <textarea
                      name="description"
                      value={jobDetails.description}
                      onChange={handleInputChange}
                      placeholder="Paste the job description here..."
                      className={`w-full p-3 rounded-xl h-32 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            {/* Analyze Match Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <FancyButton
                onClick={analyzeResumeMatch}
                loading={loading}
                darkMode={darkMode}
              />
            </motion.div>
          </motion.div>
          {/* Right Column: Results */}
          <motion.div
            className="lg:w-2/3"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className={`rounded-2xl overflow-hidden ${
                darkMode
                  ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                  : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
              } shadow-xl`}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-8">
                {/* Match Rating */}
                <div className="flex justify-center items-center mb-8">
                  <div className="relative">
                    <svg className="w-40 h-40" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      {matchRating !== null && (
                        <circle
                          className="text-purple-600"
                          strokeWidth="10"
                          strokeDasharray={`${matchRating * 2.51} 251`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          transform="rotate(-90 50 50)"
                        />
                      )}
                    </svg>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ color: darkMode ? "#ffffff" : "#111" }}
                    >
                      <span className="text-4xl font-bold">
                        {matchRating !== null ? `${matchRating}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Strengths, Weaknesses, Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className={`p-4 rounded-xl ${
                      darkMode
                        ? "bg-purple-800 bg-opacity-40 text-purple-100"
                        : "bg-purple-100 text-purple-800"
                    } shadow-md`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <h3 className="text-xl font-bold mb-2">Strengths:</h3>
                    <ul className="list-disc list-inside">
                      {strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    className={`p-4 rounded-xl ${
                      darkMode
                        ? "bg-red-800 bg-opacity-40 text-red-100"
                        : "bg-red-100 text-red-800"
                    } shadow-md`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <h3 className="text-xl font-bold mb-2">Weaknesses:</h3>
                    <ul className="list-disc list-inside">
                      {weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    className={`p-4 rounded-xl ${
                      darkMode
                        ? "bg-blue-800 bg-opacity-40 text-blue-100"
                        : "bg-blue-100 text-blue-800"
                    } shadow-md`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
                    <ul className="list-disc list-inside">
                      {suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default MatchAnalysisPage;

// FancyButton component styled with framer-motion and Tailwind
const FancyButton = ({ onClick, loading, darkMode }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-3 rounded-full ${
        darkMode
          ? "bg-purple-600 hover:bg-purple-700"
          : "bg-purple-500 hover:bg-purple-600"
      } text-white font-medium shadow-lg flex items-center space-x-2 transition-transform`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
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
      ) : (
        <>
          <span>Analyze Match</span>
          <svg
            className="ml-2 w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </motion.button>
  );
};
