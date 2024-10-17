import { Modal } from '~/Components';

export function ConfirmModal({ open, onClose, onConfirm, title, message }: ConfirmModalProps) {
  return (
    <Modal isOpen={open}>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </Modal>
  );
}
