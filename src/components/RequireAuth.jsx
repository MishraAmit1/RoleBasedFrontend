import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function RequireAuth({ children, requireRole = false }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = apiService.getToken();
    const user = apiService.getUser();

    if (!token) {
      navigate("/login");
      return;
    }

    if (requireRole && !user?.role) {
      navigate("/role-selection");
      return;
    }

    setIsLoading(false);
  }, [navigate, requireRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return children;
}

export default RequireAuth;
