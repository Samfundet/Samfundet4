import { Icon } from '@iconify/react';
import React, { type ChangeEvent, type InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import styles from './FileInput.module.scss';

type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  showPreview?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: this is what RHF expects
  onChange?: (...event: any[]) => void;
};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, type, multiple, showPreview, onChange, ...props }, ref) => {
    const [value, setValue] = React.useState<File[] | null>();

    const [previews, setPreviews] = useState<string[] | null>();

    const inputRef = useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const setInputFiles = useCallback((files: File[] | null) => {
      if (files === null) {
        (inputRef.current as HTMLInputElement).files = null;
        return;
      }
      const dt = new DataTransfer();
      for (const file of files) {
        dt.items.add(file);
      }
      (inputRef.current as HTMLInputElement).files = dt.files;
    }, []);

    useEffect(() => {
      if (!value) {
        setPreviews([]);
        setInputFiles(null);
        return;
      }

      const objectUrls = value.map(URL.createObjectURL);
      setPreviews(objectUrls);
      setInputFiles(value);

      return () => {
        for (const objectUrl of objectUrls) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [setInputFiles, value]);

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
      if (!e.target.files) {
        setValue(null);
        onChange?.(null);
        return;
      }
      const files = [...e.target.files];
      setValue(files.length > 0 ? files : null);
      onChange?.(multiple ? files : files[0]);
    }

    function removeFile(index: number) {
      if (!value) {
        return;
      }
      const newVal = [...value];
      newVal.splice(index, 1);
      setValue(newVal);
      onChange?.(multiple ? newVal : newVal[0]);
    }

    function getPreviewAltText(index: number) {
      return value?.[index]?.name ?? 'Preview';
    }

    return (
      <div>
        <input type="file" ref={inputRef} {...props} multiple={multiple} onChange={handleOnChange} />
        {showPreview && previews && previews.length > 0 && (
          <div className={styles.preview_container}>
            {previews.map((preview, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value we can use here
              <div className={styles.preview_wrapper} key={i}>
                <img className={styles.preview} src={preview} alt={getPreviewAltText(i)} />
                <button type="button" className={styles.remove_button} onClick={() => removeFile(i)}>
                  <Icon icon="mdi:minus" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
