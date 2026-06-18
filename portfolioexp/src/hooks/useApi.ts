// src/hooks/useApi.ts
// Generic client-side data-fetching hook with loading/error states.

import { useState, useEffect, useCallback } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  const fetch_ = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res  = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Request failed");
      setState({ data: json.data, loading: false, error: null });
    } catch (e: any) {
      setState({ data: null, loading: false, error: e.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { ...state, refetch: fetch_ };
}

// ─── Mutation hook ────────────────────────────────────────────
type Method = "POST" | "PUT" | "PATCH" | "DELETE";

export function useMutation<TData = unknown, TBody = unknown>(
  url: string,
  method: Method = "POST"
) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const mutate = async (body?: TBody): Promise<TData | null> => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Request failed");
      return json.data as TData;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
