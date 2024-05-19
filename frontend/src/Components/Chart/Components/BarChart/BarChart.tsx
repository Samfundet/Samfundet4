import { ChartData } from '~/Components/Chart/Chart';
import { Text } from '~/Components/Text/Text';
import styles from './BarChart.module.scss';
import { MouseEvent, useState } from 'react';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';

type BarChartProps = {
  chartTitle: string;
  data: ChartData[];
  labelSpliceStart?: number;
  labelSpliceEnd?: number;
  hAxisLabel?: string;
  vAxisLabel?: string;
};

export function BarChart({
  chartTitle,
  data,
  labelSpliceStart = 0,
  labelSpliceEnd,
  hAxisLabel,
  vAxisLabel,
}: BarChartProps) {
  const svgWidth = 1200;
  const svgHeight = 800;
  const vAxisSpace = 100;
  const barSpacing = 1;
  const numberOfBars = data.length;
  const totalBarSpacing = (numberOfBars - 1) * barSpacing;
  const totalBarWidthAvailable = svgWidth - totalBarSpacing - vAxisSpace;
  const dynamicBarWidth = totalBarWidthAvailable / numberOfBars;
  const maxBarWidth = 75;
  const minBarWidth = 10;
  const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, dynamicBarWidth)); // Adjust bar width
  const maxValue = Math.max(...data.map((item) => item.value));
  const scale = (svgHeight - 150) / maxValue; // Adjust for axis label space

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

  const numLabels = 5;
  const axisLabels = Array.from({ length: numLabels }, (_, i) => {
    const labelValue = Math.round((maxValue / (numLabels - 1)) * i); // Even distribution of label values
    const yPosition = svgHeight - 100 - labelValue * scale; // Aligning the labels with bars
    return (
      <text key={i} x="90" y={yPosition} fontSize="12px" fill="black" textAnchor="end">
        {labelValue}
      </text>
    );
  });

  const bars = data.map((item, index) => {
    const barHeight = item.value * scale;
    const xPosition = index * (barWidth + barSpacing) + vAxisSpace; // Adjust to start after axis labels
    const yPosition = svgHeight - barHeight - 100; // Leave space for labels

    return (
      <g key={index}>
        <rect
          x={xPosition}
          y={yPosition}
          width={barWidth}
          height={barHeight}
          fill={'blue'}
          onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value.toString())}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <text x={xPosition + barWidth / 2} y={svgHeight - 80} fill="black" fontSize="12px" textAnchor="middle">
          {item.label.slice(labelSpliceStart, labelSpliceEnd)}
        </text>
      </g>
    );
  });

  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'l'}>
        {chartTitle}
      </Text>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className={styles.chart}
        xmlns="http://www.w3.org/2000/svg"
      >
        {axisLabels}
        {bars}
        {/* Horizontal Axis Label */}
        <text x={svgWidth / 2} y={svgHeight - 20} fontSize="16px" fill="black" textAnchor="middle">
          {hAxisLabel}
        </text>
        {/* Vertical Axis Label */}
        <text
          x={svgHeight / 8}
          y={svgHeight / 2}
          fontSize="12px"
          fill="black"
          textAnchor="end"
          transform={`rotate(-90 12,${svgHeight / 2})`}
        >
          {vAxisLabel}
        </text>
      </svg>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
