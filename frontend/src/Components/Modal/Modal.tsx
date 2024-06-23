// @ts-nocheck
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';
import classNames from 'classnames';

/**
 * https://reactcommunity.org/react-modal/#usage
 */

export function Modal({ children, className, ...props }: ReactModal.Props) {
  return (
    <ReactModal
      {...props} // Spread must be first
      className={classNames(styles.modal, className)}
      overlayClassName={styles.overlay}
      appElement={document.querySelector('#root') as HTMLElement}
    >
      {children}
    </ReactModal>
  );
}
