import { useTranslation } from 'react-i18next';
import type { EventDto } from '~/dto';

type SetInterviewManuallyFormProps = {
  eventId: number;
  onCancel?: () => void;
  event: EventDto;
  onSave: () => void;
};

export function SetInterviewManuallyForm({
  eventId = 1,
  onCancel,
  event,
  onSave,
}: SetInterviewManuallyFormProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h1>SetInterviewManuallyForm</h1>
    </div>
  );
}
