import { useState, MouseEvent, useRef } from 'react';

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
  const objectRef = useRef<SVGSVGElement | null>(null);

  const handleMouseEnter = (event: MouseEvent<SVGElement>, value: string) => {
    setHoverInfo({
      value: value,
      x: event.pageX,
      y: event.pageY,
      visible: true,
    });
  };

  const handleMouseMove = (event: MouseEvent<SVGElement>) => {
    setHoverInfo((prev) => ({
      ...prev,
      x: event.pageX,
      y: event.pageY,
    }));
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave, objectRef };
}

export function HoverLabel({ hoverInfo }: HoverLabelProps) {
  if (!hoverInfo.visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${hoverInfo.x - 50}px`,
        top: `${hoverInfo.y - 25}px`,
        background: 'white',
        border: '1px solid black',
        padding: '5px',
        color: 'black',
        pointerEvents: 'none', // To avoid flickering when the mouse is over the label
        transform: 'translate(-50%, -50%)', // Center the label at the cursor position
      }}
    >
      {hoverInfo.value}
    </div>
  );
}
