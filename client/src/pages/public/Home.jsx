import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IoIosArrowForward } from 'react-icons/io';
import { apiGetProducts } from '../../apis/product';
import { Sidebar, Banner, BestSeller, DealDaily, FeatureProducts } from '../../components';

function Home() {
    const navigate = useNavigate();
    const [bestSeller, setBestSeller] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const { categories } = useSelector(state => state.app);

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
                                                        onClick={() => {
                                                            navigate(
                                                                `/${item.title?.toLowerCase()}?brand=${brand}`
                                                            );
                                                        }}
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
        </div>
    );
}

export default Home;
