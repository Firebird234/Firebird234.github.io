import React from "react";
import reactDom from "react-dom";
import { Routes, Route, Navigate } from "react-router-dom";

function RequireAuth({ children, redirectTo, loggedIn }) {
    return loggedIn ? children : <Navigate to={redirectTo} />;
}

export default RequireAuth;
