import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal } from '~/Components';
import { SamfImageDialog } from './SamfImageDialog';
import type { ImageDirectiveAttributes } from './directive';

type DialogRequest = {
  imageId?: number;
  alt?: string;
  onSubmit(attributes: ImageDirectiveAttributes): void;
};

type OpenDialog = (request: DialogRequest) => void;

const SamfImageDialogContext = createContext<OpenDialog | undefined>(undefined);

export function SamfImageDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<DialogRequest | undefined>(undefined);

  const open = useCallback<OpenDialog>((next) => setRequest(next), []);
  const close = useCallback(() => setRequest(undefined), []);

  const value = useMemo(() => open, [open]);

  return (
    <SamfImageDialogContext.Provider value={value}>
      {children}
      <Modal isOpen={request !== undefined} onRequestClose={close}>
        {request && (
          <SamfImageDialog
            key={`${request.imageId ?? 'new'}-${request.alt ?? ''}`}
            imageId={request.imageId}
            alt={request.alt}
            onSubmit={(attributes) => {
              request.onSubmit(attributes);
              close();
            }}
            onCancel={close}
          />
        )}
      </Modal>
    </SamfImageDialogContext.Provider>
  );
}

export function useSamfImageDialog(): OpenDialog {
  const open = useContext(SamfImageDialogContext);
  if (!open) {
    throw new Error('useSamfImageDialog must be used within a SamfImageDialogProvider');
  }
  return open;
}
