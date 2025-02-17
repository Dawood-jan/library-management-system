// ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { userAuth } = useContext(auth);

  if (!userAuth) {
    return <Navigate to="/login" />;
  }

  // if (Array.isArray(role) && !role.includes(userAuth.role)) {
  //   return <Navigate to="/login" />;
  // }

  if (typeof role === "string" && userAuth?.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
