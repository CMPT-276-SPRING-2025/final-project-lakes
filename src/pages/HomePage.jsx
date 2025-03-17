import React, { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Import your resume images
import resumeImage1 from "../../images/1.png";
import resumeImage2 from "../../images/2.png";
import resumeImage3 from "../../images/3.png";

// --------------------
// Theme Context & Provider
// --------------------
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// --------------------
// Animations (as before)
// --------------------
const float = keyframes`
  0% {
    transform: translateY(0) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(5deg);
  }
`;

const floatMiddle = keyframes`
  0% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-15px) rotate(-3deg);
  }
  100% {
    transform: translateY(0) rotate(-3deg);
  }
`;

const floatBottom = keyframes`
  0% {
    transform: translateY(0) rotate(2deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
  100% {
    transform: translateY(0) rotate(2deg);
  }
`;

// --------------------
// Styled Components
// --------------------
const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  width: 100%;
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, #1f1f3f 0%, #331f3f 100%)"
      : "linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%)"};
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
  font-family: "Inter", sans-serif;
  transition: background 0.3s ease;
`;

// --------------------
// Navigation Bar Styled Components
// --------------------
const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  background: transparent;
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.span`
  font-size: 1.25rem;
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

// NavButton for the nav bar with smaller text and refined padding
const NavButton = styled(Link)`
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
  text-decoration: none;
  font-size: 0.85rem;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: "Inter", sans-serif;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CallToAction = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ActionButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 500;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

// --------------------
// Main Content Styled Components
// --------------------
const MainContent = styled.main`
  display: flex;
  padding: 40px;
  min-height: calc(100vh - 80px);
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
`;

const Headline = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === "dark" ? "#d0d0d0" : "#fff")};
  opacity: 0.9;
`;

const BigText = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 1.5rem 0;
  line-height: 1;
`;

const Subheading = styled.p`
  font-size: 0.95rem;
  color: ${(props) => (props.theme === "dark" ? "#b0b0b0" : "#fff")};
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

// This StyledNavButton is used for the main button group (retaining your original button styling)
const StyledNavButton = styled(Link)`
  background-color: ${(props) =>
    props.theme === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.15)"};
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
  border: none;
  padding: 12px 28px;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.theme === "dark"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(255, 255, 255, 0.25)"};
    transform: translateY(-2px);
  }
`;

const RightSection = styled.div`
  flex: 1;
  position: relative;
`;

const ResumeTopImage = styled.img`
  position: absolute;
  top: 130px;
  right: 40px;
  width: 180px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  background-color: #fff;
  animation: ${float} 6s ease-in-out infinite;
  transform: rotate(5deg);
  z-index: 1;
`;

const ResumeMiddleImage = styled.img`
  position: absolute;
  top: 280px;
  right: 120px;
  width: 190px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  background-color: #fff;
  animation: ${floatMiddle} 7s ease-in-out infinite;
  transform: rotate(-3deg);
  z-index: 2;
`;

const ResumeBottomImage = styled.img`
  position: absolute;
  top: 380px;
  right: 200px;
  width: 190px;
  height: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  background-color: #fff;
  animation: ${floatBottom} 8s ease-in-out infinite;
  transform: rotate(2deg);
  z-index: 3;
`;

// --------------------
// HomePage Component (with updated six buttons)
// --------------------
const HomePage = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <PageWrapper theme={theme}>
      <NavBar>
        <Logo>
          <LogoIcon theme={theme}>📝</LogoIcon>
          <LogoText theme={theme}>ResuMate</LogoText>
        </Logo>

        {/* Navigation Bar using NavButton styled for a nav look */}
        <NavLinks>
          <NavButton to="/search" theme={theme}>
            Search Postings
          </NavButton>
          <NavButton to="/curated-jobs" theme={theme}>
            Jobs For You
          </NavButton>
          <NavButton to="/match-check" theme={theme}>
            Check Match{" "}
            <span role="img" aria-label="check">
              ✅
            </span>
          </NavButton>
          <NavButton to="/resume-improve" theme={theme}>
            Improve Resume{" "}
            <span role="img" aria-label="pen">
              ✍️
            </span>
          </NavButton>
          <NavButton to="/job-recommend" theme={theme}>
            Job Recommender{" "}
            <span role="img" aria-label="robot">
              🤖
            </span>
          </NavButton>
          <NavButton to="/interview-process" theme={theme}>
            Interview Process{" "}
            <span role="img" aria-label="phone">
              📞
            </span>
          </NavButton>
        </NavLinks>

        <CallToAction>
          <ThemeToggle onClick={toggleTheme} theme={theme}>
            {theme === "light" ? "🌙" : "🌞"}
          </ThemeToggle>
        </CallToAction>
      </NavBar>

      <MainContent>
        <LeftSection>
          <Headline theme={theme}>We make it easy to brand you...</Headline>
          <BigText theme={theme}>ResuMate</BigText>
          <Subheading theme={theme}>
            Elevate & streamline your job hunting process.
            <br />
            Helping you stand out among thousands of other
            <br />
            resumes for desired jobs.
          </Subheading>

          <ButtonGroup>
            <StyledNavButton to="/search" theme={theme}>
              Search Postings
            </StyledNavButton>
            <StyledNavButton to="/curated-jobs" theme={theme}>
              Jobs For You
            </StyledNavButton>
            <StyledNavButton to="/match-check" theme={theme}>
              Check Match{" "}
              <span role="img" aria-label="check">
                ✅
              </span>
            </StyledNavButton>
            <StyledNavButton to="/resume-improve" theme={theme}>
              Improve Resume{" "}
              <span role="img" aria-label="pen">
                ✍️
              </span>
            </StyledNavButton>
            <StyledNavButton to="/job-recommend" theme={theme}>
              Job Recommender{" "}
              <span role="img" aria-label="robot">
                🤖
              </span>
            </StyledNavButton>
            <StyledNavButton to="/interview-process" theme={theme}>
              Interview Process{" "}
              <span role="img" aria-label="phone">
                📞
              </span>
            </StyledNavButton>
          </ButtonGroup>
        </LeftSection>

        <RightSection>
          <ResumeTopImage src={resumeImage1} alt="Resume Template 1" />
          <ResumeMiddleImage src={resumeImage2} alt="Resume Template 2" />
          <ResumeBottomImage src={resumeImage3} alt="Resume Template 3" />
        </RightSection>
      </MainContent>
    </PageWrapper>
  );
};

// --------------------
// App Component
// --------------------
const App = () => {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
};

export default App;
