import classNames from 'classnames';
import styles from './Modal.module.scss';
import ReactModal from 'react-modal';

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
