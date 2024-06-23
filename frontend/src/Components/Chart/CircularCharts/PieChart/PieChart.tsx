import { calculateSectorPath } from './utils/calculateSectorPath';
import { useEffect, useState } from 'react';
import { sectorColors } from './utils/sectorColors';
import { HoverLabel, useHoverLabel } from '../../Components/HoverLabel';
import { Text } from '~/Components/Text/Text';
import styles from './PieChart.module.scss';
import type { CircularChartProps } from './utils/types';
import { sizes } from './utils/apperance';

const radius = 200;
const viewboxSize = radius * 2;

export function PieChart({ data: initialData, chartTitle, size, legend }: CircularChartProps) {
  const [dataWithColors, setDataWithColors] = useState<{ color: string; label: string; value: number }[]>([]);
  const { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave, objectRef } = useHoverLabel();

  const total = dataWithColors.reduce((acc, entry) => acc + entry.value, 0);
  let accumulatedAngle = 0;
  useEffect(() => {
    if (initialData) {
      //adds colors
      const coloredData = initialData.map((entry, index) => ({
        ...entry,
        color: sectorColors[index % sectorColors.length], // reuses colors if there are more entries than colors
      }));
      setDataWithColors(coloredData);
    }
  }, [initialData]);

  const labels = dataWithColors.map((entry, index) => (
    <div key={index} className={styles.labelWrapper}>
      <div className={styles.labelColor} style={{ backgroundColor: entry.color }} />
      <Text as={'p'} size={'m'}>
        {entry.label}: {entry.value}
      </Text>
    </div>
  ));

  return (
    <div className={styles.chartContainer} style={{ width: sizes[size].cWith + sizes[size].horizontalPadding }}>
      <Text as={'strong'} size={'l'}>
        {chartTitle}
      </Text>
      <svg
        ref={objectRef}
        width={sizes[size].cWith}
        height={sizes[size].cHeight}
        style={{ minHeight: sizes[size].cHeight, minWidth: sizes[size].cWith }}
        viewBox={`-${0} -${0} ${viewboxSize} ${viewboxSize}`}
      >
        {dataWithColors?.map((entry, index) => {
          const pathDescription = calculateSectorPath(entry.value, total, radius, accumulatedAngle);
          accumulatedAngle += (entry.value / total) * 2 * Math.PI;
          return (
            <path
              key={index}
              d={pathDescription}
              fill={entry.color}
              stroke={'#fff'}
              strokeWidth={'1'}
              onMouseEnter={(event) => handleMouseEnter(event, entry.label + ': ' + entry.value.toString())}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
      <div className={styles.legendWrapper}>
        <Text as={'strong'}>{legend}</Text>
        <div className={styles.labelsContainer}>{labels}</div>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
