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
    } = useForm();

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [edit, setEdit] = useState(null);
    const [search, setSearch] = useState('');
    const [params] = useSearchParams();

    const fetchUsers = async params => {
        const response = await apiGetAllUsers(params);
        if (response.success) setUsers(response);
    };

    const handleDelete = uid => {
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
        if (searchDebounce) param.search = searchDebounce;
        else delete param.search;

        if (!param.page) param.page = 1;

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
        <div className={clsx('w-full px-6 pb-16')}>
            <h1 className="text-3xl font-bold border-b py-6">Manage Users</h1>
            <div className="flex justify-end my-4">
                <div className="w-full max-w-md">
                    <Inputfield
                        nameKey="Search name or mail user"
                        value={search}
                        setValue={setSearch}
                        isHideLable={true}
                    />
                </div>
            </div>
            <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="overflow-x-auto bg-white shadow-md rounded-md">
                    <table className="min-w-full text-sm text-left table-fixed">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="w-[40px] px-2 py-3">#</th>
                                <th className="w-[200px] px-2 py-3">Email</th>
                                <th className="w-[160px] px-2 py-3">Name</th>
                                <th className="w-[120px] px-2 py-3">Role</th>
                                <th className="w-[140px] px-2 py-3">Phone</th>
                                <th className="w-[120px] px-2 py-3">Status</th>
                                <th className="w-[140px] px-2 py-3">Created At</th>
                                <th className="w-[120px] px-2 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.users?.map((user, id) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-2">
                                        {!params.get('page')
                                            ? id + 1
                                            : (+params.get('page') - 1) * 12 + id + 1}
                                    </td>
                                    <td className="px-2 py-2 truncate">{user.email}</td>
                                    <td className="px-2 py-2 truncate">{user.name}</td>
                                    <td className="px-2 py-2 truncate">
                                        {edit?._id === user._id ? (
                                            <Select
                                                fullWidth={false}
                                                defaultValue={edit.role}
                                                register={register}
                                                errors={errors}
                                                id={'role'}
                                                options={[
                                                    { code: 'admin', value: 'Admin' },
                                                    { code: 'user', value: 'User' },
                                                ]}
                                                validate={{ required: 'Required fill' }}
                                            />
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td className="px-2 py-2 truncate">{user.mobile || 'N/A'}</td>
                                    <td className="px-2 py-2 truncate">
                                        {edit?._id === user._id ? (
                                            <Select
                                                fullWidth={false}
                                                defaultValue={edit.isBlocked.toString()}
                                                register={register}
                                                errors={errors}
                                                id={'isBlocked'}
                                                options={[
                                                    { code: 'true', value: 'Blocked' },
                                                    { code: 'false', value: 'Active' },
                                                ]}
                                                validate={{ required: 'Required fill' }}
                                            />
                                        ) : user.isBlocked ? (
                                            'Blocked'
                                        ) : (
                                            'Active'
                                        )}
                                    </td>
                                    <td className="px-2 py-2">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-2">
                                        <div className="flex gap-1">
                                            {edit?._id === user._id ? (
                                                <>
                                                    <button
                                                        type="submit"
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Update
                                                    </button>
                                                    <span
                                                        className="text-gray-500 hover:underline"
                                                        onClick={() => setEdit(null)}
                                                    >
                                                        Cancel
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span
                                                        onClick={() => setEdit(user)}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </span>
                                                    <span
                                                        onClick={() => handleDelete(user._id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
            {users?.counts > 12 && (
                <div className="w-full mt-6 flex justify-center">
                    <Pagination totalCount={users?.counts} />
                </div>
            )}
        </div>
    );
};

export default ManageUser;
