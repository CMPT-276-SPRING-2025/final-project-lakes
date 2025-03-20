import React, { useState } from "react";
import { motion } from "framer-motion";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <header className="w-full py-6 px-8 relative z-10">
      <nav className="flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
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
              className={`${darkMode ? "stroke-white" : "stroke-black"}`}
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
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="hidden md:flex space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            "Search Postings",
            "Jobs For You",
            "Check Match",
            "Improve Resume",
            "Job Recommender",
            "Interview Process",
          ].map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className={`text-sm font-medium ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-black"
              } relative`}
              whileHover={{ scale: 1.05 }}
              custom={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: index * 0.1 + 0.3,
              }}
            >
              {item}
              {item === "Jobs For You" && (
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
                  layoutId="underline"
                />
              )}
            </motion.a>
          ))}
        </motion.div>

        {/* Dark mode toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
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
                d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
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
      </nav>
    </header>
  );
};

export default Navbar;
