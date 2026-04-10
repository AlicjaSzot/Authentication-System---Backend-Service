import { LoginCredentials } from "../components/LoginForm";
import { ResetPasswordValues } from "../schema/resetPasswordSchema";
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

export const ResetLoginPassword = async (
  id: string,
  token: string,
  data: ResetPasswordValues,
) => {
  try {
    const response = await api.post(`/auth/reset-password/${id}/${token}`, {
      newPassword: data.newPassword,
    });
    return response.data;
  } catch (err: any) {
    console.error(
      "Reset Password Error:",
      err.response?.data?.error || err.message,
    );
    throw err;
  }
};
