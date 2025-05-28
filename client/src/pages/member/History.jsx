import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import clsx from 'clsx';

import { apiGetOder } from '../../apis';
import { formatMoney } from '../../utils/helper';

const History = () => {
    const [orders, setOrders] = React.useState([]);

    const fetchOrders = async () => {
        const response = await apiGetOder();
        if (response.success) {
            setOrders(response.rs);
        } else {
            console.error('Failed to fetch orders:', response.rs);
        }
    };

    console.log('Orders:', orders);

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="w-full flex flex-col justify-center mb-3 p-10">
            <div className="bg-gray-100 mb-7">
                <div className="w-full h-[81px] flex items-center mx-auto p-5 justify-between">
                    <div className="flex flex-col gap-2 ">
                        <h3 className="font-semibold uppercase">My history</h3>
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
            {orders?.length === 0 && <h3>You have not purchased any products yet.</h3>}
            {orders?.length > 0 &&
                orders.map((el, index) => (
                    <div key={el._id} className="bg-gray-100 w-full border font-bold mb-5 mx-auto">
                        <div className="w-full px-4 flex justify-between py-4 border-b">
                            <div className="font-medium text-[12px]">
                                Order at: <span>{moment(el.createdAt).format('DD/MM/YYYY')}</span>
                            </div>
                            <div className="font-semibold text-[12px]">
                                Status:
                                <span className="font-medium text-[12px]">{' ' + el.status}</span>
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
                                        'hover:opacity-80 w-full grid grid-cols-10 font-semibold text-sm mx-2 py-4',
                                        idx !== el.products.length - 1 && 'border-b'
                                    )}
                                >
                                    <img
                                        src={item?.product?.thumb}
                                        className="w-20 h-20 object-cover col-span-1"
                                    />
                                    <div className="flex items-center gap-1 col-span-5">
                                        <span className="text-sm text-main">
                                            {item?.product?.title}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        Quantity: <span>{item?.count}</span>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        Price:{' '}
                                        <span>
                                            {formatMoney(item?.count * item?.product?.price)} VND
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
    );
};

export default History;
