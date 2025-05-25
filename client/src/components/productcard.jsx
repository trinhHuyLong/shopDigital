import { useNavigate } from 'react-router-dom';
import { useState, memo } from 'react';

import { formatMoney } from '../utils/helper';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);

    const handleClick = () => {
        navigate(`/${product?.category?.toLowerCase()}/${product._id}/${product.title}`);
    };

    return (
        <div
            className="border p-4 flex cursor-pointer relative"
            onClick={handleClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {hover && <div className="absolute inset-0 bg-transparent1"></div>}
            <img
                src={product?.thumb}
                alt={product.title}
                className="w-[90px] object-contain mr-4"
            />
            <div className="flex flex-col gap-2 mt-[15px] items-start w-full text-xs">
                <span className="line-clamp-1 capitalize text-sm">{product.title}</span>
                <span>{`${formatMoney(product.price)} VND`}</span>
            </div>
        </div>
    );
};

export default memo(ProductCard);
