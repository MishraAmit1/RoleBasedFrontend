import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiService.setRole(role);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to set role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Select Your Role
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleRoleSelect("admin")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition duration-200"
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleSelect("guest")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200"
          >
            Guest
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleSelectionPage;
