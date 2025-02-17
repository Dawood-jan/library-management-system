import axios from "axios";
import { auth } from "./context/AuthContext"; // Import your auth context or store
import { useNavigate } from "react-router-dom";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Your base URL
});

// Add interceptor
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      const navigate = useNavigate();
      const { logoutUser } = useContext(auth);

      logoutUser(); // Clear user context and token
      navigate("/login", { state: { message: "Session expired. Please login again." } });
    }
    return Promise.reject(error); // Pass the error further down
  }
);

export default api;
