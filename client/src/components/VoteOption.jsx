import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

import logo from '../assets/logo.png';
import { voteOptions } from '../utils/constants.jsx';

const VoteOption = ({ nameProduct, handleVote }) => {
    const [voteStar, setVoteStar] = useState(null);
    const [comment, setComment] = useState('');
    return (
        <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-black/50">
            <div
                onClick={e => e.stopPropagation()}
                className=" w-[700px] bg-white flex flex-col gap-4  items-center justify-center p-8"
            >
                <img src={logo} alt="" className="w-[300px] object-contain my-8" />
                <h2 className="text-center text-medium text-lg">{`Voting product ${nameProduct}`}</h2>
                <textarea
                    className="border-black border p-4 w-full"
                    placeholder="Type something"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                ></textarea>
                <div className="flex flex-col w-full gap-4">
                    <p>How do you feel this product?</p>
                    <div className="flex items-center gap-4 justify-between">
                        {voteOptions.map(el => (
                            <div
                                key={el.id}
                                onClick={() => setVoteStar(el.id)}
                                className="p-4 flex items-center justify-center flex-col gap-2 w-[100px] h-[100px] bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                            >
                                {Number(voteStar) && voteStar >= el.id ? (
                                    <AiFillStar color="orange" />
                                ) : (
                                    <AiFillStar color="gray" />
                                )}
                                <span className="text-sm">{el.text}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            handleVote(voteStar, comment);
                        }}
                        className="w-full px-4 py-2 bg-main text-white rounded-lg hover:opacity-80"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteOption;
