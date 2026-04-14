import axios from "axios";
import { error } from "console";
import { toast } from "react-hot-toast";

export const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

//(1) Request interceptor (before sending request to backend))
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//(2) Response interceptor (after receiving response from backend)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:3001/auth/refresh",
          {},
          { withCredentials: true },
        );

        setAccessToken(res.data.accessToken);

        originalRequest.headers["Authorization"] =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken("");
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    // === Global server errors
    if (error.response) {
      if (error.response.status >= 500) {
        toast.error("A server error occurred. Please try again later.");
      }
    } else if (error.request) {
      toast.error(
        "A connection error occurred. Please check your internet connection.",
      );
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export const refreshSession = async () => {
  const res = await axios.post(
    "http://localhost:3001/auth/refresh",
    {},
    { withCredentials: true },
  );
  setAccessToken(res.data.accessToken);
  return res.data;
};
