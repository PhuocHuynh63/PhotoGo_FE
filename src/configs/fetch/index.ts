import envConfig from "@configs/env";
import { getSession } from "next-auth/react";

type CustomOptions = RequestInit & {
  baseUrl?: string;
};

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options: CustomOptions = {}
) => {
  let accessToken: string | undefined;

  // Chỉ gọi getSession nếu đang chạy ở client
  if (typeof window !== "undefined") {
    const session = await getSession();
    accessToken = (session as any)?.accessToken;
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const baseUrl = options.baseUrl || envConfig?.NEXT_PUBLIC_API_URL;
  const fullUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return await res.json() as Response;
};

const http = {
  get: <T>(url: string, options?: Omit<CustomOptions, "body">) => request<T>("GET", url, options),
  post: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("POST", url, { ...options, body }),
  put: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("PUT", url, { ...options, body }),
  delete: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("DELETE", url, { ...options, body }),
};

export default http;
