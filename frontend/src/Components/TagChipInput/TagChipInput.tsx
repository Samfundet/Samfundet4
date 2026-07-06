import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, TagChip } from '~/Components';
import { getTags } from '~/api';
import { KEY } from '~/i18n/constants';
import { tagKeys } from '~/queryKeys';
import styles from './TagChipInput.module.scss';

type TagChipInputProps = {
  value?: string[];
  defaultValue?: never;
  className?: string;
  onChange?: (value: string[]) => void;
  readOnly?: boolean;
  // TODO: callback to reset input state?
};

export const TagChipInput = React.forwardRef<HTMLInputElement, TagChipInputProps>(
  ({ value, onChange, readOnly, className }, ref) => {
    const [tagNames, setTagNames] = useState<string[]>(value ?? []);
    const [tagInput, setTagInput] = useState<string>('');

    const { t } = useTranslation();

    useEffect(() => {
      onChange?.(tagNames);
    }, [onChange, tagNames]);

    function addTag(rawName: string) {
      const name = rawName.trim();
      if (name && !tagNames.some((tag) => tag.toLowerCase() === name.toLowerCase())) {
        setTagNames([...tagNames, name]);
      }
      setTagInput('');
    }

    const removeTag = useCallback(
      (name: string) => {
        setTagNames(tagNames.filter((tagName) => tagName.toLowerCase() !== name.toLowerCase()));
      },
      [tagNames],
    );

    const { data: allTags } = useQuery({ queryKey: tagKeys.list(), queryFn: getTags });

    // Reuse known tags for chip colors, fall back to a colorless chip for new names
    const tagForName = useCallback(
      (name: string) => {
        return allTags?.find((tag) => tag.name.toLowerCase() === name.toLowerCase()) ?? { id: -1, name, color: '' };
      },
      [allTags],
    );

    const tagChips = useMemo(
      () =>
        tagNames.map((name) => (
          <TagChip key={name} tag={tagForName(name)} onRemove={!readOnly ? () => removeTag(name) : undefined} />
        )),
      [tagForName, removeTag, tagNames, readOnly],
    );

    return (
      <div>
        <div className={styles.tagChips}>{tagChips}</div>
        {!readOnly && (
          <div className={styles.tag_input_row}>
            <Input
              type="text"
              value={tagInput}
              ref={ref}
              list="all-tags"
              placeholder={t(KEY.admin_images_add_tag)}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
            />
            <datalist id="all-tags">
              {allTags?.map((tag) => (
                <option value={tag.name} key={tag.name}>
                  {tag.name}
                </option>
              ))}
            </datalist>
            <Button type="button" theme="secondary" onClick={() => addTag(tagInput)} disabled={!tagInput.trim()}>
              +
            </Button>
          </div>
        )}
      </div>
    );
  },
);
TagChipInput.displayName = 'TagChipInput';
