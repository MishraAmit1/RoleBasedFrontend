import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RoleSelectionPage from "./components/RoleSelectionPage";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./components/RequireAuth";
import { useEffect } from "react";

function OAuthHandler() {
  const location = useLocation();

  useEffect(() => {
    console.log("OAuthHandler useEffect running");
    console.log("Current URL:", window.location.href);
    console.log("Current path:", location.pathname);

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    console.log("Search params:", searchParams.toString());
    console.log("Token:", token);
    console.log("User string:", userStr);

    if (token && userStr) {
      console.log("OAuth redirect detected");
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log("Parsed user:", user);

        if (!user.id || !user.email) {
          console.error("Invalid user data:", user);
          window.location.href = "/login";
          return;
        }

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Clearing URL params");
        window.history.replaceState({}, document.title, location.pathname);

        if (user.role && ["admin", "guest"].includes(user.role)) {
          console.log(`Redirecting to dashboard with role: ${user.role}`);
          window.location.href = "/dashboard";
        } else {
          console.log("Redirecting to role-selection (no role)");
          window.location.href = "/role-selection";
        }
      } catch (error) {
        console.error("Error processing OAuth redirect:", error);
        window.location.href = "/login";
      }
    } else {
      console.log("No OAuth params found");
      if (searchParams.toString()) {
        console.warn("Unexpected URL params:", searchParams.toString());
      }
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <OAuthHandler />
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
