import { type RefObject, useEffect, useState } from 'react';

export function useParentElementWidth(childRef: RefObject<HTMLElement>) {
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (entries[0].contentRect.width > 0) {
        setParentWidth(entries[0].contentRect.width);
      }
    };

    const observer = new ResizeObserver(handleResize);

    if (childRef.current && childRef.current.parentNode instanceof HTMLElement) {
      observer.observe(childRef.current.parentNode);
    }

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [childRef]);

  return parentWidth;
}
