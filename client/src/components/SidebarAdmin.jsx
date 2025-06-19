import React, { Fragment, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import clsx from 'clsx';

import logo from '../assets/logo.png';
import { adminSidebar } from '../utils/constants.jsx';

const activeStyle = 'bg-blue-700 text-white rounded-md px-4 py-2 font-medium shadow';
const notActiveStyle =
    'text-gray-700 px-4 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700';

const SidebarAdmin = () => {
    const [open, setOpen] = useState([]);

    const handleSetOpen = id => {
        setOpen(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    };

    return (
        <div className="h-full bg-white shadow-md py-6 px-4 w-64">
            <div className="flex flex-col items-center gap-2 mb-6">
                <Link to="/">
                    <img src={logo} alt="logo" className="w-[160px] object-contain" />
                    <p className="text-sm text-gray-600 mt-2">Admin workspace</p>
                </Link>
            </div>

            <div className="flex flex-col gap-1 text-sm">
                {adminSidebar.map(item => (
                    <Fragment key={item.id}>
                        {item.type === 'single' && (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        isActive ? activeStyle : notActiveStyle,
                                        'flex items-center gap-2'
                                    )
                                }
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.text}</span>
                            </NavLink>
                        )}

                        {item.type === 'parent' && (
                            <div className="flex flex-col">
                                <div
                                    className="flex items-center justify-between cursor-pointer px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition"
                                    onClick={() => handleSetOpen(item.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                    {open.includes(item.id) ? (
                                        <AiOutlineCaretDown />
                                    ) : (
                                        <AiOutlineCaretRight />
                                    )}
                                </div>

                                {open.includes(item.id) && (
                                    <div className="flex flex-col ml-6 mt-1 gap-1">
                                        {item.submenu.map(sub => (
                                            <NavLink
                                                key={sub.text}
                                                to={sub.path}
                                                onClick={e => e.stopPropagation()}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive ? activeStyle : notActiveStyle,
                                                        'text-sm pl-2'
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

export default SidebarAdmin;
