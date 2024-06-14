import styles from './TagSelect.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { TagDto } from '~/dto';
import { COLORS } from '~/types';
import { useClickOutside } from '~/hooks';
import { isColorDark } from '~/utils';

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
  //const [tempTag, setTempTag] = useState<string | null>(null); ###############

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
    const existingTag = Array.from(tagOptions).find((t) => t.name === tagName);

    if (existingTag) {
      if (newSelectedTags.has(existingTag)) {
        newSelectedTags.delete(existingTag);
      } else {
        newSelectedTags.add(existingTag);
      }
    } else {
      // Handle the case where tempTag is being selected
      const tempTag = { id: -1, name: tagName, color: '' };
      const tempTagInSelected = Array.from(newSelectedTags).find((t) => t.name === tempTag.name);

      if (tempTagInSelected) {
        newSelectedTags.delete(tempTagInSelected);
      } else {
        newSelectedTags.add(tempTag);
      }
    }

    setSelectedTags(newSelectedTags);
    exportTags(Array.from(newSelectedTags).map((tag) => tag.name));
    setTagSearch('');
  };

  // tag representation

  const tagElement = (tag: TagDto) => {
    const backgroundColor = tag.color ? `${tag.color}` : COLORS.orange_ligher;

    const textColor = isColorDark(tag.color) ? COLORS.white : COLORS.black;

    return (
      <p
        key={tag.id}
        className={styles.tag}
        onClick={(e) => toggleTag(tag.name, e)}
        // tags have support for a color in backend, so that they stand out from each other
        // when the user has selected some tags and click outside the container the tags appear to "lock in"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          ...(tagOptionsVisible
            ? { border: 'none' }
            : { border: `1px solid ${COLORS.blue_deeper}`, boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)' }),
        }}
      >
        {tag.name}
      </p>
    );
  };
  // filters tag options to display the tags which contain the searchValue string
  // this way when a user attempts to create a tag they might see one that is similar
  // by default all tags are visible in a select like scroll-down
  const filteredTagOptions = () => {
    const existingTags = Array.from(tagOptions);

    const filteredTags = existingTags.filter(
      (tag) => !selectedTags.has(tag) && tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
    );

    if (
      tagSearch &&
      !existingTags.some((tag) => tag.name === tagSearch) &&
      !filteredTags.some((tag) => tag.name === tagSearch)
    ) {
      filteredTags.push({ id: -1, name: tagSearch, color: '' });
    }

    return filteredTags.map((tag) => tagElement(tag));
  };

  const selectedTagsContainer = () => Array.from(selectedTags).map((tag) => tagElement(tag));

  // logic for setting search value and check if the search value would be a new unique tag(name)
  const handleTagSearch = (searchValue: string) => {
    setTagSearch(searchValue);
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
