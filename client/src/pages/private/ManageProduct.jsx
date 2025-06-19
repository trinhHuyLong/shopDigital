import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, createSearchParams, useNavigate, useLocation } from 'react-router-dom';

import { InputForm, Pagination } from '../../components';
import { apiGetProducts, apiDeleteProduct } from '../../apis/product';
import useDebounce from '../../hooks/useDebounce';
import UpdateProduc from './UpdateProduc';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ManageProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [product, setProduct] = useState(null);
    const [count, setCount] = useState(0);
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();
    const handleSearchProduct = data => {
        console.log(data);
    };

    const render = useCallback(() => {
        setUpdate(!update);
    });
    const fetchProduct = async params => {
        const response = await apiGetProducts(params);
        if (response.success) {
            setProduct(response.products);
            setCount(response.counts);
        }
    };

    const queryDebounce = useDebounce(watch('search'), 800);

    const handleDeleteProduct = id => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Are you sure remove this product',
            icon: 'warning',
            showCancelButton: true,
        }).then(async rs => {
            if (rs.isConfirmed) {
                const response = await apiDeleteProduct(id);
                if (response.success) {
                    toast.success('Delete successfull');
                    render();
                } else toast.error('Delete fail');
            }
        });
    };

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchProduct({ ...searchParams, q: queryDebounce, limit: 12 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [params, update]);

    useEffect(() => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ q: queryDebounce, page: 1 }).toString(),
        });
    }, [queryDebounce]);

    return (
        <div className="w-full flex flex-col relative">
            {editProduct && (
                <div className="absolute inset-0 bg-gray-100 min-h-screen">
                    <UpdateProduc
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}

            <div className="p-4 border-b w-full flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage Product</h1>
            </div>
            <div className="flex w-full justify-end items-center p-4">
                <form className="w-full" onSubmit={handleSubmit(handleSearchProduct)}>
                    <InputForm
                        id="search"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder={'Search product by title, description ...'}
                    />
                </form>
            </div>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md">
                    <div className="overflow-auto rounded-lg shadow">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Thumb</th>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Brand</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Quantity</th>
                                    <th className="px-4 py-3">Sold</th>
                                    <th className="px-4 py-3">Ratings</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {product &&
                                    product?.map((el, id) => (
                                        <tr className="hover:bg-gray-50" key={el._id}>
                                            <td className="px-4 py-3">
                                                {!params.get('page')
                                                    ? id + 1
                                                    : (+params.get('page') - 1) * 12 + id + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <img
                                                    src={el?.thumb}
                                                    className="w-12 h-12 rounded object-cover"
                                                    alt="Product"
                                                />
                                            </td>
                                            <td className="px-4 py-3">{el.title}</td>
                                            <td className="px-4 py-3">{el.brand}</td>
                                            <td className="px-4 py-3">{el.category}</td>
                                            <td className="px-4 py-3">{el.price}</td>
                                            <td className="px-4 py-3">{el.quantity}</td>
                                            <td className="px-4 py-3">{el.sold}</td>
                                            <td className="px-4 py-3">{el.totalRatings}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditProduct(el)}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={handleDeleteProduct}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center my-8">
                <Pagination totalCount={count} page={params.get('page')} />
            </div>
        </div>
    );
};

export default ManageProduct;
