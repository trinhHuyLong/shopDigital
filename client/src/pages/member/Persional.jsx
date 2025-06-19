import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { InputForm } from '../../components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { apiUpdateCurrent } from '../../apis';
import moment from 'moment';
import avatarDefault from '../../assets/avatarDefault.svg';
import { getCurrent } from '../../redux/user/asyncAction';
import { useState } from 'react';

const Persional = () => {
    const [avatar, setAvatar] = useState('');
    const { current } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleUpdateInfor = async data => {
        const formData = new FormData();
        if (data?.avatar) {
            formData.append('avatar', data.avatar[0]);
        }
        delete data.avatar;

        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1]);
        }
        const response = await apiUpdateCurrent(formData);
        if (response.success) {
            dispatch(getCurrent());
            toast.success(response.mes);
        } else {
            toast.error(response.mes);
        }
    };

    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        watch,
    } = useForm();

    useEffect(() => {
        const file = watch('avatar')?.[0];
        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [watch('avatar')]);
    useEffect(() => {
        reset({
            name: current?.name,
            mobile: current?.mobile,
            avatar: current?.avatar,
        });
        setAvatar(current?.avatar || avatarDefault);
    }, [current]);
    return (
        <div className="w-full relative px-10 py-5">
            <div className="bg-gray-100">
                <div className="w-full h-[81px] flex items-center mx-auto justify-between p-5">
                    <div className="flex flex-col gap-2 ">
                        <h3 className="font-semibold uppercase">Persional</h3>
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
            <form
                onSubmit={handleSubmit(handleUpdateInfor)}
                className="w-full flex flex-col gap-4 mx-auto py-8 "
            >
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4 w-[60%]">
                        <div className="flex gap-4 items-center ">
                            <span className="text-sm font-semibold text-gray-700 py-2">Email:</span>
                            <span className="py-2">{current.email}</span>
                        </div>
                        <InputForm
                            lable="Name"
                            register={register}
                            errors={errors}
                            id="name"
                            validate={{ required: 'Need fill this field' }}
                            fullWidth
                            placeholder="Enter your name..."
                        />

                        <InputForm
                            lable="Phone"
                            register={register}
                            errors={errors}
                            id="mobile"
                            validate={{
                                pattern: {
                                    value: /^(\+84|0)(3|5|7|8|9)\d{8}$/,

                                    message: 'phone number invalid',
                                },
                            }}
                            fullWidth
                            placeholder="Enter your phone..."
                        />
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Accont status:</span>
                            <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Role:</span>
                            <span>{current?.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Created at:</span>
                            <span>{moment(current?.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <div className="flex flex-1 border-l">
                        <div className="flex gap-2 items-center w-full justify-center">
                            <div>
                                <label
                                    htmlFor="file"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <img
                                        src={avatar}
                                        className="w-[200px] h-[200px] object-cover rounded-lg"
                                    />

                                    <span className="px-4 py-2 border mt-4 hover:bg-gray-300">
                                        Select Avatar
                                    </span>
                                </label>
                                <input id="file" type="file" hidden {...register('avatar')} />
                            </div>
                        </div>
                    </div>
                </div>
                {isDirty && (
                    <div className="flex justify-start mt-5">
                        <button
                            className="bg-main text-white px-4 py-2 hover:opacity-80 rounded-md w-[20%]"
                            type="submit"
                        >
                            save
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Persional;
