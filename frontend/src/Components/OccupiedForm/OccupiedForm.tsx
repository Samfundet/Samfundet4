import { useEffect, useState } from 'react';
import { OccupiedTimeSlotDto } from '~/dto';
import styles from './OccupiedForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots, postOccupiedTimeslots } from '~/api';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Icon } from '@iconify/react';
import { OccupiedLine } from './Components';

type OccupiedFormProps = {
  recruitmentId: number;
};

export function OccupiedForm({ recruitmentId = 1 }: OccupiedFormProps) {
  const { t } = useTranslation();
  const [occupiedTimeslots, setOccupiedTimeslots] = useState<OccupiedTimeSlotDto[]>([]);

  useEffect(() => {
    if (recruitmentId) {
      getOccupiedTimeslots(recruitmentId)
        .then((res) => {
          setOccupiedTimeslots(res.data);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  function updateTimeslots(key: number, newTimeslot: OccupiedTimeSlotDto) {
    setOccupiedTimeslots(
      occupiedTimeslots.map((element: OccupiedTimeSlotDto, index: number) => {
        if (key === index) {
          return newTimeslot;
        } else {
          return element;
        }
      }),
    );
  }

  function deleteTimeslot(key: number) {
    setOccupiedTimeslots(occupiedTimeslots.filter((element: OccupiedTimeSlotDto, index: number) => key !== index));
  }

  function createTimeSlot() {
    setOccupiedTimeslots([...occupiedTimeslots, {} as OccupiedTimeSlotDto]);
  }

  function sendTimeslots() {
    postOccupiedTimeslots(
      occupiedTimeslots.map((element) => {
        return { ...element, recruitment: recruitmentId };
      }),
    )
      .then((res) => {
        toast.success(t(KEY.common_update_successful));
        setOccupiedTimeslots(res.data);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.occupiedHeader}>{t(KEY.occupied_title)}</h3>
        <small className={styles.occupiedText}>{t(KEY.occupied_help_text)}</small>
      </div>
      <div className={styles.formContainer}>
        {occupiedTimeslots?.map((element, index) => (
          <OccupiedLine
            timeslot={element}
            index={index}
            key={index}
            onDelete={deleteTimeslot}
            onChange={updateTimeslots}
          />
        ))}
      </div>
      <div className={styles.row}>
        <Button display="block" theme="green" onClick={() => sendTimeslots()}>
          {t(KEY.common_save)}
        </Button>
        <Button className={styles.add} theme="blue" onClick={() => createTimeSlot()}>
          <Icon icon="mdi:plus"></Icon>
        </Button>
      </div>
    </div>
  );
}
