import { MdLocalPhone } from 'react-icons/md';
import { TbMailFilled } from 'react-icons/tb';
import { GiShoppingBag } from 'react-icons/gi';
import { MdOutlineMenu } from 'react-icons/md';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchSharp } from 'react-icons/io5';
import { IoCloseSharp } from 'react-icons/io5';
import { logout } from '../redux/user/userSlice';
import clsx from 'clsx';

import path from '../utils/path';
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { showCart } from '../redux/app/appSlice';
import defaultAvatar from '../assets/avatarDefault.svg';
import { navigation } from '../utils/constants';

const Header = () => {
    const ditpatch = useDispatch();
    const location = useLocation();
    const { isLoggedIn, current, mes } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isShowOption, setIsShowOption] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [search, setSearch] = useState('');

    const handleCloseMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsShowMenu(false);
            setIsClosing(false);
        }, 500);
    };
    const handleSearch = () => {
        if (search) {
            handleCloseMenu();
            navigate(`/products?title=${search.trim()}`);
        }
    };
    useEffect(() => {
        const handleClickOutOption = e => {
            const profile = document.getElementById('profile');
            if (!profile?.contains(e.target)) setIsShowOption(false);
        };

        document.addEventListener('click', handleClickOutOption);
        return () => {
            document.removeEventListener('click', handleClickOutOption);
        };
    }, []);
    useEffect(() => {
        handleCloseMenu();
    }, [location.pathname]);
    return (
        <>
            <div className="hidden lg:flex w-main justify-between h-[110px] py-[35px]">
                <Link to={path.HOME}>
                    <img src={logo} alt="logo" className="w-[234px] object-contain" />
                </Link>
                <div className="flex text-[13px]">
                    <div className="flex flex-col items-center px-6 border-r">
                        <span className="flex gap-4 items-center">
                            <MdLocalPhone color="red" />
                            <span className="font-semibold">(+1800) 000 8808</span>
                        </span>
                        <span>Mon-Sat 9:00AM - 8:00PM</span>
                    </div>
                    <div className="flex flex-col items-center  px-6 border-r">
                        <span className="flex gap-4 items-center">
                            <TbMailFilled color="red" />
                            <span className="font-semibold">support@tadathemes.com</span>
                        </span>
                        <span>Online Support 24/7</span>
                    </div>
                    {current && (
                        <>
                            <div
                                onClick={() => dispatch(showCart())}
                                className="flex  items-center justify-center gap-2 px-6 border-r cursor-pointer"
                            >
                                <GiShoppingBag color="red" />
                                <span>{`${current?.cart?.length || 0} Item(s)`}</span>
                            </div>
                            <div
                                onClick={() => setIsShowOption(!isShowOption)}
                                className="flex items-center justify-center px-6 border-r gap-2 cursor-pointer relative"
                                id="profile"
                            >
                                <img
                                    src={current?.avatar || defaultAvatar}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span>{current?.name}</span>
                                {isShowOption && (
                                    <div
                                        onClick={e => e.stopPropagation()}
                                        className="absolute flex flex-col top-full left-[16px] bg-gray-100 min-w-[150px] py-2"
                                    >
                                        <Link
                                            className="p-2 hover:bg-sky-100 w-full"
                                            to={`/${path.MEMBER}/${path.PERSIONAL}`}
                                        >
                                            Personal
                                        </Link>
                                        {current.role === 'admin' && (
                                            <Link
                                                className="p-2 hover:bg-sky-100 w-full"
                                                to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                            >
                                                Admin workspace
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-between w-full px-3 pt-5 items-center lg:hidden">
                <div onClick={() => setIsShowMenu(!isShowMenu)}>
                    <MdOutlineMenu size={28} />
                </div>
                <div>
                    <Link to={path.HOME}>
                        <img src={logo} alt="logo" className="w-[234px] object-contain" />
                    </Link>
                </div>
                <div onClick={() => dispatch(showCart())}>
                    <GiShoppingBag size={28} />
                </div>
            </div>
            {isShowMenu && (
                <div
                    className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-50"
                    onClick={handleCloseMenu}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className={clsx(
                            'absolute top-0 left-0 w-[250px] bottom-0 bg-[#1c1d1d] text-white z-50',
                            isClosing ? 'animate-slide-left' : 'animate-slide-right'
                        )}
                    >
                        <div className="flex justify-end px-2 pt-2">
                            <div onClick={handleCloseMenu}>
                                <IoCloseSharp size={24} />
                            </div>
                        </div>
                        <div className="px-3">
                            {isLoggedIn && current ? (
                                <small className="flex gap-2 text-sm items-center">
                                    <Link
                                        className="p-2 hover:bg-sky-100 w-full flex gap-2 items-center"
                                        to={`/${path.MEMBER}/${path.PERSIONAL}`}
                                    >
                                        <img
                                            src={current?.avatar || defaultAvatar}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{current?.name}</span>
                                    </Link>
                                    <span
                                        onClick={() => ditpatch(logout())}
                                        className="px-2 py-1 bg-red-500"
                                    >
                                        Logout
                                    </span>
                                </small>
                            ) : (
                                <Link to={path.LOGIN} className="bg-red-500 px-2 py-1">
                                    Login or Signup
                                </Link>
                            )}
                        </div>
                        <div className="flex justify-center w-full py-4">
                            <div className="flex h-[45px] align-center w-[90%]">
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="px-2 w-[80%] h-full bg-[#ffffff1a] outline-none"
                                    placeholder="Search something"
                                />
                                <div
                                    onClick={handleSearch}
                                    className="h-full flex items-center w-[20%] justify-center bg-[#ffffff1a]"
                                >
                                    <IoSearchSharp size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col px-3 gap-3">
                            {navigation.map(item => {
                                return (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            isActive ? 'pr-12 text-main' : 'pr-12 hover:text-main'
                                        }
                                    >
                                        {item.value}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
