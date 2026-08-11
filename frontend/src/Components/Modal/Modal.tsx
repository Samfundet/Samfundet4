import classNames from 'classnames';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

/**
 * https://reactcommunity.org/react-modal/#usage
 */

interface ModalProps extends ReactModal.Props {
  className?: string;
}
export function Modal({ children, className, isOpen, ...props }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    // @ts-ignore
    <ReactModal
      {...props} // Spread must be first
      isOpen={isOpen}
      className={classNames(styles.modal, className)}
      overlayClassName={styles.overlay}
      appElement={document.querySelector('#root') as HTMLElement}
    >
      {children}
    </ReactModal>
  );
}
