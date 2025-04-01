import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type ChangeEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import { IconButton } from '../IconButton';
import { TimeDisplay } from '../TimeDisplay';
import styles from './InputFile.module.scss';

export type InputFileType = 'image' | 'pdf';

export type InputFileProps = {
  fileType: InputFileType;
  label?: ReactNode;
  error?: boolean | string;
  onSelected: (file: File) => void;
};

export function InputFile({ fileType, label, error = false, onSelected }: InputFileProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOnChange(e?: ChangeEvent<HTMLInputElement>) {
    if (e === undefined) return;
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      setSelectedFile(e.target.files?.[0]);
      if (e.target.files?.[0] !== undefined) {
        onSelected(e.target.files?.[0]);
      }
    }
  }

  const handleClearFile = () => {
    setSelectedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
  }

  const icons: Record<InputFileType, string> = {
    image: 'mdi:image',
    pdf: 'mdi:file',
  };

  const horizontalPreview = fileType === 'pdf';
  const typePreviewClass = `preview_${fileType.toLowerCase()}`;
  const fileSizeMb = ((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2);
  const isError = error !== false;

  return (
    <div>
      {/* Visual label */}
      <label>{label}</label>
      {/* Label container to accept button input */}
      <label className={classNames(styles.file_label, horizontalPreview && styles.horizontal, isError && styles.error)}>
        <input
          type="file"
          accept={acceptTypes()}
          onChange={handleOnChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />

        {/* Select button */}
        <div className={styles.top_row}>
          <div className={styles.upload_button}>
            <Icon icon={icons[fileType] ?? ''} />
            {t(KEY.inputfile_choose_a_file)}
          </div>
          {fileType === 'image' && (
            <span className={styles.title}>{selectedFile?.name ?? t(KEY.inputfile_no_file_selected)}</span>
          )}
        </div>

        {/* File Preview */}
        <div className={classNames(styles.selected_container, fileType === 'pdf' && styles.pdf)}>
          {/* PDF shows additional information */}
          {fileType === 'pdf' && (
            <div className={styles.preview_meta}>
              <p className={styles.title}>{selectedFile?.name ?? t(KEY.inputfile_no_file_selected)}</p>
              <p>
                <TimeDisplay timestamp={new Date(selectedFile?.lastModified ?? 0)} />
              </p>
              <p>{fileSizeMb} MB</p>
            </div>
          )}
          {/* Image/pdf preview. Shows empty preview for pdf type */}
          {(fileType === 'pdf' || preview) && (
            <div className={classNames(styles.preview_container, styles[typePreviewClass])}>
              {preview && (
                /* Delete-button */
                <div className={styles.image_wrapper}>
                  <img className={styles.preview} src={preview} alt="Preview" />
                  <IconButton
                    color={COLORS.red}
                    icon="mdi:delete"
                    onClick={handleClearFile}
                    className={styles.delete_button}
                    title="Delete file"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
