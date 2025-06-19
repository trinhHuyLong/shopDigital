import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { InputForm, Select, Loading, MarkdownEditor } from '../../components';
import { validate, fileToBase64 } from '../../utils/helper';
import { apiCreateProduct } from '../../apis/product';
import { showModal } from '../../redux/app/appSlice';

const CreateProduct = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.app);
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const {
        register,
        formState: { errors },
        reset,
        watch,
        handleSubmit,
    } = useForm();
    const handleCreateProduct = async data => {
        const invalids = validate(setInvalidFields);
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(el => el._id === data.category)?.title;
            }
            const formData = new FormData();
            const finalPayload = { ...data };
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0]);
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append('images', image);
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiCreateProduct(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success('Create product successful');
                reset();
                setPreview({
                    thumb: null,
                    images: [],
                });
            } else {
                toast.error('Create product error');
            }
        }
    };

    const handlePreviewthumb = async file => {
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setPreview(prev => ({ ...prev, thumb: base64 }));
            } catch (err) {
                console.error('Error converting file:', err);
            }
        }
    };

    const handlePreviewImages = async files => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpg') {
                toast.warning('File not supported');
                return;
            } else {
                const base64 = await fileToBase64(file);
                imagesPreview.push({ name: file.name, path: base64 });
            }
        }
        if (imagesPreview.length > 0) setPreview(prev => ({ ...prev, images: imagesPreview }));
    };

    useEffect(() => {
        if (watch('thumb')) {
            handlePreviewthumb(watch('thumb')[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
        handlePreviewImages(watch('images'));
    }, [watch('images')]);

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex items-center justify-between text-3xl font-bold px-4 border-b">
                <span>Create New Product</span>
            </h1>
            <div className="p-4">
                <form action="" onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm
                        lable="Name product"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{ required: 'Need fill this field' }}
                        fullWidth
                        placeholder="Name of new product"
                    />
                    <div className="w-full flex gap-4 my-4">
                        <InputForm
                            lable="Price"
                            register={register}
                            errors={errors}
                            id="price"
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder="Price of new product"
                            type="number"
                            style="flex-auto"
                        />
                        <InputForm
                            lable="Quantity"
                            register={register}
                            errors={errors}
                            id="quantity"
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder="Quantity of new product"
                            type="number"
                            style="flex-auto"
                        />
                    </div>
                    <div className="w-full flex gap-4 my-4">
                        <Select
                            lable="Categories"
                            options={categories?.map(el => ({ code: el._id, value: el.title }))}
                            register={register}
                            errors={errors}
                            id="category"
                            validate={{ required: 'Need fill this field' }}
                            style="flex-auto"
                            fullWidth
                        />

                        <Select
                            lable="Brand (Optional)"
                            options={categories
                                ?.find(el => el._id === watch('category'))
                                ?.brand?.map(el => ({ code: el, value: el }))}
                            register={register}
                            errors={errors}
                            id="brand"
                            style="flex-auto"
                            fullWidth
                        />
                    </div>
                    <MarkdownEditor
                        lable="Description"
                        register={register}
                        errors={errors}
                        id="description"
                        validate={{ required: 'Need fill this field' }}
                        fullWidth
                        placeholder="Description of new product"
                        type="text"
                        style="flex-auto"
                    />
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="thumb">
                            Upload thumb
                        </label>
                        <input
                            type="file"
                            id="thumb"
                            {...register('thumb', { required: 'Need fill' })}
                        />
                        {errors['thumb'] && ( // Sử dụng name thay vì id
                            <span className="mt-1 text-red-500 text-xs ">
                                {errors['thumb']?.message}
                            </span>
                        )}
                    </div>
                    {preview.thumb && (
                        <div className="my-4">
                            <img src={preview.thumb} className="h-[150px] object-contain" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="images">
                            Upload images of product
                        </label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            {...register('images', { required: 'Need fill' })}
                        />
                        {errors['images'] && ( // Sử dụng name thay vì id
                            <span className="mt-1 text-red-500 text-xs ">
                                {errors['images']?.message}
                            </span>
                        )}
                    </div>
                    {preview?.images.length > 0 && (
                        <div className="my-4 flex w-full gap-3 flex-wrap">
                            {preview?.images?.map((el, i) => (
                                <div key={i} className="w-fit relative">
                                    <img src={el.path} className="h-[150px] object-contain" />
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-main text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 mt-8"
                    >
                        Create New Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
