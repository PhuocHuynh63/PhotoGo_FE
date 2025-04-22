import { getServerSession } from "next-auth";
import envConfig from "@configs/env";
import { authOptions } from "@lib/authOptions";

type CustomOptions = RequestInit & {
    baseUrl?: string;
};

// Hàm lấy accessToken từ session
const getAccessToken = async () => {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    return session?.accessToken;
};

// Hàm gọi API chung cho tất cả các phương thức HTTP
const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions
) => {

    const accessToken = await getAccessToken();
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    };

    const baseUrl = options?.baseUrl || (envConfig?.NEXT_PUBLIC_API_URL ?? '');
    const fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

    const res = await fetch(fullUrl, { ...options, method, headers, body });
    return await res.json() as Response;
};

const http = {
    get: <Response>(url: string, options?: Omit<CustomOptions, 'body'>) => request<Response>('GET', url, options),
    post: <Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) => request<Response>('POST', url, { ...options, body }),
    put: <Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) => request<Response>('PUT', url, { ...options, body }),
    delete: <Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) => request<Response>('DELETE', url, { ...options, body }),
};

export default http;