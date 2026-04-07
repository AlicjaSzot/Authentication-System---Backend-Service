import React from "react";
import LoginForm, { LoginCredentials } from "../components/LoginForm";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../api/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginCredentials) => {
    try {
      const result = await LoginUser(data);

      console.log("Zalogowano pomyślnie!", result);
      localStorage.setItem("token", result.token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
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
