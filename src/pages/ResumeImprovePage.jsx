import React, { useState } from "react";

const ResumeImprovePage = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleFileUpload = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const generateResumeAndCoverLetter = async () => {
    if (!resumeFile || !jobDetails.description) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);

    // Read Resume File as Text
    const reader = new FileReader();
    reader.readAsText(resumeFile);
    reader.onload = async () => {
      const resumeText = reader.result;

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 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`, // ⚠️ SECURITY RISK!
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an AI that helps create optimized resumes and cover letters.",
                },
                {
                  role: "user",
                  content: `Here is a resume:\n\n${resumeText}\n\nHere is a job description:\n\n${jobDetails.description}\n\n1. Extract key skills and keywords from both. 
                2. Rewrite the resume to match the job description while keeping the original experience intact.
                3. Generate a professional cover letter tailored for the job.`,
                },
              ],
            }),
          }
        );

        const data = await response.json();
        setGeneratedText(data.choices[0].message.content);
      } catch (error) {
        console.error("Error generating resume & cover letter:", error);
        alert(
          "Failed to generate resume & cover letter. Check console for details."
        );
      }

      setLoading(false);
    };
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

        <div className="grid grid-cols-3 gap-8">
          {/* Resume Upload Section */}
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Resume Upload:
            </h2>
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-blue-500 rounded-xl bg-blue-100 hover:bg-blue-200 cursor-pointer">
              <span className="text-lg font-medium text-gray-700">
                Click to Upload 📂
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {resumeFile && (
              <p className="text-sm mt-2 text-gray-600 font-medium">
                Uploaded: {resumeFile.name}
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
              onClick={generateResumeAndCoverLetter}
              className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Resume & Cover Letter"}
            </button>
          </div>

          {/* Display Generated Resume & Cover Letter */}
          {generatedText && (
            <div className="mt-6 bg-gray-200 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">
                Generated Resume & Cover Letter:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {generatedText}
              </p>
            </div>
          )}

          {/* Resume & Cover Letter Generators */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="bg-indigo-100 p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                Resume Generator
              </h2>
              <div className="h-60 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                Ready to Generate
              </div>
            </div>
            <div className="bg-indigo-100 p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                Cover Letter Generator
              </h2>
              <div className="h-60 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                Ready to generate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImprovePage;
