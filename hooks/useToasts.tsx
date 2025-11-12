import React, { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

export const useToasts = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000); // Auto-dismiss after 5 seconds
    }, [removeToast]);

    return { toasts, addToast, removeToast };
};
