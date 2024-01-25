import { MenuItemDto } from '~/dto';
import styles from './ManyToManyPiece.module.scss';

type ManyToManyPieceProps = {
  title: string;
  dishes: MenuItemDto[];
};

export function ManyToManyPiece({ title, dishes }: ManyToManyPieceProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{title}</div>
      <div className={styles.content}>
        {dishes.map((i) => (
          <div key={i.id}>{dishes[i].name}</div>
        ))}
      </div>
    </div>
  );
}
