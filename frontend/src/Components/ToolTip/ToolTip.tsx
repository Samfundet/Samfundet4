import classNames from 'classnames';
import type React from 'react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Image } from '../Image';
import styles from './ToolTip.module.scss';
import { useTooltipPosition } from './useToolTipPosition';

type AlignmentOptions = 'top' | 'right' | 'bottom' | 'left';
type DisplayOptions = 'text' | 'image';

type ToolTipProps = {
  alignment?: AlignmentOptions;
  display?: DisplayOptions;
  value?: string;
  children: ReactNode;
  followCursor?: boolean;
  showArrow?: boolean;
};

export function ToolTip({
  value = 'Jokes on you',
  display = 'text',
  alignment = 'top',
  children,
  followCursor = false,
  showArrow = false,
}: ToolTipProps) {
  const [hover, setHover] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
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

  const tooltipStyle = useTooltipPosition({
    hover,
    followCursor,
    alignment,
    coords,
    containerRef,
    tooltipRef,
    offset: followCursor ? 20 : 5,
  });

  return (
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
        className={classNames(styles.tooltip, !hover && styles.hidden, showArrow && styles[alignment])}
        style={tooltipStyle}
      >
        {display === 'text' ? <p>{value}</p> : <Image className={styles.noMargin} src={value} />}
      </div>
    </div>
  );
}
