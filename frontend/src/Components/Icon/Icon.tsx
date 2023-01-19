type IconProps = {
  size?: string;
  color?: string;
  icon: string;
  className?: string;
  viewBox?: string;
};

export function Icon({ size, color, icon, className, viewBox }: IconProps) {
  return (
    <svg
      className={className}
      width={`${size}px`}
      height={`${size}px`}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path fill={color} d={icon} />
    </svg>
  );
}
