import { Outlet } from "react-router-dom";
import ModeToggle from "../components/ModeToggle";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <nav className="p-4 border-b dark:border-gray-700 flex justify-between">
        <h1 className="text-2xl font-bold">ResuMate</h1>
        <ModeToggle /> {/* Dark mode switch */}
      </nav>

      <main className="p-6">
        <Outlet /> {/* This renders the child components */}
      </main>
    </div>
  );
}

export default MainLayout;
