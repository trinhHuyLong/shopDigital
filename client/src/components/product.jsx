import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { TiThMenu } from 'react-icons/ti';
import { IoEye } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { formatMoney } from '../utils/helper';
import label1 from '../assets/lable2.png';
import label2 from '../assets/lable3.png';
import renderStar from '../utils/rederStar';
import { Selection } from '../components';

const Product = ({ product, type }) => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Link to={`/${product?.category?.toLowerCase()}/${product._id}/${product.title}`}>
            <div className="w-full text-base px-[10px] py-[8px]">
                <div
                    className="w-full border p-[15px] flex flex-col items-center"
                    onMouseEnter={() => setIsShow(true)}
                    onMouseLeave={() => setIsShow(false)}
                >
                    <div className="w-full relative flex justify-center">
                        {isShow && (
                            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
                                <Selection icon={<IoEye />} />
                                <Selection icon={<TiThMenu />} />
                                <Selection icon={<FaHeart />} />
                            </div>
                        )}
                        {type && (
                            <img
                                src={type === 'new' ? label1 : label2}
                                alt="label"
                                className="absolute top-[-16px] left-[-28px] w-[84px] h-[25px] object-cover"
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
                                    <span className="absolute top-[-16px] left-[0px] text-white text-center text-[12px] font-semibold leading-[25px]">
                                        New
                                    </span>
                                ) : (
                                    <span className="absolute top-[-16px] left-[0px] text-white text-center text-[12px] font-semibold leading-[25px]">
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

export default Product;
