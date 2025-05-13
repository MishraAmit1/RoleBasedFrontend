import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const user = apiService.getUser();

  const handleLogout = async () => {
    await apiService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center text-white">
          <h1 className="font-bold text-xl">Role-Based App</h1>
        </div>

        <div className="flex items-center">
          <span className="text-gray-300 mr-4">
            {user?.role === "admin" ? (
              <span className="bg-purple-600 px-2 py-1 rounded text-white text-sm">
                Admin
              </span>
            ) : (
              <span className="bg-green-600 px-2 py-1 rounded text-white text-sm">
                Guest
              </span>
            )}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
