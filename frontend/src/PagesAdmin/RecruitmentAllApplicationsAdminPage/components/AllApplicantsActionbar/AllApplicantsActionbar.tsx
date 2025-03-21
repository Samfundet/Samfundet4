import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './AllApplicantsActionbar.module.scss';

export type FilterType = 'conflicts' | 'no_conflicts' | 'specific' | null;

type AllApplicantsActionbarProps = {
  onFilterChange: (filterType: FilterType) => void;
  onSearchChange: () => void;
};

export function AllApplicantsActionbar({ onFilterChange, onSearchChange }: AllApplicantsActionbarProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const { t } = useTranslation();

  const filters: Array<{ type: FilterType; label: string }> = [
    { type: 'conflicts', label: t(KEY.recruitment_all_applicants_filter_conflicts) },
    { type: 'no_conflicts', label: t(KEY.recruitment_all_applicants_filter_no_conflicts) },
    { type: 'specific', label: t(KEY.recruitment_all_applicants_filter_specific) },
  ];

  const handleFilterClick = (filterType: FilterType) => {
    const newFilterType = filterType === activeFilter ? null : filterType;
    setActiveFilter(newFilterType);
    onFilterChange(newFilterType);
  };

  return (
    <div>
      <InputField
        icon="mdi:search"
        placeholder={t(KEY.recruitment_search_for_applicant)}
        onChange={() => onSearchChange()}
      />
      <div className={styles.filte_buttons_container}>
        {filters.map(({ type, label }) => (
          <Button
            key={type}
            theme={activeFilter === type ? 'samf' : 'outlined'}
            display="pill"
            className={styles.filter_button}
            onClick={() => handleFilterClick(type)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
