import React from "react";
import LoginForm, { LoginCredentials } from "../components/LoginForm";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../api/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: LoginCredentials) => {
    try {
      const responseData = await LoginUser(data);

      const { user, accessToken } = responseData;

      login(user, accessToken);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else if (err.response?.status >= 400 && err.response?.status < 500) {
        toast.error(
          err.response?.data?.error || "Login failed. Please check your input.",
        );
      }
    }
  };

  return (
    <Container>
      <Typography component="h1">Log to your account</Typography>
      <LoginForm onSubmit={handleLogin} />
    </Container>
  );
};

export default LoginPage;
