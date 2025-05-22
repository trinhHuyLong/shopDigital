import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import { productInforTabs } from '../utils/constants.jsx';
import { Votebar, VoteOption, Comment } from '../components';
import renderStar from '../utils/rederStar';
import { apiRatingProduct } from '../apis/product';
import { showModal } from '../redux/app/appSlice';
import path from '../utils/path';

const ProductInfor = ({ totalRating, ratings, nameProduct, productId, handleSubmitVote }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const { isLoggedIn } = useSelector(state => state.user);
    const toggleVote = () => {
        if (!isLoggedIn) {
            swal.fire({
                text: 'Login to vote',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go login',
                title: 'Oops',
                showCancelButton: true,
            }).then(rs => {
                if (rs.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            });
        } else {
            dispatch(
                showModal({
                    isShowModal: true,
                    modalChildren: <VoteOption nameProduct={nameProduct} handleVote={handleVote} />,
                })
            );
        }
    };
    const handleVote = async (star, comment) => {
        if (!star || !productId || !comment) {
            alert('Please fill all fields!');
            return;
        }
        const response = await apiRatingProduct({
            pid: productId,
            star,
            comment,
            updateAt: Date.now(),
        });
        if (response.success) {
            dispatch(
                showModal({
                    isShowModal: false,
                    modalChildren: null,
                })
            );
            handleSubmitVote();
        }
    };
    return (
        <div className="">
            <div className="flex items-center gap-2 relative bottom-[-1px]">
                {productInforTabs.map((el, index) => (
                    <span
                        onClick={() => setActiveTab(index)}
                        className={`p-2 cursor-pointer px-4 ${
                            activeTab === index ? 'bg-white border border-b-0' : 'bg-gray-200 '
                        }`}
                        key={index}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="w-full p-4 border">
                {activeTab < 4 && <p>{productInforTabs[activeTab].content}</p>}
            </div>
            <div>
                <div className="flex mt-8">
                    <div className="flex-4 border flex flex-col items-center justify-center">
                        <span className="font-semibold text-3xl">{`${totalRating}/5`}</span>
                        <span className="flex">{renderStar(totalRating)}</span>
                        <span className="text-sm">{`${ratings?.length} reviews`}</span>
                    </div>
                    <div className="flex-6 border p-4 gap-2 flex flex-col">
                        {Array.from(
                            Array(5)
                                .keys()
                                .map(el => (
                                    <Votebar
                                        key={el}
                                        number={5 - el}
                                        ratingCount={
                                            ratings?.filter(item => item.star === 5 - el)?.length
                                        }
                                        ratingTotal={ratings?.length}
                                    />
                                ))
                        )}
                    </div>
                </div>
                <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
                    <span>Do you review this product?</span>
                    <button
                        onClick={toggleVote}
                        className="px-4 py-2 bg-main text-white hover:opacity-50 rounded-md"
                    >
                        Vote now
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {ratings?.map((item, index) => (
                        <Comment
                            key={index}
                            image={item?.postedBy?.avatar}
                            createdAt={item?.updateAt}
                            comment={item?.comment}
                            star={item?.star}
                            name={item?.postedBy?.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductInfor;
