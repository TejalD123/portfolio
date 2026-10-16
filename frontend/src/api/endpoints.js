import api from "./axios";

// ---------- Projects ----------
export const getProjects = () => api.get("/projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const getProjectFields = () => api.get("/projects/fields/all");
export const createProject = (formData) =>
  api.post("/projects", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProject = (id, formData) =>
  api.put(`/projects/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ---------- Experience ----------
export const getExperiences = () => api.get("/experience");
export const getExperienceById = (id) => api.get(`/experience/${id}`);
export const createExperience = (formData) =>
  api.post("/experience", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateExperience = (id, formData) =>
  api.put(`/experience/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

// ---------- Case studies ----------
export const getCaseStudies = () => api.get("/case-studies");
export const getCaseStudyById = (id) => api.get(`/case-studies/${id}`);
export const createCaseStudy = (formData) =>
  api.post("/case-studies", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCaseStudy = (id, formData) =>
  api.put(`/case-studies/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteCaseStudy = (id) => api.delete(`/case-studies/${id}`);

// ---------- Profile ----------
export const getProfile = () => api.get("/profile");
export const getResume = () => api.get("/profile/resume");
export const createProfile = (formData) =>
  api.post("/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProfile = (formData) =>
  api.put("/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

// ---------- Contact ----------
export const sendContactMessage = (data) => api.post("/contact", data);
export const getContacts = () => api.get("/contact");
export const markContactAsRead = (id) => api.patch(`/contact/${id}/read`);
export const deleteContact = (id) => api.delete(`/contact/${id}`);

// ---------- Auth ----------
export const loginAdmin = (data) => api.post("/auth/login", data);
export const registerAdmin = (data) => api.post("/auth/register", data);