import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RoleSelectionPage from "./components/RoleSelectionPage";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./components/RequireAuth";
import { useEffect } from "react";

function App() {
  // Handle Google OAuth redirect
  useEffect(() => {
    const url = window.location.href;

    // Check if this is a Google OAuth callback
    if (url.includes("?token=")) {
      try {
        // Extract token from URL
        const token = new URLSearchParams(window.location.search).get("token");
        const userStr = new URLSearchParams(window.location.search).get("user");

        console.log("Received token:", token);
        console.log("Received user string:", userStr);

        if (!token || !userStr) {
          console.error("Missing token or user data in URL");
          window.location.href = "/login";
          return;
        }

        let user;
        try {
          user = JSON.parse(decodeURIComponent(userStr));
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          window.location.href = "/login";
          return;
        }

        console.log("Parsed user object:", user);

        // Store auth info
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Clear the URL params to prevent issues on refresh
        window.history.replaceState({}, document.title, "/");

        // If user has role, go to dashboard, otherwise to role selection
        if (user.role) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/role-selection";
        }
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/role-selection"
          element={
            <RequireAuth>
              <RoleSelectionPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth requireRole={true}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
