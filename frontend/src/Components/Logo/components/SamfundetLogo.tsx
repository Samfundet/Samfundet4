import type { LogoPalette, LogoProps } from '~/Components/Logo/Logo';
import { COLORS } from '~/types';

type SamfLogoProps = {
  color: LogoProps['color'];
  size: LogoProps['size'];
};

export function SamfundetLogo({ color, size }: SamfLogoProps) {
  const logoColor = (color: string): LogoPalette => {
    switch (color) {
      case 'org-color':
        return { primary: COLORS.red_samf };
      case 'org-alt-color':
        return { primary: COLORS.red_samf_faded };
      case 'dark':
        return { primary: COLORS.black };
      case 'light':
        return { primary: COLORS.white };
      default:
        return { primary: COLORS.black };
    }
  };
  const dimensions = {
    xsmall: { logoWidth: '50px', logoHeight: '50px' },
    small: { logoWidth: '100px', logoHeight: '100px' },
    medium: { logoWidth: '200px', logoHeight: '200px' },
    large: { logoWidth: '300px', logoHeight: '300px' },
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: dimensions[size].logoWidth, minHeight: dimensions[size].logoHeight }}
      viewBox="-5 -5 110 110"
      strokeWidth="10"
      stroke={logoColor(color).primary}
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      overflow="visible"
    >
      <title>Samfundet Logo</title>
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
        <rect
          x="40"
          y="40"
          width="20"
          height="20"
          strokeWidth="0"
          fill={logoColor(color).primary}
          className="inner-middle"
        />
      </g>
    </svg>
  );
}
