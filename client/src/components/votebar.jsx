import React, { useRef, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percent = useRef();
    if (ratingTotal === 0) {
        ratingTotal = 1;
    }
    useEffect(() => {
        percent.current.style.cssText = `right: ${
            ((ratingTotal - ratingCount) / ratingTotal) * 100
        }%`;
    }, [ratingCount, ratingTotal]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex w-[10%] items-center justify-center gap-1 text-sm">
                <span>{number}</span>
                <AiFillStar color="orange" size={20} />
            </div>
            <div className="w-[75%]">
                <div className="w-full h-[6px] bg-gray-200 rounded-l-full rounded-r-full relative">
                    <div ref={percent} className="absolute inset-0 bg-red-500"></div>
                </div>
            </div>
            <div className="w-[15%] flex justify-center text-xs text-400">{`${
                ratingCount || 0
            } ratings`}</div>
        </div>
    );
};

export default Votebar;
