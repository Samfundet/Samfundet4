import type { LogoPalette, LogoProps } from '~/Components/Logo/Logo';
import { COLORS } from '~/types';

type UkaLogoProps = {
  color: LogoProps['color'];
  size: LogoProps['size'];
};

export function UkaLogo({ color, size }: UkaLogoProps) {
  const logoColor = (color: string): LogoPalette => {
    switch (color) {
      case 'org-color':
        return { primary: COLORS.blue_uka };
      case 'org-alt-color':
        return { primary: COLORS.bisque_uka };
      case 'dark':
        return { primary: COLORS.black };
      case 'light':
        return { primary: COLORS.white };
      default:
        return { primary: COLORS.black };
    }
  };

  const dimensions = {
    xsmall: { logoWidth: '100px', logoHeight: '28px' },
    small: { logoWidth: '200px', logoHeight: '56.16px' },
    medium: { logoWidth: '300px', logoHeight: '84.24px' },
    large: { logoWidth: '400px', logoHeight: '112.32px' },
  };

  return (
    <svg
      version="1.1"
      style={{ maxWidth: dimensions[size].logoWidth, minHeight: dimensions[size].logoHeight }}
      viewBox="0 0 200 56.16"
      id="uka-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>UKA Logo</title>
      <defs id="defs3" />
      <path
        d="M 0.001708,0.02333813 0,28.109347 c 0,16.392639 13.685131,28.044594 27.472521,28.044594
           13.744836,0 27.489458,-11.651955 27.489458,-28.044594 V -3.8710894e-6 L 30.473573,0.01472613
            V 25.081608 c 0,1.509422 -1.441604,3.027738 -2.947396,3.027738 -1.499957,0 -3.043322,-1.518316
             -3.043322,-3.027738 V 0.00974513 L 0,0.02447513 l 0.001708,-0.0011 v 0"
        id="uka-U"
        style={{ fill: logoColor(color).primary, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
      />
      <path
        d="M 122.94693,56.144049 H 96.85246 L 85.544076,37.620174 V 56.144049 H 60.954617 V 0.01344613
           H 85.544076 V 18.580942 L 96.85246,0.00988813 l 26.09447,0.0036 -16.67545,28.08600887 16.67545,28.044594"
        id="uka-K"
        style={{ fill: logoColor(color).primary, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
      />
      <path
        d="M 180.4474,0.00988813 H 145.45766 L 125.90941,56.144049 h 27.59242 l
           9.4297,-28.00702 9.47525,28.00702 h 27.58674 L 180.4474,0.00988813"
        id="uka-A"
        style={{ fill: logoColor(color).primary, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
      />
    </svg>
  );
}
