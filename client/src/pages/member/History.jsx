import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoMdMenu } from 'react-icons/io';
import moment from 'moment';
import clsx from 'clsx';

import { apiGetOder } from '../../apis';
import { formatMoney } from '../../utils/helper';
import { MemberSideBar } from '../../components';

const History = () => {
    const [orders, setOrders] = React.useState([]);
    const [open, setOpen] = useState(false);

    const fetchOrders = async () => {
        const response = await apiGetOder();
        if (response.success) {
            setOrders(response.rs);
        } else {
            console.error('Failed to fetch orders:', response.rs);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="w-full flex flex-col justify-center lg:mb-3 lg:p-10">
            <div className="bg-gray-100 mb-7">
                <div className="w-full h-[81px] flex items-center mx-auto p-5 justify-between">
                    <div className="flex flex-col gap-2 ">
                        <h3 className="font-semibold uppercase hidden lg:block">My history</h3>
                        <div onClick={() => setOpen(!open)} className="lg:hidden">
                            <IoMdMenu size={28} />
                        </div>
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
            {orders?.length === 0 && (
                <h3 className="px-3 lg:px-0">You have not purchased any products yet.</h3>
            )}
            <div className="px-3 lg:px-0">
                {orders?.length > 0 &&
                    orders.map((el, index) => (
                        <div
                            key={el._id}
                            className="bg-gray-100 w-full border font-bold mb-5 mx-auto"
                        >
                            <div className="w-full px-4 flex justify-between py-4 border-b">
                                <div className="font-medium text-[12px]">
                                    Order at:{' '}
                                    <span>{moment(el.createdAt).format('DD/MM/YYYY')}</span>
                                </div>
                                <div className="font-semibold text-[12px]">
                                    Status:
                                    <span className="font-medium text-[12px]">
                                        {' ' + el.status}
                                    </span>
                                </div>
                            </div>
                            {el.products.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-100 w-full flex items-center gap-3 my-3 px-4"
                                >
                                    <Link
                                        to={`/${item?.product?.category?.toLowerCase()}/${
                                            item?.product?._id
                                        }/${item?.product?.title}`}
                                        className={clsx(
                                            'hover:opacity-80 w-full lg:grid flex flex-col lg:flex-row lg:grid-cols-10 font-semibold text-sm mx-2 py-4',
                                            idx !== el.products.length - 1 && 'border-b'
                                        )}
                                    >
                                        <img
                                            src={item?.product?.thumb}
                                            className="lg:w-20 w-14 h-14 lg:h-20 object-cover lg:col-span-1 hidden lg:block"
                                        />
                                        <div className="hidden lg:flex items-center gap-1 lg:col-span-5">
                                            <span className="text-sm text-main">
                                                {item?.product?.title}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center lg:hidden">
                                            <img
                                                src={item?.product?.thumb}
                                                className="lg:w-20 w-14 h-14 lg:h-20 object-cover lg:col-span-1"
                                            />
                                            <div className="flex items-center gap-1 lg:col-span-5">
                                                <span className="text-sm text-main">
                                                    {item?.product?.title}
                                                </span>
                                            </div>
                                            <div className="pl-4 lg:hidden">X {item?.count}</div>
                                        </div>
                                        <div className="lg:col-span-2 hidden lg:flex items-center ">
                                            Quantity: <span>{item?.count}</span>
                                        </div>
                                        <div className="lg:col-span-2 flex items-center justify-end lg:justify-start gap-2">
                                            <span className="text-sm text-gray-500">Price:</span>
                                            <span>
                                                {formatMoney(item?.count * item?.product?.price)}{' '}
                                                VND
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                            <div className="w-full px-4 flex justify-end py-4 border-t text-[16px] bg-yellow-100">
                                <div className="font-semibold ">
                                    Total price:
                                    <span className="font-medium text-main">
                                        {' ' + formatMoney(el.total)} VND
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="w-[327px] h-full bg-white fixed top-0 left-0"
                    >
                        <MemberSideBar handleClose={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
