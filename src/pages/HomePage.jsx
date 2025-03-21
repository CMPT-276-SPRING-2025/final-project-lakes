import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

// Import your Navbar & Footer from the new system
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import your three resume images (adjust paths as needed)
import resumeImage1 from "../../images/1.png";
import resumeImage2 from "../../images/2.png";
import resumeImage3 from "../../images/3.png";

/* -------------------------
   Typing Effect Data/Logic
-------------------------- */
const typingTexts = [
  "We make it easy to brand you...",
  "Helping you stand out in the job market...",
  "Your AI-powered resume assistant...",
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
   Fancy Button & Keyframes
-------------------------- */
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

const StyledFancyButton = styled.a`
  .Btn-Container {
    display: flex;
    width: auto;
    min-width: 9em;
    height: 3em;
    background-color: rgb(168, 85, 247);
    border-radius: 40px;
    /* Updated shadow to match Match Analysis style */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 10px 10px -5px rgba(0, 0, 0, 0.1);
    justify-content: space-between;
    align-items: center;
    border: 1px solid ${(props) => (props.darkMode ? "#ffffff" : "#1e1e2e")};
    cursor: pointer;
    font-size: 0.95rem;
    animation: ${fadeIn} 1s ease-in-out;

    @media (max-width: 480px) {
      min-width: 100%;
      height: 2.5em;
      font-size: 0.85rem;
    }
  }

  .icon-Container {
    width: 45px;
    height: 45px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid ${(props) => (props.darkMode ? "#ffffff" : "#1e1e2e")};
    min-width: 45px;

    @media (max-width: 480px) {
      width: 35px;
      min-width: 35px;
      height: 35px;
    }
  }

  .text {
    width: calc(100% - 60px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8em;
    letter-spacing: 1.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 20px;

    @media (max-width: 480px) {
      font-size: 0.75em;
      padding-left: 5px;
    }
  }

  .icon-Container svg {
    transition-duration: 1.5s;
    color: #8b5cf6;

    @media (max-width: 480px) {
      transform: scale(0.8);
    }
  }

  .Btn-Container:hover .icon-Container svg {
    transition-duration: 1.5s;
    animation: arrow 1s linear infinite;
  }

  @keyframes arrow {
    0% {
      opacity: 0;
      margin-left: 0px;
    }
    100% {
      opacity: 1;
      margin-left: 10px;
    }
  }
`;

function FancyButton({ to, darkMode, children }) {
  return (
    <StyledFancyButton href={to} darkMode={darkMode}>
      <button className="Btn-Container">
        <span className="text">{children}</span>
        <span className="icon-Container">
          <svg
            width={16}
            height={19}
            viewBox="0 0 16 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1.61321" cy="1.61321" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="5.73583" cy="1.61321" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="5.73583" cy="5.5566" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="9.85851" cy="5.5566" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="9.85851" cy="9.5" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="13.9811" cy="9.5" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="5.73583" cy="13.4434" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="9.85851" cy="13.4434" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="1.61321" cy="17.3868" r="1.5" fill="#8b5cf6" />{" "}
            <circle cx="5.73583" cy="17.3868" r="1.5" fill="#8b5cf6" />{" "}
          </svg>
        </span>
      </button>
    </StyledFancyButton>
  );
}

/* -------------------------
   Floating Images Keyframes & Styled Components
-------------------------- */
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
  box-shadow: 0 10px 25px
    ${(props) =>
      props.darkMode ? "rgba(252, 250, 250, 0.6)" : "rgba(0, 0, 0, 0.6)"};
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
  box-shadow: 0 10px 25px
    ${(props) =>
      props.darkMode ? "rgba(252, 250, 250, 0.6)" : "rgba(0, 0, 0, 0.6)"};
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
  box-shadow: 0 10px 25px
    ${(props) =>
      props.darkMode ? "rgba(252, 250, 250, 0.6)" : "rgba(0, 0, 0, 0.6)"};
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
    top: 0px;
  }

  @media (max-width: 480px) {
    width: 160px;
    right: 10%;
  }
`;

/* -------------------------
   Framer Motion Variants
-------------------------- */
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

    const createParticles = () => {
      const container = document.getElementById("particle-container");
      if (!container) return;
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
    };
    createParticles();

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
            <h2 className="text-xl text-purple-600 font-medium mb-2">
              {typedText}|
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 flex items-center">
              <span
                className={`${darkMode ? "text-white" : "text-black"} mr-1`}
              >
                Resu
              </span>
              <span className="text-purple-500">Mate</span>
            </h1>
            <p
              className={`text-md mb-6 md:mb-8 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ResuMate uses advanced AI to analyze your resume against job
              descriptions, providing personalized recommendations to increase
              your match rate by up to 60%. Our platform helps you optimize
              keywords, highlight relevant skills, and format your resume to
              pass through ATS systems with ease. Say goodbye to generic
              applications and hello to tailored job matches.
            </p>

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

            {/* Feature Boxes with Framer Motion and updated shadow */}
            <motion.div
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.div
                variants={featureVariants}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                } backdrop-blur-sm flex flex-col shadow-2xl`}
              >
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Search Postings
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm mb-2`}
                >
                  Browse thousands of job listings filtered by industry,
                  location, and experience level.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/search" darkMode={darkMode}>
                    Search Postings
                  </FancyButton>
                </div>
              </motion.div>

              <motion.div
                variants={featureVariants}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                } backdrop-blur-sm flex flex-col shadow-2xl`}
              >
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Jobs For You
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm mb-2`}
                >
                  Access positions that match your profile, skills, and career
                  goals.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/curated-jobs" darkMode={darkMode}>
                    Jobs For You
                  </FancyButton>
                </div>
              </motion.div>

              <motion.div
                variants={featureVariants}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                } backdrop-blur-sm flex flex-col shadow-2xl`}
              >
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Check Match
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm mb-2`}
                >
                  Upload resume and job description to see match percentage.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/match-check" darkMode={darkMode}>
                    Check Match
                  </FancyButton>
                </div>
              </motion.div>

              <motion.div
                variants={featureVariants}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                } backdrop-blur-sm flex flex-col shadow-2xl`}
              >
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Improve Resume
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm mb-2`}
                >
                  Get personalized suggestions to enhance your resume with
                  tailored keywords.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/resume-improve" darkMode={darkMode}>
                    Improve Resume
                  </FancyButton>
                </div>
              </motion.div>

              <motion.div
                variants={featureVariants}
                className={`p-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 bg-opacity-50"
                    : "bg-white bg-opacity-70"
                } backdrop-blur-sm flex flex-col shadow-2xl`}
              >
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  Interview Process
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm mb-2`}
                >
                  Prepare with AI-generated practice questions and mock
                  interviews.
                </p>
                <div className="mt-auto">
                  <FancyButton to="/interview-process" darkMode={darkMode}>
                    Interview Process
                  </FancyButton>
                </div>
              </motion.div>
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
