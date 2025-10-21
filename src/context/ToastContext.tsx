import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';

interface Toast {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  // duration in milliseconds (optional) - if omitted defaults by type
  showToast: (message: string, type?: Toast['type'], durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', durationMs?: number) => {
    // default durations by type: error longer so users can read
    const defaultDuration = type === 'error' ? 6000 : type === 'success' ? 3000 : 2500;
    const dur = typeof durationMs === 'number' ? durationMs : defaultDuration;

    setToast({ message, type });
    setVisible(true);

    // clear any existing timer so new toast stays full duration
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
    }, dur) as unknown as number;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && visible && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white transition-all duration-300 flex items-start space-x-3 max-w-xl
            ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          <div className="flex-1 text-sm">{toast.message}</div>
          <button
            aria-label="Dismiss notification"
            onClick={() => {
              setVisible(false);
              if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
              }
            }}
            className="ml-2 text-white opacity-90 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
