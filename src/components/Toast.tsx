'use client';

import React from 'react';
import { ToastMessage } from '@/types/task';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={18} color="var(--status-completed)" />;
        if (toast.type === 'error') icon = <AlertCircle size={18} color="#ef4444" />;
        if (toast.type === 'warning') icon = <AlertTriangle size={18} color="#f59e0b" />;
        if (toast.type === 'info') icon = <Info size={18} color="var(--primary)" />;

        return (
          <div key={toast.id} className="toast-item">
            {icon}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => onDismiss(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
