import axios from "axios";
import { LoginCredentials } from "../components/LoginForm";

export const LoginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post("http://localhost:3001/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  } catch (err: any) {
    console.error("Login Error:", err.message);
    throw err;
  }
};
