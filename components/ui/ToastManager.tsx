import React, { createContext, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { Toast, ToastMessage, ToastType } from './Toast';

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages(current => [...current, { id, type, message, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setMessages(current => current.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {messages.map(message => (
          <Toast
            key={message.id}
            message={message}
            onDismiss={dismissToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
} 