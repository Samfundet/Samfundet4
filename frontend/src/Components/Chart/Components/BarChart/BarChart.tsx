import { ChartData } from '~/Components/Chart/Chart';
import { Text } from '~/Components/Text/Text';
import styles from './BarChart.module.scss';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';

type BarChartProps = {
  chartTitle: string;
  data: ChartData[];
  labelSpliceStart?: number;
  labelSpliceEnd?: number;
  maxBarWidth?: number;
  minBarWidth?: number;
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
  maxBarWidth = 80,
  minBarWidth = 10,
}: BarChartProps) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDivWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateDivWidth();
    window.addEventListener('resize', updateDivWidth);
    return () => {
      window.removeEventListener('resize', updateDivWidth);
    };
  }, []);

  const svgWidth = containerWidth ?? 1200;
  const svgHeight = 500;
  const vAxisSpace = 45;
  const barSpacing = 5;
  const numberOfBars = data.length;
  const totalBarSpacing = (numberOfBars - 1) * barSpacing;
  const totalBarWidthAvailable = svgWidth - totalBarSpacing - vAxisSpace;
  const dynamicBarWidth = totalBarWidthAvailable / numberOfBars;
  const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, dynamicBarWidth)); // Adjust bar width
  const maxValue = Math.max(...data.map((item) => item.value));
  const scale = (svgHeight - 150) / maxValue; // Adjust for axis label space
  const totalBarWidth = numberOfBars * barWidth;
  // const totalSpacingWidth = totalBarSpacing;
  const totalBarsAndSpacingWidth = totalBarWidth + totalBarSpacing;
  const xAxisLabelPosition = totalBarsAndSpacingWidth / 2 + vAxisSpace;

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
    const yPosition = svgHeight - 50 - labelValue * scale; // Aligning the labels with bars
    return (
      <text key={i} x="40" y={yPosition} style={{ fontSize: '14px' }} fill="currentColor" textAnchor="end">
        {labelValue}
      </text>
    );
  });

  const bars = data.map((item, index) => {
    const barHeight = item.value * scale;
    const xPosition = index * (barWidth + barSpacing) + vAxisSpace; // Adjust to start after axis labels
    const yPosition = svgHeight - barHeight - 50; // Leave space for labels

    return (
      <g key={index}>
        <rect
          x={xPosition}
          y={yPosition}
          width={barWidth}
          height={barHeight}
          fill={'#FA8072'}
          onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value.toString())}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <text
          x={xPosition + barWidth / 2}
          y={svgHeight - 30}
          fill="currentColor"
          style={{ fontSize: '14px' }}
          textAnchor="middle"
        >
          {item.label.slice(labelSpliceStart, labelSpliceEnd)}
        </text>
      </g>
    );
  });

  return (
    <div className={styles.container} ref={containerRef}>
      <Text as={'strong'} size={'l'}>
        {chartTitle}
      </Text>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {axisLabels}
        {bars}
        {/* Horizontal Axis Label */}
        <text
          x={xAxisLabelPosition}
          y={svgHeight - 5}
          style={{ fontSize: '18px' }}
          textAnchor="middle"
          fill="currentColor"
        >
          {hAxisLabel}
        </text>
        {/* Vertical Axis Label */}
        <text
          x={svgHeight / 8}
          y={svgHeight / 2}
          style={{ fontSize: '18px' }}
          textAnchor="end"
          transform={`rotate(-90 14,${svgHeight / 2})`}
          fill="currentColor"
        >
          {vAxisLabel}
        </text>
      </svg>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
