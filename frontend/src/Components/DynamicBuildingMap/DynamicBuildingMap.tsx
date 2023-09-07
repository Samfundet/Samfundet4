import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  SVGProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import styles from './DynamicBuildingMap.module.scss';

// ===================================== //
//              Component                //
// ===================================== //

type DynamicBuildingMapProps = {
  width?: string;
  height?: string;
  highlightKey?: string;
  onSetHighlight?: (key?: string) => void;
  onClickedVenue?: (key?: string) => void;
};

/**
 * Dynamic animated SVG map of Samfundet.
 * The component binding to the SVG file and hover effects.
 *
 *  The SVG must have a structure like this to be supported:
 *
 * ```html
 * <g id="venue_name">
 *  <g id="body">
 *    <!-- Path elements -->
 *  </g>
 *  <g id="label">
 *     <!-- Text elements -->
 *  </g>
 * </g>
 * ```
 *
 * My SVG editor seems to use matrices in parent group which are
 * a bit nasty to work with using CSS (translations aren't always what you'd expect).
 *
 * It could probably be a bit cleaner if we manually add
 * empty groups around the body and label elements for each venue.
 *
 */
export function DynamicBuildingMap({
  width,
  height,
  highlightKey,
  onSetHighlight,
  onClickedVenue,
}: DynamicBuildingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState<string | undefined>(undefined);

  // Create venue bindings
  function bindVenue(key: string, classes?: string) {
    const highlight = highlightKey === key;
    return (
      <SvgBinding
        key={key}
        query={`[id=${key}]`}
        className={classNames(styles.venue, styles[key], highlight && styles.highlight)}
        onMouseEnter={() => {
          setHovering(key);
          onSetHighlight?.(key);
        }}
        onMouseLeave={() => {
          setHovering(undefined);
          onSetHighlight?.(undefined);
        }}
        onClick={() => {
          onClickedVenue?.(key);
        }}
        style="pointer-events: all;"
      >
        {/* Bind children bodies and label */}
        <SvgBinding query="[id^=body]" className={classNames(styles.body, classes)} />
        <SvgBinding query="[id^=label]" className={classNames(styles.label, classes)} />
      </SvgBinding>
    );
  }

  // Checks both internal state and highlight from parent
  function isHovering(key: string) {
    return hovering === key || highlightKey === key;
  }

  // Styling
  const containerStyle: CSSProperties = {
    maxWidth: width ?? '100%',
    maxHeight: height ?? '100%',
    overflow: 'visible',
  };

  // Need to load svg async this way to ensure it is
  // in the DOM before we try SVG binders. The default
  // import as react component does not work as it does the
  // async in the background.
  const MapSvgRef = useRef<FunctionComponent<SVGProps<SVGSVGElement>>>();
  const [, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        MapSvgRef.current = (await import(`./map.svg`)).ReactComponent;
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, []);
  const LoadedSvgMap = MapSvgRef.current;

  // Render DOM
  return (
    <div ref={containerRef} style={containerStyle}>
      {LoadedSvgMap !== undefined && (
        <>
          <LoadedSvgMap style={{ pointerEvents: 'none', overflow: 'visible' }} className={styles.svg} />
          <SvgParentContext.Provider value={containerRef.current}>
            {/* Round bois */}
            {bindVenue('storsalen')}
            {bindVenue('rundhallen')}
            {bindVenue('bodegaen')}

            {/* Vertical stack to the south */}
            {bindVenue('klubben')}
            {bindVenue('edgar', classNames({ [styles.hidden]: isHovering('rundhallen') }))}
            {bindVenue('lyche', classNames({ [styles.hidden]: isHovering('bodegaen') }))}
            {bindVenue('strossa', classNames({ [styles.hidden]: isHovering('bodegaen') }))}

            {/* Others */}
            {bindVenue('selskapssiden')}
            {bindVenue('daglighallen')}
            {bindVenue('knaus')}
          </SvgParentContext.Provider>

          {/* This is just a tweaked SVG filter found on the web */}
          {/* No need to know the inner workings of svg, but it adds a nice outline! */}
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <filter
              id="filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="linearRGB"
            >
              <feMorphology operator="dilate" radius="60 60" in="SourceAlpha" result="morphology" />
              <feFlood floodColor="#222" floodOpacity="1" result="flood" />
              <feComposite in="flood" in2="morphology" operator="in" result="composite" />
              <feMerge result="merge">
                <feMergeNode in="composite" result="mergeNode" />
                <feMergeNode in="SourceGraphic" result="mergeNode2" />
              </feMerge>
            </filter>
          </svg>
        </>
      )}
    </div>
  );
}

// ===================================== //
//            SVG Binding                //
// ===================================== //

type SvgContextType = SVGElement | Element | null;
const SvgParentContext = createContext<SvgContextType>(null);

type SvgBindingProps = {
  query: string;
  style?: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  children?: ReactNode;
};

/**
 * Handles binding to an SVG element
 * Provide a query (that selects the SVG element, see SVG queries)
 * and optional classes.
 *
 * You can nest these inside a parent context provider to easily
 * query down in a hierarchy.
 *
 */
export function SvgBinding({
  query,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}: SvgBindingProps) {
  const parent = useContext(SvgParentContext);
  const [elements, setElements] = useState<SVGElement[]>([]);

  // Class/style update
  useEffect(() => {
    elements.forEach((el) => {
      el.setAttribute('class', className ?? '');
      const oldStyle = el.getAttribute('style') ?? '';
      el.setAttribute('style', `${oldStyle} ${style}`);
    });
  }, [elements, style, className]);

  // Bind events
  useEffect(() => {
    elements.forEach((el) => {
      el.onmouseenter = () => onMouseEnter?.();
      el.onmouseleave = () => onMouseLeave?.();
      el.onclick = () => onClick?.();
    });
  }, [elements, onMouseEnter, onMouseLeave, onClick]);

  // Bind to element
  useEffect(() => {
    const els = parent?.querySelectorAll(query) ?? [];
    setElements([...els] as SVGElement[]);
  }, [parent, query]);

  return (
    <>
      <SvgParentContext.Provider value={elements[0]}>{children}</SvgParentContext.Provider>
    </>
  );
}
