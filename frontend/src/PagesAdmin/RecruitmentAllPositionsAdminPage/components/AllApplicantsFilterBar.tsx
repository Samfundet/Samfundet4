import { useState } from 'react';
import { Button, InputField } from '~/Components';
import styles from './AllApplicantsFilterBar.module.scss';

export type FilterType = 'name' | 'noRejections' | 'similar' | 'conflicts' | 'noConflicts' | 'specific' | null;

type AllApplicantsFilterBarProps = {
  onFilterChange: (filterType: FilterType) => void;
  onSearchChange: (searchTerm: string) => void;
};

export function AllApplicantsFilterBar({ onFilterChange, onSearchChange }: AllApplicantsFilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filters: Array<{ type: FilterType; label: string }> = [
    { type: 'name', label: 'Sorter på navn' },
    { type: 'noRejections', label: 'Vis kun verv hvor søkeren er ønsket' },
    { type: 'similar', label: 'Sorter på like stillinger' },
    { type: 'conflicts', label: 'Vis kun konflikter' },
    { type: 'noConflicts', label: 'Vis kun uten konflikter' },
    { type: 'specific', label: 'Vis kun søkere for spesifikke verv' },
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
        placeholder="Search for applicant"
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
