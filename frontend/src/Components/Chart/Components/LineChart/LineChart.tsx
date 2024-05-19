import { ChartData } from '~/Components/Chart/Chart';
import { MouseEvent, useState } from 'react';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from './LineChart.module.scss';

type LineChartProps = {
  data: ChartData[];
  svgHeight: number;
  vAxisSpace: number;
  scale: number;
  barWidth: number;
  barSpacing: number;
};

export function LineChart({ data, svgHeight, vAxisSpace, scale, barWidth, barSpacing }: LineChartProps) {
  const [hoverInfo, setHoverInfo] = useState({ value: '', x: 0, y: 0, visible: false });

  const handleMouseEnter = (event: MouseEvent<SVGPathElement>, value: string) => {
    setHoverInfo({
      value: value,
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const handleMouseMove = (event: MouseEvent<SVGPathElement>) => {
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

  // Calculate coordinates for the line chart
  const lineCoordinates = data.map((item, index) => ({
    x: index * (barWidth + barSpacing) + vAxisSpace + barWidth / 2,
    y: svgHeight - item.value * scale,
  }));

  const maxLineWidth = (data.length - 1) * (barWidth + barSpacing);
  const newSvgWidth = maxLineWidth + vAxisSpace + barWidth / 2 + 20;
  // Render the line chart and data points
  const linePath = `M${lineCoordinates.map((coord) => `${coord.x},${coord.y}`).join('L')}`;
  const dataPoints = data.map((item, index) => (
    <g key={index}>
      <circle
        cx={lineCoordinates[index].x}
        cy={lineCoordinates[index].y}
        r={5}
        fill="#FA8072"
        onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value.toString())}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {/* Value label */}
      <text
        x={lineCoordinates[index].x + 5}
        y={lineCoordinates[index].y - 30}
        fontSize="12px"
        fill="currentColor"
        textAnchor="middle"
      >
        {item.value}
      </text>
    </g>
  ));

  const horizontalLabels = data.map((item, index) => {
    if (index % 3 === 0) {
      // Display label for every third data point
      return (
        <text
          key={index}
          x={lineCoordinates[index].x + 5}
          y={svgHeight - 5}
          fontSize="12px"
          fill="currentColor"
          textAnchor="middle"
        >
          {item.label}
        </text>
      );
    }
    return null;
  });

  return (
    <div className={styles.container}>
      <svg
        width={newSvgWidth}
        height={svgHeight}
        viewBox={`0 0 ${newSvgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render the line */}
        <path d={linePath} fill="none" stroke="#B0C4DE" strokeWidth="3" />
        {/* Render data points */}
        {dataPoints}
        {horizontalLabels}
      </svg>

      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
