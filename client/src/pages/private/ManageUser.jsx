import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { apiGetAllUsers, apiUpdateUser, apiDeleteUser } from '../../apis/user';
import { Inputfield, Pagination, InputForm, Select } from '../../components';
import useDebounce from '../../hooks/useDebounce';
import clsx from 'clsx';

const ManageUser = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        email: '',
        name: '',
        role: '',
        mobile: '',
        isBlocked: '',
    });
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [edit, setEdit] = useState(null);
    const [search, setSearch] = useState('');
    const [params] = useSearchParams();
    const fetchUsers = async params => {
        const response = await apiGetAllUsers(params);
        if (response.success) {
            setUsers(response);
        }
    };

    const handleDelete = uid => {
        console.log(uid);
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete this user?',
            showCancelButton: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if (response.success) {
                    fetchUsers({ ...params, limit: 12 });
                    toast.success('Delete user success!');
                } else {
                    toast.error(response.message || 'Delete user failed!');
                }
            }
        });
    };

    const handleUpdate = async data => {
        const response = await apiUpdateUser(data, edit._id);
        if (response.success) {
            setEdit(null);
            fetchUsers({ ...params, limit: 12 });
            toast.success('Update user success!');
        } else {
            toast.error(response.message || 'Update user failed!');
        }
    };

    const searchDebounce = useDebounce(search, 500);

    useEffect(() => {
        const param = Object.fromEntries([...params]);
        if (searchDebounce) {
            param.search = searchDebounce;
        } else {
            delete param.search;
        }
        if (!param.page) {
            param.page = 1;
        }
        navigate({
            pathname: `/admin/manage-users`,
            search: createSearchParams(param).toString(),
        });
        fetchUsers({ ...param, limit: 12 });
    }, [searchDebounce, params]);

    useEffect(() => {
        if (edit) {
            reset({
                email: edit.email,
                name: edit.name,
                role: edit.role,
                mobile: edit.mobile,
                isBlocked: edit.isBlocked ? 'true' : 'false',
            });
        }
    }, [edit]);
    return (
        <div className={clsx('w-full', edit && 'pl-10')}>
            <h1 className="h-[75px] flex items-center justify-between px-4 text-3xl font-bold border-b">
                Manege users
            </h1>
            <div className="w-full p-4">
                <div className="flex justify-end py-4">
                    <div className="w-[50%]">
                        <Inputfield
                            nameKey="Search name or mail user"
                            value={search}
                            setValue={setSearch}
                            isHideLable={true}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <table className="table-auto mb-6 text-left w-full">
                        <thead className="font-bold bg-gray-700 text-[13px] text-white">
                            <tr className=" border border-gray-500">
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Email address</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created at</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((user, id) => (
                                <tr key={user._id} className="border border-gray-500 ">
                                    <td className="px-4 py-2">
                                        {!params.get('page')
                                            ? id + 1
                                            : (+params.get('page') - 1) * 12 + id + 1}
                                    </td>
                                    <td className="px-4 py-2">
                                        {edit?._id === user._id ? (
                                            <InputForm
                                                fullWidth
                                                defaultValue={edit.email}
                                                register={register}
                                                errors={errors}
                                                id={'email'}
                                                validate={{
                                                    required: 'Required fill',
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                        message: 'Invalid email address',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <span>{user.email}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {edit?._id === user._id ? (
                                            <InputForm
                                                fullWidth
                                                defaultValue={edit.name}
                                                register={register}
                                                errors={errors}
                                                id={'name'}
                                                validate={{ required: 'Required fill' }}
                                            />
                                        ) : (
                                            <span>{user.name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {edit?._id === user._id ? (
                                            <Select
                                                fullWidth
                                                defaultValue={edit.role}
                                                register={register}
                                                errors={errors}
                                                id={'role'}
                                                validate={{ required: 'Required fill' }}
                                                options={[
                                                    {
                                                        code: 'admin',
                                                        value: 'Admin',
                                                    },
                                                    {
                                                        code: 'user',
                                                        value: 'User',
                                                    },
                                                ]}
                                            />
                                        ) : (
                                            <span>{user.role}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {edit?._id === user._id ? (
                                            <InputForm
                                                fullWidth
                                                defaultValue={'0123456789'}
                                                register={register}
                                                errors={errors}
                                                id={'mobile'}
                                                validate={{
                                                    required: 'Required fill',
                                                    pattern: {
                                                        value: /^[0-9]{10}$/,
                                                        message: 'Invalid phone number',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <span>{!user.mobile ? 'Update now' : user.mobile}</span>
                                        )}
                                    </td>
                                    <td className="p-4 py-2">
                                        {edit?._id === user._id ? (
                                            <Select
                                                fullWidth
                                                defaultValue={edit.isBlocked}
                                                register={register}
                                                errors={errors}
                                                id={'isBlocked'}
                                                options={[
                                                    {
                                                        code: 'true',
                                                        value: 'Blocked',
                                                    },
                                                    {
                                                        code: 'false',
                                                        value: 'Active',
                                                    },
                                                ]}
                                                validate={{ required: 'Required fill' }}
                                            />
                                        ) : (
                                            <span>{user.isBlocked ? 'Blocked' : 'Active'}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex">
                                            {edit?._id === user._id ? (
                                                <button
                                                    type="submit"
                                                    className="pr-2 text-orange-500 hover:underline cursor-pointer h-full"
                                                >
                                                    Update
                                                </button>
                                            ) : (
                                                <span
                                                    onClick={() => setEdit(user)}
                                                    className="pr-2 text-orange-500 hover:underline cursor-pointer"
                                                >
                                                    Edit
                                                </span>
                                            )}
                                            {edit?._id === user._id ? (
                                                <span
                                                    className="pl-2 text-orange-500 hover:underline cursor-pointer"
                                                    onClick={() => setEdit(null)}
                                                >
                                                    Cancel
                                                </span>
                                            ) : (
                                                <span
                                                    onClick={() => handleDelete(user._id)}
                                                    className="pl-2 text-orange-500 hover:underline cursor-pointer"
                                                >
                                                    Delete
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
                {users?.counts > 12 && (
                    <div className="w-full m-auto my-4 flex justify-center">
                        <Pagination totalCount={users?.counts} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUser;
