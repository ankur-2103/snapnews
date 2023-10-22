import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    children: ReactNode;
    isModalOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isModalOpen}) => {
    
    if (!isModalOpen) return null;

    return createPortal(
        <div className="flex flex-col items-center justify-center fixed z-[2] w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)] p-4">
            {children}              
        </div>
    , document.getElementById('modal') as Element);
};

export default Modal;
