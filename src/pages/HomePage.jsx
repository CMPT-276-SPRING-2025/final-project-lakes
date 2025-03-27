import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

// Import your Navbar & Footer from the new system
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import your three resume images (adjust paths as needed)
import resumeImage1 from "../../Images/1.png";
import resumeImage2 from "../../Images/2.png";
import resumeImage3 from "../../Images/3.png";

/* -------------------------
   Typing Effect Data/Logic
------------------------- */
const typingTexts = [
  "We make it easy to brand you...",
  "Helping you stand out in the job market...",
  "Your AI-powered resume and cover letter assistant...",
  "Say goodbye to generic applications and hello to tailored job matches...",
  "Analyze your resume against job descriptions, provide personalized recommendations to increase your match rate...",
  "Help you optimize keywords, highlight relevant skills, and format your resume to pass through ATS systems with ease...",
];

function useTypedText(texts, speed = 100) {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentText = texts[index];
    const timer = setTimeout(() => {
      if (!deleting && charIndex < currentText.length) {
        setDisplayText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (deleting && charIndex > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setDeleting(!deleting);
        if (!deleting) {
          setTimeout(() => {
            setIndex((prev) => (prev + 1) % texts.length);
          }, 1000);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [deleting, charIndex, index, texts, speed]);

  return displayText;
}

/* -------------------------
   Keyframes & Styled Components
------------------------- */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
  max-width: 500px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

// Updated button style that no longer forces a font family
const ModernButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #a855f7;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  width: 100%;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 20px -5px rgba(168, 85, 247, 0.4);
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.6rem 1.2rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    min-width: 26px;
    color: #a855f7;
  }
`;

const FeatureCard = styled(motion.div)`
  padding: 1.25rem;
  border-radius: 0.75rem;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  h3 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  p {
    font-weight: 400;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    flex-grow: 1;
  }
`;

// Use the same FancyButton implementation as before
function FancyButton({ to, darkMode, children }) {
  return (
    <ModernButton
      href={to}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      <span className="icon">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </ModernButton>
  );
}

/* -------------------------
   Floating Images Keyframes & Styled Components
------------------------- */
const float = keyframes`
  0% { transform: translateY(0) rotate(5deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(5deg); }
`;

const floatMiddle = keyframes`
  0% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-25px) rotate(-3deg); }
  100% { transform: translateY(0) rotate(-3deg); }
`;

const floatBottom = keyframes`
  0% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(-25px) rotate(2deg); }
  100% { transform: translateY(0) rotate(2deg); }
`;

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 400px;

  @media (max-width: 1000px) {
    min-height: 350px;
  }

  @media (max-width: 768px) {
    min-height: 280px;
    margin-top: 3rem;
  }

  @media (max-width: 480px) {
    min-height: 400px;
  }
`;

const ImageTop = styled.img`
  position: absolute;
  top: 10px;
  right: 0px;
  width: 270px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${float} 6s ease-in-out infinite;
  transform: rotate(5deg);
  z-index: 3;

  @media (max-width: 1100px) {
    width: 250px;
    right: 0;
    top: 20px;
  }

  @media (max-width: 1023px) {
    width: 200px;
    right: 12%;
    top: 35px;
  }

  @media (max-width: 900px) {
    width: 200px;
    right: 5%;
  }

  @media (max-width: 768px) {
    width: 180px;
    right: 5%;
    top: 0;
  }

  @media (max-width: 480px) {
    width: 160px;
    right: 5%;
  }
`;

const ImageMiddle = styled.img`
  position: absolute;
  top: 190px;
  right: 110px;
  width: 280px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${floatMiddle} 7s ease-in-out infinite;
  transform: rotate(-3deg);
  z-index: 2;

  @media (max-width: 1100px) {
    width: 260px;
    right: 60px;
    top: 230px;
  }

  @media (max-width: 1023px) {
    width: 200px;
    right: 37%;
    top: 100px;
  }

  @media (max-width: 900px) {
    width: 200px;
    right: 35%;
  }

  @media (max-width: 768px) {
    width: 180px;
    right: 32.5%;
    top: 30px;
  }

  @media (max-width: 480px) {
    width: 160px;
    right: 35%;
  }
`;

const ImageBottom = styled.img`
  position: absolute;
  top: 350px;
  right: 220px;
  width: 290px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${floatBottom} 8s ease-in-out infinite;
  transform: rotate(2deg);
  z-index: 1;

  @media (max-width: 1100px) {
    width: 270px;
    right: 120px;
    top: 410px;
  }

  @media (max-width: 1023px) {
    width: 200px;
    right: 62%;
    top: 35px;
  }

  @media (max-width: 900px) {
    width: 200px;
    right: 65%;
  }

  @media (max-width: 768px) {
    width: 180px;
    right: 60%;
    top: 0;
  }

  @media (max-width: 480px) {
    width: 160px;
    right: 10%;
  }
`;

/* -------------------------
   Framer Motion Variants
------------------------- */
const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const typedText = useTypedText(typingTexts, 100);
  const [showGlowEffect, setShowGlowEffect] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setShowGlowEffect(true);
    const container = document.getElementById("particle-container");
    if (container) {
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
        container.appendChild(particle);
      }
    }
    return () => {
      const container = document.getElementById("particle-container");
      if (container) container.innerHTML = "";
    };
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`flex flex-col min-h-screen relative w-full overflow-hidden transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : ""
      }`}
    >
      {/* Particle container */}
      <div
        id="particle-container"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      {/* Gradient background & animated blobs */}
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
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Text & Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              className="mb-16 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.h1
                className={`text-7xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-black"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Resu<span className="text-purple-500">Mate</span>
              </motion.h1>
              <motion.p
                className={`text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } max-w-2xl mx-auto md:mx-0`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {typedText}|
              </motion.p>
            </motion.div>

            {/* Floating Images for Mobile */}
            <div className="lg:hidden w-full mb-8">
              <ImagesContainer>
                <ImageTop
                  src={resumeImage1}
                  alt="Resume Template 1"
                  darkMode={darkMode}
                />
                <ImageMiddle
                  src={resumeImage2}
                  alt="Resume Template 2"
                  darkMode={darkMode}
                />
                <ImageBottom
                  src={resumeImage3}
                  alt="Resume Template 3"
                  darkMode={darkMode}
                />
              </ImagesContainer>
            </div>

            {/* Feature Boxes with Framer Motion */}
            <motion.div
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <FeatureCard
                variants={featureVariants}
                className={
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                }
              >
                <h3
                  className={darkMode ? "text-purple-300" : "text-purple-700"}
                >
                  Search Postings
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Browse thousands of job listings filtered by industry,
                  location, and experience level.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/search" darkMode={darkMode}>
                    Search Postings
                  </FancyButton>
                </div>
              </FeatureCard>

              <FeatureCard
                variants={featureVariants}
                className={
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                }
              >
                <h3
                  className={darkMode ? "text-purple-300" : "text-purple-700"}
                >
                  Jobs For You
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Access positions that match your profile, skills, and career
                  goals.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/curated-jobs" darkMode={darkMode}>
                    Jobs For You
                  </FancyButton>
                </div>
              </FeatureCard>

              <FeatureCard
                variants={featureVariants}
                className={
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                }
              >
                <h3
                  className={darkMode ? "text-purple-300" : "text-purple-700"}
                >
                  Check Match
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Upload resume and job description to see match percentage.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/match-check" darkMode={darkMode}>
                    Check Match
                  </FancyButton>
                </div>
              </FeatureCard>

              <FeatureCard
                variants={featureVariants}
                className={
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                }
              >
                <h3
                  className={darkMode ? "text-purple-300" : "text-purple-700"}
                >
                  Improve Resume
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Get personalized suggestions to enhance your resume with
                  tailored keywords.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/resume-improve" darkMode={darkMode}>
                    Improve Resume
                  </FancyButton>
                </div>
              </FeatureCard>

              <FeatureCard
                variants={featureVariants}
                className={
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                }
              >
                <h3
                  className={darkMode ? "text-purple-300" : "text-purple-700"}
                >
                  Interview Process
                </h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Prepare with AI-generated practice questions and mock
                  interviews.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/interview-process" darkMode={darkMode}>
                    Interview Process
                  </FancyButton>
                </div>
              </FeatureCard>
            </motion.div>
          </div>

          {/* Right Section: Floating Images for Desktop */}
          <div className="hidden lg:block w-full lg:w-1/2">
            <ImagesContainer>
              <ImageTop
                src={resumeImage1}
                alt="Resume Template 1"
                darkMode={darkMode}
              />
              <ImageMiddle
                src={resumeImage2}
                alt="Resume Template 2"
                darkMode={darkMode}
              />
              <ImageBottom
                src={resumeImage3}
                alt="Resume Template 3"
                darkMode={darkMode}
              />
            </ImagesContainer>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
