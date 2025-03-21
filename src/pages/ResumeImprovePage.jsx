import React, { useState } from "react";
import styled from "styled-components";
import ResumeButton from "../components/resumebutton.jsx";

// Styled Components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%);
  font-family: Arial, sans-serif;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const PageDescription = styled.p`
  color: #666;
  margin-bottom: 2.5rem;
  font-size: 1rem;
`;

const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div``;

const SectionHeader = styled.div`
  background: linear-gradient(90deg, #9370db 0%, #ff69b4 100%);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.3rem;
  margin: 0;
  font-weight: 500;
`;

const UploadButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: block;
  margin-bottom: 1.5rem;
  width: 100%;

  &:hover {
    background-color: #3367d6;
  }
`;

const SubTitle = styled.h3`
  color: #9370db;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
  font-weight: 500;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #9370db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-height: ${(props) => (props.large ? "150px" : "100px")};
  font-size: 0.95rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #9370db;
  }
`;

const PurpleButton = styled.button`
  background-color: #9370db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  width: 100%;
  text-transform: uppercase;

  &:hover {
    background-color: #8560c5;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px;
  border: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
  color: #555;
  font-size: 0.95rem;
`;

const FeedbackLabel = styled.h4`
  color: #9370db;
  font-size: 1rem;
  margin: 0 0 0.8rem 0;
`;

const ResumeImprovePage = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [resumeText, setResumeText] = useState("");
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
  };

  const generateResumeAndCoverLetter = async () => {
    if (!resumeText.trim() || !jobDetails.description.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);

    try {
      // Simulate API response
      setTimeout(() => {
        setGeneratedResume(
          "Sample generated resume content would appear here."
        );
        setGeneratedCoverLetter(
          "Sample generated cover letter content would appear here."
        );
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating resume & cover letter:", error);
      alert("Failed to generate resume & cover letter.");
      setLoading(false);
    }
  };

  const regenerateResume = async () => {
    setLoading(true);
    setTimeout(() => {
      setGeneratedResume(
        "Updated resume based on your feedback would appear here."
      );
      setLoading(false);
    }, 2000);
  };

  const regenerateCoverLetter = async () => {
    setLoading(true);
    setTimeout(() => {
      setGeneratedCoverLetter(
        "Updated cover letter based on your feedback would appear here."
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <PageWrapper>
      <ContentContainer>
        <PageTitle>Improve Resume</PageTitle>
        <PageDescription>
          Upload your resume and job description to get AI-powered resume and
          cover letter optimization.
        </PageDescription>

        <ThreeColumns>
          <Column>
            <SectionHeader>
              <SectionTitle>Resume Upload</SectionTitle>
            </SectionHeader>

            <UploadButton as={ResumeButton} onResumeParsed={handleResumeParsed}>
              Upload Resume (PDF)
            </UploadButton>

            <SubTitle>Job Details</SubTitle>
            <InputField
              type="text"
              name="title"
              value={jobDetails.title}
              onChange={handleInputChange}
              placeholder="Job Title"
            />
            <InputField
              type="text"
              name="company"
              value={jobDetails.company}
              onChange={handleInputChange}
              placeholder="Company"
            />
            <InputField
              type="text"
              name="location"
              value={jobDetails.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <TextArea
              name="description"
              value={jobDetails.description}
              onChange={handleInputChange}
              placeholder="Job Description"
              large
            ></TextArea>

            <PurpleButton
              onClick={generateResumeAndCoverLetter}
              disabled={loading}
            >
              {loading ? "GENERATING..." : "GENERATE RESUME & COVER LETTER"}
            </PurpleButton>
          </Column>

          <Column>
            <SectionHeader>
              <SectionTitle>Resume Generator</SectionTitle>
            </SectionHeader>

            <ResultContainer>
              {generatedResume || "Your generated resume will appear here..."}
            </ResultContainer>

            <FeedbackLabel>Feedback for Resume</FeedbackLabel>
            <TextArea
              value={resumeFeedback}
              onChange={(e) => setResumeFeedback(e.target.value)}
              placeholder="Provide feedback to improve the resume..."
            />

            <PurpleButton onClick={regenerateResume} disabled={loading}>
              {loading ? "REGENERATING..." : "REGENERATE RESUME"}
            </PurpleButton>
          </Column>

          <Column>
            <SectionHeader>
              <SectionTitle>Cover Letter Generator</SectionTitle>
            </SectionHeader>

            <ResultContainer>
              {generatedCoverLetter ||
                "Your generated cover letter will appear here..."}
            </ResultContainer>

            <FeedbackLabel>Feedback for Cover Letter</FeedbackLabel>
            <TextArea
              value={coverLetterFeedback}
              onChange={(e) => setCoverLetterFeedback(e.target.value)}
              placeholder="Provide feedback to improve the cover letter..."
            />

            <PurpleButton onClick={regenerateCoverLetter} disabled={loading}>
              {loading ? "REGENERATING..." : "REGENERATE COVER LETTER"}
            </PurpleButton>
          </Column>
        </ThreeColumns>
      </ContentContainer>
    </PageWrapper>
  );
};

export default ResumeImprovePage;
