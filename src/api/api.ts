import axios, { type InternalAxiosRequestConfig } from "axios";
import { store } from "../store/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosConfig = {
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends httpOnly refresh token cookie automatically
};

export const api        = axios.create({ ...axiosConfig, timeout: 6000  });
export const apiPrivate = axios.create({ ...axiosConfig, timeout: 10000 });

let logoutHandler: (() => void) | null = null;

export const injectLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

// Inject access token from Redux into every private request
apiPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken;
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, attempt silent refresh then retry the original request
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?._retry) {
      prevRequest._retry = true;

      try {
        // Refresh token is sent automatically via httpOnly cookie
        const res = await api.post('/auth/refresh');
        const newToken = res.data.accessToken;

        // Update Redux with the new access token
        store.dispatch({ type: 'auth/setAccessToken', payload: newToken });

        // Retry original request with new token
        prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiPrivate(prevRequest);
      } catch (refreshError) {
        if (logoutHandler) logoutHandler();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);