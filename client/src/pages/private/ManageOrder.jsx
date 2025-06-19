import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { apiGetOders, apiUpdateStatus, apiUpdateProduct } from '../../apis';
import { useEffect } from 'react';
import { formatMoney } from '../../utils/helper';
import { toast } from 'react-toastify';

const ManageOrder = () => {
    const [orders, setOrders] = React.useState([]);
    const fetchOrders = async () => {
        const response = await apiGetOders();
        if (response.success) {
            setOrders(response.rs);
        } else {
            console.error('Failed to fetch orders:', response.rs);
        }
    };

    const handleOrder = async (id, status, products) => {
        // Nếu cập nhật số lượng sản phẩm khi đơn hàng thành công
        if (status === 'Successed') {
            await Promise.all(
                products.map(el => {
                    const quantity = el.product.quantity - el.count;
                    const sold = el.product.sold + el.count;
                    console.log(quantity);
                    // Cập nhật đúng id sản phẩm
                    return apiUpdateProduct({ quantity, sold }, el.product._id);
                })
            );
        }

        const response = await apiUpdateStatus(id, status);
        if (response.success) {
            toast.success('Change status order success');
            fetchOrders();
        } else {
            toast.error('Change status order fail');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    return (
        <div>
            <h1 className="h-[75px] flex items-center justify-between px-4 text-3xl font-bold border-b">
                Manege orders
            </h1>
            <div className="p-4">
                {orders?.length === 0 && <h3 className="text-center mt-5">No orders found.</h3>}
                {orders?.length > 0 &&
                    orders.map(el => (
                        <div key={el._id} className="bg-white w-full border font-bold mb-5 mx-auto">
                            <div className="w-full px-4 py-4 border-b flex items-center justify-between bg-gray-300">
                                <div className="flex gap-2 items-center">
                                    <img
                                        src={el.orderBy?.avatar}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span>{el?.orderBy?.name}</span>
                                        <span className="text-[12px] font-normal">
                                            {el?.orderBy?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <div className="flex justify-end">
                                        <div className="font-medium text-[12px]">
                                            Order at:{' '}
                                            <span>{moment(el.createdAt).format('DD/MM/YYYY')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="font-medium text-[12px]">
                                            Status:
                                            <span className=" font-medium text-[12px]">
                                                {' ' + el.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {el.products.map((item, idx) => (
                                <div
                                    key={idx}
                                    className=" w-full flex items-center gap-3 my-3 px-4"
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
                                                {formatMoney(item?.count * item?.product?.price)}{' '}
                                                VND
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                            <div className="w-full px-4 py-4 border-t text-[16px] bg-yellow-100">
                                <div className=" flex justify-end ">
                                    <div className="font-semibold ">
                                        Total price:
                                        <span className="font-medium text-main">
                                            {' ' + formatMoney(el.total)} VND
                                        </span>
                                    </div>
                                </div>

                                {el?.status !== 'Cancelled' && el?.status !== 'Successed' && (
                                    <div className=" flex justify-end mt-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleOrder(el._id, 'Cancelled')}
                                                className="bg-main px-4 py-2 hover:opacity-80 text-white rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleOrder(el._id, 'Successed', el?.products)
                                                }
                                                className="bg-main px-4 py-2 hover:opacity-80 text-white rounded-md"
                                            >
                                                Successful
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ManageOrder;
