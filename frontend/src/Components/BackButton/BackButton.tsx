import { Button } from '../Button';
import { useTranslation } from 'react-i18next';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';

type BackButtonProps = {
  url?: string;
};

export function BackButton({ url }: BackButtonProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const goBack = () => {
    navigate({ url: url ? url : -1 });
  };

  return (
    <Button theme="outlined" rounded={true} onClick={goBack}>
      {t(KEY.common_go_back)}
    </Button>
  );
}
