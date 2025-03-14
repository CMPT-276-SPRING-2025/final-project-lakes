import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CuratedJobsPage from "./pages/CuratedJobsPage";
import MatchCheckPage from "./pages/MatchCheckPage";
import ResumeImprovePage from "./pages/ResumeImprovePage";
import JobRecommendPage from "./pages/JobRecommendPage";
import InterviewProcess from "./pages/InterviewProcess";

// ✅ Correctly create the router using `createBrowserRouter`
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/curated-jobs" element={<CuratedJobsPage />} />
      <Route path="/match-check" element={<MatchCheckPage />} />
      <Route path="/resume-improve" element={<ResumeImprovePage />} />
      <Route path="/job-recommend" element={<JobRecommendPage />} />
      <Route path="/interview-process" element={<InterviewProcess />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
