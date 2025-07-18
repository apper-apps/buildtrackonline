import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import TimelinePage from "@/components/pages/TimelinePage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import StaffPage from "@/components/pages/StaffPage";
import TasksPage from "@/components/pages/TasksPage";
import ReportsPage from "@/components/pages/ReportsPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-secondary-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
          {/* Header */}
          <Header onMenuClick={handleMenuClick} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Routes>
              <Route path="/" element={<TimelinePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
    </Router>
  );
}

export default App;