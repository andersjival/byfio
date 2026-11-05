import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isAlert?: boolean;
}

type ConfirmFn = (message: string, options?: ConfirmOptions) => Promise<boolean>;
type AlertFn = (message: string, options?: Omit<ConfirmOptions, 'cancelLabel' | 'isAlert'>) => Promise<void>;

interface ConfirmContextValue {
  confirm: ConfirmFn;
  alert: AlertFn;
}

const ConfirmContext = createContext<ConfirmContextValue>({
  confirm: () => Promise.resolve(false),
  alert: () => Promise.resolve(),
});

export const useConfirm = (): ConfirmFn => useContext(ConfirmContext).confirm;
export const useAlert = (): AlertFn => useContext(ConfirmContext).alert;

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolveRef = useRef<((val: boolean) => void) | null>(null);

  const confirm: ConfirmFn = useCallback((msg, opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setMessage(msg);
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const alert: AlertFn = useCallback((msg, opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = () => resolve();
      setMessage(msg);
      setOptions({ ...opts, isAlert: true, variant: opts.variant || 'info' });
      setOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    resolveRef.current?.(true);
  };

  const handleCancel = () => {
    setOpen(false);
    resolveRef.current?.(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      <ConfirmDialog
        open={open}
        message={message}
        title={options.title}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        variant={options.variant}
        isAlert={options.isAlert}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
