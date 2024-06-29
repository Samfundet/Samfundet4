type SamfundetLogoProps = {
  className?: string;
};

export function SamfundetLogo({ className }: SamfundetLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      height="100"
      width="100"
      strokeWidth="10"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      overflow="visible"
      className={className}
    >
      {/* <!-- 
          All the elements are equal copies of one another.
          They are only transformed to create logo.
          This makes size changes and proportions easy to work with.
          The classname are carefully selected to be easily targetable.
      --> */}
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
          {/* <!-- Copies of outer-corners. --> */}
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
        {/* <!-- Copies of outer-corners. --> */}
        <g transform="translate(40,40) rotate(0)" className="corner-top-left">
          <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
          <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
        </g>
        <g transform="translate(60,60) rotate(180)" className="corner-bottom-right">
          <polyline points="0 0 20 0" transform="rotate(0)" className="corner-foot-left" />
          <polyline points="0 0 20 0" transform="rotate(90)" className="corner-foot-right" />
        </g>
        <rect x="40" y="40" width="20" height="20" strokeWidth="0" fill="currentColor" className="inner-middle" />
      </g>
    </svg>
  );
}
