import React, { useState } from "react";
import ResumeButton from "../components/resumebutton";

const OPENAI_API_KEY =
  "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"; // OpenAI API Key
const JSEARCH_API_KEY = "4d9349ad30msh512113b3b1be6adp1945b7jsn31b42dbeea2f"; // JSearch API Key

const CuratedJobsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Callback function to handle parsed resume text
  const handleResumeParsed = async (text) => {
    setLoading(true);

    try {
      // Step 1: Extract keywords using OpenAI API
      const extractedKeywords = await extractKeywordsFromResume(text);
      console.log("Extracted Keywords:", extractedKeywords); // Log the extracted keywords
      setKeywords(extractedKeywords);

      // Step 2: Fetch jobs using JSearch API
      const fetchedJobs = await fetchJobsUsingKeywords(["Amazon"]); // Hardcoded for testing
      console.log("Fetched Jobs:", fetchedJobs); // Log the fetched jobs
      setJobs(fetchedJobs.slice(0, 5)); // Limit to 5 jobs
    } catch (error) {
      console.error("Error processing resume:", error);
      alert("Failed to process the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to extract keywords using OpenAI API
  const extractKeywordsFromResume = async (resumeText) => {
    const prompt = `
      Analyze the following resume text and extract five relevant keywords or skills that represent the candidate's expertise. 
      The keywords should be concise, specific, and relevant for job search purposes.
      Resume Text: ${resumeText}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const keywords = data.choices[0].message.content
      .trim()
      .split("\n")
      .map((k) => k.trim());
    return keywords;
  };

  // Function to fetch jobs using JSearch API
  const fetchJobsUsingKeywords = async (keywords) => {
    // Hardcode "Amazon" as the query and "USA" as the country for testing
    const keywordQuery = "Amazon"; // Hardcoded for testing
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      keywordQuery
    )}&page=1&num_pages=1&country=us&date_posted=all`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": JSEARCH_API_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `JSearch API Error: ${errorData.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      console.log("JSearch API Response:", data); // Log the response for debugging
      return data.data || [];
    } catch (error) {
      console.error("Error fetching jobs from JSearch API:", error);
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Side: Upload Resume */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          Upload Your Resume
        </h2>
        <ResumeButton onResumeParsed={handleResumeParsed} />
        {loading && (
          <p className="text-white mt-4">Processing your resume...</p>
        )}
        {keywords.length > 0 && (
          <div className="mt-4">
            <p className="text-white font-semibold">Extracted Keywords:</p>
            <ul className="list-disc pl-4">
              {keywords.map((keyword, index) => (
                <li key={index} className="text-white">
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Side: Job Listings */}
      <div className="w-1/2 ml-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recommended Jobs
        </h2>
        {loading && <p className="text-gray-600">Loading jobs...</p>}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.job_id} className="mb-4 p-4 bg-gray-100 rounded-md">
              <p className="font-bold">{job.job_title}</p>
              <p className="text-sm text-gray-600">{job.employer_name}</p>
              <p className="text-sm text-gray-600">
                {job.job_city}, {job.job_country}
              </p>
              <p className="text-sm text-gray-600">${job.salary || "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            {keywords.length > 0
              ? "No jobs available for the selected keywords."
              : "Upload a resume to see recommended jobs."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CuratedJobsPage;
