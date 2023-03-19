import { CSSProperties } from 'react';
import { Position } from '~/Components/Toast/Toast';

const justifyContent: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const alignItems: Record<string, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

/**
 * Maps a position to the correct css styling with flexbox.
 *
 * Example:
 *
 * Input: 'top-center'
 *
 * Output: { justifyContent: 'center', alignItems: 'flex-start' }
 */
export function positionToStyle(position: Position): CSSProperties {
  const xy = position.split('-');
  const xPos = xy[1];
  const yPos = xy[0];

  const xKeyWord = justifyContent[xPos];
  const yKeyWord = alignItems[yPos];

  const style = {
    justifyContent: xKeyWord,
    alignItems: yKeyWord,
  };

  return style;
}
