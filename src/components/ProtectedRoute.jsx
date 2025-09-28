import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the protected page if authenticated
    return children;
}
