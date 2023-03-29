import { ContentCard } from '~/Components';
import { BACKEND_DOMAIN } from '~/constants';
import { HomePageElementDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';

type LargeCardProps = {
  element: HomePageElementDto;
};

export function LargeCard({ element }: LargeCardProps) {
  const event = element.events[0];
  const url = reverse({ pattern: ROUTES.frontend.event, urlParams: { id: event.id } });
  return (
    <ContentCard
      title={dbT(element, 'title')}
      description={dbT(element, 'description')}
      imageUrl={BACKEND_DOMAIN + event.image_url}
      url={url}
      buttonText=""
    />
  );
}
