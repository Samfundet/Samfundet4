import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { Subscription } from './Subscription';

export function Documents() {
  const { t, i18n } = useTranslation();

  const title = 'Case Documents';

  return <Subscription title={title} actions={<Button>New</Button>} />;
}
