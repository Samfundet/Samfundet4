import { randomUUID } from 'crypto';
import { createContext, useContext, useState } from 'react';
import { Children } from '~/types';
import { Toast } from '../Toast';
import { ToastProps } from '../Toast/Toast';
import styles from './ToastManager.module.scss';

type ToastManagerProps = {
  children?: Children;
};

type ToastContextType = {
  pushToast: (toats: ToastProps) => void;
  popToast: (id: number) => void;
};

let nextToastId = 0;
const ToastContext = createContext<ToastContextType>({
  pushToast: () => {
    return;
  },
  popToast: () => {
    return;
  },
});

export function useToastContext() {
  const toastContext = useContext(ToastContext);

  if (toastContext === undefined) {
    throw new Error('useToastContext must be used within ToastContext');
  }

  return toastContext;
}

export function ToastManager({ children }: ToastManagerProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function pushToast(toast: ToastProps) {
    const t = {
      ...toast,
      id: nextToastId,
    };
    nextToastId += 1;
    setToasts([...toasts, t]);
  }
  function popToast(id: number) {
    setToasts(toasts.filter((t) => t.id !== id));
  }

  return (
    <>
      <ToastContext.Provider value={{ pushToast, popToast }}>
        <div className={styles.toast_manager_wrapper}>
          <div className={styles.toast_stack}>
            {toasts.map((toast) => {
              return <Toast key={toast.id} {...toast} />;
            })}
          </div>
        </div>
        {children}
      </ToastContext.Provider>
    </>
  );
}
