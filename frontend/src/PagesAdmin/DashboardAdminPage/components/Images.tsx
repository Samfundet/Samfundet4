import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { Subscription } from './Subscription';

export function Images() {
  const { t, i18n } = useTranslation();

  const title = 'Images';

  return <Subscription title={title} actions={<Button>New</Button>} />;
}
