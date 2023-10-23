import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/* This component creates a basic structure of Modal */ 

interface ModalProps {
    children: ReactNode; // Children to be rendered inside the modal
    isModalOpen: boolean; // Check modal is open or close
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
