import { useState } from "react";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type UseFetchType = {
  url: string;
  options?: RequestInit;
};

export const useFetch = ({ url, options = {} }: UseFetchType) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = async (
    method: RequestMethod,
    {
      body,
      customUrl,
      headers = {},
    }: {
      body?: any;
      customUrl?: string;
      headers?: Record<string, string>;
    } = {}
  ) => {
    const finalUrl = customUrl || url;
    setLoading(true);
    setError(null);

    try {
      const response: any = await fetch(finalUrl, {
        ...options, // base options first
        method, // override method if set in options
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}), // base headers
          ...headers, // request-specific headers override base headers
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const contentType = response.headers.get("Content-Type");
      const isJson = contentType?.includes("application/json");
      const responseData = isJson
        ? await response.json()
        : await response.text();

      if (!response.ok || response.detail) {
        throw new Error(
          responseData?.message ||
            response.detail ||
            `HTTP error! Status: ${response.status}`
        );
      }

      setData(responseData);
      return responseData;
    } catch (err: any) {
      console.table(err);
      setError(err?.message || err?.detail || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    get: (customUrl?: string, headers?: Record<string, string>) =>
      request("GET", { customUrl, headers }),
    post: (body: any, customUrl?: string, headers?: Record<string, string>) =>
      request("POST", { body, customUrl, headers }),
    put: (body: any, customUrl?: string, headers?: Record<string, string>) =>
      request("PUT", { body, customUrl, headers }),
    del: (customUrl?: string, headers?: Record<string, string>) =>
      request("DELETE", { customUrl, headers }),
  };
};
