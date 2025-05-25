import { useState, memo } from 'react';
import { Link } from 'react-router-dom';

import { formatMoney } from '../utils/helper';
import label1 from '../assets/lable2.png';
import label2 from '../assets/lable3.png';
import renderStar from '../utils/rederStar';

const Product = ({ product, type }) => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Link to={`/${product?.category?.toLowerCase()}/${product._id}/${product.title}`}>
            <div className="w-full text-base px-[10px] py-[8px]">
                <div
                    className="w-full border p-[15px] flex flex-col items-center relative"
                    onMouseEnter={() => setIsShow(true)}
                    onMouseLeave={() => setIsShow(false)}
                >
                    <div className="w-full  flex justify-center">
                        {isShow && (
                            <div className="absolute inset-0 bg-transparent1 flex justify-center gap-2 animate-slide-fwd-center"></div>
                        )}
                        {type && (
                            <img
                                src={type === 'new' ? label1 : label2}
                                alt="label"
                                className="absolute top-[0px] left-[-12px] w-[84px] h-[25px] object-cover"
                            />
                        )}
                        <img
                            src={
                                product.thumb
                                    ? product.thumb
                                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt7ocNuUgQqYYlmgHTEZIhx5aXBPfybSqneA&s'
                            }
                            alt={product.title}
                            className="w-[243px] h-[243px] object-cover"
                        />
                        {type && (
                            <>
                                {type === 'new' ? (
                                    <span className="absolute top-[-3px] left-[12px] text-white text-center text-[12px] font-semibold leading-[25px]">
                                        New
                                    </span>
                                ) : (
                                    <span className="absolute top-[-3px] left-[12px] text-white text-center text-[12px] font-semibold leading-[25px]">
                                        Hot
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mt-2  items-start w-full">
                        <span className="line-clamp-1">{product.title}</span>
                        <span className="flex h-4">{renderStar(product.totalRatings)}</span>
                        <span>{`${formatMoney(product.price)} VND`}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default memo(Product);
