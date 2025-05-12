import React from 'react';
import { useEffect, useState } from 'react';

import { IoIosArrowForward } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { apiGetProducts } from '../../apis/product';

import {
    Sidebar,
    Banner,
    BestSeller,
    DealDaily,
    FeatureProducts,
    CustomSlider,
} from '../../components';

function Home() {
    const [bestSeller, setBestSeller] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const fetchProducts = async () => {
        const [bestSeller, newProducts] = await Promise.all([
            apiGetProducts({ limit: 7, sort: '-sold' }),
            apiGetProducts({ limit: 7, sort: '-createdAt' }),
        ]);
        if (bestSeller?.success && newProducts?.success) {
            setBestSeller(bestSeller.products);
            setNewProducts(newProducts.products);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    const { categories } = useSelector(state => state.app);
    const { isLogged, token } = useSelector(state => state.user);
    return (
        <div className="w-main mt-6">
            <div className="w-main flex">
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
                    <Banner />
                    <BestSeller bestSeller={bestSeller} newProducts={newProducts} />
                </div>
            </div>
            <div className="my-8">
                <FeatureProducts />
            </div>
            <div className="my-8">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    New Arrivals
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider type={'best'} products={bestSeller} />
                </div>
            </div>
            <div className="my-8">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    HOT COLLECTIONS
                </h3>
                <div className="grid grid-cols-3 gap-4 my-4">
                    {categories?.map(item => {
                        if (item.image) {
                            return (
                                <div key={item._id} className="flex border p-4">
                                    <img
                                        src={item.image}
                                        alt={item.cate}
                                        className="w-[110px] object-contain mx-6"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-sm uppercase pb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex flex-col gap-2 text-sm">
                                            {item.brand.map((brand, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-main"
                                                    >
                                                        <span>
                                                            <IoIosArrowForward />
                                                        </span>
                                                        <span>{brand}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
            <div className="my-8">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    Blog posts
                </h3>
            </div>
        </div>
    );
}

export default Home;
