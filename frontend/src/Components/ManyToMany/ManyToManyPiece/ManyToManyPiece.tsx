import styles from './ManyToManyPiece.module.scss';

type ManyToManyPieceProps = {
  title: string;
  elements: string[];
};

export function ManyToManyPiece({ title, elements }: ManyToManyPieceProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{title}</div>
      <div className={styles.content}>
        {elements.map((i) => (
          <div className={styles.element} key={i}>
            checkbox
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}
