import React, { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiMenu, FiX } from "react-icons/fi";
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

const typingTexts = [
  "We make it easy to brand you...",
  "Helping you stand out in the job market...",
  "Your AI-powered resume assistant...",
];

const TypingEffect = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!deleting && charIndex < typingTexts[index].length) {
          setText((prev) => prev + typingTexts[index][charIndex]);
          setCharIndex((prev) => prev + 1);
        } else if (deleting && charIndex > 0) {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        } else {
          setDeleting(!deleting);
          if (!deleting) {
            setTimeout(
              () => setIndex((prev) => (prev + 1) % typingTexts.length),
              1000
            );
          }
        }
      },
      deleting ? 100 : 100
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, charIndex, index]);

  const { theme } = useTheme(); // Get the current theme
  return <Headline theme={theme}>{text}|</Headline>;
};

// --------------------
// Animations (as before)
// --------------------
const float = keyframes`
  0% {
    transform: translateY(0) rotate(5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
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
    transform: translateY(-25px) rotate(-3deg);
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
    transform: translateY(-25px) rotate(2deg);
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
      ? "linear-gradient(135deg,rgb(82, 82, 170) 0%, #331f3f 100%)"
      : "linear-gradient(135deg, #c2c1df 0%, #ffc0cb 100%)"};
  font-family: Georgia, "Times New Roman", Times, serif;
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
  position: relative;
  width: 100%;

  @media (max-width: 1200px) {
    padding: 10px 30px; /* Reduce padding earlier */
  }

  @media (max-width: 1000px) {
    padding: 8px 25px; /* Reduce further */
  }

  @media (max-width: 768px) {
    padding: 6px 20px; /* Keep reducing */
  }

  @media (max-width: 600px) {
    padding: 5px 15px; /* Smallest padding for mobile */
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.span`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#fff")};
  animation: ${fadeIn} 1s ease-in-out;
`;

const LogoText = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  font-family: Georgia, "Times New Roman", Times, serif;
  cursor: pointer;
  padding: 6px 10px;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  animation: ${fadeIn} 1s ease-in-out;
  @media (max-width: 1000px) {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 1200px) {
    gap: 15px;
  }
  @media (max-width: 1000px) {
    display: ${(props) => (props.menuOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.15); /* Semi-transparent white */
    backdrop-filter: blur(10px); /* Glass effect */
    padding: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border-radius: 0 0 10px 10px; /* Slight round edges */
  }
`;

// NavButton for the nav bar with smaller text and refined padding
const NavButton = styled(Link)`
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  text-decoration: none;
  font-size: 1rem;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: Georgia, "Times New Roman", Times, serif;
  transition: background 0.3s ease;
  animation: ${fadeIn} 1s ease-in-out;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};

  @media (max-width: 1000px) {
    display: block;
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
  animation: ${fadeIn} 1s ease-in-out,

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

  @media (max-width: 1000px) {
    flex-direction: row; /* Keep buttons on left, images on right */
    align-items: flex-start;
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    flex-direction: row; /* KEEP IT SIDE-BY-SIDE ON SMALL SCREENS */
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  @media (max-width: 768px) {
    padding-left: 0;
    align-items: left;
  }
`;

const Headline = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  transition: color 0.3s ease;
  animation: ${fadeIn} 1s ease-in-out;
`;

const BigText = styled.h1`
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 800;
  font-family: Georgia, "Times New Roman", Times, serif;
  color: ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#111")};
  margin: 0 0 1.5rem 0;
  line-height: 1;
  text-shadow: 1px 1px 5px
    ${(props) => (props.theme === "dark" ? "#f0f0f0" : "#111")};
  animation: ${fadeIn} 1s ease-in-out;
`;

const Subheading = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.9;
  animation: ${fadeIn} 1s ease-in-out;
`;

// This StyledNavButton is used for the main button group (retaining your original button styling)
const StyledNavButton = styled(Link)`
  background-color: ${(props) =>
    props.theme === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.15)"};
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#111")};
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

const StyledButton = styled(Link)`
  .Btn-Container {
    display: flex;
    width: auto;
    min-width: 9em;
    height: 3em;
    background-color: #1d2129;
    border-radius: 40px;
    box-shadow: 0px 5px 10px
      ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    border: 1px solid
      ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
    animation: ${fadeIn} 1s ease-in-out;
  }
  .icon-Container {
    width: 45px;
    height: 45px;
    background-color: ${(props) =>
      props.theme === "dark" ? "#ffffff" : "#ffffff"};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 3px solid #1d2129;
    border: 1px solid
      ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e1e2e")};
  }
  .text {
    width: calc(170px - 45px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8em;
    letter-spacing: 1.2px;
  }
  .icon-Container svg {
    transition-duration: 1.5s;
    color: white;
  }
  .Btn-Container:hover .icon-Container svg {
    transition-duration: 1.5s;
    animation: arrow 1s linear infinite;
  }
  @keyframes arrow {
    0% {
      opacity: 0;
      margin-left: 0px;
    }
    100% {
      opacity: 1;
      margin-left: 10px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
  max-width: 500px;

  @media (max-width: 1000px) {
    flex-direction: row;
    justify-content: flex-start; /* Align buttons to left */
  }

  @media (max-width: 600px) {
    flex-direction: column; /* Stack vertically only on small screens */
  }
`;

const FancyButton = ({ to, children }) => {
  const { theme } = useTheme();
  return (
    <StyledButton to={to} theme={theme}>
      <button className="Btn-Container">
        <span className="text">{children}</span>
        <span className="icon-Container">
          <svg
            width={16}
            height={19}
            viewBox="0 0 16 19"
            fill="nones"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
            <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
            <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
            <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
            <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
            <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
            <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
            <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
          </svg>
        </span>
      </button>
    </StyledButton>
  );
};

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;

  @media (max-width: 1000px) {
    justify-content: flex-end;
    align-items: center;
    width: 50%; /* Ensures it remains on the right */
  }

  @media (max-width: 600px) {
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const ResumeTopImage = styled.img`
  position: absolute;
  top: 20px;
  right: 40px;
  width: 250px;
  height: auto;
  box-shadow: 0 10px 25px
    ${(props) =>
      props.theme === "dark"
        ? "rgba(252, 250, 250, 0.6)"
        : "rgba(0, 0, 0, 0.6)"};
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${float} 6s ease-in-out infinite;
  transform: rotate(5deg);
  z-index: 1;
  @media (max-width: 1000px) {
    width: 220px; /* Smaller at 1000px */
    right: 0px;
    top: 40px;
  }

  @media (max-width: 600px) {
    width: 180px; /* Even smaller at 600px */
    right: 0px;
    top: 120px;
  }
`;

const ResumeMiddleImage = styled.img`
  position: absolute;
  top: 150px;
  right: 120px;
  width: 270px;
  height: auto;
  box-shadow: 0 10px 25px
    ${(props) =>
      props.theme === "dark"
        ? "rgba(252, 250, 250, 0.6)"
        : "rgba(0, 0, 0, 0.6)"};
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${floatMiddle} 7s ease-in-out infinite;
  transform: rotate(-3deg);
  z-index: 2;
  @media (max-width: 1000px) {
    width: 220px; /* Smaller at 1000px */
    right: 50px;
    top: 200px;
  }

  @media (max-width: 600px) {
    width: 180px; /* Even smaller at 600px */
    right: 30px;
    top: 240px;
  }
`;

const ResumeBottomImage = styled.img`
  position: absolute;
  top: 290px;
  right: 180px;
  width: 280px;
  height: auto;
  box-shadow: 0 10px 25px
    ${(props) =>
      props.theme === "dark"
        ? "rgba(252, 250, 250, 0.6)"
        : "rgba(0, 0, 0, 0.6)"};
  border-radius: 4px;
  background-color: #fff;
  animation: ${fadeIn} 1s ease-in-out, ${floatBottom} 8s ease-in-out infinite;
  transform: rotate(2deg);
  z-index: 3;
  @media (max-width: 1000px) {
    width: 220px; /* Smaller at 1000px */
    right: 100px;
    top: 340px;
  }

  @media (max-width: 600px) {
    width: 180px; /* Even smaller at 600px */
    right: 70px;
    top: 370px;
  }
`;

// --------------------
// HomePage Component (with updated six buttons)
// --------------------
const HomePage = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

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

        <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuIcon>

        {/* Navigation Bar using NavButton styled for a nav look */}
        <NavLinks menuOpen={menuOpen} theme={theme}>
          <NavButton to="/search" theme={theme}>
            Search Postings
          </NavButton>
          <NavButton to="/curated-jobs" theme={theme}>
            Jobs For You
          </NavButton>
          <NavButton to="/match-check" theme={theme}>
            Check Match
          </NavButton>
          <NavButton to="/resume-improve" theme={theme}>
            Improve Resume
          </NavButton>
          <NavButton to="/job-recommend" theme={theme}>
            Job Recommender
          </NavButton>
          <NavButton to="/interview-process" theme={theme}>
            Interview Process
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
          <Headline theme={theme}>
            <TypingEffect />
          </Headline>
          <BigText theme={theme}>ResuMate</BigText>
          <Subheading theme={theme}>
            Elevate & streamline your job hunting process.
            <br />
            Helping you stand out among thousands of other applicants.
          </Subheading>

          <ButtonGroup>
            <FancyButton to="/search" theme={theme}>
              Search Postings
            </FancyButton>
            <FancyButton to="/curated-jobs" theme={theme}>
              Jobs For You
            </FancyButton>
            <FancyButton to="/match-check" theme={theme}>
              Check Match
            </FancyButton>
            <FancyButton to="/resume-improve" theme={theme}>
              Improve Resume
            </FancyButton>
            <FancyButton to="/job-recommend" theme={theme}>
              Job Recommender
            </FancyButton>
            <FancyButton to="/interview-process" theme={theme}>
              Interview Process
            </FancyButton>
          </ButtonGroup>
        </LeftSection>

        <RightSection>
          <ResumeTopImage
            theme={theme}
            src={resumeImage1}
            alt="Resume Template 1"
          />
          <ResumeMiddleImage
            theme={theme}
            src={resumeImage2}
            alt="Resume Template 2"
          />
          <ResumeBottomImage
            theme={theme}
            src={resumeImage3}
            alt="Resume Template 3"
          />
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
