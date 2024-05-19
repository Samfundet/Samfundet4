import { calculateSectorPath } from '~/Components/Chart/Components/PieChart/utils/calculateSectorPath';
import { MouseEvent, useEffect, useState } from 'react';
import { pieChartColors } from '~/Components/Chart/Components/PieChart/utils/pieChartColors';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';
import { Text } from '~/Components/Text/Text';
import styles from './PieChart.module.scss';

type PieChartData = {
  label: string;
  value: number;
};

type PieChartProps = {
  data: PieChartData[];
  charTitle: string;
};

export function PieChart({ data: initialData, charTitle }: PieChartProps) {
  const [dataWithColors, setDataWithColors] = useState<{ color: string; label: string; value: number }[]>([]);
  const [hoverInfo, setHoverInfo] = useState({ value: '', x: 0, y: 0, visible: false });
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

  //used for hover label
  const handleMouseEnter = (event: MouseEvent<SVGPathElement>, value: string) => {
    setHoverInfo({
      value: value,
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  //used for hover label
  const handleMouseMove = (event: MouseEvent<SVGPathElement>) => {
    setHoverInfo((prev) => ({
      ...prev,
      x: event.clientX,
      y: event.clientY,
    }));
  };

  //used for hover label
  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <div className={styles.chartContainer}>
      <Text as={'strong'} size={'l'}>
        {charTitle}
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
