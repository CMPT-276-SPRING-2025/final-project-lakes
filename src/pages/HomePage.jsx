import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center text-center bg-gray-100 p-6">
      {/* Header */}
      <h2 className="text-4xl font-bold mt-6 text-gray-800">
        Welcome to ResuMate – Your AI Job Assistant 🚀
      </h2>
      <p className="text-gray-600 mt-2 text-lg">
        Find jobs, enhance your resume, and apply with confidence.
      </p>

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
      </div>
    </div>
  );
};

// Navigation button component
const NavItem = ({ to, text, emoji }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center w-48 h-36 rounded-xl border-2 
      bg-gray-200 text-gray-700 border-gray-300 hover:shadow-lg transform transition-all 
      duration-300 hover:scale-105 hover:bg-blue-500 hover:text-white"
  >
    <span className="text-4xl">{emoji}</span>
    <p className="mt-2 text-center font-semibold">{text}</p>
  </Link>
);

export default HomePage;
