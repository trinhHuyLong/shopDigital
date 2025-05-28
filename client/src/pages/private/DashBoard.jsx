import { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { apiGetOderInMonth, apiGetOders } from '../../apis';
import { formatMoney } from '../../utils/helper';

const DashBoard = () => {
    const [ordersInMonth, setOrdersInMonth] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // 👈 thêm loading

    const topCustomers = useMemo(() => {
        if (!ordersInMonth || ordersInMonth.length === 0) return [];

        const customerTotals = {};

        ordersInMonth?.forEach(order => {
            console.log(order);
            const id = order.orderBy._id;
            if (!customerTotals[id]) {
                customerTotals[id] = {
                    name: order.orderBy.name,
                    email: order.orderBy.email,
                    avatar: order.orderBy.avatar,
                    total: 0,
                };
            }
            customerTotals[id].total += order.total;
        });

        return Object.values(customerTotals)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [ordersInMonth]);

    const topProducts = useMemo(() => {
        if (!ordersInMonth || ordersInMonth.length === 0) return [];

        const productMap = {};

        ordersInMonth.forEach(order => {
            order.products.forEach(({ product, count }) => {
                const id = product._id;
                if (!productMap[id]) {
                    productMap[id] = {
                        title: product.title,
                        price: product.price,
                        thumb: product.thumb,
                        totalQuantity: 0,
                    };
                }
                productMap[id].totalQuantity += count;
            });
        });

        return Object.values(productMap)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5);
    }, [ordersInMonth]);

    console.log(topProducts);

    const fetchOrders = async () => {
        setLoading(true);
        const [month, all] = await Promise.all([
            apiGetOderInMonth({ status: 'Successed' }),
            apiGetOders({ status: 'Successed' }),
        ]);
        if (month.success && all.success) {
            setOrdersInMonth(month.rs);
            setOrders(all.rs);
        }
        setLoading(false);
    };

    const totalInMonth = useMemo(() => {
        return ordersInMonth?.reduce((rs, el) => rs + el.total, 0);
    }, [ordersInMonth]);

    const total = useMemo(() => {
        return orders?.reduce((rs, el) => rs + el.total, 0);
    }, [orders]);

    useLayoutEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h1 className="h-[75px] flex items-center justify-between px-4 text-3xl font-bold border-b">
                Dashboard
            </h1>
            <div className="p-5">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow animate-pulse h-[100px]" />
                        <div className="bg-white p-6 rounded-2xl shadow animate-pulse h-[100px]" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-2xl shadow">
                                <h2 className="text-lg text-gray-600">Revenue this month</h2>
                                <p className="text-3xl font-semibold text-blue-600 mt-2">
                                    {formatMoney(totalInMonth)} VND
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow">
                                <h2 className="text-lg text-gray-600">Total revenue</h2>
                                <p className="text-3xl font-semibold text-green-600 mt-2">
                                    {formatMoney(total)} VND
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow  mb-10">
                            <h3 className="text-xl font-semibold mb-4">
                                Top customers buy the most in this month
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {topCustomers.map((el, id) => (
                                            <tr key={id}>
                                                <td className="px-4 py-3 flex gap-2 items-center">
                                                    <img
                                                        src={el.avatar}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">
                                                            {el.name}
                                                        </span>
                                                        <span className="text-[14px] font-medium">
                                                            ({el.email})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-blue-600 font-medium">
                                                    {formatMoney(el.total)} VND
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow mb-10">
                            <h3 className="text-xl font-semibold mb-4">
                                Top most purchased products
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {topProducts.map((el, id) => (
                                            <tr key={id}>
                                                <td className="px-4 py-3 flex gap-2 items-center">
                                                    <img
                                                        src={el.thumb}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">
                                                            {el.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-blue-600 font-medium">
                                                    {formatMoney(el.price)} VND
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 font-medium">
                                                    {formatMoney(el.totalQuantity)} unit
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashBoard;
