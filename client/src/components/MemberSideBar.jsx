import React, { Fragment, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import clsx from 'clsx';

import avatar from '../assets/avatarDefault.svg';
import { memberSidebar } from '../utils/constants.jsx';
import { useSelector } from 'react-redux';

const activeStyle = 'px-4 py-2 flex items-center gap-2  bg-main text-white';
const notActiveStyle =
    'px-4 py-2 flex items-center gap-2  hover:bg-main hover:opacity-80 hover:text-white';

const MemberSideBar = () => {
    const [open, setOpen] = useState(false);
    const { current } = useSelector(state => state.user);
    return (
        <div className="bg-gray-100 h-full py-4 font-sm">
            <div className="flex flex-col items-center justify-center gap-2 py-4">
                <div
                    to="/"
                    className="w-full flex items-center py-4 flex-col justify-center border-b mb-4"
                >
                    <img
                        src={current.avatar || avatar}
                        alt=""
                        className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex justify-center pt-2 font-semibold">
                        <small>{current.name}</small>
                    </div>
                </div>
            </div>
            <div>
                {memberSidebar.map(item => (
                    <Fragment key={item.id}>
                        {item.type === 'single' && (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(isActive ? activeStyle : notActiveStyle, 'p-4 ')
                                }
                            >
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </NavLink>
                        )}
                        {item.type === 'parent' && (
                            <div className="flex flex-col  " onClick={() => setOpen(!open)}>
                                <div className="px-4 py-2 flex items-center justify-between hover:bg-main hover:opacity-80 hover:text-white cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                    {open ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
                                </div>
                                {open && (
                                    <div className="flex flex-col">
                                        {item.submenu.map(sub => (
                                            <NavLink
                                                key={sub.text}
                                                to={sub.path}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive ? activeStyle : notActiveStyle,
                                                        ' pl-10'
                                                    )
                                                }
                                            >
                                                {sub.text}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export default MemberSideBar;
