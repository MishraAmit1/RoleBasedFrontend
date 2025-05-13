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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OAuthHandler() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        if (!user.id || !user.email) {
          window.location.href = "/login";
          return;
        }

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.history.replaceState({}, document.title, location.pathname);

        if (user.role && ["admin", "guest"].includes(user.role)) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/role-selection";
        }
      } catch (error) {
        window.location.href = "/login";
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
