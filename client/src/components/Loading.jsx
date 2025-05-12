import React from 'react';
import { HashLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <HashLoader color="#ee3131" />
        </div>
    );
};

export default Loading;
