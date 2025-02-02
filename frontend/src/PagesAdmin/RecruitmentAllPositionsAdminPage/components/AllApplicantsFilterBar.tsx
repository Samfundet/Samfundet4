import { useState } from 'react';
import { Button } from '~/Components';
import styles from './AllApplicantsFilterBar.module.scss';

type FilterType = 'name' | 'similar' | 'conflicts' | 'noConflicts' | 'specific' | null;

export function AllApplicantsFilterBar() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filters: Array<{ type: FilterType; label: string }> = [
    { type: 'name', label: 'Sorter på navn' },
    { type: 'similar', label: 'Sorter på like stillinger' },
    { type: 'conflicts', label: 'Vis kun konflikter' },
    { type: 'noConflicts', label: 'Vis kun uten konflikter' },
    { type: 'specific', label: 'Vis kun søkere for spesifikke verv' },
  ];

  const handleFilterClick = (filterType: FilterType) => {
    setActiveFilter(filterType === activeFilter ? null : filterType);
  };

  return (
    <div className={styles.filter_bar}>
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
  );
}
