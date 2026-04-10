import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import ResetPasswordPage from "./components/ResetPasswordPage";

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route
            path="reset-password/:id/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
