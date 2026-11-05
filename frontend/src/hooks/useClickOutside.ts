import { type MutableRefObject, useEffect, useRef } from 'react';

/**
 * Adds a callback to clicks outside of some element
 * @param callback Function called when clicked outside
 * @param deps Optional additional dependencies for callback function
 * @returns react reference on component you can click outside
 */
export function useClickOutside<T extends Node>(
  callback: () => void,
  event: 'mousedown' | 'mouseup' = 'mousedown',
): MutableRefObject<T | null> {
  const ref = useRef<T>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    function handleClickOutside(evt: MouseEvent) {
      if (evt.target instanceof Element) {
        if (ref.current && !ref.current.contains(evt.target)) {
          callback();
        }
      }
    }
    document.addEventListener(event, handleClickOutside);
    // Remove listener on cleanup
    return () => {
      document.removeEventListener(event, handleClickOutside);
    };
  }, [ref, event, callback]);
  return ref;
}
