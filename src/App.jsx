import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CuratedJobsPage from "./pages/CuratedJobsPage";
import MatchCheckPage from "./pages/MatchCheckPage";
import ResumeImprovePage from "./pages/ResumeImprovePage";
import JobRecommendPage from "./pages/JobRecommendPage";
import InterviewProcess from "./pages/InterviewProcess";
import { ThemeProvider } from "./components/ThemeProvider";

// ✅ Define the router without `MainLayout`
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/curated-jobs" element={<CuratedJobsPage />} />
      <Route path="/match-check" element={<MatchCheckPage />} />
      <Route path="/resume-improve" element={<ResumeImprovePage />} />
      <Route path="/job-recommend" element={<JobRecommendPage />} />
      <Route path="/interview-process" element={<InterviewProcess />} />
    </>
  )
);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
