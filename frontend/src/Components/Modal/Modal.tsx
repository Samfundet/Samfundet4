import classNames from 'classnames';
// @ts-nocheck
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

/**
 * https://reactcommunity.org/react-modal/#usage
 */

interface ModalProps extends ReactModal.Props {
  className?: string;
}

export function Modal({ children, className, ...props }: ModalProps) {
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
