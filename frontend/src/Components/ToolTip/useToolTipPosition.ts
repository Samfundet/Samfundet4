import type { CSSProperties, RefObject } from 'react';
import { useMemo } from 'react';

type AlignmentOptions = 'top' | 'right' | 'bottom' | 'left';

type UseTooltipPositionProps = {
  hover: boolean;
  followCursor: boolean;
  alignment: AlignmentOptions;
  coords: { x: number; y: number };
  containerRef: RefObject<HTMLDivElement>;
  tooltipRef: RefObject<HTMLDivElement>;
  offset?: number;
};

export function useTooltipPosition({
  hover,
  followCursor,
  alignment,
  coords,
  containerRef,
  tooltipRef,
  offset = 10, // Default offset
}: UseTooltipPositionProps): CSSProperties {
  return useMemo((): CSSProperties => {
    if (!hover || !tooltipRef.current || !containerRef.current) {
      return {};
    }

    // Follow Cursor
    if (followCursor) {
      const style: CSSProperties = { position: 'absolute' };
      switch (alignment) {
        case 'top':
          style.left = `${coords.x}px`;
          style.top = `${coords.y - offset}px`;
          style.transform = 'translate(-50%, -100%)';
          break;
        case 'right':
          style.left = `${coords.x + offset}px`;
          style.top = `${coords.y}px`;
          style.transform = 'translateY(-50%)';
          break;
        case 'bottom':
          style.left = `${coords.x}px`;
          style.top = `${coords.y + offset}px`;
          style.transform = 'translateX(-50%)';
          break;
        case 'left':
          style.left = `${coords.x - offset}px`;
          style.top = `${coords.y}px`;
          style.transform = 'translate(-100%, -50%)';
          break;
      }
      return style;
    }

    // Static pos
    const staticStyle: CSSProperties = { position: 'absolute' };
    switch (alignment) {
      case 'top':
        staticStyle.bottom = `calc(100% + ${offset}px)`;
        staticStyle.left = '50%';
        staticStyle.transform = 'translateX(-50%)';
        break;
      case 'right':
        staticStyle.top = '50%';
        staticStyle.left = `calc(100% + ${offset}px)`;
        staticStyle.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        staticStyle.top = `calc(100% + ${offset}px)`;
        staticStyle.left = '50%';
        staticStyle.transform = 'translateX(-50%)';
        break;
      case 'left':
        staticStyle.top = '50%';
        staticStyle.right = `calc(100% + ${offset}px)`;
        staticStyle.transform = 'translateY(-50%)';
        break;
    }
    return staticStyle;
  }, [hover, followCursor, alignment, coords, containerRef, tooltipRef, offset]);
}
