import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

const API_KEY = "9e4811e9f4msh79dc0327c602ff2p109aa4jsn6cee4b28e7fc";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};

export default function JobSearchPage() {
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    company: "",
  });
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const searchQuery = filters.company || "software developer"; // Default query
        const url = `https://jsearch.p.rapidapi.com/search?query=${searchQuery}%20jobs%20in%20${filters.location}&page=1&num_pages=1&country=us&date_posted=all`;
        const response = await fetch(url, options);
        const result = await response.json();
        setJobResults(result.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]); // Fetch new jobs when filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 min-h-screen shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-300 p-4 rounded-t-xl">
        <h1 className="text-lg font-bold">ResuMate</h1>
        <p className="text-sm">Simplifying the job process... 😊</p>
      </div>

      {/* Search Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-center">Search Job Postings</h2>
      </div>

      {/* Filters */}
      <div className="p-4 grid grid-cols-3 gap-2">
        <input
          type="text"
          name="location"
          placeholder="Location..."
          className="p-2 border rounded-md"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Min Salary..."
          className="p-2 border rounded-md"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company..."
          className="p-2 border rounded-md"
          onChange={handleFilterChange}
        />
      </div>

      {/* Job Results */}
      <div className="p-4">
        <p className="font-bold">Current Pos :</p>
        {loading ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : jobResults.length > 0 ? (
          jobResults.map((job) => (
            <div
              key={job.job_id}
              className="my-2 p-3 flex gap-2 bg-gray-200 rounded-md"
            >
              <div>
                <p className="font-bold">{job.job_title}</p>
                <p className="text-sm text-gray-600">
                  {job.employer_name} - {job.job_city}
                </p>
                <p className="text-sm text-gray-600">${job.salary || "N/A"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No jobs match your filters.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="text-center p-4">
        <button className="bg-gray-300 px-6 py-2 rounded-md">
          &lt; Next Page &gt;
        </button>
      </div>
    </div>
  );
}
