import { useCallback, useEffect, useState } from 'react';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Runs an async function on mount and gives you { data, loading, error, reload }.
 *
 * Usage:
 *   const { data, loading, error } = useFetch(() => api.courses.list(), []);
 *
 * `deps` works like useEffect's dependency array — when a value in it changes,
 * the request runs again.
 */
export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await run();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }, [run]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await run();
        if (alive) setState({ data, loading: false, error: null });
      } catch (err) {
        if (alive) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Something went wrong',
          });
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [run]);

  return { ...state, reload: load, setData: (d: T) => setState({ data: d, loading: false, error: null }) };
}
