import { useEffect, useState } from 'react';

/**
 * Track if ctrl or cmd is pressed down.
 */
export function useIsMetaKeyDown(): boolean {
  const [isDown, setIsDown] = useState(false);

  // Toggle the menu when ⌘K is pressed.
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        setIsDown(true);
      }
    }
    function up(e: KeyboardEvent) {
      if (e.key === 'Meta' || e.ctrlKey) {
        setIsDown(false);
      }
    }

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  return isDown;
}
