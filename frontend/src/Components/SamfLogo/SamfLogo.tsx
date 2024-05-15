type SamfLogoProps = {
  color?: 'red-samf' | 'dark' | 'light';
  size?: 'small' | 'medium' | 'large';
};

export function SamfLogo({ color = 'red-samf', size = 'medium' }: SamfLogoProps) {
  const logoColor = (color: string) => {
    switch (color) {
      case 'red-samf':
        return '#a03033';
      case 'dark':
        return '#161616';
      case 'light':
        return '#ffffff';
      default:
        return '#000000';
    }
  };
  const dimensions = {
    small: { width: '50px', height: '50px' },
    medium: { width: '100px', height: '100px' },
    large: { width: '200px', height: '200px' },
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-5 -5 110 110"
      width={dimensions[size].width}
      height={dimensions[size].height}
      strokeWidth="10"
      stroke={logoColor(color)}
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      overflow="visible"
    >
      <g className="outer">
        <g className="corners">
          <g transform="translate(0,0) rotate(0)" className="corner-top-left">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(100,0) rotate(90)" className="corner-top-right">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(0,100) rotate(-90)" className="corner-bottom-left">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(100,100) rotate(180)" className="corner-bottom-right">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
        </g>

        <g className="bridges">
          <polyline points="0 0 20 0" transform="translate(40,0) rotate(0)" className="bridge-top" />
          <polyline points="0 0 20 0" transform="translate(0,40) rotate(90)" className="bridge-left" />
          <polyline points="0 0 20 0" transform="translate(100,60) rotate(-90)" className="bridge-right" />
          <polyline points="0 0 20 0" transform="translate(60,100) rotate(180)" className="bridge-bottom" />
        </g>
      </g>

      <g className="middle">
        <g className="corners">
          <g transform="translate(20,20) rotate(0)" className="corner-top-left">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(80,20) rotate(90)" className="corner-top-right">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(20,80) rotate(-90)" className="corner-bottom-left">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
          <g transform="translate(80,80) rotate(180)" className="corner-bottom-right">
            <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
            <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
          </g>
        </g>
      </g>

      <g className="inner">
        <g transform="translate(40,40) rotate(0)" className="corner-top-left">
          <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
          <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
        </g>
        <g transform="translate(60,60) rotate(180)" className="corner-bottom-right">
          <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
          <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
        </g>
        <rect x="40" y="40" width="20" height="20" strokeWidth="0" fill={logoColor(color)} className="inner-middle" />
      </g>
    </svg>
  );
}
