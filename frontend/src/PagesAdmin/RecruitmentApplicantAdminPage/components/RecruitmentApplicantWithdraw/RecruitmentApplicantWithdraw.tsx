import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Text } from '~/Components';
import { withdrawRecruitmentApplicationRecruiter } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentApplicantWithdraw.module.scss';

type Props = {
  application: RecruitmentApplicationDto | undefined;
};

export function RecruitmentApplicantWithdraw({ application }: Props) {
  const { t } = useTranslation();

  const adminWithdraw = useMutation({
    mutationFn: (id: string) => {
      return withdrawRecruitmentApplicationRecruiter(id);
    },
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
    },
  });

  return (
    <>
      {application?.withdrawn ? (
        <Text as="i" size="l" className={styles.withdrawnText}>
          {t(KEY.recruitment_withdrawn)}
        </Text>
      ) : (
        <Button
          theme="samf"
          onClick={() => {
            if (application?.id) {
              adminWithdraw.mutate(application.id);
            }
          }}
        >
          {t(KEY.recruitment_withdraw_application)}
        </Button>
      )}
    </>
  );
}
