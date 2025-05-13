import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { toast } from "react-toastify";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiService.setRole(role);
      toast.success(`Role set to ${role}!`);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to set role. Please try again.");
      toast.error("Failed to set role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Choose Your Role
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
          Select a role to continue to your dashboard.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleRoleSelect("admin")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold rounded-lg transition duration-200 text-sm sm:text-base"
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleSelect("guest")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-lg transition duration-200 text-sm sm:text-base"
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
