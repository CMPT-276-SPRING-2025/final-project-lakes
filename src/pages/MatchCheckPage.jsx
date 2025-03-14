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
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI career assistant that evaluates how well a resume matches a job description.",
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
              - List 3-5 strengths.
              - List 3-5 weaknesses.
              - Give suggestions to improve the match score.
              
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
          /\*\*Strengths:\*\*(.*?)\*\*Weaknesses:\*\*/s
        );
        const weaknessesMatch = output.match(
          /\*\*Weaknesses:\*\*(.*?)\*\*Suggested Improvements:\*\*/s
        );
        const suggestionsMatch = output.match(
          /\*\*Suggested Improvements:\*\*(.*)/s
        );

        setMatchRating(ratingMatch ? ratingMatch[1] : "N/A");
        setStrengths(
          strengthsMatch
            ? strengthsMatch[1]
                .trim()
                .split("\n")
                .filter((s) => s)
            : []
        );
        setWeaknesses(
          weaknessesMatch
            ? weaknessesMatch[1]
                .trim()
                .split("\n")
                .filter((w) => w)
            : []
        );
        setSuggestions(
          suggestionsMatch && suggestionsMatch[1]
            ? suggestionsMatch[1]
                .trim()
                .split("\n")
                .map((s) => s.trim().replace(/\*\*/g, "")) // Removes ** from text
                .filter((s) => s)
            : []
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-10 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-700">ResuMate</h1>
          <span className="text-gray-600 italic text-lg">
            Simplifying the job process... 😊
          </span>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Resume Upload and Job Details Section */}
          <div className="col-span-1.25">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Resume Upload:
            </h2>
            <ResumeButton onResumeParsed={handleResumeParsed} />
            {uploadedFileName && (
              <p className="mt-2 text-sm text-gray-600">
                Uploaded File:{" "}
                <span className="font-medium">{uploadedFileName}</span>
              </p>
            )}

            {/* Job Details Form */}
            <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Enter Job Details
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={jobDetails.title}
                  onChange={handleInputChange}
                  placeholder="Job Title"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="company"
                  value={jobDetails.company}
                  onChange={handleInputChange}
                  placeholder="Company"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="location"
                  value={jobDetails.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="description"
                  value={jobDetails.description}
                  onChange={handleInputChange}
                  placeholder="Job Description"
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <button
              onClick={analyzeResumeMatch}
              className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Match"}
            </button>
          </div>

          {/* Match Analysis Results Section */}
          <div className="col-span-4 bg-indigo-100 p-8 rounded-xl shadow-lg flex flex-col h-full">
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-700 text-center">
              Match Analysis
            </h2>

            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 flex flex-col items-center w-full flex-grow">
              {/* Match Rating Section */}
              <div className="text-4xl font-extrabold text-green-600 mb-6">
                Match Rating: {matchRating !== null ? `${matchRating}%` : "N/A"}
              </div>

              {/* Strengths, Weaknesses, and Suggested Improvements */}
              <div className="grid grid-cols-3 gap-6 w-full flex-grow">
                {/* Strengths */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-gray-700 text-center mb-4">
                    Strengths
                  </h3>
                  <div className="overflow-y-auto flex-grow p-2 max-h-72">
                    <ul className="list-disc list-inside text-sm">
                      {strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Weaknesses */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-gray-700 text-center mb-4">
                    Weaknesses
                  </h3>
                  <div className="overflow-y-auto flex-grow p-2 max-h-72">
                    <ul className="list-disc list-inside text-sm">
                      {weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggested Improvements */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-gray-700 text-center mb-4">
                    Suggested Improvements
                  </h3>
                  <div className="overflow-y-auto flex-grow p-2 max-h-72">
                    <ul className="list-disc list-inside text-sm">
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
  );
};

export default MatchAnalysisPage;
