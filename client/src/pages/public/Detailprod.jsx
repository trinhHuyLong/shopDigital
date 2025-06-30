import { useNavigate, useParams } from 'react-router-dom';
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
import { apiUpdateCart } from '../../apis';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from '../../redux/user/asyncAction';
import { current } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import path from '../../utils/path';
import clsx from 'clsx';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
    ],
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
    const { current } = useSelector(state => state.user);
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState(null);
    const [quantity, setQuantity] = useState('');
    const { id, title, category } = useParams();
    const [currentImg, setCurrentImg] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProductData = async id => {
        const response = await apiGetProduct(id);
        if (response.success) {
            setProduct(response.product);
            setCurrentImg(response.product?.thumb);
        }
    };

    const fetchProducts = async id => {
        const response = await apiGetProducts({ _id: { $ne: id } });
        if (response.success) {
            setProducts(response.products);
        }
    };

    const handleAddCart = async () => {
        if (!current) {
            return Swal.fire({
                title: 'Almost....',
                text: 'Please login first!',
                icon: 'info',
                cancelButtonText: 'Not now',
                showCancelButton: true,
                confirmButtonText: 'Go login page',
            }).then(async rs => {
                if (rs.isConfirmed) navigate(`${path.LOGIN}`);
            });
        }
        if (!quantity) {
            return toast.error('Please enter quantity');
        }
        if (quantity && product?.quantity > 0) {
            const response = await apiUpdateCart({
                pid: product._id,
                color: product.color,
                quantity,
            });
            if (response.success) {
                toast.success('Upadate cart success');
                const result = await dispatch(getCurrent());
                if (result?.payload) {
                    navigate('/member/my-cart');
                } else {
                    toast.error('Something went wrong fetching user info');
                }
            } else toast.error('fail');
        }
    };

    const handleChangeImg = e => {
        setCurrentImg(e.target.src);
    };

    const handleQuantity = number => {
        if (number === '') {
            setQuantity('');
            return;
        }
        if (!Number(number) || number < 1) return;

        if (number > product?.quantity) {
            toast.info('sold off');
            return;
        }
        setQuantity(number);
    };

    useEffect(() => {
        if (id) {
            setQuantity('');
            fetchProductData(id);
            fetchProducts(id);
        }

        const ids = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(ids);
    }, [id]);

    const handleSubmitVote = useCallback(() => {
        fetchProductData(id);
    });

    return (
        <div className="w-full">
            <div className="h-[81px] bg-gray-100 flex justify-center items-center mt-4">
                <div className="w-full px-3 lg:w-main">
                    <h3 className="font-semibold uppercase">{title}</h3>
                    <Breadcrumbs title={title} category={category} />
                </div>
            </div>
            <div className="w-full lg:w-main m-auto mt-4 flex flex-col lg:flex-row">
                <div className="flex flex-col gap-4 w-full px-3 lg:w-[40%]">
                    <img
                        src={currentImg}
                        alt="product"
                        className="border w-full lg:w-[458px] object-cover"
                    />
                    <div className="w-full lg:w-[458px]">
                        <div className=" mx-[-10px]">
                            {product?.images && product.images.length > 0 && (
                                <Slider {...settings} className="imageSlider w-full">
                                    {product?.images.map((el, index) => (
                                        <div
                                            onClick={handleChangeImg}
                                            className="flex justify-center items-center px-[10px] cursor-pointer"
                                        >
                                            <div
                                                key={index}
                                                className="flex justify-center items-center lg:w-[134px] lg:h-[134px] border overflow-hidden"
                                            >
                                                <img
                                                    src={el}
                                                    alt={`product-${index}`}
                                                    className="lg:h-[134px] h-[150px] m-auto object-cover p-2"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-3 lg:p-0 lg:w-[40%] lg:pr-[24px] flex flex-col gap-2">
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
                        {product?.description &&
                            product?.description.map(el => (
                                <li className="leading-6" key={el}>
                                    {el}
                                </li>
                            ))}
                    </ul>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semiboldf">Quantity:</span>
                            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} />
                        </div>
                        <button
                            onClick={() => {
                                handleAddCart();
                            }}
                            className={clsx(
                                product?.quantity === 0 &&
                                    'w-full bg-gray-400 lg:hover:cursor-default text-gray-100 py-2',
                                product?.quantity > 0 &&
                                    'w-full bg-main lg:hover:opacity-80 hover:cursor-pointer text-gray-100 py-2'
                            )}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
                <div className="p-3 lg:p-0 lg:w-[20%]">
                    {productIconData?.map(el => (
                        <ProductIcon key={el.id} icon={el.icon} title={el.title} sub={el.sub} />
                    ))}
                </div>
            </div>
            <div className="lg:w-main lg:m-auto mt-4 lg:mt-8 mx-3">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    Product review:
                </h3>
                <ProductInfor
                    totalRating={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    productId={product?._id}
                    handleSubmitVote={handleSubmitVote}
                />
            </div>
            <div className="lg:w-main lg:m-auto mt-8 mx-3">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 uppercase border-main">
                    Other Customers also buy:
                </h3>
                {products && (
                    <div className="mt-4 mx-[-10px] mb-8">
                        <CustomSlider products={products} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailProd;
