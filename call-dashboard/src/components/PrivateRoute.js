import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Retrieve superuser status from localStorage
  const isSuperuser = localStorage.getItem("is_superuser") === "true";

  return isSuperuser ? children : <Navigate to="/dashboard" />;
};

export default PrivateRoute;
