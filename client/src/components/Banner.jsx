import { memo } from 'react';

const Banner = () => {
    return (
        <div className="w-full px-3 lg:px-0">
            <img
                src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
                alt="banner"
                className="h-auto lg:h-[400px] w-full object-cover"
            />
        </div>
    );
};

export default memo(Banner);
