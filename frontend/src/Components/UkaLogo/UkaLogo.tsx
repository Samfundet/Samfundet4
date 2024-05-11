type UkaLogoProps = {
  color?: 'blue-uka' | 'dark' | 'light';
  size?: 'small' | 'medium' | 'large';
};

export function UkaLogo({ color = 'blue-uka', size = 'medium' }: UkaLogoProps) {
  const logoColor = (color: string) => {
    switch (color) {
      case 'blue-uka':
        return '#150b59';
      case 'dark':
        return '#161616';
      case 'light':
        return '#ffffff';
      default:
        return '#000000';
    }
  };

  const dimensions = {
    small: { width: '110px', height: '66px' },
    medium: { width: '200px', height: '112px' },
    large: { width: '300px', height: '168px' },
  };

  return (
    <svg
      version="1.1"
      id="svg2"
      width={dimensions[size].width}
      height={dimensions[size].height}
      viewBox="0 0 374.71866 105.21306"
    >
      <defs id="defs6" />
      <g id="g8" transform="matrix(1.3333333,0,0,-1.3333333,0,105.21306)">
        <g id="g10" transform="scale(0.1)">
          <path
            d="m 772.324,788.77 0.024,-394.676 C 772.348,163.738 580.039,0 386.293,0 193.145,0 0,163.738 0,394.094 v
            395.004 l 344.121,-0.207 v -352.25 c 0,-21.211 20.258,-42.547 41.418,-42.547 21.078,0 42.766,21.336
            42.766,42.547 v 352.32 l 344.043,-0.207 -0.024,0.016 v 0"
            style={{ fill: logoColor(color), fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
            id="path12"
          />
          <path
            d="M 1727.7,0 H 1361.01 L 1202.1,260.305 V 0 H 856.559 V 788.77 H 1202.1 V 527.852 L 1361.01,788.82
            1727.7,788.77 1493.37,394.094 1727.7,0"
            style={{ fill: logoColor(color), fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
            id="path14"
          />
          <path
            d="M 2535.72,788.82 H 2044.03 L 1769.33,0 h 387.74 L 2289.58,393.566 2422.73,0 h 387.66 l -274.67,788.82"
            style={{ fill: logoColor(color), fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
            id="path16"
          />
        </g>
      </g>
    </svg>
  );
}
