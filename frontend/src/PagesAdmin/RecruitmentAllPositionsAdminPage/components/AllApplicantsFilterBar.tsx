import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputField } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './AllApplicantsFilterBar.module.scss';
export type FilterType = 'name' | 'noRejections' | 'similar' | 'conflicts' | 'noConflicts' | 'specific' | null;

type AllApplicantsFilterBarProps = {
  onFilterChange: (filterType: FilterType) => void;
  onSearchChange: (searchTerm: string) => void;
};

export function AllApplicantsFilterBar({ onFilterChange, onSearchChange }: AllApplicantsFilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const { t } = useTranslation();

  const filters: Array<{ type: FilterType; label: string }> = [
    { type: 'name', label: t(KEY.recruitment_all_applicants_filter_name) },
    { type: 'noRejections', label: t(KEY.recruitment_all_applicants_filter_no_rejections) },
    { type: 'similar', label: t(KEY.recruitment_all_applicants_filter_similar) },
    { type: 'conflicts', label: t(KEY.recruitment_all_applicants_filter_conflicts) },
    { type: 'noConflicts', label: t(KEY.recruitment_all_applicants_filter_no_conflicts) },
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
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div className={styles.filte_buttons}>
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
