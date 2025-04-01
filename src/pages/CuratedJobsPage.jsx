import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Make sure this path matches your actual directory structure
// You may need to adjust this path based on your file organization
import ResumeUploadArea from "../components/ResumeUploadArea";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const JSEARCH_API_KEY = import.meta.env.VITE_JSEARCH_API_KEY;

const CuratedJobsPage = () => {
  // Update dark mode state to use localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // Add this useEffect to persist dark mode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    // Apply dark class to HTML element for Tailwind
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Your existing states...
  const [keywords, setKeywords] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  useEffect(() => {
    // Trigger glow effect animation on component mount
    setShowGlowEffect(true);

    // Create floating particles effect
    const createParticles = () => {
      const particleContainer = document.getElementById("particle-container");
      if (!particleContainer) return;

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-white opacity-20 z-0";

        // Random size between 5-15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation duration between 15-30s
        const duration = Math.random() * 15 + 15;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;

        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particleContainer.appendChild(particle);
      }
    };

    createParticles();

    // Clean up particles on unmount
    return () => {
      const particleContainer = document.getElementById("particle-container");
      if (particleContainer) {
        particleContainer.innerHTML = "";
      }
    };
  }, []);

  // Callback function to handle parsed resume text
  const handleResumeParsed = async (text, fileName) => {
    console.log("Resume parsed! Filename:", fileName);
    setLoading(true);

    try {
      // Extract keywords using OpenAI API
      const extractedKeywords = await extractKeywordsFromResume(text);
      setKeywords(extractedKeywords);

      // Fetch jobs using JSearch API
      const fetchedJobs = await fetchJobsUsingKeywords(extractedKeywords);
      setJobs(fetchedJobs.slice(0, 5)); // Limit to 5 jobs
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractKeywordsFromResume = async (resumeText) => {
    console.log(
      "Extracting keywords from resume text:",
      resumeText.substring(0, 100) + "..."
    );

    try {
      // Call OpenAI API to extract keywords
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that extracts specific information from resumes. Extract exactly two things: 1) Country (e.g., Canada, USA), 2) Role (either 'developer' if the person has professional experience, or 'intern' if they're a student). Return only these two values as a comma-separated list.",
              },
              {
                role: "user",
                content: `Extract country and role from the following resume text:\n\n${resumeText}`,
              },
            ],
            max_tokens: 20, // Reduced tokens since we only need two values
            temperature: 0.3, // Lower temperature for more deterministic output
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenAI API request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices returned from OpenAI API");
      }

      const keywords = data.choices[0].message.content
        .trim()
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword);

      console.log("Extracted keywords:", keywords);

      // Ensure we have exactly two keywords
      if (keywords.length !== 2) {
        throw new Error("Didn't receive exactly two keywords");
      }

      return keywords;
    } catch (error) {
      console.error("Error extracting keywords:", error);
      throw error;
    }
  };

  const fetchJobsUsingKeywords = async (keywords) => {
    console.log("Fetching jobs for keywords:", keywords);

    if (keywords.length !== 2) {
      console.error("Expected exactly 2 keywords (country and role)");
      return [];
    }

    const [country, role] = keywords;

    // Create a query based on the role and country
    let query;
    if (role.toLowerCase() === "intern") {
      query = `${role} jobs in ${country}`;
    } else {
      query = `developer jobs in ${country}`;
    }

    try {
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
          query
        )}&page=1&num_pages=1`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `JSearch API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Fetched jobs:", data.data);

      return data.data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };
  // Card variant for framer motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Job card variant for framer motion
  const jobCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
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

      {/* Gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
            : "bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100"
        }`}
      >
        {/* Animated blobs */}
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-purple-700" : "bg-purple-300"
          } opacity-20`}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        <motion.div
          className={`absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-blue-700" : "bg-blue-300"
          } opacity-20`}
          animate={{
            x: [0, -70, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        <motion.div
          className={`absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full blur-3xl -z-10 ${
            darkMode ? "bg-rose-700" : "bg-rose-300"
          } opacity-20`}
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
          }}
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

      {/* Use the Navbar component */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-8 pt-8 pb-16 relative z-10">
        {/* Page title */}
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
            Find Your <span className="text-purple-500">Perfect</span> Job
          </motion.h1>
          <motion.p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto md:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Upload your not so good resume and let our AI find the best job
            matches for your skills and experience.
          </motion.p>
        </motion.div>

        {/* Content cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Upload Resume Card */}
          <motion.div
            className="lg:w-1/2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
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
                  Upload Your Resume
                </h2>

                {/* Using the ResumeUploadArea component */}
                {/* If you still see errors, you might need to ensure the component is imported correctly */}
                {/* and that all required dependencies (pdf.js, lucide-react, etc.) are installed */}
                <ResumeUploadArea
                  onResumeParsed={handleResumeParsed}
                  darkMode={darkMode}
                />

                {/* Keywords section */}
                <AnimatePresence>
                  {keywords.length > 0 && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3
                        className={`text-lg font-semibold mb-3 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Your Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <motion.span
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              darkMode
                                ? "bg-purple-800 bg-opacity-40 text-purple-100"
                                : "bg-purple-100 text-purple-800"
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {keyword}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.p
                  className={`mt-8 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  No sign down required. Your data is only used to match you
                  with relevant jobs.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Recommended Jobs Card */}
          <motion.div
            className="lg:w-1/2"
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
                  Recommended Jobs
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-24">
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div className="relative w-20 h-20">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-4 border-purple-500 border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.15,
                            }}
                            style={{ opacity: 0.3 + i * 0.2 }}
                          />
                        ))}
                      </motion.div>
                      <p
                        className={`mt-4 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Finding the perfect job matches...
                      </p>
                    </motion.div>
                  </div>
                ) : jobs.length > 0 ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.job_id}
                        className={`p-6 rounded-xl ${
                          darkMode
                            ? "bg-gray-700 bg-opacity-40 border border-gray-600"
                            : "bg-gray-50 border border-gray-100"
                        } shadow-md overflow-hidden`}
                        custom={index}
                        variants={jobCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{
                          scale: 1.02,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {job.job_title}
                        </h3>
                        <div
                          className={`flex items-center text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          } mb-3`}
                        >
                          <span className="font-medium">
                            {job.employer_name}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {job.job_city || "Remote"},{" "}
                            {job.job_country || "USA"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-blue-800 bg-opacity-40 text-blue-100"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {job.job_employment_type || "Full-time"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-green-800 bg-opacity-40 text-green-100"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            New
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-purple-800 bg-opacity-40 text-purple-100"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            Match: 95%
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          } mb-4`}
                        >
                          {job.job_description?.substring(0, 150)}...
                        </p>
                        <motion.a
                          href={job.job_apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            darkMode
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-purple-500 hover:bg-purple-600"
                          } text-white`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Apply Now
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
                        </motion.a>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="py-24 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.svg
                      className={`w-16 h-16 mx-auto mb-6 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <path
                        d="M9 12H15M12 9V15M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                    <motion.p
                      className={`text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Upload your resume to discover your perfect job matches.
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          className={`mt-16 p-8 rounded-2xl ${
            darkMode
              ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
              : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
          } shadow-xl`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            {[
              { stat: "3,500+", label: "Companies Hiring" },
              { stat: "96%", label: "Match Accuracy" },
              { stat: "2x", label: "Faster Job Search" },
              { stat: "83%", label: "Satisfaction Rate" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.h3
                  className={`text-4xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.stat}
                </motion.h3>
                <motion.p
                  className={`mt-2 text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Use the Footer component */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default CuratedJobsPage;
