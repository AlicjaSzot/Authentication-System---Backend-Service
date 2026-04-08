import React from "react";
import LoginForm, { LoginCredentials } from "../components/LoginForm";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../api/auth";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginCredentials) => {
    try {
      await LoginUser(data);
      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed!");
    }
  };

  return (
    <Container>
      <Typography variant="h3">Log to your account</Typography>
      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
};

export default LoginPage;
