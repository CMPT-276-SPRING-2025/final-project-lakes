import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { useTheme } from "../path-to-your-theme-provider"; // Adjust this path

// Replace with your actual API key and hide it in .env file in production
const API_KEY = process.env.REACT_APP_JSEARCH_API_KEY || "your-api-key";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};

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
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, rgb(82, 82, 170) 0%, #331f3f 100%)"
      : "linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%)"};
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
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  text-decoration: none;
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  opacity: 0.8;
`;

const SearchTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
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
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  font-family: Georgia, "Times New Roman", Times, serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &::placeholder {
    color: ${(props) => (props.theme === "dark" ? "#cccccc" : "#555")};
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
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  margin-bottom: 1rem;
`;

const JobCardContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const JobCard = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  margin-bottom: 0.5rem;
`;

const JobCompany = styled.p`
  font-size: 1.1rem;
  color: ${(props) => (props.theme === "dark" ? "#e6e6e6" : "#333")};
  margin-bottom: 0.5rem;
`;

const JobSalary = styled.p`
  font-size: 1.1rem;
  color: ${(props) => (props.theme === "dark" ? "#e6e6e6" : "#333")};
  margin-bottom: 1rem;
`;

const MatchButton = styled.button`
  background-color: rgba(59, 130, 246, 0.8);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: Georgia, "Times New Roman", Times, serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(59, 130, 246, 1);
    animation: ${pulseAnimation} 1s infinite;
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
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
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
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  text-align: center;
  padding: 2rem;
`;

const NoResultsText = styled.p`
  font-size: 1.1rem;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  text-align: center;
  padding: 2rem;
`;

export default function JobSearchPage() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Assuming you have a theme context
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
    <PageWrapper theme={theme}>
      <ContentContainer>
        <Header>
          <LogoContainer>
            <LogoIcon>📝</LogoIcon>
            <LogoText to="/" theme={theme}>
              ResuMate
            </LogoText>
          </LogoContainer>
          <Tagline theme={theme}>Simplifying the job process... 😊</Tagline>
        </Header>

        <SearchTitle theme={theme}>Search Job Postings</SearchTitle>

        <FilterContainer>
          <FilterInput
            type="text"
            name="location"
            placeholder="Location..."
            onChange={handleFilterChange}
            theme={theme}
          />
          <FilterInput
            type="number"
            name="salary"
            placeholder="Min Salary..."
            onChange={handleFilterChange}
            theme={theme}
          />
          <FilterInput
            type="text"
            name="company"
            placeholder="Company..."
            onChange={handleFilterChange}
            theme={theme}
          />
        </FilterContainer>

        <JobResultsHeader theme={theme}>Current Positions:</JobResultsHeader>

        {loading ? (
          <LoadingText theme={theme}>Loading opportunities...</LoadingText>
        ) : jobResults_sample.length > 0 ? (
          <JobCardContainer>
            {jobResults_sample.map((job) => (
              <JobCard key={job.job_id}>
                <JobTitle theme={theme}>{job.job_title}</JobTitle>
                <JobCompany theme={theme}>
                  {job.employer_name} - {job.job_city}
                </JobCompany>
                <JobSalary theme={theme}>${job.salary || "N/A"}</JobSalary>
                <MatchButton onClick={() => handleInterviewProcess(job)}>
                  Am I a good match? <FiArrowRight />
                </MatchButton>
              </JobCard>
            ))}
          </JobCardContainer>
        ) : (
          <NoResultsText theme={theme}>
            No jobs match your filters.
          </NoResultsText>
        )}

        <PaginationContainer>
          <PaginationButton theme={theme}>&lt; Next Page &gt;</PaginationButton>
        </PaginationContainer>
      </ContentContainer>
    </PageWrapper>
  );
}
