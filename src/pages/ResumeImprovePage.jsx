import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeButton from "../components/ResumeUploadArea.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Variants for animations
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const ResumeImprovePage = () => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // Particle and glow effect state
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  // Form state
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false); // for the overall generate action, if needed
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [resumeFeedback, setResumeFeedback] = useState("");
  const [coverLetterFeedback, setCoverLetterFeedback] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Toggle darkMode and persist to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Particle and glow effects
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
    localStorage.setItem("resumeText", extractedText);
    localStorage.setItem("uploadedFileName", fileName);
    
  };

  const generateResumeAndCoverLetter = async () => {
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
            Authorization: `Bearer ${openAiKey}`, // Replace with environment variable
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional career coach who creates ATS-optimized resumes and compelling cover letters tailored to job descriptions. You have a client who needs help optimizing their resume and writing a cover letter for a job application.",
              },
              {
                role: "user",
                content: `
              Optimize the resume and generate a tailored cover letter based on the provided job description. The output must be extremely impressive, ATS-compatible, and plain text without any markdown formatting (do not use any asterisks, underscores, or similar symbols).

              Resume:
              ${resumeText}

              Job Description:
              ${jobDetails.description}

              Requirements:
              - Extract key skills and keywords.
              - Rewrite the resume to be ATS-friendly while preserving professional experience.
              - Generate a well-structured, formal, and engaging cover letter.
              - Ensure the output is clear and organized with proper headings, newlines, and paragraphs.
              - The output should be in plain text with no markdown formatting symbols.

              Output Format:
              Optimized Resume:
              <Formatted Resume Content with clear headings and paragraphs without any delimiter lines>

              Cover Letter:
              <Formatted Cover Letter Content with clear headings and paragraphs without any delimiter lines>
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract resume and cover letter separately
        const resumeMatch = output.match(
          /Optimized Resume:\s*([\s\S]*?)\s*Cover Letter:/
        );
        const coverLetterMatch = output.match(/Cover Letter:\s*([\s\S]*)/);

        setGeneratedResume(
          resumeMatch ? resumeMatch[1].trim() : "Error parsing resume..."
        );
        setGeneratedCoverLetter(
          coverLetterMatch
            ? coverLetterMatch[1].trim()
            : "Error parsing cover letter..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating resume & cover letter:", error);
      alert(
        "Failed to generate resume & cover letter. Check console for details."
      );
    }

    setLoading(false);
  };

  const regenerateResume = async () => {
    if (!resumeText.trim() || !jobDetails.description.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoadingResume(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional career coach who creates ATS-optimized resumes tailored to job descriptions. You have a client who needs help optimizing their resume for a job application.",
              },
              {
                role: "user",
                content: `
              Optimize the resume based on the provided job description and feedback. The output must be extremely impressive, ATS-compatible, and plain text without any markdown formatting (do not use any asterisks, underscores, or similar symbols).

              Resume:
              ${resumeText}

              Job Description:
              ${jobDetails.description}

              Feedback:
              ${resumeFeedback}

              Requirements:
              - Extract key skills and keywords.
              - Rewrite the resume to be ATS-friendly while preserving professional experience.
              - Incorporate feedback provided by the user.
              - Ensure the output is clear and organized with proper headings, newlines, and paragraphs.
              - The output should be in plain text with no markdown formatting symbols.

              Output Format:
              Optimized Resume:
              <Formatted Resume Content with clear headings and paragraphs without any delimiter lines>
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract resume
        const resumeMatch = output.match(/\*\*Optimized Resume:\*\*(.*)/s);

        setGeneratedResume(
          resumeMatch ? resumeMatch[1].trim() : "Error parsing resume..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error regenerating resume:", error);
      alert("Failed to regenerate resume. Check console for details.");
    }

    setLoadingResume(false);
  };

  const regenerateCoverLetter = async () => {
    if (!resumeText.trim() || !jobDetails.description.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoadingCoverLetter(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`, // Replace with environment variable
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional career coach who creates compelling cover letters tailored to job descriptions. You have a client who needs help writing a cover letter for a job application.",
              },
              {
                role: "user",
                content: `
              Generate a tailored cover letter based on the provided job description and feedback. The output must be extremely impressive, ATS-compatible, and plain text without any markdown formatting (do not use any asterisks, underscores, or similar symbols).

              Resume:
              ${resumeText}

              Job Description:
              ${jobDetails.description}

              Feedback:
              ${coverLetterFeedback}

              Requirements:
              - Extract key skills and keywords.
              - Incorporate feedback provided by the user.
              - Generate a well-structured, formal, and engaging cover letter.
              - Ensure the output is clear and organized with proper headings, newlines, and paragraphs.
              - The output should be in plain text with no markdown formatting symbols.

              Output Format:
              Cover Letter:
              <Formatted Cover Letter Content with clear headings and paragraphs without any delimiter lines>
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract cover letter
        const coverLetterMatch = output.match(/\*\*Cover Letter:\*\*(.*)/s);

        setGeneratedCoverLetter(
          coverLetterMatch
            ? coverLetterMatch[1].trim()
            : "Error parsing cover letter..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error regenerating cover letter:", error);
      alert("Failed to regenerate cover letter. Check console for details.");
    }

    setLoadingCoverLetter(false);
  };

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

      {/* Navbar */}
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
            Improve Resume And Cover Letter
          </motion.h1>
          <motion.p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto md:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Upload your resume and job description to get AI-powered resume and
            cover letter optimization.
          </motion.p>
        </motion.div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Resume Upload */}
          <motion.div
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
                <motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ResumeButton
                      onResumeParsed={handleResumeParsed}
                      darkMode={darkMode}
                    />
                  </motion.div>
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
                onClick={generateResumeAndCoverLetter}
                loading={loading}
                darkMode={darkMode}
              />
            </motion.div>
          </motion.div>

          {/* Column 2: Resume Generator */}
          <div className="space-y-8">
            {/* Resume Generator Output Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 ..."
                    : "bg-white bg-opacity-70 ..."
                } shadow-xl`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-6">
                  <h2
                    className={`text-2xl font-bold mb-6 text-center ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Resume Generator
                  </h2>
                  <div
                    className={`rounded-xl p-4 min-h-[250px] mb-6 ${
                      darkMode
                        ? "bg-gray-700 bg-opacity-50 border border-gray-600"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } whitespace-pre-line`}
                    >
                      {generatedResume ||
                        "Your generated resume will appear here..."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            {/* Resume Feedback Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 ..."
                    : "bg-white bg-opacity-70 ..."
                } shadow-xl`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-6">
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      darkMode ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    Feedback for Resume
                  </h3>
                  <textarea
                    value={resumeFeedback}
                    onChange={(e) => setResumeFeedback(e.target.value)}
                    placeholder="Provide feedback to improve the resume..."
                    rows="4"
                    className={`w-full p-3 rounded-xl mb-6 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-100 text-black border-gray-300"
                    }`}
                  />
                  <motion.button
                    onClick={regenerateResume}
                    disabled={loading}
                    className={`px-6 py-3 rounded-full w-full ${
                      darkMode
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-500 hover:bg-purple-600"
                    } text-white font-medium shadow-lg transition-transform flex items-center justify-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingResume ? (
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
                      <span>Regenerate Resume</span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Column 3: Cover Letter Generator & Feedback */}
          <div className="space-y-8">
            {/* Cover Letter Generator Output Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 ..."
                    : "bg-white bg-opacity-70 ..."
                } shadow-xl`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-6">
                  <h2
                    className={`text-2xl font-bold mb-6 text-center ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Cover Letter Generator
                  </h2>
                  <div
                    className={`rounded-xl p-4 min-h-[250px] mb-6 ${
                      darkMode
                        ? "bg-gray-700 bg-opacity-50 border border-gray-600"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } whitespace-pre-line`}
                    >
                      {generatedCoverLetter ||
                        "Your generated cover letter will appear here..."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            {/* Cover Letter Feedback Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 ..."
                    : "bg-white bg-opacity-70 ..."
                } shadow-xl`}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div className="p-6">
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      darkMode ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    Feedback for Cover Letter
                  </h3>
                  <textarea
                    value={coverLetterFeedback}
                    onChange={(e) => setCoverLetterFeedback(e.target.value)}
                    placeholder="Provide feedback to improve the cover letter..."
                    rows="4"
                    className={`w-full p-3 rounded-xl mb-6 focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-100 text-black border-gray-300"
                    }`}
                  />

                  <motion.button
                    onClick={regenerateCoverLetter}
                    disabled={loading}
                    className={`px-6 py-3 rounded-full w-full ${
                      darkMode
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-500 hover:bg-purple-600"
                    } text-white font-medium shadow-lg transition-transform flex items-center justify-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingCoverLetter ? (
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
                      <span>Regenerate Cover Letter</span>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default ResumeImprovePage;

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
          <span>Generate Resume & Cover Letter</span>
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
