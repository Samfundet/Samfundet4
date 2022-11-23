import OriginalSkeleton, { SkeletonProps } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/** Simple wrapper around package to import required css file. */
export function Skeleton(props: SkeletonProps) {
  return <OriginalSkeleton {...props} />;
}
