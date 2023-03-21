import styles from './AccessDenied.module.scss';

export function AccessDenied() {
  const header = 'You are not authorized.';
  const message = `You somehow bypassed the outermost security layer, but luckily we stopped you!
  You could have hurt someone! Now, go to your room and think about what you've done!`;

  return (
    <div className={styles.dialog}>
      <h1 className={styles.header}>{header}</h1>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
