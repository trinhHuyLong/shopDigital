import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { InputForm, Loading } from '../../components';
import { validate, fileToBase64 } from '../../utils/helper';
import { showModal } from '../../redux/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { apiUpdateCategory } from '../../apis';
import { getCategories } from '../../redux/app/asyncAction';

const UpdateCategory = ({ editCategory, setEditCategory }) => {
    const dispatch = useDispatch();
    const [preview, setPreview] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);

    const {
        register,
        formState: { errors },
        reset,
        watch,
        handleSubmit,
    } = useForm();

    const handleUpdateCategory = async data => {
        const invalids = validate(setInvalidFields);
        if (invalids === 0) {
            const formData = new FormData();
            const finalPayload = { ...data };

            formData.append('title', finalPayload.title);
            formData.append('brand', finalPayload.brand);

            // Nếu user chọn ảnh mới thì append
            if (finalPayload?.image && finalPayload.image.length > 0) {
                formData.append('image', finalPayload.image[0]);
            }

            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiUpdateCategory(formData, editCategory._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));

            if (response.success) {
                toast.success('Update category successful');
                reset();
                setPreview('');
                dispatch(getCategories());
                setEditCategory(null);
            } else {
                toast.error('Update category error');
            }
        }
    };

    const handlePreviewImage = async file => {
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setPreview(base64);
            } catch (err) {
                console.error('Error converting file:', err);
            }
        }
    };

    // Preview ảnh khi người dùng chọn ảnh mới
    useEffect(() => {
        const imageWatch = watch('image');
        if (imageWatch && imageWatch.length > 0) {
            handlePreviewImage(imageWatch[0]);
        }
    }, [watch('image')]);

    // Load dữ liệu ban đầu khi có category để edit
    useEffect(() => {
        if (editCategory) {
            reset({
                title: editCategory?.title || '',
                brand: editCategory?.brand?.join('. ') || '',
            });
            setPreview(editCategory?.image || '');
        }
    }, [editCategory]);

    return (
        <div>
            <div className="p-4 border-b w-full flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Update Category</h1>
                <span
                    className="bg-main rounded-md px-4 hover:opacity-80 cursor-pointer py-2 text-white"
                    onClick={() => setEditCategory(null)}
                >
                    Cancel
                </span>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateCategory)}>
                    <InputForm
                        lable="Name category"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{ required: 'Need fill this field' }}
                        fullWidth
                        placeholder="Name of category"
                    />
                    <div className="w-full flex gap-4 my-4">
                        <InputForm
                            lable="Brand"
                            register={register}
                            errors={errors}
                            id="brand"
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder="Brand of category"
                            type="text"
                            style="flex-auto"
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="image">
                            Upload image
                        </label>
                        <input type="file" id="image" {...register('image')} accept="image/*" />
                        {errors?.image && (
                            <span className="mt-1 text-red-500 text-xs">
                                {errors.image.message}
                            </span>
                        )}
                    </div>
                    {preview && (
                        <div className="my-4">
                            <img src={preview} className="h-[150px] object-contain" alt="preview" />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-main text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 mt-8"
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
