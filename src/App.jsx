import { Route, BrowserRouter, Routes } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import ProjectManagementPage from "@/components/pages/ProjectManagementPage";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import ReportsPage from "@/components/pages/ReportsPage";
import TimelinePage from "@/components/pages/TimelinePage";
import StaffPage from "@/components/pages/StaffPage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import TasksPage from "@/components/pages/TasksPage";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

return (
    <BrowserRouter>
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
              <Route path="/project-management" element={<ProjectManagementPage />} />
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
    </BrowserRouter>
  );
}

export default App;