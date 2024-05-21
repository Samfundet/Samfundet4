import { useState, MouseEvent } from 'react';

type HoverInfo = {
  value: string;
  x: number;
  y: number;
  visible: boolean;
};

type HoverLabelProps = {
  hoverInfo: HoverInfo;
};

export function useHoverLabel() {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({ value: '', x: 0, y: 0, visible: false });

  const handleMouseEnter = (event: MouseEvent<SVGElement>, value: string) => {
    setHoverInfo({
      value: value,
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const handleMouseMove = (event: MouseEvent<SVGElement>) => {
    setHoverInfo((prev) => ({
      ...prev,
      x: event.clientX,
      y: event.clientY,
    }));
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave };
}

export function HoverLabel({ hoverInfo }: HoverLabelProps) {
  if (!hoverInfo.visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${hoverInfo.x + 10}px`,
        top: `${hoverInfo.y + 10}px`,
        background: 'white',
        border: '1px solid black',
        padding: '5px',
        color: 'black',
      }}
    >
      {hoverInfo.value}
    </div>
  );
}
