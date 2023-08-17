import classNames from 'classnames';
import styles from './Video.module.scss';

type VideoProps = {
  title?: string;
  embedId: string;
  className?: string;
};

/** Component for displaying a youtube video */
export function Video({ title, embedId = 'dQw4w9WgXcQ', className }: VideoProps) {
  const videoClassNames = classNames(styles.video, className);
  return (
    <div className={styles.container}>
      <iframe
        width="100%"
        className={videoClassNames}
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
