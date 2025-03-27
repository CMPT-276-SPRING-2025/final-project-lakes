import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport width is less than 900px
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const navLinks = [
    { label: "Search Postings", path: "/search" },
    { label: "Jobs For You", path: "/curated-jobs" },
    { label: "Check Match", path: "/match-check" },
    { label: "Improve Resume", path: "/resume-improve" },
  ];

  // Animation variants
  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <header className="w-full py-6 px-8 relative z-30">
      <nav className="flex items-center justify-between">
        {/* 🔗 Logo */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center">
            <motion.div
              className="mr-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={darkMode ? "stroke-white" : "stroke-black"}
              >
                <rect
                  x="3"
                  y="3"
                  width="22"
                  height="22"
                  rx="3"
                  strokeWidth="2.5"
                />
                <path
                  d="M8 14L12 18L20 10"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Resu<span className="text-purple-500">Mate</span>
            </h1>
          </Link>
        </motion.div>

        {/* 🧭 Desktop Nav (900px and above) */}
        <motion.div
          className="hidden lg:hidden md:flex space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: isMobile ? "none" : "flex" }}
        >
          {navLinks.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative"
              // Removed the delay from hover transition
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to={item.path}
                className={`text-md font-medium ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
              {location.pathname === item.path && (
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-500"
                  layoutId="desktopUnderline"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* 🌙 Dark Mode + 🍔 Menu Button */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } shadow-lg`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V4M12 20V21M4 12H3M6.314 6.314L5.5 5.5M17.686 6.314L18.5 5.5M6.314 17.69L5.5 18.5M17.686 17.69L18.5 18.5M21 12H20M16 12A4 4 0 1 1 8 12A4 4 0 0 1 16 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>

          {/* Hamburger for mobile - shown below 900px */}
          {isMobile && (
            <motion.button
              className="focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className={`w-6 h-6 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          )}
        </div>
      </nav>

      {/* 📱 Enhanced Mobile Menu with Premium Glossy Glass Effect */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            className="fixed inset-x-0 top-20 mx-4 z-50 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <motion.div
              className={`rounded-xl shadow-2xl ${
                darkMode
                  ? "bg-gray-900/40 border border-gray-700/30"
                  : "bg-white/30 border border-gray-200/30"
              }`}
              style={{
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
              }}
            >
              <div className="px-6 py-6 space-y-1">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={mobileItemVariants}
                    className="relative py-3"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`block text-lg font-medium transition-all duration-300 ${
                        location.pathname === item.path
                          ? `${
                              darkMode ? "text-purple-400" : "text-purple-600"
                            } font-semibold`
                          : darkMode
                          ? "text-gray-200 hover:text-white"
                          : "text-gray-700 hover:text-black"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {location.pathname === item.path && (
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-purple-500 rounded-full"
                        layoutId="mobileUnderline"
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Visual glass effect enhancement with decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
