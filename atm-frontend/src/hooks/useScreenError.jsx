import { useState, useCallback } from "react";

export default function useScreenError() {
  const [error, setError] = useState(null);
  const showError = useCallback((e) => {
    setError(
      e?.data?.error || e?.message || String(e) || "Something went wrong"
    );
  }, []);
  const clearError = useCallback(() => setError(null), []);
  return { error, showError, clearError };
}
