import { Container, Typography } from "@mui/material";
import React from "react";
import RegisterForm, { RegisterCredentials } from "../components/RegisterForm";

const RegisterPage = () => {
  const handleRegister = async (data: RegisterCredentials) => {
    console.log(data);
  };

  return (
    <Container>
      <Typography component="h1">Create your account</Typography>
      <RegisterForm onSubmit={handleRegister} />
    </Container>
  );
};

export default RegisterPage;
