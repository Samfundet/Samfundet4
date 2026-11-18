import { useEffect, useState } from 'react';

/** Returns if primary mouse button is currently pressed down */
export function useMouseDown(): boolean {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    function handleMouseDown() {
      setMouseDown(true);
    }

    function handleMouseUp() {
      setMouseDown(false);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return mouseDown;
}
