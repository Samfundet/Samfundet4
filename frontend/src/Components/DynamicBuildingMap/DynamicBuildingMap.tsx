import { CSSProperties, useEffect, useRef } from 'react';

import { ReactComponent as Map } from './map.svg';

// ===================================== //
//                Types                  //
// ===================================== //

// SVG attributes in use (need to know these to restore initial states)
type AllowedAttributes = 'style' | 'transform' | 'filter';
type AttributeMap = Partial<Record<AllowedAttributes, string>>;
const allAllowedAttributes: AllowedAttributes[] = ['style', 'transform', 'filter'];

// Definition of block config (changes applied on hover)
type BlockConfig = {
  root: Record<string, AttributeMap>;
  // Not used right now, but necessary to set fill/stroke etc
  body: Record<string, AttributeMap>;
  bodyElements: Record<string, AttributeMap>;
};

// ===================================== //
//               Config                  //
// ===================================== //

const defaultAttributeValue: AttributeMap = {
  style: 'pointer-events: all; cursor: pointer; transition: .3s; transition-function: ease-in-out;',
  // Not used right now, but might be nice
  transform: '',
  filter: '',
};

const styleHide = 'opacity: 0;';
const southVenueTranslation = 'transform: translate(-250px, 150px);';

// Main config. Defines attribute changes for self and other elements on hover
const blockHoverConfig: Record<string, Partial<BlockConfig>> = {
  // Main round bois
  storsalen: {
    root: {
      storsalen: { style: 'transform: translateY(-250px);' },
    },
  },
  rundhallen: {
    root: {
      rundhallen: { style: 'transform: translate(-200px, 220px);' },
      edgar: { style: styleHide },
    },
  },
  bodegaen: {
    root: {
      bodegaen: { style: 'transform: translateY(250px);' },
      lyche: { style: styleHide },
      strossa: { style: styleHide },
    },
  },
  // Vertical stack south side
  klubben: {
    root: {
      klubben: { style: southVenueTranslation },
    },
  },
  edgar: {
    root: {
      edgar: { style: southVenueTranslation },
    },
  },
  lyche: {
    root: {
      lyche: { style: southVenueTranslation },
    },
  },
  strossa: {
    root: {
      strossa: { style: southVenueTranslation },
    },
  },
  // Others
  selskapssiden: {
    root: {
      selskapssiden: { style: 'transform: translateY(-250px);' },
    },
  },
  daglighallen: {
    root: {
      daglighallen: { style: 'transform: translate(200px, 50px);' },
    },
  },
  knaus: {
    root: {
      knaus: { style: 'transform: translate(0, -50px);' },
    },
  },
};

// A svg block element (eg. an svg path)
// and its initial attributes for resetting
type BlockElement = {
  element: Element;
  initialAttributes: AttributeMap;
};

// One map block (typically a venue)
type MapBlock = {
  key: string;
  body: BlockElement;
  bodyElements: BlockElement[];
  label: BlockElement;
};

// ===================================== //
//              Component                //
// ===================================== //

type DynamicBuildingMapProps = {
  width?: string;
  height?: string;
  hoverKey?: string;
  onSetHover?: (key?: string) => void;
  onClickedVenue?: (key?: string) => void;
};

/**
 * Dynamic animated SVG map of Samfundet.
 * The component handles parsing of the SVG file and setting attributes
 * to various elements on hover.
 *
 * The SVG must have a structure like this to be supported:
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
 * Given this structure, you can simply modify the hoverConfig
 * above to create new behavior.
 */
export function DynamicBuildingMap({ width, height, hoverKey, onSetHover, onClickedVenue }: DynamicBuildingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = useRef<Record<string, MapBlock>>({});

  // Set attributes for block elements
  function setAttributes(elements: BlockElement[], attributes: AttributeMap) {
    elements.forEach((el) => {
      for (const [attrKey, value] of Object.entries(attributes)) {
        const initial = el.initialAttributes[attrKey as AllowedAttributes];
        const defaultVal = defaultAttributeValue[attrKey as AllowedAttributes];
        const combinedVal = `${initial} ${defaultVal} ${value}`;
        el.element.setAttribute(attrKey, combinedVal);
      }
    });
  }

  // Reset attributes for all blocks
  function resetAllAttributes() {
    Object.keys(blocks.current).forEach((key) => {
      const block = blocks.current[key];
      for (const attr of allAllowedAttributes) {
        setAttributes([block.body, block.label, ...block.bodyElements], { [attr]: '' });
      }
      // Prevent label hover initially
      setAttributes([block.label], { style: 'pointer-events: none;' });
    });
    onSetHover?.(undefined);
  }

  // Get block safely by key
  function getBlock(key: string): MapBlock | null {
    if (Object.keys(blocks.current).includes(key)) {
      return blocks.current[key];
    }
    return null;
  }

  // Set attribute for block body container
  function applyBlockHover(block: MapBlock) {
    const config = blockHoverConfig[block.key];
    onSetHover?.(block.key);

    // Set root attributes (used for both body and root)
    for (const [key, attribs] of Object.entries(config.root ?? {})) {
      const someBlock = getBlock(key);
      if (someBlock !== null) {
        setAttributes([someBlock.body, someBlock.label], attribs);
      }
    }

    // Set body attributes
    for (const [key, attribs] of Object.entries(config.body ?? {})) {
      const someBlock = getBlock(key);
      if (someBlock !== null) {
        setAttributes([someBlock.body], attribs);
      }
    }

    // Set body element attributes
    for (const [key, attribs] of Object.entries(config.bodyElements ?? {})) {
      const someBlock = getBlock(key);
      if (someBlock !== null) {
        setAttributes(someBlock.bodyElements, attribs);
      }
    }
  }

  function createBlockElement(svg: Element): BlockElement {
    const initialAttribs: Partial<AttributeMap> = {};
    for (const attr of allAllowedAttributes) {
      initialAttribs[attr] = svg.getAttribute(attr) ?? '';
    }
    return {
      element: svg,
      initialAttributes: initialAttribs,
    };
  }

  // Creates a block from svg elements
  function createBlock(key: string, parent: SVGGElement) {
    const body = parent.querySelector('[id^=body]') as SVGGElement | null;
    const label = parent.querySelector('[id^=label]') as SVGGElement | null;
    if (body != null && label != null) {
      const children = body.querySelectorAll('path');

      // Create & store block
      const block: MapBlock = {
        key: key,
        body: createBlockElement(body),
        bodyElements: Array.from(children).map((child) => createBlockElement(child)),
        label: createBlockElement(label),
      };
      blocks.current[key] = block;

      // Listeners
      parent.onmouseenter = () => {
        applyBlockHover(block);
      };
      parent.onmouseleave = () => {
        resetAllAttributes();
      };
      parent.onclick = () => {
        onClickedVenue?.(key);
      };
    } else {
      console.warn(`Couldn't find child "body" and "label" elements for key "${key}"`);
    }
  }

  // Parse svg
  function parseSvg(svg: SVGElement) {
    // Default transition time, pointer events and overflow allowed
    // Only elements with hover config should use pointer events
    svg.setAttribute('style', 'transition: .2s; overflow: visible; pointer-events: none;');

    // Build blocks based on hover config
    for (const key of Object.keys(blockHoverConfig)) {
      const svgBlock = svg.querySelector(`[id=${key}]`) as SVGGElement;
      if (svgBlock !== null) {
        createBlock(key, svgBlock);
      }
    }
    // Initialize attribs
    resetAllAttributes();
  }

  // Update hover effect from external source
  useEffect(() => {
    if (hoverKey !== undefined) {
      const block = getBlock(hoverKey);
      if (block !== null) {
        resetAllAttributes();
        applyBlockHover(block);
      }
    } else {
      resetAllAttributes();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hoverKey]);

  // Parse SVG on container change
  useEffect(() => {
    if (containerRef.current !== null) {
      const svg = containerRef.current.querySelector('svg') as SVGElement | null;
      if (svg !== null) {
        parseSvg(svg);
      }
    }
    // We don't care if parseSvg function updates, because this component does
    // not have state dependencies (only references). If the container changes
    // the svg changes, and functions will update old references.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [containerRef]);

  const containerStyle: CSSProperties = {
    maxWidth: width ?? '100%',
    maxHeight: height ?? '100%',
    overflow: 'visible',
  };

  // Render DOM
  return (
    <div ref={containerRef} style={containerStyle}>
      <Map />
    </div>
  );
}
