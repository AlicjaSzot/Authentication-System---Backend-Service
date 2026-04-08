import axios from "axios";

let accessToken = "";

//funkcja do aktualizacji tokena
export const setAccessToken = (token: string) => {
  accessToken = token;
};

//Instancja Axios
export const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, //pozwala na wysłanie HTTPOnly cookies
});

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
    }

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
      window.location.href = "/";
      return Promise.reject(refreshError);
    }
    return Promise.reject(error);
  },
);
