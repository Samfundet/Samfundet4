/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

/**
 * https://reactcommunity.org/react-modal/#usage
 */


export function Modal({ children, ...props }: ReactModal.Props) {
  return (
    <ReactModal
      {...props} // Spread must be first
      className={styles.modal}
      overlayClassName={styles.overlay}
      appElement={document.querySelector('#root') as HTMLElement}
    >
      {children}
    </ReactModal>
  );
}
