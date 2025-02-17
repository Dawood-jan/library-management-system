import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import "./App.css";
import AdminDashboard from "./Layout/dashboard/AdminDashboard";
import UserDashboard from "./Layout/dashboard/UserDashboard";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";
import Header from "./Layout/header/Header";
import { auth } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ViewBook from "./pages/ViewBook";
import Footer from "./Layout/footer/Footer";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/form/ForgotPassword.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </AuthProvider>
  );
}

const Main = () => {
  const { userAuth } = useContext(auth);
  const location = useLocation();

  useEffect(() => {
    // Ensure auth state is ready before rendering.
    if (userAuth?.user?.token === null && localStorage.getItem("userAuth")) {
      const savedAuth = JSON.parse(localStorage.getItem("userAuth"));
      if (savedAuth) {
        userAuth.setAuth(savedAuth);
      }
    }
  }, [userAuth]);

  // Determine if the current route is part of the dashboard
  const isDashboardRoute = location.pathname.includes("dashboard");

  return (
    <>
      {!isDashboardRoute && <Header />}
      <div className="flex-grow">
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Navigate to="/:category" />} />
          <Route path="/:category" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/library/all-book-user/:id" element={<ViewBook />} />
          {userAuth && (
            <>
              <Route
                path="/admin-dashboard/*"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-dashboard/*"
                element={
                  <ProtectedRoute role="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
            </>
          )}
        </Routes>
      </div>
      {/* Always show Footer unless on dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
