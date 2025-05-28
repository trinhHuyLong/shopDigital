import { useSelector } from 'react-redux';
import imageDf from '../../assets/imageDf.jpg';
import { apiDeleteCategory } from '../../apis';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getCategories } from '../../redux/app/asyncAction';
import { useState } from 'react';
import UpdateCategory from './UpdateCategory';

const ManageCategory = () => {
    const ditpatch = useDispatch();
    const { categories } = useSelector(state => state.app);
    const [edit, setEdit] = useState(null);
    const handleDelete = async id => {
        Swal.fire({
            title: 'Are you sure',
            text: 'Are you sure remove this category',
            icon: 'warning',
            showCancelButton: true,
        }).then(async rs => {
            if (rs.isConfirmed) {
                const response = await apiDeleteCategory(id);
                if (response.success) {
                    toast.success('Delete successfull');
                    ditpatch(getCategories());
                } else toast.error('Delete fail');
            }
        });
    };

    return (
        <div>
            {edit && (
                <div className="absolute inset-0 bg-gray-100 min-h-screen">
                    <UpdateCategory editCategory={edit} setEditCategory={setEdit} />
                </div>
            )}
            <div className="p-4 border-b w-full flex justify-between items-center ">
                <h1 className="text-3xl font-bold tracking-tight">Manage Product</h1>
            </div>
            {categories?.map(el => (
                <div
                    className="border p-5 pt-3 flex items-center justify-between m-5 bg-white"
                    key={el._id}
                >
                    <div className="flex items-center">
                        <div>
                            <img src={el.image || imageDf} className="w-16" />
                        </div>
                        <div className="flex flex-col gap-2 pl-4">
                            <h3 className="">{el.title}</h3>
                            {el?.brand?.length > 0 && (
                                <span>Brand: {el?.brand?.map(item => item).join(', ')}</span>
                            )}
                            {el?.brand?.length === 0 && <span>No brand</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEdit(el);
                                window.scroll({ top: 0, behavior: 'smooth' });
                            }}
                            className="underline text-orange-400 hover:opacity-80 cursor-pointer"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => handleDelete(el._id)}
                            className="underline text-red-700 hover:opacity-80 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManageCategory;
