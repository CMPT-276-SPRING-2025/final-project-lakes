import React, { useState } from "react";
import ResumeButton from "../components/ResumeButton.jsx"; // Import the ResumeButton component

const ResumeImprovePage = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeText, setResumeText] = useState(""); // Store extracted resume text
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [resumeFeedback, setResumeFeedback] = useState("");
  const [coverLetterFeedback, setCoverLetterFeedback] = useState("");
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

  const generateResumeAndCoverLetter = async () => {
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
            Authorization: `Bearer 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`, // Replace with environment variable
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional career coach who creates ATS-optimized resumes and compelling cover letters tailored to job descriptions. You have a client who needs help optimizing their resume and writing a cover letter for a job application.",
              },
              {
                role: "user",
                content: `
              **Optimize the resume and generate a tailored cover letter based on the provided job description.**

              **Resume:**
              ${resumeText}

              **Job Description:**
              ${jobDetails.description}

              **Requirements:**
              - Extract key skills and keywords.
              - Rewrite the resume to be ATS-friendly while preserving professional experience.
              - Generate a well-structured, formal, and engaging cover letter.
              - Format both for readability and conciseness.

              **Output Format:**
              **Optimized Resume:**\n<Formatted Resume Content>\n
              **Cover Letter:**\n<Formatted Cover Letter Content>\n
              Ensure proper sectioning and clarity in the response.
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract resume and cover letter separately
        const resumeMatch = output.match(
          /\*\*Optimized Resume:\*\*(.*?)\*\*Cover Letter:\*\*/s
        );
        const coverLetterMatch = output.match(/\*\*Cover Letter:\*\*(.*)/s);

        setGeneratedResume(
          resumeMatch ? resumeMatch[1].trim() : "Error parsing resume..."
        );
        setGeneratedCoverLetter(
          coverLetterMatch
            ? coverLetterMatch[1].trim()
            : "Error parsing cover letter..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating resume & cover letter:", error);
      alert(
        "Failed to generate resume & cover letter. Check console for details."
      );
    }

    setLoading(false);
  };

  const regenerateResume = async () => {
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
                  "You are a professional career coach who creates ATS-optimized resumes tailored to job descriptions. You have a client who needs help optimizing their resume for a job application.",
              },
              {
                role: "user",
                content: `
              **Optimize the resume based on the provided job description and feedback.**

              **Resume:**
              ${resumeText}

              **Job Description:**
              ${jobDetails.description}

              **Feedback:**
              ${resumeFeedback}

              **Requirements:**
              - Extract key skills and keywords.
              - Rewrite the resume to be ATS-friendly while preserving professional experience.
              - Incorporate feedback provided by the user.
              - Format for readability and conciseness.

              **Output Format:**
              **Optimized Resume:**\n<Formatted Resume Content>\n
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract resume
        const resumeMatch = output.match(/\*\*Optimized Resume:\*\*(.*)/s);

        setGeneratedResume(
          resumeMatch ? resumeMatch[1].trim() : "Error parsing resume..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error regenerating resume:", error);
      alert("Failed to regenerate resume. Check console for details.");
    }

    setLoading(false);
  };

  const regenerateCoverLetter = async () => {
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
            Authorization: `Bearer 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`, // Replace with environment variable
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional career coach who creates compelling cover letters tailored to job descriptions. You have a client who needs help writing a cover letter for a job application.",
              },
              {
                role: "user",
                content: `
              **Generate a tailored cover letter based on the provided job description and feedback.**

              **Resume:**
              ${resumeText}

              **Job Description:**
              ${jobDetails.description}

              **Feedback:**
              ${coverLetterFeedback}

              **Requirements:**
              - Generate a well-structured, formal, and engaging cover letter.
              - Incorporate feedback provided by the user.
              - Format for readability and conciseness.

              **Output Format:**
              **Cover Letter:**\n<Formatted Cover Letter Content>\n
            `,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const output = data.choices[0].message.content;

        // Use regex to extract cover letter
        const coverLetterMatch = output.match(/\*\*Cover Letter:\*\*(.*)/s);

        setGeneratedCoverLetter(
          coverLetterMatch
            ? coverLetterMatch[1].trim()
            : "Error parsing cover letter..."
        );
      } else {
        throw new Error("Invalid response from OpenAI");
      }
    } catch (error) {
      console.error("Error regenerating cover letter:", error);
      alert("Failed to regenerate cover letter. Check console for details.");
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

        <div className="grid grid-cols-3 gap-8">
          {/* Resume Upload Section */}
          <div className="col-span-1">
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
              onClick={generateResumeAndCoverLetter}
              className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Resume & Cover Letter"}
            </button>
          </div>

          {/* Resume Section */}
          <div className="col-span-1 bg-indigo-100 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Resume Generator
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 text-left max-h-96 overflow-y-auto resize-y">
              <pre className="whitespace-pre-wrap">
                {generatedResume || "Your generated resume will appear here..."}
              </pre>
            </div>

            {/* Resume Feedback */}
            <h3 className="mt-6 text-xl font-semibold text-indigo-700">
              Feedback for Resume
            </h3>
            <textarea
              className="w-full h-20 p-3 border rounded-lg"
              value={resumeFeedback}
              onChange={(e) => setResumeFeedback(e.target.value)}
              placeholder="Provide feedback..."
            />

            <button
              onClick={regenerateResume}
              className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Regenerate Resume"}
            </button>
          </div>

          {/* Cover Letter Section */}
          <div className="col-span-1 bg-indigo-100 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Cover Letter Generator
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 text-left max-h-96 overflow-y-auto resize-y">
              <pre className="whitespace-pre-wrap">
                {generatedCoverLetter ||
                  "Your generated cover letter will appear here..."}
              </pre>
            </div>

            {/* Cover Letter Feedback */}
            <h3 className="mt-6 text-xl font-semibold text-indigo-700">
              Feedback for Cover Letter
            </h3>
            <textarea
              className="w-full h-20 p-3 border rounded-lg"
              value={coverLetterFeedback}
              onChange={(e) => setCoverLetterFeedback(e.target.value)}
              placeholder="Provide feedback..."
            />

            <button
              onClick={regenerateCoverLetter}
              className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Regenerate Cover Letter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImprovePage;
