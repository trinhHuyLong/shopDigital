import { IoIosArrowDown } from 'react-icons/io';
import { useEffect, useState, useRef } from 'react';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import useDebounce from '../hooks/useDebounce';
import { apiGetProducts } from '../apis/product';
import { useSelector } from 'react-redux';

const SearchItem = ({ name, activeClick, handleSetActive, type = 'checkbox' }) => {
    const [params] = useSearchParams();
    const { categories } = useSelector(state => state.app);
    const { category } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState('');
    const [brand, setBrand] = useState('');
    const [bestPrice, setBestPrice] = useState(null);
    const [price, setPrice] = useState({ from: '', to: '' });
    const debounceFrom = useDebounce(price.from, 500);
    const debounceTo = useDebounce(price.to, 500);

    const inputQ = useRef();

    const handleSelect = e => {
        if (selected === e.target.value) {
            setSelected('');
        } else setSelected(e.target.value);
        handleSetActive(null);
    };

    const handleSelectBrand = e => {
        if (brand === e.target.value) {
            setBrand('');
        } else setBrand(e.target.value);
        handleSetActive(null);
    };

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response.products[0]?.price);
        }
    };

    useEffect(() => {
        setPrice({
            from: params.get('from') || '',
            to: params.get('to') || '',
        });
        setBrand(params.get('brand'));
        setSelected(category || '');
        fetchBestPriceProduct();
    }, []);

    useEffect(() => {
        const queries = {};
        params.forEach((value, key) => {
            queries[key] = value;
        });
        if (brand) {
            queries.brand = brand;
        } else delete queries.brand;
        queries.page = 1;
        if (selected) {
            navigate({
                pathname: `/${selected.toLowerCase()}`,
                search: createSearchParams(queries).toString(),
            });
        } else {
            delete queries.brand;
            navigate({
                pathname: `/products`,
                search: createSearchParams(queries).toString(),
            });
        }
    }, [selected, brand]);

    useEffect(() => {
        const queries = {};
        params.forEach((value, key) => {
            queries[key] = value;
        });
        if (Number(price.from) > 0) queries.from = price.from;
        else delete queries.from;
        if (Number(price.to) > 0) queries.to = price.to;
        else delete queries.to;
        queries.page = 1;
        if (category) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams(queries).toString(),
            });
        } else {
            navigate({
                pathname: `/products`,
                search: createSearchParams(queries).toString(),
            });
        }
    }, [debounceFrom, debounceTo]);

    useEffect(() => {
        const handleClickOutOption = e => {
            if (activeClick === name) {
                const inputQuery = inputQ.current;
                if (inputQuery && !inputQuery.contains(e.target)) {
                    handleSetActive(null);
                }
            }
        };
        document.addEventListener('click', handleClickOutOption);
        return () => {
            document.removeEventListener('click', handleClickOutOption);
        };
    }, [activeClick, handleSetActive]);

    return (
        <div
            ref={inputQ}
            onClick={() => handleSetActive(name)}
            className="px-2 py-4 lg:p-4 cursor-pointer z-49 text-gray-500 text-xs relative border border-gray-400 flex justify-between items-center gap-6"
        >
            <span className="capitalize">{name}</span>
            <IoIosArrowDown size={14} />
            {activeClick === name && (
                <div
                    onClick={e => e.stopPropagation()}
                    className="absolute top-[calc(100%+4px)] left-0 w-fit p-4 bg-white border min-w-[150px] z-50"
                >
                    {type === 'checkbox' && name === 'category' && (
                        <div>
                            <div className="flex flex-col gap-3 mt-4">
                                {categories?.map(el => (
                                    <div key={el._id} className="flex items-center gap-4">
                                        <input
                                            id={el.title}
                                            type="checkbox"
                                            value={el.title.toLowerCase()}
                                            name={el.title}
                                            className="w-4 h-4 focus:ring-blue-500"
                                            onChange={handleSelect}
                                            checked={selected === el.title.toLowerCase()}
                                        />
                                        <label
                                            className="capitalize text-gray-700"
                                            htmlFor={el.title}
                                        >
                                            {el.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {type === 'checkbox' && name === 'brand' && (
                        <div>
                            <div className="flex flex-col gap-3 mt-4">
                                {categories
                                    .find(
                                        el =>
                                            el.title.toLowerCase() === category.toLocaleLowerCase()
                                    )
                                    ?.brand?.map(el => (
                                        <div key={el} className="flex items-center gap-4">
                                            <input
                                                id={el}
                                                type="checkbox"
                                                value={el.toLowerCase()}
                                                name={el}
                                                className="w-4 h-4 focus:ring-blue-500"
                                                onChange={handleSelectBrand}
                                                checked={brand === el.toLowerCase()}
                                            />
                                            <label
                                                className="capitalize text-gray-700"
                                                htmlFor={el}
                                            >
                                                {el}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {type === 'input' && (
                        <div onClick={e => e.stopPropagation()}>
                            <div className="p-4 flex items-center justify-between gap-8 border-b">
                                <span className="whitespace-nowrap">
                                    {`The highest price is ${Number(
                                        bestPrice
                                    ).toLocaleString()} VND`}
                                </span>
                                <span
                                    onClick={() => {
                                        setPrice({ from: '', to: '' });
                                        handleSetActive(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex items-center p-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="from">From</label>
                                    <input
                                        id="from"
                                        className="w-[120px] h-[40px] px-2 outline-none bg-gray-100"
                                        type="number"
                                        value={price.from}
                                        onChange={e =>
                                            setPrice(prev => ({ ...prev, from: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="to">To</label>
                                    <input
                                        id="to"
                                        className="w-[120px] h-[40px] px-2 outline-none bg-gray-100"
                                        type="number"
                                        value={price.to}
                                        onChange={e =>
                                            setPrice(prev => ({ ...prev, to: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchItem;
