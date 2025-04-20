import { useEffect, useState } from 'react';
import Slider from "react-slick";

import { Product } from '../components'
import { apiGetProducts } from '../apis/product';

const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
}

const CustomSlider = ({activeTab}) => {
    const [bestSeller, setBestSeller] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    const fetchProducts = async () => {
        const [bestSeller, newProducts] = await Promise.all([apiGetProducts({limit: 7, sort: '-sold' }), apiGetProducts({limit: 7, sort: '-createdAt' })]);
        if (bestSeller?.success && newProducts?.success) {
            setBestSeller(bestSeller.products);
            setNewProducts(newProducts.products);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Slider {...settings}>
            {
                (activeTab === 0 ? bestSeller : newProducts).map((product) => (
                    <Product key={product.id} product={product} isNew={activeTab === 0 ? false : true} />
                ))
            }
        </Slider>
    );
}

export default CustomSlider;