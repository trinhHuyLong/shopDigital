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
            <table>
                <thead>
                    <tr className="border bg-sky-900 text-white  border-gray-700 py-2">
                        <th className="py-2 pl-2 text-left">#</th>
                        <th className="py-2 text-left">Thumb</th>
                        <th className="py-2 text-left">Title</th>
                        <th className="py-2 text-left">Brand</th>
                        <th className="py-2 text-left">Category</th>
                        <th className="py-2 text-left">Price</th>
                        <th className="py-2 text-left">Quantity</th>
                        <th className="py-2 text-left">Sold</th>
                        <th className="py-2 text-left">Ratings</th>
                        <th className="py-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {product?.map((el, id) => (
                        <tr key={id}>
                            <td className="py-2 pl-2">
                                {!params.get('page')
                                    ? id + 1
                                    : (+params.get('page') - 1) * 12 + id + 1}
                            </td>
                            <td className="py-2">
                                <img src={el.thumb} className="w-12 h-12 object-cover" />
                            </td>
                            <td className="py-2">{el.title}</td>
                            <td className="py-2">{el.brand}</td>
                            <td className="py-2">{el.category}</td>
                            <td className="py-2">{el.price}</td>
                            <td className="py-2">{el.quantity}</td>
                            <td className="py-2">{el.sold}</td>
                            <td className="py-2">{el.totalRatings}</td>
                            <td>
                                <span
                                    onClick={() => setEditProduct(el)}
                                    className="text-blue-500 hover:underline cursor-pointer px-1"
                                >
                                    Edit
                                </span>
                                <span
                                    onClick={() => handleDeleteProduct(el._id)}
                                    className="text-blue-500 hover:underline cursor-pointer px-1"
                                >
                                    Remove
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-center my-8">
                <Pagination totalCount={count} page={params.get('page')} />
            </div>
        </div>
    );
};

export default ManageProduct;
