import { DynamicBuildingMap } from '~/Components/DynamicBuildingMap';

/** Page used by cypress to check healthy rendering of frontend. */
export function HealthPage() {
  return <DynamicBuildingMap />;
  return <span data-cy="health">I&apos;m alive!!</span>;
}
