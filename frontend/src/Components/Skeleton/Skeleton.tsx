import OriginalSkeleton, { SkeletonProps } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useIsDarkTheme } from '~/hooks';
import { COLORS } from '~/types';

/** Simple wrapper around package to import required css file. */
export function Skeleton(props: SkeletonProps) {
  const isDarkTheme = useIsDarkTheme();
  const baseColor = isDarkTheme ? COLORS.theme_dark_input_bg : '#ddd';
  const highlightColor = isDarkTheme ? '#333' : '#eee';
  const defaultBorder = isDarkTheme ? '1px solid black' : '1px solid #ccc';
  const style = props.style?.border ? props.style : { ...props.style, border: defaultBorder };

  return (
    <OriginalSkeleton
      {...props}
      baseColor={props.baseColor || baseColor}
      highlightColor={props.highlightColor || highlightColor}
      style={style}
    />
  );
}
