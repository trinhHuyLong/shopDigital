import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { apiUpdateProduct } from '../../apis/product';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { InputForm, MarkdownEditor, Select, Loading } from '../../components';
import { validate, fileToBase64 } from '../../utils/helper';
import { showModal } from '../../redux/app/appSlice';

const UpdateProduc = ({ editProduct, render, setEditProduct }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.app);
    const {
        register,
        formState: { errors },
        reset,
        watch,
        handleSubmit,
        setValue,
    } = useForm();
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [invalidFields, setInvalidFields] = useState([]);
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

    const handleCreateProduct = async data => {
        const invalids = validate(setInvalidFields);
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(
                    el => el.title.toLowerCase() === data.category.toLowerCase()
                )?.title;
            }
            const formData = new FormData();
            const finalPayload = { ...data };
            console.log(finalPayload);
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload?.thumb) {
                formData.delete('thumb');
                formData.append('thumb', finalPayload.thumb[0]);
            } else {
                formData.delete('thumb');
                console.log(preview?.thumb);
                formData.append('thumb', preview?.thumb);
            }
            if (finalPayload.images) {
                console.log(1);
                formData.delete('images');
                for (let image of finalPayload.images) formData.append('images', image);
            } else {
                console.log(preview?.images);
                formData.delete('images');
                if (preview?.images?.length > 0) {
                    preview.images.forEach(img => {
                        formData.append('images', img.path);
                    });
                }
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiUpdateProduct(formData, editProduct._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success('Create product successful');
                reset();
                setPreview({
                    thumb: null,
                    images: [],
                });
                setEditProduct(null);
            } else {
                toast.error('Create product error');
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
        reset({
            title: editProduct?.title,
            price: editProduct?.price,
            quantity: editProduct?.quantity,
            category: editProduct?.category.toLowerCase(),
            brand: editProduct?.brand?.toLowerCase(),
            description: editProduct?.description?.join('. '),
        });

        setPreview({
            thumb: editProduct?.thumb || '',
            images:
                editProduct?.images.map(el => ({
                    path: el,
                })) || [],
        });
    }, [editProduct]);

    useEffect(() => {
        if (watch('images')) {
            handlePreviewImages(watch('images'));
        }
    }, [watch('images')]);

    return (
        <div className="w-full flex flex-col relative">
            <div className="p-4 border-b w-full flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Update Product</h1>
                <span
                    className="bg-main rounded-md px-4 hover:opacity-80 cursor-pointer py-2 text-white"
                    onClick={() => setEditProduct(null)}
                >
                    Cancel
                </span>
            </div>
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
                            options={categories?.map(el => ({
                                code: el.title?.toLowerCase(),
                                value: el.title,
                            }))}
                            register={register}
                            errors={errors}
                            id="category"
                            validate={{ required: 'Need fill this field' }}
                            style="flex-auto"
                            fullWidth
                        />

                        {watch('category') && (
                            <Select
                                lable="Brand (Optional)"
                                options={categories
                                    ?.find(
                                        el =>
                                            el.title?.toLowerCase() ===
                                            watch('category')?.toLowerCase()
                                    )
                                    ?.brand?.map(el => ({
                                        code: el.toLowerCase(),
                                        value: el,
                                    }))}
                                register={register}
                                errors={errors}
                                id="brand"
                                style="flex-auto"
                                fullWidth
                            />
                        )}
                    </div>
                    <InputForm
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
                        <input type="file" id="thumb" {...register('thumb')} />
                        {errors['thumb'] && ( // Sử dụng name thay vì id
                            <span className="mt-1 text-red-500 text-xs ">
                                {errors['thumb']?.message}
                            </span>
                        )}
                    </div>
                    {preview.thumb && (
                        <div className="my-4">
                            <img src={preview.thumb} className="h-[150px] object-contain border" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="images">
                            Upload images of product
                        </label>
                        <input type="file" id="images" multiple {...register('images')} />
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
                                    <img
                                        src={el.path}
                                        className="h-[150px] object-contain border"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-main text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 mt-8"
                    >
                        Update New Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduc;
