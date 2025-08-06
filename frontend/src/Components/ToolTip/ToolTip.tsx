import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import type { Children } from '~/types';
import { Image } from '../Image';
import styles from './ToolTip.module.scss';

type AlignmentOptions = 'top' | 'right';
type DisplayOptions = 'text' | 'image';

type EffectiveAlignment = 'top' | 'right' | 'bottom' | 'left';

type ToolTipProps = {
  alignment?: AlignmentOptions;
  display?: DisplayOptions;
  value?: string;
  children: Children;
  followCursor?: boolean;
};

export function ToolTip({
                          value = 'Jokes on you',
                          display = 'text',
                          alignment = 'top',
                          children,
                          followCursor = false,
                        }: ToolTipProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!followCursor || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!followCursor || !hover || !tooltipRef.current || !containerRef.current) {
      return {};
    }

    const offset = 20;
    const { width: tooltipWidth, height: tooltipHeight } = tooltipRef.current.getBoundingClientRect();
    const { x: cursorX, y: cursorY } = coords;

    const containerRect = containerRef.current.getBoundingClientRect();
    const absoluteCursorX = containerRect.left + cursorX;
    const absoluteCursorY = containerRect.top + cursorY;

    let effectiveAlignment: EffectiveAlignment = alignment;

    if (alignment === 'top' && absoluteCursorY - tooltipHeight - offset < 0) {
      effectiveAlignment = 'bottom';
    }
    if (alignment === 'right' && absoluteCursorX + tooltipWidth + offset > window.innerWidth) {
      effectiveAlignment = 'left';
    }

    const style: React.CSSProperties = { position: 'absolute' };

    switch (effectiveAlignment) {
      case 'top':
        style.left = `${cursorX}px`;
        style.top = `${cursorY - offset}px`;
        style.transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        style.left = `${cursorX + offset}px`;
        style.top = `${cursorY}px`;
        style.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        style.left = `${cursorX}px`;
        style.top = `${cursorY + offset}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.left = `${cursorX - offset}px`;
        style.top = `${cursorY}px`;
        style.transform = 'translate(-100%, -50%)';
        break;
    }

    return style;
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{ position: 'relative' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
        <div
          ref={tooltipRef}
          className={classNames(
            styles.tooltip,
            !followCursor && (alignment === 'top' ? styles.top : styles.right),
            !hover && styles.hidden,
          )}
          style={followCursor ? getTooltipStyle() : {}}
        >
          {display === 'text' ? <p>{value}</p> : <Image className={styles.noMargin} src={value} />}
        </div>
      </div>
    </div>
  );
}
