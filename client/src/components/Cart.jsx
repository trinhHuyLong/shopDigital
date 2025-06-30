import React from 'react';
import { ImBin } from 'react-icons/im';
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { showCart } from '../redux/app/appSlice';
import { formatMoney } from '../utils/helper';
import { apiRemoveCart } from '../apis';
import { toast } from 'react-toastify';
import { getCurrent } from '../redux/user/asyncAction';
import { useNavigate } from 'react-router-dom';
import path from '../utils/path';
import clsx from 'clsx';

const Cart = ({ isClosing, setIsClosing }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { current } = useSelector(state => state.user);
    const romoveCart = async pid => {
        const response = await apiRemoveCart(pid);
        if (response.success) {
            toast.success('Remove success');
            dispatch(getCurrent());
        } else toast.error('Remove fail');
    };
    return (
        <div
            onClick={e => e.stopPropagation()}
            className={clsx(
                'fixed top-0 bottom-0 right-0 lg:w-[400px] w-[85%] h-screen bg-black grid grid-rows-10 text-white p-6',
                isClosing ? 'animate-slide-left1' : 'animate-slide-right1'
            )}
        >
            <header className="py-4 border-b border-gray-500 row-span-1 h-full flex justify-between items-center font-bold text-2xl">
                <span>Your cart</span>
                <span
                    onClick={() => {
                        setIsClosing(true);
                        setTimeout(() => {
                            dispatch(showCart());
                            setIsClosing(false);
                        }, 500);
                    }}
                    className="cursor-pointer"
                >
                    <IoCloseCircle size={24} />
                </span>
            </header>
            <section className="row-span-6 gap-3 flex flex-col h-full max-h-full overflow-y-auto">
                {current?.cart?.length === 0 && (
                    <span className="text-xs italic">Your cart is empty</span>
                )}
                {current?.cart?.length !== 0 &&
                    current?.cart?.map(el => (
                        <div key={el._id} className="flex gap-2 mt-4 justify-between">
                            <div className="flex gap-5">
                                <img src={el?.product?.thumb} className="w-16 h-16 object-cover" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-main">{el?.product?.title}</span>
                                    <span className="text-[10px]">Quantity: {el?.quantity}</span>
                                    <span className="text-sm">
                                        {formatMoney(el?.product?.price)} VND
                                    </span>
                                </div>
                            </div>
                            <span
                                onClick={() => romoveCart(el.product?._id)}
                                className="p-2 rounded-full hover:bg-gray-700 cursor-pointer h-8 w-8"
                            >
                                <ImBin size={20} />
                            </span>
                        </div>
                    ))}
            </section>
            <div className="row-span-3 h-full flex flex-col gap-3">
                <div className="flex justify-between items-center my-4 pt-4 border-t">
                    <span>Subtotal:</span>
                    <span className="text-sm">
                        {formatMoney(
                            current?.cart?.reduce(
                                (sum, el) => sum + Number(el?.product?.price) * el?.quantity,
                                0
                            )
                        ) + ' '}
                        VND
                    </span>
                </div>
                <span className="text-center text-gray-700 text-xs italic">
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <button
                    onClick={() => {
                        navigate(`/${path.MEMBER}/${path.MY_CART}`);
                        dispatch(showCart());
                    }}
                    className="bg-main w-full py-2 mt-4 hover:opacity-80"
                >
                    Shopping cart
                </button>
            </div>
        </div>
    );
};

export default Cart;
