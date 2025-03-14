import React from "react";
import { Link } from "react-router-dom";
import ResumeButton from "../components/resumebutton";

const HomePage = () => {
  // Callback function to handle parsed resume text
  const handleResumeParsed = (text) => {};

  return (
    <div className="min-h-screen flex flex-col items-center text-center bg-gray-100 dark:bg-gray-900 p-6">
      {/* Header */}
      <h2 className="text-4xl font-bold mt-6 text-gray-800 dark:text-white">
        Welcome to ResuMate – Your AI Job Assistant 🚀
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
        Find jobs, enhance your resume, and apply with confidence.
      </p>

      {/* Resume Upload Button */}
      <ResumeButton onResumeParsed={handleResumeParsed} />

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <NavItem to="/search" text="1. Search Postings" emoji="🔍" />
        <NavItem to="/curated-jobs" text="2. Jobs Curated To You" emoji="🎯" />
        <NavItem
          to="/match-check"
          text="3. Check if You’re a Good Match"
          emoji="✅"
        />
        <NavItem to="/resume-improve" text="4. Improve My Resume" emoji="✍️" />
        <NavItem to="/job-recommend" text="5. Job Recommender" emoji="🤖" />
        <NavItem
          to="/interview-process"
          text="6. Interview Process"
          emoji="📞"
        />
      </div>
    </div>
  );
};

// Navigation button component
const NavItem = ({ to, text, emoji }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center w-48 h-36 rounded-xl border-2 
      bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 
      hover:shadow-lg transform transition-all duration-300 hover:scale-105 
      hover:bg-blue-500 dark:hover:bg-blue-700 hover:text-white"
  >
    <span className="text-4xl">{emoji}</span>
    <p className="mt-2 text-center font-semibold">{text}</p>
  </Link>
);

export default HomePage;
