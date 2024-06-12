import styles from './TagSelect.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { TagDto } from '~/dto';
import { COLORS } from '~/types';
import { useIsDarkTheme } from '~/hooks';

const FOUR_POINT_FIVE_REM = 4.5;

type TagSelectProps = {
  currentTagOptions: TagDto[];
  onTagChange: (selectedTags: string[]) => void;
};

export function TagSelect({ currentTagOptions, onTagChange }: TagSelectProps) {
  const [unselectedVisible, setUnselectedVisible] = useState<boolean>(false);
  const [tagOptions, setTagOptions] = useState<Set<TagDto>>(new Set(currentTagOptions));
  const [tagSearch, setTagSearch] = useState<string>('');
  const [tempTag, setTempTag] = useState<string | null>(null);
  const isDarkMode = useIsDarkTheme();

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));
  const [selectedContainerHeight, setSelectedContainerHeight] = useState(0);
  const getRootFontSize = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTagOptions(new Set(currentTagOptions));
  }, [currentTagOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setUnselectedVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  useEffect(() => {
    if (selectedContainerRef.current) {
      const heightInPx = selectedContainerRef.current.offsetHeight;
      const heightInRem = heightInPx / getRootFontSize();
      setSelectedContainerHeight(heightInRem);
    }
  }, [selectedContainerRef, selectedTags]);

  const toggleTag = (tagValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagValue)) {
      newSelectedTags.delete(tagValue);
    } else {
      newSelectedTags.add(tagValue);
    }
    setSelectedTags(newSelectedTags);

    if (tempTag === tagValue) {
      setTempTag(null);
      setTagSearch('');
    }

    onTagChange(Array.from(newSelectedTags));
  };

  const tagElement = (tagName: string, tagColor?: string) => (
    <p
      key={tagName}
      className={styles.tag}
      onClick={(e) => toggleTag(tagName, e)}
      style={{
        backgroundColor: tagColor ? `#${tagColor}` : isDarkMode ? COLORS.grey_2 : COLORS.grey_5,
        ...(unselectedVisible ? { border: 'none' } : { border: `1px solid ${COLORS.blue_deeper}` }),
      }}
    >
      {tagName}
    </p>
  );

  const filteredUnselectedTags = () => {
    const existingTagNames = Array.from(tagOptions).map((tag) => tag.name);
    let newTagOptions = existingTagNames;

    if (tempTag && !existingTagNames.includes(tempTag)) {
      newTagOptions = [...newTagOptions, tempTag];
    }

    const filteredTags = newTagOptions.filter(
      (tag) => !selectedTags.has(tag) && tag.toLowerCase().includes(tagSearch.toLowerCase()),
    );

    return filteredTags.map((tag) => {
      const tagObj = currentTagOptions.find((t) => t.name === tag);
      return tagElement(tag, tagObj ? tagObj.color : undefined);
    });
  };

  const selectedTagsContainer = () =>
    Array.from(selectedTags).map((tagName) => {
      const tagObj = currentTagOptions.find((tag) => tag.name === tagName);
      return tagElement(tagName, tagObj ? tagObj.color : undefined);
    });

  const handleTagSearch = (searchValue: string) => {
    setTagSearch(searchValue);
    if (
      searchValue.length > 0 &&
      !Array.from(tagOptions)
        .map((tag) => tag.name)
        .includes(searchValue)
    ) {
      setTempTag(searchValue);
    } else {
      setTempTag(null);
    }
  };

  const handleFocus = () => {
    setUnselectedVisible(true);
  };

  return (
    <div ref={containerRef} className={styles.tagSelect}>
      <div
        className={styles.inputSelected}
        style={
          unselectedVisible ? { borderRadius: '0.5rem 0.5rem 0 0' } : { borderRadius: '0.5rem 0.5rem 0.5rem 0.5rem' }
        }
      >
        <input
          type="text"
          onChange={(event) => handleTagSearch(event.target.value)}
          value={tagSearch}
          onFocus={() => handleFocus()}
          className={styles.tagSearch}
          placeholder={'Søk eller lag ny ...'}
        />
        {selectedTagsContainer().length > 0 && (
          <div className={styles.selectedContainer} ref={selectedContainerRef}>
            {selectedTagsContainer().reverse()}
            {selectedContainerHeight > FOUR_POINT_FIVE_REM && <span className={styles.selectedContainerGradient} />}
          </div>
        )}
      </div>
      {unselectedVisible && (
        <div className={styles.unselectedContainerOuter}>
          <span className={styles.unselectedContainerTopGradient} />
          <div className={styles.unselectedContainer}>{filteredUnselectedTags().reverse()}</div>

          <span className={styles.unselectedContainerBottomGradient} />
        </div>
      )}
    </div>
  );
}
