export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
};

type ConfirmCallback = (result: boolean) => void;

let confirmListener: ((options: ConfirmOptions, callback: ConfirmCallback) => void) | null = null;

export const setConfirmListener = (listener: (options: ConfirmOptions, callback: ConfirmCallback) => void) => {
  confirmListener = listener;
};

/**
 * Global confirm dialog utility. 
 * Resolves to true if the user clicks confirm, false if cancel.
 */
export const confirmDialog = (options: string | ConfirmOptions): Promise<boolean> => {
  const opts = typeof options === 'string' ? { message: options } : options;
  return new Promise((resolve) => {
    if (confirmListener) {
      confirmListener(opts, resolve);
    } else {
      // Fallback to native if the provider isn't mounted (e.g. during SSR or early render)
      if (typeof window !== 'undefined') {
        resolve(window.confirm(opts.message));
      } else {
        resolve(false);
      }
    }
  });
};
