import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sample data (unchanged)
const jobResults_sample = [
  {
    job_id: 1,
    job_title: "Software Engineer",
    employer_name: "Google",
    job_city: "Mountain View",
    salary: "120,000",
    description:
      "Develop scalable web applications and contribute to Google's cutting-edge technology stack.",
  },
  {
    job_id: 2,
    job_title: "Frontend Developer",
    employer_name: "Facebook",
    job_city: "Menlo Park",
    salary: "110,000",
    description:
      "Work on user-facing applications, improving UI/UX and optimizing performance for billions of users.",
  },
  {
    job_id: 3,
    job_title: "Data Scientist",
    employer_name: "Amazon",
    job_city: "Seattle",
    salary: "130,000",
    description:
      "Analyze large datasets to derive insights, optimize business strategies, and enhance AI models.",
  },
  {
    job_id: 4,
    job_title: "Product Manager",
    employer_name: "Microsoft",
    job_city: "Redmond",
    salary: "125,000",
    description:
      "Lead cross-functional teams to define product roadmaps and drive innovation in cloud computing solutions.",
  },
  {
    job_id: 5,
    job_title: "Backend Engineer",
    employer_name: "Netflix",
    job_city: "Los Angeles",
    salary: "115,000",
    description:
      "Build high-performance backend services to support streaming experiences for millions of users worldwide.",
  },
  {
    job_id: 1,
    job_title: "Software Engineer",
    employer_name: "Google",
    job_city: "Mountain View",
    salary: "120,000",
    description:
      "Develop scalable web applications and contribute to Google's cutting-edge technology stack.",
  },
  {
    job_id: 2,
    job_title: "Frontend Developer",
    employer_name: "Facebook",
    job_city: "Menlo Park",
    salary: "110,000",
    description:
      "Work on user-facing applications, improving UI/UX and optimizing performance for billions of users.",
  },
  {
    job_id: 3,
    job_title: "Data Scientist",
    employer_name: "Amazon",
    job_city: "Seattle",
    salary: "130,000",
    description:
      "Analyze large datasets to derive insights, optimize business strategies, and enhance AI models.",
  },
  {
    job_id: 4,
    job_title: "Product Manager",
    employer_name: "Microsoft",
    job_city: "Redmond",
    salary: "125,000",
    description:
      "Lead cross-functional teams to define product roadmaps and drive innovation in cloud computing solutions.",
  },
  {
    job_id: 5,
    job_title: "Backend Engineer",
    employer_name: "Netflix",
    job_city: "Los Angeles",
    salary: "115,000",
    description:
      "Build high-performance backend services to support streaming experiences for millions of users worldwide.",
  },
  {
    job_id: 1,
    job_title: "Software Engineer",
    employer_name: "Google",
    job_city: "Mountain View",
    salary: "120,000",
    description:
      "Develop scalable web applications and contribute to Google's cutting-edge technology stack.",
  },
  {
    job_id: 2,
    job_title: "Frontend Developer",
    employer_name: "Facebook",
    job_city: "Menlo Park",
    salary: "110,000",
    description:
      "Work on user-facing applications, improving UI/UX and optimizing performance for billions of users.",
  },
  {
    job_id: 3,
    job_title: "Data Scientist",
    employer_name: "Amazon",
    job_city: "Seattle",
    salary: "130,000",
    description:
      "Analyze large datasets to derive insights, optimize business strategies, and enhance AI models.",
  },
  {
    job_id: 4,
    job_title: "Product Manager",
    employer_name: "Microsoft",
    job_city: "Redmond",
    salary: "125,000",
    description:
      "Lead cross-functional teams to define product roadmaps and drive innovation in cloud computing solutions.",
  },
  {
    job_id: 5,
    job_title: "Backend Engineer",
    employer_name: "Netflix",
    job_city: "Los Angeles",
    salary: "115,000",
    description:
      "Build high-performance backend services to support streaming experiences for millions of users worldwide.",
  },
];

// API configuration (unchanged)
const API_KEY = import.meta.env.VITE_JSEARCH_API_KEY;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
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
function shortenJobDescription(description) {
  if (!description) return "";

  // Clean up the description
  const cleaned = description
    .replace(/(Job Description:|Responsibilities:|Requirements:)/gi, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Attempt to split by sentence
  const sentences = cleaned.split(/(?<=[.?!])\s+/); // keeps punctuation

  let summary = "";
  for (let sentence of sentences) {
    if ((summary + " " + sentence).split(" ").length <= 40) {
      summary += (summary ? " " : "") + sentence;
    } else {
      break;
    }
  }

  // If no punctuation or sentence was too long, fallback to word slice
  if (!summary) {
    const words = cleaned.split(" ");
    summary = words.slice(0, 40).join(" ") + (words.length > 40 ? "..." : "");
  } else if (
    !summary.endsWith(".") &&
    !summary.endsWith("!") &&
    !summary.endsWith("?")
  ) {
    summary += "...";
  }

  return summary;
}

const JobSearchPage = () => {
  const navigate = useNavigate();

  // State for expanded job descriptions
  const [expanded, setExpanded] = useState({});

  // State for dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  // Particle and glow effect state
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    company: "",
  });
  // Add debounced filters state
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  // Toggle darkMode and persist to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Toggle expanded job descriptions
  const toggleDescription = (job_id) => {
    setExpanded((prev) => ({
      ...prev,
      [job_id]: !prev[job_id],
    }));
  };

  // Truncate text function
  const truncateText = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Navigate to interview process
  const handleInterviewProcess = (job) => {
    navigate("/match-check", { state: { job } });
  };
  const handleInterviewquestions = (job) => {
    navigate("/interview-process", { state: { job } });
  };

  // Debounce the filter changes
  useEffect(() => {
    // Set a timer to update debouncedFilters after 500ms of no changes
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms debounce time

    // Clean up the timer if filters change before timeout
    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch jobs when debouncedFilters change, not on every keystroke
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const searchQuery = debouncedFilters.company || "software developer"; // Default query
        const url = `https://jsearch.p.rapidapi.com/search?query=${searchQuery}%20jobs%20in%20${debouncedFilters.location}&page=1&num_pages=2&country=us&date_posted=all`;
        const response = await fetch(url, options);
        const result = await response.json();
        
        setJobResults(result.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Uncomment to enable API fetch
    fetchJobs();

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [debouncedFilters]); // This only runs when debouncedFilters change, not on every keystroke

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  // When API is enabled, this would paginate jobResults
  // For now, paginate the sample data
  const currentJobs = jobResults.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobResults.length / jobsPerPage);

  // Change page functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
            Search Job Postings
          </motion.h1>
          <motion.p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto md:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Find your perfect job match from thousands of opportunities.
          </motion.p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="mb-10"
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
            } shadow-xl mb-8`}
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
                Filter Jobs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location..."
                  className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-200"
                  }`}
                />

                <input
                  type="text"
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  placeholder="Company..."
                  className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-black border-gray-200"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Job Results Heading */}
        <motion.h2
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          Current Positions:
        </motion.h2>

        {/* Job Results */}
        {loading ? (
          <motion.div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
            } shadow-xl p-8 text-center`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-purple-600"
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
            </div>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading opportunities...
            </p>
          </motion.div>
        ) : jobResults.length > 0 ? (
          <AnimatePresence>
            {currentJobs.map((job, index) => (
              <motion.div
                key={job.job_id + index}
                className={`rounded-2xl overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                    : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
                } shadow-xl mb-6`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {job.job_title}
                      </h3>
                      <p
                        className={`text-lg mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {job.employer_name} - {job.job_city}
                      </p>
                      <p
                        className={`text-lg font-medium mb-4 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {job.job_employment_type}
                      </p>
                      <div
                        className={`mb-4 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {shortenJobDescription(job.job_description)}
                      </div>
                    </div>
                    <div className="md:self-center">
                      <div className="flex flex-col gap-2">
                        <motion.button
                          onClick={() => handleInterviewProcess(job)}
                          className={`px-6 py-3 rounded-full text-white font-medium shadow-lg flex items-center justify-center space-x-2 ${
                            darkMode
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-purple-500 hover:bg-purple-600"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Am I a good match?</span>
                          <FiArrowRight />
                        </motion.button>

                        <motion.button
                          onClick={() => handleInterviewquestions(job)}
                          className={`px-6 py-3 rounded-full font-medium shadow-lg flex items-center justify-center space-x-2 ${
                            darkMode
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Search Interview Questions</span>
                          <FiSearch />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700"
                : "bg-white bg-opacity-70 backdrop-blur-lg border border-gray-100"
            } shadow-xl p-8 text-center`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No jobs match your filters.
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {jobResults.length > jobsPerPage && (
          <motion.div
            className="flex justify-center mt-8 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg transition-transform ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              } ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
              &lt; Previous
            </motion.button>

            <div
              className={`flex items-center justify-center px-4 font-medium ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Page {currentPage} of {totalPages}
            </div>

            <motion.button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg transition-transform ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              } ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
              Next &gt;
            </motion.button>
          </motion.div>
        )}
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default JobSearchPage;
