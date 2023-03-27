import { Icon } from '@iconify/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button } from '../Button';
import styles from './InputFile.module.scss';

export type InputFileType = 'image' | 'pdf';

type InputFileProps = {
  fileType: InputFileType;
};

export function InputFile({ fileType }: InputFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  function handleOnChange(e?: ChangeEvent<HTMLInputElement>) {
    if (e === undefined) return;
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      setSelectedFile(e.target.files?.[0]);
    }
  }

  // Create preview on file change
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Free memory on unmount
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function acceptTypes() {
    switch (fileType) {
      case 'image':
        return 'image/*';
      case 'pdf':
        return 'application/pdf';
    }
    return '*';
  }

  const icons: Record<InputFileType, string> = {
    image: 'mdi:image',
    pdf: 'mdi:file',
  };

  return (
    <label className={styles.file_label}>
      <input type="file" accept={acceptTypes()} onChange={handleOnChange} style={{ display: 'none' }} />
      <div className={styles.text_row}>
        <Icon icon={icons[fileType] ?? ''} />
        Velg en fil...
      </div>
      {preview && (
        <div className={styles.preview_container}>
          <img className={styles.preview} src={preview} />
        </div>
      )}
    </label>
  );
}
