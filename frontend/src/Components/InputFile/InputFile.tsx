import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type ChangeEvent, type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { TimeDisplay } from '../TimeDisplay';
import styles from './InputFile.module.scss';
import { Link } from '../Link';
import { getFileNameFromUrl, isFileImage } from '~/utils';

export type InputFileType = 'image' | 'pdf' | 'any';

export type InputFileProps = {
  fileType?: InputFileType;
  label?: ReactNode;
  existing_url?: string;
  error?: boolean | string;
  onSelected?: (file: File) => void;
};

export function InputFile({ fileType='any', label, existing_url, error = false, onSelected }: InputFileProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [isImage, setIsImage] = useState<boolean>(false);


  function handleOnChange(e?: ChangeEvent<HTMLInputElement>) {
    if (e === undefined || onSelected === undefined) return;
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      setSelectedFile(e.target.files?.[0]);
      if (e.target.files?.[0] !== undefined) {
        onSelected(e.target.files?.[0]);
        setIsImage(isFileImage(e.target.files?.[0].name));
      } else {
        setIsImage(false);
      }
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
    any: 'mdi:file',
  };

  const horizontalPreview = fileType === 'pdf';
  const typePreviewClass = `preview_${fileType?.toLowerCase()}`;
  const fileSizeMb = ((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2);
  const isError = error !== false;

  return (
    <div>
      {/* Visual label */}
      <label>{label}</label>
      {/* Label container to accept button input */}
      <label className={classNames(styles.file_label, horizontalPreview && styles.horizontal, isError && styles.error)}>
        <input type="file" accept={acceptTypes()} onChange={handleOnChange} style={{ display: 'none' }} />

        {/* Select button */}
        <div className={styles.top_row}>
          <div className={styles.upload_button}>
            <Icon icon={icons[fileType] ?? ''} />
            {t(KEY.inputfile_choose_a_file)}
          </div>
          { 
          (existing_url && !selectedFile)  ?
            (
              <Link className={styles.title} url={existing_url} target='external'>{getFileNameFromUrl(existing_url)}</Link>
            ):
          (          
          <span className={styles.title}>{selectedFile?.name ?? t(KEY.inputfile_no_file_selected)}</span>
           )
      
    
          }
        </div>

  <div className={styles.selected_container}>
  {preview &&
    <>
    <div className={styles.preview_meta}>
      <p>
        <TimeDisplay timestamp={new Date(selectedFile?.lastModified ?? 0)} />
      </p>
      <p>{fileSizeMb} MB</p>
    </div>
    {isImage && (
      <div className={classNames(styles.preview_container, styles[typePreviewClass])}>
        {preview && <img className={styles.preview} src={preview} alt="Preview" />}
      </div>
      )
    }
    </>
  }
  </div>
      </label>
    </div>
  );
}
