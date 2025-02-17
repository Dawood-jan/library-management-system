import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import "./App.css";
import AdminDashboard from "./Layout/dashboard/AdminDashboard";
import ContributorDashboard from "./Layout/dashboard/ContributorDashboard";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";
import Header from "./Layout/header/Header";
import { auth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ViewRecipe from "./pages/ViewRecipe";
import Footer from "./Layout/footer/Footer";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

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
  // const isDashboardRoute = location.pathname.includes('dashboard');

  useEffect(() => {
    // Ensure auth state is ready before rendering.
    if (userAuth.token === null && localStorage.getItem("userAuth")) {
      // This block ensures the state is synced correctly
      const savedAuth = JSON.parse(localStorage.getItem("userAuth"));
      if (savedAuth) {
        userAuth.setAuth(savedAuth);
      }
    }
  }, [userAuth]);

  return (
    <>
      {userAuth.token === null && <Header />}
      <div className="">
        <div className="flex-grow">
          <Routes>
            <Route path="/register" element={<Signup />} />
            <Route path="/" element={<Navigate to="/:category" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:category" element={<HomePage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/recipes/users-recipe/:id" element={<ViewRecipe />} />
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
                path="/contributor-dashboard/*"
                element={
                  <ProtectedRoute role="contributor">
                    <ContributorDashboard />
                  </ProtectedRoute>
                }
              />
              </>
            )}
          </Routes>
        </div>
      </div>
      {!userAuth.token ? <Footer /> : null}
    </>
  );
};

export default App;
