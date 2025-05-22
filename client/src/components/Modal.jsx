import React from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../redux/app/appSlice';

const Modal = ({ children }) => {
    const dispatch = useDispatch();
    return (
        <div
            onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
            className="fixed z-50 bg-transparent inset-0 "
        >
            {children}
        </div>
    );
};

export default Modal;
