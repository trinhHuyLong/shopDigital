import { MdLocalPhone } from 'react-icons/md';
import { TbMailFilled } from 'react-icons/tb';
import { GiShoppingBag } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import path from '../utils/path';
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { showCart } from '../redux/app/appSlice';
import defaultAvatar from '../assets/avatarDefault.svg';

const Header = () => {
    const dispatch = useDispatch();
    const [isShowOption, setIsShowOption] = useState(false);
    const { current } = useSelector(state => state.user);
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
    return (
        <div className="w-main flex justify-between h-[110px] py-[35px]">
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
                            className="flex  items-center justify-center px-6 border-r gap-2 cursor-pointer relative"
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
    );
};

export default Header;
