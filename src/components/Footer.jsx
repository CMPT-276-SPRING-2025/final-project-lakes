import React from "react";
import { motion } from "framer-motion";

const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`w-full py-8 px-8 relative z-10 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
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

        <motion.div
          className="flex space-x-8 mt-6 md:mt-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            href="#"
            className={`text-sm font-medium ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Privacy Policy
          </motion.a>
          <motion.a
            href="#"
            className={`text-sm font-medium ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Terms of Service
          </motion.a>
          <motion.a
            href="#"
            className={`text-sm font-medium ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
