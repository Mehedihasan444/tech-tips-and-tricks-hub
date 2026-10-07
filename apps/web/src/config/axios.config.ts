// SERVER-ONLY: uses `next/headers` (cookies). Import only from `"use server"`
// service modules or route handlers — never from `"use client"` components.
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import envConfig from "./envConfig";
import { authCookieOptions, ACCESS_TOKEN_MAX_AGE } from "./authCookies";
import { getNewAccessToken } from "@/services/AuthService";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
});

axiosInstance.interceptors.request.use(
  async function (config) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const config = error.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      const res = await getNewAccessToken();
      const accessToken = res.data.accessToken;

      config.headers["Authorization"] = accessToken;
      const cookieStore = await cookies();
      cookieStore.set("accessToken", accessToken, authCookieOptions(ACCESS_TOKEN_MAX_AGE));

      return axiosInstance(config);
    }

    // If we get here, the request is still unauthorized after refresh (or refresh failed).
    // The session is genuinely dead — clear cookies and force re-login.
    if (error?.response?.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      redirect("/login?session=expired");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
