import React from 'react';
import moment from 'moment';
import avatarDefault from '../assets/avatarDefault.svg';
import renderStar from '../utils/rederStar';

const Comment = ({ image = avatarDefault, name = 'anonymous', createdAt, comment, star }) => {
    return (
        <div className="flex gap-4">
            <div className="flex-none">
                <img src={image} alt="" className="w-[25px] h-[25px] object-cover rounded-full" />
            </div>
            <div className="flex flex-col flex-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-xs">{moment(createdAt).fromNow()}</span>
                </div>
                <div className="flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-300 py-2 bg-gray-100">
                    <span className="flex ictems-center gap-1">
                        <span className="font-semibold">Vote:</span>
                        <span className="flex">{renderStar(star)}</span>
                    </span>
                    <span className="flex gap-1">
                        <span className="font-semibold">Comment:</span>
                        <span className="flex">{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Comment;
