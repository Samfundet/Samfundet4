type HoverLabelProps = {
  hoverInfo: {
    value: string;
    x: number;
    y: number;
    visible: boolean;
  };
};

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
