import { calculateSectorPath } from './utils/calculateSectorPath';
import { useEffect, useState } from 'react';
import { pieChartColors } from './utils/pieChartColors';
import { HoverLabel, useHoverLabel } from '../../Components/HoverLabel';
import { Text } from '~/Components/Text/Text';
import styles from './PieChart.module.scss';
import { CircularChartProps } from './utils/types';

export function PieChart({ data: initialData, chartTitle }: CircularChartProps) {
  const [dataWithColors, setDataWithColors] = useState<{ color: string; label: string; value: number }[]>([]);
  const { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave } = useHoverLabel();
  const radius = 200;
  const viewboxSize = radius * 2;

  const total = dataWithColors.reduce((acc, entry) => acc + entry.value, 0);
  let accumulatedAngle = 0;

  useEffect(() => {
    if (initialData) {
      //adds colors
      const coloredData = initialData.map((entry, index) => ({
        ...entry,
        color: pieChartColors[index % pieChartColors.length], // reuses colors if there are more entries than colors
      }));
      setDataWithColors(coloredData);
    }
  }, [initialData]);

  return (
    <div className={styles.chartContainer}>
      <Text as={'strong'} size={'l'}>
        {chartTitle}
      </Text>
      <svg height={425} width={425} viewBox={`-${0} -${0} ${viewboxSize} ${viewboxSize}`}>
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
        {dataWithColors.map((entry, index) => (
          <div key={index} className={styles.labelWrapper}>
            <div className={styles.labelColor} style={{ backgroundColor: entry.color }} />
            <Text as={'p'} size={'m'}>
              {entry.label}: {entry.value}
            </Text>
          </div>
        ))}
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
