import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import ExperienceDetail from "./pages/ExperienceDetail.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ADMIN_PATH } from "./utils/constants.js";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminProjectForm from "./pages/admin/AdminProjectForm.jsx";
import AdminExperience from "./pages/admin/AdminExperience.jsx";
import AdminExperienceForm from "./pages/admin/AdminExperienceForm.jsx";
import AdminCaseStudies from "./pages/admin/AdminCaseStudies.jsx";
import AdminCaseStudyForm from "./pages/admin/AdminCaseStudyForm.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminContacts from "./pages/admin/AdminContacts.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Home />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/experience/:id" element={<ExperienceDetail />} />
      <Route path="/case-studies/:id" element={<CaseStudyDetail />} />

      {/* Hidden admin area — not linked from the public site */}
      <Route path={`${ADMIN_PATH}/login`} element={<AdminLogin />} />
      <Route
        path={ADMIN_PATH}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectForm />} />
        <Route path="projects/:id/edit" element={<AdminProjectForm />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="experience/new" element={<AdminExperienceForm />} />
        <Route path="experience/:id/edit" element={<AdminExperienceForm />} />
        <Route path="case-studies" element={<AdminCaseStudies />} />
        <Route path="case-studies/new" element={<AdminCaseStudyForm />} />
        <Route path="case-studies/:id/edit" element={<AdminCaseStudyForm />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="messages" element={<AdminContacts />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;