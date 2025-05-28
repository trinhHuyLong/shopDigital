import React, { Fragment, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import clsx from 'clsx';

import logo from '../assets/logo.png';
import { adminSidebar } from '../utils/constants.jsx';

const activeStyle = 'px-4 py-2 flex items-center gap-2  bg-main text-white';
const notActiveStyle =
    'px-4 py-2 flex items-center gap-2  hover:bg-main hover:opacity-80 hover:text-white';

const SidebarAdmin = () => {
    const [open, setOpen] = useState([]);
    const handleSetOpen = id => {
        if (open.includes(id)) {
            setOpen(open.filter(num => num !== id));
        } else {
            setOpen([...open, id]);
        }
    };
    return (
        <div className="bg-white h-full py-4 font-sm">
            <div className="flex flex-col items-center justify-center gap-2 py-4">
                <Link to="/">
                    <img src={logo} alt="" className="w-[200px] object-contain" />
                    <div className="flex justify-center pt-2">
                        <small>Admin workspace</small>
                    </div>
                </Link>
            </div>
            <div>
                {adminSidebar.map(item => (
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
                            <div className="flex flex-col  " onClick={() => handleSetOpen(item.id)}>
                                <div className="px-4 py-2 flex items-center justify-between hover:bg-main hover:opacity-80 hover:text-white cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                    {open.includes(item.id) ? (
                                        <AiOutlineCaretDown />
                                    ) : (
                                        <AiOutlineCaretRight />
                                    )}
                                </div>
                                {open.includes(item.id) && (
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

export default SidebarAdmin;
