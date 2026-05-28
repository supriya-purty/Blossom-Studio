import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, adminUser } = useAuth();

  if (adminOnly) {
    return adminUser?.role === "admin" ? children : <Navigate to="/login" replace />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
