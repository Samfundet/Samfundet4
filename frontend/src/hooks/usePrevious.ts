import { useEffect, useRef } from 'react';

/**
 * Utility hook to get the previous value of react state
 * @param value current state
 * @returns previous state after next render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
