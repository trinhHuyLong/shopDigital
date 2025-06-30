import { Link, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineLogout } from 'react-icons/hi';
import Swal from 'sweetalert2';

import { getCurrent } from '../redux/user/asyncAction';
import { logout, clearMessage } from '../redux/user/userSlice';

const TopHeader = () => {
    const ditpatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, current, mes } = useSelector(state => state.user);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoggedIn) {
                ditpatch(getCurrent());
            }
        }, 300);
        return () => {
            clearTimeout(timeout);
        };
    }, [ditpatch, isLoggedIn]);

    useEffect(() => {
        if (mes) {
            Swal.fire('Oops!', mes, 'info').then(() => {
                ditpatch(clearMessage());
                navigate(`/${path.LOGIN}`);
            });
        }
    }, [mes]);

    return (
        <div className="hidden md:flex w-full h-[38px] bg-main justify-center items-center text-white text-xs">
            <div className="w-main flex justify-between">
                <div className="flex items-center">
                    <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                </div>
                <div>
                    {isLoggedIn && current ? (
                        <small className="flex gap-2 text-sm items-center">
                            {`Wellcome, ${current?.name}`}
                            <span
                                onClick={() => ditpatch(logout())}
                                className="hover:rounded-full hover:bg-gray-200 p-2 hover:text-main cursor-pointer"
                            >
                                <HiOutlineLogout size={18} />
                            </span>
                        </small>
                    ) : (
                        <Link to={path.LOGIN} className="hover:text-gray-800">
                            Sign in or create an account
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
