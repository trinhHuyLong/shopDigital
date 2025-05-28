import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { InputForm, Select, Loading } from '../../components';
import { validate, fileToBase64 } from '../../utils/helper';
import { showModal } from '../../redux/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { apiCreateCategory } from '../../apis';

const CreateCategory = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.app);
    const [preview, setPreview] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);

    const {
        register,
        formState: { errors },
        reset,
        watch,
        handleSubmit,
    } = useForm();

    const handleCreateCategory = async data => {
        const invalids = validate(setInvalidFields);
        if (invalids === 0) {
            const formData = new FormData();
            const finalPayload = { ...data };
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1]);
            }
            if (finalPayload.image) formData.append('image', finalPayload.image[0]);
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiCreateCategory(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success('Create category successful');
                reset();
                setPreview('');
            } else {
                toast.error('Create category error');
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

    useEffect(() => {
        if (watch('image')) {
            handlePreviewImage(watch('image')[0]);
        }
    }, [watch('image')]);
    return (
        <div>
            <div className="p-4 border-b w-full flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage Category</h1>
            </div>
            <div className="p-4">
                <form action="" onSubmit={handleSubmit(handleCreateCategory)}>
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
                            placeholder="Brand of new category"
                            type="text"
                            style="flex-auto"
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-8">
                        <label className="font-semibold" htmlFor="image">
                            Upload image
                        </label>
                        <input
                            type="file"
                            id="image"
                            {...register('image', { required: 'Need fill' })}
                        />
                        {errors['image'] && ( // Sử dụng name thay vì id
                            <span className="mt-1 text-red-500 text-xs ">
                                {errors['image']?.message}
                            </span>
                        )}
                    </div>
                    {preview && (
                        <div className="my-4">
                            <img src={preview} className="h-[150px] object-contain" />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-main text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 mt-8"
                    >
                        Create New Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
