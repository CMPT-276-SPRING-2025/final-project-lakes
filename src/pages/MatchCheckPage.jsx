import React, { useState } from "react";
import ResumeButton from "../components/ResumeButton.jsx";

const MatchAnalysisPage = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeText, setResumeText] = useState("");
  const [matchRating, setMatchRating] = useState(null);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-10 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 text-gray-900">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-700">ResuMate</h1>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Resume Upload:
            </h2>
            <ResumeButton onResumeParsed={setResumeText} />
            {uploadedFileName && (
              <p className="mt-2 text-sm text-gray-600">
                Uploaded File:{" "}
                <span className="font-medium">{uploadedFileName}</span>
              </p>
            )}

            <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Enter Job Details
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  name="description"
                  placeholder="Job Description"
                  className="w-full p-3 border rounded-lg h-32"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-indigo-100 p-8 rounded-xl shadow-lg flex flex-col h-full">
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-700 text-center">
              Match Analysis
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 flex flex-col items-center w-full flex-grow">
              <div className="text-4xl font-extrabold text-green-600 mb-6">
                Match Rating: {matchRating !== null ? `${matchRating}%` : "N/A"}
              </div>

              <div className="grid grid-cols-3 gap-6 w-full flex-grow">
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
