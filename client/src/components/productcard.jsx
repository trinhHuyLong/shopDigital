import {formatMoney} from '../utils/helper'

const ProductCard = ({ product }) => {
    return (
        <div className="border p-4 flex">
            <img src={product?.thumb} alt={product.title} className='w-[90px] object-contain mr-4'/>
            <div className='flex flex-col gap-2 mt-[15px] items-start gap-1 w-full text-xs'>
                <span className="line-clamp-1 capitalize text-sm">{product.title}</span>
                <span>{`${formatMoney(product.price)} VND`}</span>
            </div>
        </div>
    );
}

export default ProductCard;