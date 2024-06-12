import styles from './TagSelect.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { TagDto } from '~/dto';
import { COLORS } from '~/types';
import { useIsDarkTheme } from '~/hooks';

const FOUR_POINT_FIVE_REM = 4.5;

type TagSelectProps = {
  currentTagOptions: TagDto[];
  exportTags: (selectedTags: string[]) => void; // makes selected tags available to parent
};

export function TagSelect({ currentTagOptions, exportTags }: TagSelectProps) {
  // tag options, like in a HTML select element
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
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));

  // gets the font size of the root element (rem)
  const [selectedContainerHeight, setSelectedContainerHeight] = useState(0);
  const getRootFontSize = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTagOptions(new Set(currentTagOptions));
  }, [currentTagOptions]);

  // logic for detecting if the user clicks outside the tagOption wrapper
  // which "unrenders" the relevant TSX, hiding it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setTagOptionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  // updates selectedContainerHeight, a value used to control styling
  useEffect(() => {
    if (selectedContainerRef.current) {
      const heightInPx = selectedContainerRef.current.offsetHeight;
      const heightInRem = heightInPx / getRootFontSize(); // calculates height in rem
      setSelectedContainerHeight(heightInRem);
    }
  }, [selectedContainerRef, selectedTags]);

  // logic for moving a tag to the selected section when clicked, or to the "unselected" section
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

    exportTags(Array.from(newSelectedTags));
  };

  // tag representation
  const tagElement = (tagName: string, tagColor?: string) => (
    <p
      key={tagName}
      className={styles.tag}
      onClick={(e) => toggleTag(tagName, e)}
      // tags have support for a color in backend, so that they stand out from each other
      // when the user has selected some tags and click outside the container the tags appear to "lock in"
      style={{
        backgroundColor: tagColor ? `#${tagColor}` : isDarkMode ? COLORS.grey_2 : COLORS.grey_5,
        ...(tagOptionsVisible
          ? { border: 'none' }
          : { border: `1.5px solid ${COLORS.blue_deeper}`, boxShadow: `inset 0 0 5px 1px ${COLORS.black_t25}` }),
      }}
    >
      {tagName}
    </p>
  );

  // filters tag options to display the tags which contain the searchValue string
  // this way when a user attempts to create a tag they might see one that is similar
  // by default all tags are visible in a select like scroll-down
  const filteredTagOptions = () => {
    const existingTagNames = Array.from(tagOptions).map((tag) => tag.name);
    let newTagOptions = existingTagNames;

    if (tempTag && !existingTagNames.includes(tempTag)) {
      //adds  the search value(if it is not in the tag options, so that the user can add a new tag
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
    setTagOptionsVisible(true);
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
      {tagOptionsVisible && (
        <div className={styles.unselectedContainerOuter}>
          <span className={styles.unselectedContainerTopGradient} />
          <div className={styles.unselectedContainer}>{filteredTagOptions().reverse()}</div>

          <span className={styles.unselectedContainerBottomGradient} />
        </div>
      )}
    </div>
  );
}
