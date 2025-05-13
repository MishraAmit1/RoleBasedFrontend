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
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      console.log("OAuth redirect detected");
      console.log("Token:", token);
      console.log("User string:", userStr);

      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log("Parsed user:", user);

        // Validate user object
        if (!user.id || !user.email) {
          console.error("Invalid user data:", user);
          window.location.href = "/login";
          return;
        }

        // Store in localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Clear URL params
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Redirect based on role
        if (user.role && ["admin", "guest"].includes(user.role)) {
          console.log(`Redirecting to dashboard with role: ${user.role}`);
          window.location.href = "/dashboard";
        } else {
          console.log("Redirecting to role-selection");
          window.location.href = "/role-selection";
        }
      } catch (error) {
        console.error("Error processing OAuth redirect:", error);
        window.location.href = "/login";
      }
    } else if (searchParams.toString()) {
      console.warn("Unexpected URL params:", searchParams.toString());
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
