import { useState, useRef, useCallback } from "react";

type UseFetchStreamOptions = {
  method?: "POST" | "GET";
  headers?: HeadersInit;
  body?: BodyInit | null;
};

export function useFetchStream() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchStream = useCallback(
    async (url: string, options: UseFetchStreamOptions = {}) => {
      setData("");
      setError(null);
      setLoading(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const response = await fetch(url, {
          method: options.method || "GET",
          headers: options.headers,
          body: options.body,
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setData((prev) => prev + chunk);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
        controllerRef.current = null;
      }
    },
    []
  );

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { data, loading, error, fetchStream, abort };
}
