import { Container, Typography } from "@mui/material";
import React from "react";
import RegisterForm from "../components/RegisterForm";
import { RegisterFormValues } from "../schema/registerSchema";
import { RegisterUser } from "../api/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword, ...apiData } = data;

      await RegisterUser(apiData);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      if ((err as any).response?.status < 500) {
        toast.error(
          (err as any).response?.data?.error || "Registration failed.",
        );
      }
    }
  };

  return (
    <Container>
      <Typography component="h1">Create your account</Typography>
      <RegisterForm onSubmit={handleRegister} />
    </Container>
  );
};

export default RegisterPage;
