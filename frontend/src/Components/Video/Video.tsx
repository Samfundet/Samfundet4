import styles from './Video.module.scss';

type VideoProps = {
  title?: string;
  embedId: string;
};

/** Component for displaying a youtube video */
export function Video({ title, embedId = 'dQw4w9WgXcQ' }: VideoProps) {
  return (
    <div className={styles.container}>
      <iframe
        width="853"
        height="480"
        className={styles.frame}
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
