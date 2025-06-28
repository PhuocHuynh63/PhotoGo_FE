import envConfig from "@configs/env";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
type CustomOptions = RequestInit & {
  baseUrl?: string;
};

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options: CustomOptions = {}
) => {
  let accessToken: string | undefined;

  try {
    if (typeof window !== "undefined") {
      const session = await getSession();
      accessToken = (session as any)?.accessToken;
    } else {
      const session = await getServerSession(authOptions);
      accessToken = (session as any)?.accessToken;
    }
  } catch (error) {
    console.error("Error getting session:", error);
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const baseUrl = options.baseUrl || envConfig?.NEXT_PUBLIC_API_URL;
  const fullUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });


  if (!res.ok) {
    console.error(`HTTP error! status: ${res.status}, url: ${fullUrl}`);
    // Throw an error or return a specific error object could be a better approach
    // For now, returning null to align with previous behavior on failure.
    return null as unknown as Response;
  }

  // Handle 204 No Content response
  if (res.status === 204) {
    return null as unknown as Response;
  }

  try {
    const data = await res.json();
    return data as Response;
  } catch (error) {
    console.error(`Failed to parse JSON response for url: ${fullUrl}`, error);
    return null as unknown as Response;
  }
};

const http = {
  get: <T>(url: string, options?: Omit<CustomOptions, "body">) => request<T>("GET", url, options),
  post: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("POST", url, { ...options, body }),
  put: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("PUT", url, { ...options, body }),
  patch: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("PATCH", url, { ...options, body }),
  delete: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("DELETE", url, { ...options, body }),
};

export default http;