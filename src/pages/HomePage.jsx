import React from "react";
import { Link } from "react-router-dom";
import ResumeButton from "../components/ResumeButton";
import { useTheme } from "../components/ThemeProvider";
import styled, { keyframes } from "styled-components";

const HomePage = () => {
  const { theme } = useTheme();

  return (
    <PageWrapper theme={theme}>
      <AnimatedBackground theme={theme} />
      <Header>
        <Title>
          Welcome to <Accent>ResuMate</Accent> – Your AI Job Assistant 🚀
        </Title>
        <Subtitle>
          Find jobs, enhance your resume, and apply with confidence.
        </Subtitle>
        <ResumeButton onResumeParsed={() => {}} />
      </Header>

      <NavGrid>
        <NavItem to="/search" text="Search Postings" emoji="🔍" />
        <NavItem to="/curated-jobs" text="Jobs For You" emoji="🎯" />
        <NavItem to="/match-check" text="Check Match" emoji="✅" />
        <NavItem to="/resume-improve" text="Improve Resume" emoji="✍️" />
        <NavItem to="/job-recommend" text="Job Recommender" emoji="🤖" />
        <NavItem to="/interview-process" text="Interview Process" emoji="📞" />
      </NavGrid>

      <FloatingAnimation theme={theme} />
    </PageWrapper>
  );
};

const NavItem = ({ to, text, emoji }) => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <StyledLink to={to}>
      <CardInner theme={theme}>
        <Emoji>{emoji}</Emoji>
        <CardText>{text}</CardText>
      </CardInner>
    </StyledLink>
  );
};

/* ============================
   Animations
============================= */

// Slow rotating gradient in background
const gradientRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Background pulse effect for a dynamic feel
const backgroundPulse = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { opacity: 0.5; }
`;

// Fade-in effect for header title
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translate(0, 0); opacity: 0.7; }
  50% { transform: translate(20px, -20px); opacity: 1; }
  100% { transform: translate(0, 0); opacity: 0.7; }
`;

/* ============================
   Styled Components
============================= */

const PageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => (props.theme === "dark" ? "#0f172a" : "#fff")};
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#111")};
`;

// Animated gradient background with additional pulse effect
const AnimatedBackground = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: ${(props) =>
    props.theme === "dark"
      ? "radial-gradient(circle, #0f172a, #1e293b)"
      : "radial-gradient(circle, #e5e7eb, #f3f4f6)"};
  animation: ${gradientRotate} 30s linear infinite,
    ${backgroundPulse} 6s ease-in-out infinite;
  z-index: -3;
`;

// Header style with fade-in effect for the title
const Header = styled.header`
  text-align: center;
  margin-top: 10px;
  z-index: 2;
  animation: ${fadeIn} 2s ease-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  animation: ${fadeIn} 2s ease-out;
`;

const Accent = styled.span`
  color: #3b82f6;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 32px;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1000px;
  margin-top: 40px;
  z-index: 2;
  justify-items: center;
  align-items: center;

  /* Mobile view adjustments */
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* For smaller screens, use 2 columns */
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* For very small screens, use 1 column */
    gap: 15px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const pulseGlow = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(232, 28, 255, 0.6), 0 0 20px rgba(64, 201, 255, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(232, 28, 255, 0.8), 0 0 30px rgba(64, 201, 255, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(232, 28, 255, 0.6), 0 0 20px rgba(64, 201, 255, 0.6);
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 190px;
  height: 254px;
  background-color: ${(props) => (props.theme === "dark" ? "#000" : "#fff")};
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#000")};
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 12px;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: 200px;
    height: 264px;
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, rgb(255, 0, 38) 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
    transition: filter 0.3s ease-in-out;
  }

  &:hover {
    animation: ${pulseGlow} 1.5s infinite ease-in-out;
  }

  &:hover::after {
    filter: blur(30px);
  }

  &:hover::before {
    transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  }
`;

const Emoji = styled.div`
  font-size: 4rem;
  margin-bottom: 12px;
  text-align: center;
`;

const CardText = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`;

const FloatingShape = styled.div`
  position: absolute;
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)"
      : "linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)"};
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation: ${float} 8s ease-in-out infinite;
  z-index: 0;
  opacity: 0.8;
`;

const FloatingAnimation = ({ theme }) => {
  return (
    <>
      {/* Right side circles */}
      <FloatingShape theme={theme} size={100} top={15} left={80} />
      <FloatingShape theme={theme} size={140} top={75} left={25} />
      <FloatingShape theme={theme} size={80} top={50} left={90} />
      <FloatingShape theme={theme} size={60} top={30} left={40} />

      {/* Left side circles */}
      <FloatingShape theme={theme} size={120} top={10} left={10} />
      <FloatingShape theme={theme} size={150} top={60} left={5} />
      <FloatingShape theme={theme} size={90} top={80} left={10} />
      <FloatingShape theme={theme} size={70} top={40} left={5} />
      <FloatingShape theme={theme} size={100} top={80} left={85} />
      <FloatingShape theme={theme} size={85} top={95} left={42} />
    </>
  );
};

export default HomePage;
