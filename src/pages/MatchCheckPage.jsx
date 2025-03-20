import React, { useState, useEffect } from "react";
import ResumeButton from "../components/ResumeButton.jsx";
import styled from "styled-components";

const MatchAnalysisPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeText, setResumeText] = useState(""); // Extracted resume text
  const [matchRating, setMatchRating] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // FIXED: Initialize as an array
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleResumeParsed = (extractedText, fileName) => {
    setResumeText(extractedText);
    setUploadedFileName(fileName);
    console.log("Extracted Resume Text:", extractedText);
  };

  const analyzeResumeMatch = async () => {
    if (!resumeText.trim() || !jobDetails.description.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your key
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI career assistant that evaluates how well a users resume matches a given job description.",
              },
              {
                role: "user",
                content: `
              **Evaluate the resume against the job description.**
  
              **Resume:**
              ${resumeText}
  
              **Job Description:**
              ${jobDetails.description}
  
              **Requirements:**
              - Provide a match percentage (0-100%).
              - List exactly **3 strengths**.
              - List exactly **3 weaknesses**.
              - List exactly **3 suggestions** for improvement.
  
              **Output Format:**
              **Match Rating:** <Match Score>%
              **Strengths:**
              1. <Strength 1>
              2. <Strength 2>
              3. <Strength 3>
  
              **Weaknesses:**
              1. <Weakness 1>
              2. <Weakness 2>
              3. <Weakness 3>
  
              **Suggested Improvements:**
              1. <Suggestion 1>
              2. <Suggestion 2>
              3. <Suggestion 3>
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        const ratingMatch = output.match(/\*\*Match Rating:\*\* (\d+)%/);
        const strengthsMatch = output.match(
          /\*\*Strengths:\*\*\s*([\s\S]+?)\n\s*\*\*Weaknesses:/
        );
        const weaknessesMatch = output.match(
          /\*\*Weaknesses:\*\*\s*([\s\S]+?)\n\s*\*\*Suggested Improvements:/
        );
        const suggestionsMatch = output.match(
          /\*\*Suggested Improvements:\*\*\s*([\s\S]+)/
        );

        const extractList = (match, defaultText) => {
          if (!match || !match[1])
            return [defaultText, defaultText, defaultText]; // Always return 3 items

          const items = match[1]
            .trim()
            .split("\n")
            .map((s) => s.replace(/^\d+\.\s+/, "").trim()) // Remove numbering like "1."
            .filter((s) => s); // Remove empty strings

          while (items.length < 3) {
            items.push(defaultText); // Ensure 3 items minimum
          }

          return items.slice(0, 3); // Ensure exactly 3
        };

        setMatchRating(ratingMatch ? ratingMatch[1] : "N/A");
        setStrengths(extractList(strengthsMatch, "No strength identified."));
        setWeaknesses(extractList(weaknessesMatch, "No weakness identified."));
        setSuggestions(
          extractList(suggestionsMatch, "No suggestion available.")
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error analyzing resume match:", error);
      alert("Failed to analyze resume match. Check console for details.");
    }
    setLoading(false);
  };
  return (
    <StyledContainer theme={theme}>
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span
              className="text-5xl font-black drop-shadow-md"
              style={{
                color: theme === "dark" ? "#ffffff" : "#111",
                margin: "0 0 1.5rem 0",
                lineHeight: "1",
                textShadow: `1px 1px 5px ${
                  theme === "dark" ? "#f0f0f0" : "#111"
                }`,
                animation: "fadeIn 1s ease-in-out",
                fontSize: "1.3rem",
                fontWeight: 700,
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                cursor: "pointer",
                padding: "6px 10px",
              }}
            >
              ResuMate
            </span>
          </div>
          <div className="hidden md:flex space-x-6 text-white">
            <a href="#" className="hover:text-purple-800 transition-colors">
              Search Postings
            </a>
            <a href="#" className="hover:text-purple-800 transition-colors">
              Jobs For You
            </a>
            <a
              href="#"
              className="hover:text-purple-800 transition-colors font-bold"
            >
              Check Match
            </a>
            <a href="#" className="hover:text-purple-800 transition-colors">
              Improve Resume
            </a>
            <a href="#" className="hover:text-purple-800 transition-colors">
              Job Recommender
            </a>
            <a href="#" className="hover:text-purple-800 transition-colors">
              Interview Process
            </a>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md transition-all hover:scale-110"
            style={{
              background: theme === "dark" ? "#333" : "#ddd",
              color: theme === "dark" ? "#fff" : "#000",
              boxShadow:
                theme === "dark"
                  ? "0px 4px 6px rgba(255,255,255,0.5)"
                  : "0px 4px 6px rgba(0,0,0,0.5)",
            }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-full max-w-7xl mx-auto bg-white/80 dark:bg-gray-900 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: theme === "dark" ? "#1e1e2e" : "#fff",
          boxShadow:
            theme === "dark"
              ? "0px 8px 16px rgba(255,255,255,0.3)"
              : "0px 8px 16px rgba(0,0,0,0.3)",
        }}
      >
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Column - Resume Upload and Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <h1
                className="text-5xl font-extrabold drop-shadow-sm"
                style={{
                  color: theme === "dark" ? "#f0f0f0" : "#111",
                  margin: "0 0 1.5rem 0",
                  lineHeight: "1",
                  textShadow: `0px 1px 6px ${
                    theme === "dark" ? "#f0f0f0" : "#111"
                  }`,
                  animation: "fadeIn 1s ease-in-out",
                }}
              >
                Check Match
              </h1>
              <p
                className="opacity-80"
                style={{ color: theme === "dark" ? "#fff" : "#333" }}
              >
                Evaluate how well your resume matches the job description and
                get personalized recommendations.
              </p>

              <div
                className="p-6 rounded-2xl transition-all transform hover:scale-105"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgb(82, 82, 170) 0%, #331f3f 100%)"
                      : "linear-gradient(135deg, rgba(240, 196, 225, 0.26) 0%,rgba(135, 131, 217, 0.45) 100%)",
                  boxShadow:
                    theme === "dark"
                      ? "0px 5px 10px #ffffff"
                      : "0px 5px 10px #1e1e2e",
                }}
              >
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme === "dark" ? "#f0f0f0" : "#333" }}
                >
                  Upload Resume
                </h2>
                <ResumeButton onResumeParsed={handleResumeParsed} />
                {uploadedFileName && (
                  <p
                    className="mt-2 text-sm opacity-80"
                    style={{ color: theme === "dark" ? "#ddd" : "#111" }}
                  >
                    Uploaded:{" "}
                    <span className="font-medium">{uploadedFileName}</span>
                  </p>
                )}
              </div>

              <div
                className="p-6 rounded-2xl transition-all transform hover:scale-105"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgb(82, 82, 170) 0%, #331f3f 100%)"
                      : "linear-gradient(135deg, rgba(221, 179, 206, 0.26) 0%,rgb(175, 173, 218) 100%)",
                  boxShadow:
                    theme === "dark"
                      ? "0px 5px 10px #ffffff"
                      : "0px 5px 10px #1e1e2e",
                }}
              >
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme === "dark" ? "#f0f0f0" : "#333" }}
                >
                  Job Details
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                      ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                  />
                  <input
                    type="text"
                    name="company"
                    value={jobDetails.company}
                    onChange={handleInputChange}
                    placeholder="Company"
                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                      ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                  />
                  <input
                    type="text"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                      ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                  />
                  <textarea
                    name="description"
                    value={jobDetails.description}
                    onChange={handleInputChange}
                    placeholder="Paste the job description here..."
                    className={`w-full p-3 rounded-xl h-32 focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                      ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-white border-2"
                          : "bg-gray-100 text-black border-black border-2"
                      }`}
                  ></textarea>
                </div>
              </div>

              <FancyButton
                onClick={analyzeResumeMatch}
                loading={loading}
                theme={theme}
              />
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-3 self-start">
              <div
                className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-md overflow-hidden"
                style={{
                  boxShadow:
                    theme === "dark"
                      ? "0px 5px 10px #ffffff"
                      : "0px 5px 10px #1e1e2e",
                  color: theme === "dark" ? "#f0f0f0" : "#111",
                }}
              >
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-500 p-6"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(135deg, rgb(82, 82, 170) 0%, #331f3f 100%)"
                        : "linear-gradient(135deg, rgba(221, 179, 206, 0.26) 0%,rgb(175, 173, 218) 100%)",
                    boxShadow:
                      theme === "dark"
                        ? "0px 5px 10px #ffffff"
                        : "0px 5px 10px #1e1e2e",
                    color: theme === "dark" ? "#f0f0f0" : "#111",
                  }}
                >
                  <h2 className="text-3xl font-extrabold">Match Analysis</h2>
                </div>

                <div
                  className="p-6"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "#111", // Set text color dynamically
                  }}
                >
                  {/* Match Rating */}
                  <div className="flex justify-center items-center mb-8">
                    <div className="relative">
                      <svg className="w-40 h-40" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        {matchRating !== null && (
                          <circle
                            className="text-purple-600"
                            strokeWidth="10"
                            strokeDasharray={`${matchRating * 2.51} 251`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                          />
                        )}
                      </svg>
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: theme === "dark" ? "#ffffff" : "#111" }} // Dynamic text color
                      >
                        <span className="text-4xl font-bold">
                          {matchRating !== null ? `${matchRating}%` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Strengths, Weaknesses, Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: theme === "dark" ? "#2f3a2d" : "#d4edda",
                        color: theme === "dark" ? "#ffffff" : "#155724", // Dynamic text color
                        boxShadow:
                          theme === "dark"
                            ? "0px 5px 10px #ffffff"
                            : "0px 5px 10px #1e1e2e",
                      }}
                    >
                      <h3 className="text-xl font-bold mb-2">Strengths:</h3>
                      <ul className="list-disc list-inside">
                        {strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: theme === "dark" ? "#330000" : "#f8d7da",
                        color: theme === "dark" ? "#ffffff" : "#721c24", // Dynamic text color
                        boxShadow:
                          theme === "dark"
                            ? "0px 5px 10px #ffffff"
                            : "0px 5px 10px #1e1e2e",
                      }}
                    >
                      <h3 className="text-xl font-bold mb-2">Weaknesses:</h3>
                      <ul className="list-disc list-inside">
                        {weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: theme === "dark" ? "#001a33" : "#cce5ff",
                        color: theme === "dark" ? "#ffffff" : "#004085", // Dynamic text color
                        boxShadow:
                          theme === "dark"
                            ? "0px 5px 10px #ffffff"
                            : "0px 5px 10px #1e1e2e",
                      }}
                    >
                      <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
                      <ul className="list-disc list-inside">
                        {suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

export default MatchAnalysisPage;

const StyledContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  font-family: "serif";
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, rgb(82, 82, 170) 0%, #331f3f 100%)"
      : "linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%)"};
  transition: background 0.3s ease-in-out;
`;

const StyledButton = styled.button`
  display: flex;
  width: auto;
  min-width: 9em;
  height: 3em;
  background-color: #1d2129;
  border-radius: 40px;
  box-shadow: 0px 5px 10px
    ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
  justify-content: space-between;
  align-items: center;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
  transition: transform 0.2s ease-in-out, background 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background-color: #292e3a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-Container {
    width: 45px;
    height: 45px;
    background-color: ${(props) =>
      props.theme === "dark" ? "#ffffff" : "#ffffff"};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid
      ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
  }

  .text {
    width: calc(170px - 45px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8em;
    letter-spacing: 1.2px;
  }

  .icon-Container svg {
    transition-duration: 1.5s;
    color: black;
  }

  &:hover .icon-Container svg {
    animation: arrowMove 1s linear infinite;
  }

  @keyframes arrowMove {
    0% {
      opacity: 0;
      margin-left: 0px;
    }
    100% {
      opacity: 1;
      margin-left: 5px;
    }
  }
`;

// The button component with click functionality
const FancyButton = ({ onClick, loading, theme }) => {
  return (
    <StyledButton onClick={onClick} disabled={loading} theme={theme}>
      <span className="text">{loading ? "Analyzing..." : "Analyze Match"}</span>
      <span className="icon-Container">
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
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
        ) : (
          <svg
            width={16}
            height={19}
            viewBox="0 0 16 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
            <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
            <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
            <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
            <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
            <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
          </svg>
        )}
      </span>
    </StyledButton>
  );
};
