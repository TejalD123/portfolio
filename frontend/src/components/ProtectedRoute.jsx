import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_PATH } from "../utils/constants.js";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={`${ADMIN_PATH}/login`} replace />;
  }
  return children;
}
