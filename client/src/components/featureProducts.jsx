import { useEffect, useState } from 'react';

import { ProductCard } from '.';
import { apiGetProducts } from '../apis/product';

const FeatureProducts = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const data = await apiGetProducts({ limit: 9, sort: '-totalRatings' });
        if (data?.success) {
            setProducts(data?.products);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="w-full">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                Feature Products
            </h3>
            <div className="grid grid-cols-3 gap-4 my-4">
                {products?.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
            <div className="flex justify-between">
                <img
                    className="w-[49.2%] object-contain"
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
                />
                <div className="flex flex-col justify-between w-[24%]">
                    <img
                        className="w-full object-contain"
                        src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
                    />
                    <img
                        className="w-full object-contain"
                        src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
                    />
                </div>
                <img
                    className="w-[23.7%] object-contain"
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
                />
            </div>
        </div>
    );
};

export default FeatureProducts;
