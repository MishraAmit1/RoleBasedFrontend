import apiService from "../services/api";
import { toast } from "react-toastify";

function Navbar() {
  const user = apiService.getUser();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">Role-Based App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm sm:text-base">
            {user ? `Hello, ${user.email}` : "Guest"}
          </span>
          <button
            onClick={handleLogout}
            className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
