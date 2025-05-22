import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, Link } from 'react-router-dom';
import { InputForm } from '../../components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { apiUpdateCurrent } from '../../apis';
import moment from 'moment';
import avatarDefault from '../../assets/avatarDefault.svg';
import { getCurrent } from '../../redux/user/asyncAction';

const Persional = () => {
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
    } = useForm();
    const { current } = useSelector(state => state.user);
    useEffect(() => {
        reset({
            name: current?.name,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
        });
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
                className="w-full mx-auto py-8 flex flex-col gap-4"
            >
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
                    lable="Email"
                    register={register}
                    errors={errors}
                    id="email"
                    validate={{
                        required: 'Need fill this field',
                        pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: 'phone number invalid',
                        },
                    }}
                    fullWidth
                    placeholder="Enter your email..."
                />
                <InputForm
                    lable="Phone"
                    register={register}
                    errors={errors}
                    id="mobile"
                    validate={{
                        required: 'Need fill this field',
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
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Profile image:</span>
                    <label htmlFor="file">
                        <img
                            src={current?.avatar || avatarDefault}
                            className="w-20 h-20 object-cover rounded-lg ml-8"
                        />
                    </label>
                    <input id="file" type="file" hidden {...register('avatar')} />
                </div>
                {isDirty && (
                    <div className="flex justify-center">
                        <button
                            className="bg-main text-white px-4 py-2 hover:opacity-80 rounded-md w-[50%]"
                            type="submit"
                        >
                            Update information
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Persional;
