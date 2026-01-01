
import React from 'react';
import { AlertTriangleIcon } from './IconComponents';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 rounded-full p-3 mb-4">
                        <AlertTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-600 mt-2 mb-6">{message}</p>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-transparent border-2 border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
