export function calculateSectorPath(value: number, total: number, radius: number, accumulatedAngle: number): string {
  const percentage = value / total;
  const angle = percentage * 2 * Math.PI;
  const endAngle = accumulatedAngle + angle;

  const startX = radius + radius * Math.cos(accumulatedAngle);
  const startY = radius + radius * Math.sin(accumulatedAngle);

  const endX = radius + radius * Math.cos(endAngle);
  const endY = radius + radius * Math.sin(endAngle);

  const largeArcFlag = percentage > 0.5 ? 1 : 0;
  // returns path specs to create a sector for piechart
  return `M ${radius},${radius} 
          L ${startX},${startY} 
          A ${radius},${radius} 
          0 ${largeArcFlag} 
          1 ${endX},${endY} Z`;
}
