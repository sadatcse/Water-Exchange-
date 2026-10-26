'use client';
import { useCallback, useRef, useState } from 'react';
import { apiError } from '@/lib/api-client';

/**
 * Runs a save/delete request once at a time — a second click while one is in flight is ignored.
 *   const { run, busy, error } = useSubmit();
 *   await run(() => apiSecure.put(`/products/${id}`, form));   // → response, or undefined on error
 */
export default function useSubmit() {
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (request) => {
    if (lock.current) return undefined;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      return await request();
    } catch (err) {
      setError(apiError(err, 'Could not save. Check your connection and try again.'));
      return undefined;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }, []);

  return { run, busy, error, setError };
}
