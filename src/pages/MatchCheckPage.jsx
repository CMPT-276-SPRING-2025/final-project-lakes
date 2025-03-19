import React, { useState } from "react";
import ResumeButton from "../components/ResumeButton.jsx";

const MatchAnalysisPage = () => {
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
            Authorization: `Bearer YOUR_OPENAI_API_KEY_HERE`, // Replace with your key
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500 p-8 flex flex-col font-serif">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-5xl font-black text-white drop-shadow-lg">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Column - Resume Upload and Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-800">
                Check Match
              </h1>
              <p className="text-gray-600">
                Evaluate how well your resume matches the job description and
                get personalized recommendations.
              </p>

              <div className="bg-purple-50 p-6 rounded-2xl shadow-lg shadow-purple-300 transition-all transform hover:scale-105">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">
                  Upload Resume
                </h2>
                <ResumeButton onResumeParsed={handleResumeParsed} />
                {uploadedFileName && (
                  <p className="mt-2 text-sm text-gray-600">
                    Uploaded:{" "}
                    <span className="font-medium">{uploadedFileName}</span>
                  </p>
                )}
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl shadow-lg shadow-purple-300 transition-all transform hover:scale-105">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">
                  Job Details
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    className="w-full p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="company"
                    value={jobDetails.company}
                    onChange={handleInputChange}
                    placeholder="Company"
                    className="w-full p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="w-full p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <textarea
                    name="description"
                    value={jobDetails.description}
                    onChange={handleInputChange}
                    placeholder="Paste the job description here..."
                    className="w-full p-3 border border-purple-200 rounded-xl h-32 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <button
                onClick={analyzeResumeMatch}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Match"
                )}
              </button>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-3 self-start">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
                  <h2 className="text-3xl font-extrabold text-white">
                    Match Analysis
                  </h2>
                </div>

                <div className="p-6">
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">
                          {matchRating !== null ? `${matchRating}%` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Strengths, Weaknesses, Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-green-700 mb-2">
                        Strengths
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 font-serif">
                        {strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-50 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-red-700 mb-2">
                        Weaknesses
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 font-serif">
                        {weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h3 className="text-lg font-bold text-blue-700 mb-2">
                        Suggestions
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 font-serif">
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
    </div>
  );
};

export default MatchAnalysisPage;
