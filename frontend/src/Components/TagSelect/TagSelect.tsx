import styles from './TagSelect.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { TagDto } from '~/dto';
import { COLORS } from '~/types';
import { useIsDarkTheme, useClickOutside } from '~/hooks';

const FOUR_POINT_FIVE_REM = 4.5;

type TagSelectProps = {
  currentTagOptions: TagDto[];
  exportTags: (selectedTags: string[]) => void; // makes selected tags available to parent
};

export function TagSelect({ currentTagOptions, exportTags }: TagSelectProps) {
  // tag options, like in an HTML select element
  // uses set because it is easier to crosscheck tagOptions and selectedTags, I feel the Set api can be easier
  // for humans to read
  const [tagOptions, setTagOptions] = useState<Set<TagDto>>(new Set(currentTagOptions));
  // conditionally control visibility of tag options
  const [tagOptionsVisible, setTagOptionsVisible] = useState<boolean>(false);
  // state of the "auto-select" string filter
  const [tagSearch, setTagSearch] = useState<string>('');
  // when the tag is not in tagOptions a new tag can be created,
  // therefor the tagSearch string will be appended to the options
  const [tempTag, setTempTag] = useState<string | null>(null);
  const isDarkMode = useIsDarkTheme();

  // uses set because it is easier to crosscheck tagOptions and selectedTags
  const [selectedTags, setSelectedTags] = useState<Set<TagDto>>(new Set());

  // gets the font size of the root element (rem)
  const [selectedContainerHeight, setSelectedContainerHeight] = useState(0);
  const getRootFontSize = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setTagOptionsVisible(false);
  });
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTagOptions(new Set(currentTagOptions));
  }, [currentTagOptions]);

  // updates selectedContainerHeight, a value used to control styling
  useEffect(() => {
    if (selectedContainerRef.current) {
      const heightInPx = selectedContainerRef.current.offsetHeight;
      const heightInRem = heightInPx / getRootFontSize(); // calculates height in rem
      setSelectedContainerHeight(heightInRem);
    }
  }, [selectedContainerRef, selectedTags]);

  // logic for moving a tag to the selected section when clicked, or to the "unselected" section
  const toggleTag = (tagName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedTags = new Set(selectedTags);
    let tag = Array.from(tagOptions).find((t) => t.name === tagName);

    // Handle the case where tag is not found in tagOptions but is a tempTag
    if (!tag && tempTag === tagName) {
      // Assign a dummy id and empty color for tempTag
      tag = { id: -1, name: tempTag, color: '' };
      // Add tempTag to tagOptions
      setTagOptions(new Set([...Array.from(tagOptions), tag]));
    }

    if (tag) {
      if (newSelectedTags.has(tag)) {
        newSelectedTags.delete(tag);
      } else {
        newSelectedTags.add(tag);
      }
    }

    setSelectedTags(newSelectedTags);

    if (tempTag === tagName) {
      setTempTag(null);
      setTagSearch('');
    }
    exportTags(Array.from(newSelectedTags).map((tag) => tag.name));
  };

  // tag representation
  const tagElement = (tag: TagDto) => (
    <p
      key={tag.id}
      className={styles.tag}
      onClick={(e) => toggleTag(tag.name, e)}
      // tags have support for a color in backend, so that they stand out from each other
      // when the user has selected some tags and click outside the container the tags appear to "lock in"
      style={{
        backgroundColor: tag.color ? `${tag.color}` : isDarkMode ? COLORS.grey_2 : COLORS.grey_5,
        ...(tagOptionsVisible
          ? { border: 'none' }
          : { border: `1px solid ${COLORS.blue_deeper}`, boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)' }),
      }}
    >
      {tag.name}
    </p>
  );

  // filters tag options to display the tags which contain the searchValue string
  // this way when a user attempts to create a tag they might see one that is similar
  // by default all tags are visible in a select like scroll-down
  const filteredTagOptions = () => {
    const existingTags = Array.from(tagOptions);
    let newTagOptions = existingTags;

    if (tempTag) {
      //adds  the search value(if it is not in the tag options, so that the user can add a new tag
      const tempTagExists = existingTags.some((tag) => tag.name === tempTag);
      if (!tempTagExists) {
        // Assign a dummy id and empty color for tempTag
        newTagOptions = [...newTagOptions, { id: -1, name: tempTag, color: '' }];
      }
    }

    const filteredTags = newTagOptions.filter(
      (tag) => !selectedTags.has(tag) && tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
    );
    return filteredTags.map((tag) => tagElement(tag));
  };

  const selectedTagsContainer = () => Array.from(selectedTags).map((tag) => tagElement(tag));

  // logic for setting search value and check if the search value would be a new unique tag(name)
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

  return (
    <div ref={containerRef} className={styles.tagSelect}>
      <div
        className={styles.inputSelected}
        style={
          tagOptionsVisible ? { borderRadius: '0.5rem 0.5rem 0 0' } : { borderRadius: '0.5rem 0.5rem 0.5rem 0.5rem' }
        }
      >
        <input
          type="text"
          onChange={(event) => handleTagSearch(event.target.value)}
          value={tagSearch}
          onFocus={() => setTagOptionsVisible(true)}
          className={styles.tagSearch}
          placeholder={'Søk...'}
        />
        {selectedTagsContainer().length > 0 && (
          <div className={styles.selectedContainer} ref={selectedContainerRef}>
            {selectedTagsContainer().reverse()}
            {selectedContainerHeight > FOUR_POINT_FIVE_REM && <span className={styles.selectedContainerGradient} />}
          </div>
        )}
      </div>
      {tagOptionsVisible && (
        <div style={{ position: 'relative' }}>
          <span className={styles.unselectedContainerTopGradient} />
          <div className={styles.unselectedContainer}>{filteredTagOptions().reverse()}</div>
          <span className={styles.unselectedContainerBottomGradient} />
        </div>
      )}
    </div>
  );
}
