import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import { FaShieldAlt, FaReply, FaTruck, FaTty } from 'react-icons/fa';
import { IoIosGift } from 'react-icons/io';
import DOMPurify from 'dompurify';

import { SelectQuantity } from '../../components';
import { apiGetProduct, apiGetProducts } from '../../apis/product';
import { Breadcrumbs, ProductIcon, ProductInfor, CustomSlider } from '../../components';
import { formatMoney, formatNumber } from '../../utils/helper';
import renderStar from '../../utils/rederStar';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const productIconData = [
    {
        id: 1,
        title: 'guarantee',
        sub: 'Quality checked',
        icon: <FaShieldAlt />,
    },
    {
        id: 2,
        title: 'Free Shipping',
        sub: 'Free on all products',
        icon: <FaTruck />,
    },
    {
        id: 3,
        title: 'Special gift cards',
        sub: 'Special gift cards',
        icon: <IoIosGift />,
    },
    {
        id: 4,
        title: 'Free return',
        sub: 'Within 7 days',
        icon: <FaReply />,
    },
    {
        id: 5,
        title: 'Consultancy',
        sub: 'Lifetime 24/7/356',
        icon: <FaTty />,
    },
];

const DetailProd = () => {
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState(null);
    const [quantity, setQuantity] = useState('');
    const { id, title, category } = useParams();
    const [currentImg, setCurrentImg] = useState(null);

    const fetchProductData = async id => {
        const response = await apiGetProduct(id);
        if (response.success) {
            setProduct(response.product);
            setCurrentImg(response.product?.thumb);
        }
    };

    const fetchProducts = async id => {
        const response = await apiGetProducts({ category });
        if (response.success) {
            setProducts(response.products);
        }
    };

    const handleChangeImg = e => {
        setCurrentImg(e.target.src);
        console.log(1);
    };

    const handleQuantity = useCallback(
        number => {
            if (number === '') {
                setQuantity('');
                return;
            }
            if (!Number(number) || number < 1) return;
            setQuantity(number);
        },
        [quantity]
    );

    useEffect(() => {
        if (id) {
            fetchProductData(id);
            fetchProducts();
        }
        window.scrollTo(0, 0);
    }, [id]);

    const handleSubmitVote = useCallback(() => {
        fetchProductData(id);
    });

    return (
        <div className="w-full">
            <div className="h-[81px] bg-gray-100 flex justify-center items-center">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{title}</h3>
                    <Breadcrumbs title={title} category={category} />
                </div>
            </div>
            <div className="w-main m-auto mt-4 flex">
                <div className="flex flex-col gap-4 w-[40%]">
                    <img src={currentImg} alt="product" className="border w-[458px] object-cover" />
                    <div className="w-[458px]">
                        <div className=" mx-[-10px]">
                            <Slider {...settings} className="imageSlider w-full">
                                {product?.images.map((el, index) => (
                                    <div
                                        onClick={handleChangeImg}
                                        className="flex justify-center items-center px-[10px] cursor-pointer"
                                    >
                                        <div
                                            key={index}
                                            className="flex justify-center items-center w-[134px] h-[134px] border overflow-hidden"
                                        >
                                            <img
                                                src={el}
                                                alt={`product-${index}`}
                                                className="h-[134px] m-auto object-cover p-2"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
                <div className=" w-[40%] pr-[24px] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[30px] font-semibole">
                            {`${formatMoney(formatNumber(product?.price))}`} VND
                        </h2>
                        <span className="text-sm text-main">Store: {product?.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStar(product?.totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}
                        <span className="text-sm text-main italic">(Sold: {product?.sold})</span>
                    </div>
                    <ul className="text-sm text-gray-500 !list-square list-inside">
                        {product?.description.length > 1 &&
                            product?.description.map(el => (
                                <li className="leading-6" key={el}>
                                    {el}
                                </li>
                            ))}
                        {product?.description.length === 1 && (
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(product?.description[0]),
                                }}
                            ></div>
                        )}
                    </ul>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semiboldf">Quantity:</span>
                            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} />
                        </div>
                        <button className="w-full bg-main text-gray-100 py-2">Add to cart</button>
                    </div>
                </div>
                <div className=" w-[20%]">
                    {productIconData?.map(el => (
                        <ProductIcon key={el.id} icon={el.icon} title={el.title} sub={el.sub} />
                    ))}
                </div>
            </div>
            <div className="w-main m-auto mt-8">
                <ProductInfor
                    totalRating={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    productId={product?._id}
                    handleSubmitVote={handleSubmitVote}
                />
            </div>
            <div className="w-main m-auto mt-8">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    Other Customers also buy:
                </h3>
                {products && (
                    <div className="mt-4 mx-[-10px]">
                        <CustomSlider products={products} />
                    </div>
                )}
            </div>
            <div className="h-[500px] w-full"></div>
        </div>
    );
};

export default DetailProd;
