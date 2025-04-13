import { useEffect, useState } from 'react';
import Slider from "react-slick";

import { apiGetProducts } from '../apis/product';
import { Product } from '../components'
import b1 from '../assets/b1.avif'
import b2 from '../assets/b2.avif'

const tabs = [
    { id: 0, name: 'Best Seller' },
    { id: 1, name: 'New Arrivals' }
]

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
}
const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    const fetchProducts = async () => {
        const [bestSeller, newProducts] = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: '-createdAt' })]);
        if (bestSeller?.success && newProducts?.success) {
            setBestSeller(bestSeller.products);
            setNewProducts(newProducts.products);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return <div>
        <div className='flex text-[20px] pb-4 border-b-2 border-main'>
            <div className='ml-[-32px]'>
                {tabs.map((tab) => (
                    <span
                        key={tab.id}
                        className={`font-semibold px-8 cursor-pointer capitalize border-r text-gray-400 ${activeTab === tab.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >{tab.name}</span>
                ))}
            </div>
        </div>
        <div className='mt-4 mx-[-10px]'>  
            <Slider {...settings}>
                {
                    (activeTab === 0 ? bestSeller : newProducts).map((product) => (
                        <Product key={product.id} product={product} isNew={activeTab===0?false:true}/>
                    ))
                }
            </Slider>
        </div>
        <div className='w-full flex gap-4 mt-4'>
            <img src={b1} alt="" className='flex-1 object-contain'/>
            <img src={b2} alt="" className='flex-1 object-contain'/>
        </div>
    </div>
}

export default BestSeller;