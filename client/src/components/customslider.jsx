import Slider from 'react-slick';

import { Product } from '.';

const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const CustomSlider = ({ type, products }) => {
    return (
        <Slider className="customSlider" {...settings}>
            {products?.map(product => (
                <Product key={product.id} product={product} type={type} />
            ))}
        </Slider>
    );
};

export default CustomSlider;
