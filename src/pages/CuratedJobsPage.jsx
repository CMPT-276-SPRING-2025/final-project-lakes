import React, { useState, useEffect } from "react";
import ResumeButton from "../components/resumebutton";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar"; // Import the Navbar component
import Footer from "../components/Footer"; // Import the Footer component

const OPENAI_API_KEY =
  "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";
const JSEARCH_API_KEY = "4d9349ad30msh512113b3b1be6adp1945b7jsn31b42dbeea2f";

const CuratedJobsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
  // Update the main handler function to include proper error handling
  const handleResumeParsed = async (text) => {
    setLoading(true);
    setJobs([]); // Clear any previous jobs
    setKeywords([]); // Clear any previous keywords

    try {
      // Extract keywords using OpenAI API
      const extractedKeywords = await extractKeywordsFromResume(text);
      setKeywords(extractedKeywords);

      // Fetch jobs using JSearch API - no hardcoded fallbacks
      const fetchedJobs = await fetchJobsUsingKeywords(extractedKeywords);

      // Set the jobs, limited to 5 for display
      setJobs(fetchedJobs.slice(0, 5));

      // If no jobs were found, show an error
      if (fetchedJobs.length === 0) {
        throw new Error("No matching jobs found for your profile");
      }
    } catch (error) {
      console.error("Error processing resume:", error);

      // Show error to user
      alert(
        `Error: ${
          error.message || "Failed to process your resume. Please try again."
        }`
      );

      // Keep existing keywords if we got that far
      if (keywords.length === 0) {
        setKeywords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to extract keywords using OpenAI API

  // Extract keywords from resume using OpenAI API
  const extractKeywordsFromResume = async (resumeText) => {
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
                  "You are a helpful assistant that analyzes resumes and extracts key skills, experiences, and qualifications.",
              },
              {
                role: "user",
                content: `Extract the top 5 most important keywords from this resume. Focus on technical skills, experience level, industry, and job roles. Also identify if the person is a student or intern, and their country of residence if mentioned. Format your response as a JSON array of strings with no explanation: ["keyword1", "keyword2", "student/not student", "country", "intern/not intern"].\n\nResume text:\n${resumeText}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Parse the JSON response from OpenAI
        try {
          const keywordsText = data.choices[0].message.content.trim();
          const keywords = JSON.parse(keywordsText);
          console.log("Extracted keywords:", keywords);
          return keywords;
        } catch (parseError) {
          console.error("Error parsing OpenAI response:", parseError);
          // Extract keywords more simply from text response
          const text = data.choices[0].message.content;
          return text
            .split(",")
            .map((kw) => kw.trim())
            .slice(0, 5);
        }
      }

      throw new Error("Invalid response from OpenAI API");
    } catch (error) {
      console.error("Error extracting keywords:", error);
      throw error; // Propagate error to be handled in the calling function
    }
  };

  // Fetch jobs from JSearch API using extracted keywords
  const fetchJobsUsingKeywords = async (keywords) => {
    // Extract main skills (usually the first 2-3 keywords)
    const skills = keywords.slice(0, 2).join(" ");

    // Check if person is a student/intern (should be in positions 2 and 4)
    const isStudent = keywords[2]?.toLowerCase().includes("student");
    const isIntern = keywords[4]?.toLowerCase().includes("intern");

    // Determine job type based on student/intern status
    const jobType = isStudent || isIntern ? "internship" : "fulltime";

    // Extract country (should be in position 3)
    const country = keywords[3] || "USA";

    // Build our query
    const query = `${skills} ${jobType}`;

    // Call JSearch API
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        query
      )}&num_pages=1&country=${encodeURIComponent(country)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": JSEARCH_API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`JSearch API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      // Transform the API response to match our expected job structure
      return data.data.map((job) => ({
        job_id: job.job_id || String(Math.random()),
        job_title: job.job_title || "Position",
        employer_name: job.employer_name || "Company",
        job_city: job.job_city || (job.job_is_remote ? "Remote" : ""),
        job_country: job.job_country || country,
        job_employment_type: job.job_employment_type || jobType,
        job_description: job.job_description || "No description available",
        job_apply_link: job.job_apply_link || "#",
      }));
    }

    throw new Error("Invalid response format from JSearch API");
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
            Upload your resume and let our AI find the best job matches for your
            skills and experience.
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
                    <motion.button
                      className={`px-6 py-3 rounded-full ${
                        darkMode
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-purple-500 hover:bg-purple-600"
                      } text-white font-medium shadow-lg flex items-center space-x-2`}
                      onClick={() => {
                        // Simulate ResumeButton click
                        handleResumeParsed(
                          "Sample resume text for demonstration"
                        );
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 16L12 12M12 12L8 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Upload Resume</span>
                    </motion.button>
                  </motion.div>

                  {loading && (
                    <motion.div
                      className="mt-8 flex flex-col items-center"
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
                      <p
                        className={`mt-4 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Analyzing your resume...
                      </p>
                    </motion.div>
                  )}
                </motion.div>

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
                  No sign up required. Your data is only used to match you with
                  relevant jobs.
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
