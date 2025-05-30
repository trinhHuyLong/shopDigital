import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectQuantity } from '../../components';
import { useParams, NavLink, Link } from 'react-router-dom';
import { formatMoney } from '../../utils/helper';
import { apiUpdateCart, apiRemoveCart, apiCreateOder } from '../../apis';
import { toast } from 'react-toastify';
import { getCurrent } from '../../redux/user/asyncAction';
import product from '../../components/product';

const DetailCart = () => {
    const [quantity, setQuantity] = useState({});
    const { current } = useSelector(state => state.user);
    const { category } = useParams();
    const dispatch = useDispatch();
    const handleQuantity = (pid, number) => {
        if (number === '') {
            setQuantity(prev => ({ ...prev, [pid]: '' }));
            return;
        }
        if (number === 0) {
            setQuantity(prev => ({ ...prev, [pid]: number }));
            return;
        }
        if (!Number(number) || number < 0) {
            return;
        }
        setQuantity(prev => ({ ...prev, [pid]: number }));
    };
    const handleUpdateCart = async () => {
        const promises = current?.cart?.map(async el => {
            if (quantity[el._id] !== 0) {
                return apiUpdateCart({
                    pid: el.product?._id,
                    quantity: quantity[el._id],
                });
            } else {
                return apiRemoveCart(el.product?._id);
            }
        });

        const responses = await Promise.all(promises);
        const hasError = responses.some(response => !response.success);

        if (hasError) {
            toast.error('Failed to update cart');
        } else {
            toast.success('Update cart done');
            dispatch(getCurrent());
        }
    };

    const handleCheckOut = async () => {
        const response = await apiCreateOder();
        if (response.success) {
            toast.success('Checkout successful');
            dispatch(getCurrent());
        } else {
            toast.error('Checkout failed');
        }
    };

    useEffect(() => {
        current?.cart?.forEach(el => {
            setQuantity(prev => ({ ...prev, [el._id]: el.quantity }));
        });
    }, []);
    return (
        <div className="w-full flex flex-col justify-center mb-3 p-10">
            <div className="bg-gray-100">
                <div className="w-full h-[81px] flex items-center mx-auto p-5 justify-between">
                    <div className="flex flex-col gap-2 ">
                        <h3 className="font-semibold uppercase">My cart</h3>
                    </div>
                    <div>
                        <NavLink
                            className="px-4 py-2 bg-main text-white cursor-pointer rounded-md hover:opacity-80"
                            to={`/`}
                        >
                            Go home
                        </NavLink>
                    </div>
                </div>
            </div>
            {current?.cart?.length > 0 && (
                <>
                    <div className="w-full grid grid-cols-10 font-bold border my-5 py-3 mx-auto">
                        <div className="col-span-6 w-full pl-5">Products</div>
                        <div className="col-span-3 w-full pl-5">Quantity</div>
                        <div className="col-span-1 w-full pl-5">Price</div>
                    </div>
                    {current?.cart?.map(el => (
                        <div
                            key={el._id}
                            className="w-full border grid grid-cols-10 font-bold my-3 py-3 mx-auto"
                        >
                            <div className="col-span-6 w-full">
                                <Link
                                    to={`/${el?.product?.category?.toLowerCase()}/${
                                        el?.product?._id
                                    }/${el?.product?.title}`}
                                    className="flex gap-2 hover:opacity-80"
                                >
                                    <img
                                        src={el?.product?.thumb}
                                        className="w-28 h-28 object-cover"
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-main">
                                            {el?.product?.title}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-span-3 w-full flex items-center">
                                <SelectQuantity
                                    quantity={quantity[el._id]}
                                    handleQuantity={number => handleQuantity(el._id, number)}
                                />
                            </div>
                            <div className="col-span-1 flex items-center w-full">
                                <span className="text-sm">
                                    {formatMoney(el?.product?.price * quantity[el._id])} VND
                                </span>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 w-full mx-auto flex flex-col justify-center items-end gap-3 border my-3">
                        <span className="flex items-center gap-8 text-sm">
                            <span>Subtotal:</span>
                            <span className="text-main font-bold">
                                {formatMoney(
                                    current?.cart?.reduce(
                                        (sum, el) => sum + el?.product?.price * quantity[el._id],
                                        0
                                    )
                                )}{' '}
                                VND
                            </span>
                        </span>
                        <span>Shipping, taxes, and discounts calculated at checkout</span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleUpdateCart()}
                                className="bg-main text-white px-4 py-2 rounded-md hover:opacity-80"
                            >
                                Update cart
                            </button>
                            <button
                                onClick={handleCheckOut}
                                className="bg-main text-white px-4 py-2 rounded-md hover:opacity-80"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
            {current?.cart?.length === 0 && (
                <div className="text-center py-4">
                    No products in your cart.
                    <Link className="underline pl-2 hover:opacity-80 text-main" to={'/products'}>
                        Go to products page
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DetailCart;
