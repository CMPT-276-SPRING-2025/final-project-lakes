import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { createGlobalStyle } from "styled-components";

// Sample data
const jobResults_sample = [
  {
    job_id: 1,
    job_title: "Software Engineer",
    employer_name: "Google",
    job_city: "Mountain View",
    salary: "120,000",
    description:
      "Develop scalable web applications and contribute to Google's cutting-edge technology stack.",
  },
  {
    job_id: 2,
    job_title: "Frontend Developer",
    employer_name: "Facebook",
    job_city: "Menlo Park",
    salary: "110,000",
    description:
      "Work on user-facing applications, improving UI/UX and optimizing performance for billions of users.",
  },
  {
    job_id: 3,
    job_title: "Data Scientist",
    employer_name: "Amazon",
    job_city: "Seattle",
    salary: "130,000",
    description:
      "Analyze large datasets to derive insights, optimize business strategies, and enhance AI models.",
  },
  {
    job_id: 4,
    job_title: "Product Manager",
    employer_name: "Microsoft",
    job_city: "Redmond",
    salary: "125,000",
    description:
      "Lead cross-functional teams to define product roadmaps and drive innovation in cloud computing solutions.",
  },
  {
    job_id: 5,
    job_title: "Backend Engineer",
    employer_name: "Netflix",
    job_city: "Los Angeles",
    salary: "115,000",
    description:
      "Build high-performance backend services to support streaming experiences for millions of users worldwide.",
  },
];

// API configuration
const API_KEY = "9e4811e9f4msh79dc0327c602ff2p109aa4jsn6cee4b28e7fc sjsjjs";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};

// Animations
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

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%);
  font-family: Georgia, "Times New Roman", Times, serif;
  padding: 2rem;
  transition: background 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.span`
  font-size: 1.5rem;
`;

const LogoText = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  text-decoration: none;
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: #111;
  opacity: 0.8;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #111;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  color: #111;
  font-family: Georgia, "Times New Roman", Times, serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &::placeholder {
    color: #555;
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const JobResultsHeader = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 1rem;
`;

const JobCardContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const JobTitle = styled.h3`
  font-size: 2rem; /* Larger for readability */
  font-weight: 700; /* Bold */
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  color: black;
  margin-bottom: 0.5rem;
  letter-spacing: -0.4px;
`;

const JobCompany = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0.5rem;
`;

const JobSalary = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  color: rgba(0, 0, 0, 0.75);
  margin-bottom: 1rem;
`;

const JobDescription = styled.p`
  font-size: 1.1rem;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.5;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: rgb(57, 0, 126);
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
`;
const JobCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const JobCard = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative; /* Allow absolute positioning inside */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const MatchButton = styled.button`
  background: linear-gradient(135deg, #b800e6, #ff66b2);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #a300cc, #ff4da6);
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  color: #111;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  font-family: Georgia, "Times New Roman", Times, serif;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #111;
  text-align: center;
  padding: 2rem;
`;

const NoResultsText = styled.p`
  font-size: 1.1rem;
  color: #111;
  text-align: center;
  padding: 2rem;
`;
export default function JobSearchPage() {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({});

  const toggleDescription = (job_id) => {
    setExpanded((prev) => ({
      ...prev,
      [job_id]: !prev[job_id],
    }));
  };

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

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

  const handleInterviewProcess = (job) => {
    navigate("/interview-process", { state: { job } }); // Pass job data as state
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <PageWrapper>
      <ContentContainer>
        <Header>
          <LogoContainer>
            <LogoIcon>📝</LogoIcon>
            <LogoText to="/">ResuMate</LogoText>
          </LogoContainer>
          <Tagline>Simplifying the job process... 😊</Tagline>
        </Header>

        <SearchTitle>Search Job Postings</SearchTitle>

        <FilterContainer>
          <FilterInput
            type="text"
            name="location"
            placeholder="Location..."
            onChange={handleFilterChange}
          />
          <FilterInput
            type="number"
            name="salary"
            placeholder="Min Salary..."
            onChange={handleFilterChange}
          />
          <FilterInput
            type="text"
            name="company"
            placeholder="Company..."
            onChange={handleFilterChange}
          />
        </FilterContainer>

        <JobResultsHeader>Current Positions:</JobResultsHeader>

        {loading ? (
          <LoadingText>Loading opportunities...</LoadingText>
        ) : jobResults_sample.length > 0 ? (
          <JobCardContainer>
            {jobResults_sample.map((job) => (
              <JobCard key={job.job_id}>
                <JobTitle>{job.job_title}</JobTitle>
                <JobCardHeader>
                  <JobCompany>
                    {job.employer_name} - {job.job_city}
                  </JobCompany>
                  <MatchButton onClick={() => handleInterviewProcess(job)}>
                    Am I a good match? <FiArrowRight />
                  </MatchButton>
                </JobCardHeader>
                <JobSalary>${job.salary || "N/A"}</JobSalary>
                <JobDescription>
                  {expanded[job.job_id]
                    ? job.description
                    : truncateText(job.description, 20)}
                  <ReadMoreButton onClick={() => toggleDescription(job.job_id)}>
                    {expanded[job.job_id] ? "Read Less" : "Read More"}
                  </ReadMoreButton>
                </JobDescription>
              </JobCard>
            ))}
          </JobCardContainer>
        ) : (
          <NoResultsText>No jobs match your filters.</NoResultsText>
        )}

        <PaginationContainer>
          <PaginationButton>&lt; Next Page &gt;</PaginationButton>
        </PaginationContainer>
      </ContentContainer>
    </PageWrapper>
  );
}
