import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Set auth token for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth functions
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  setRole: async (role) => {
    try {
      const response = await api.post("/auth/role", { role });
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error("Error setting role:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  },

  // Form CRUD operations
  getForms: async () => {
    try {
      const response = await api.get("/forms");
      return response.data;
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  },

  createForm: async (formData) => {
    try {
      const response = await api.post("/forms", formData);
      return response.data;
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  },

  updateForm: async (id, formData) => {
    try {
      const response = await api.put(`/forms/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating form:", error);
      throw error;
    }
  },

  deleteForm: async (id) => {
    try {
      const response = await api.delete(`/forms/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  },

  // Helper functions
  getToken: () => localStorage.getItem("auth_token"),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default apiService;
