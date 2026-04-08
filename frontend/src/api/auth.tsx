import { LoginCredentials } from "../components/LoginForm";
import { api, setAccessToken } from "./axiosClient";

export const LoginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    });

    setAccessToken(response.data.accessToken);
    return response.data;
  } catch (err: any) {
    console.error("Login Error:", err.response?.data?.error || err.message);
    throw err;
  }
};

export const LogoutUser = async () => {
  try {
    await api.post("/auth/logout");
    setAccessToken("");
  } catch (err) {
    console.error("Logout Error:", err);
  }
};
