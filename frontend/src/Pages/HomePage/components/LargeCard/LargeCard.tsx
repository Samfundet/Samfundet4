import { ContentCard } from '~/Components';
import type { HomePageElementDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, imageUrl } from '~/utils';
import styles from './LargeCard.module.scss';

type LargeCardProps = {
  element?: HomePageElementDto;
};

export function LargeCard({ element }: LargeCardProps) {
  const layoutStyle = styles.layout;

  if (!element) {
    return (
      <div className={layoutStyle}>
        <ContentCard isSkeleton />
      </div>
    );
  }

  const event = element?.events[0];
  const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } });

  return (
    <div className={layoutStyle}>
      <ContentCard
        title={dbT(element, 'title')}
        description={dbT(element, 'description')}
        imageUrl={imageUrl(event.image, 'medium')}
        url={url}
        buttonText=""
      />
    </div>
  );
}
