import { IoIosArrowDown } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import useDebounce from '../hooks/useDebounce';
import { colors } from '../utils/constants.jsx';
import path from '../utils/path';
import { apiGetProducts } from '../apis/product';

const SearchItem = ({ name, activeClick, handleSetActive, type = 'checkbox' }) => {
    const [params] = useSearchParams();
    const { category } = useParams();
    const navigate = useNavigate();
    const [selected, setselected] = useState([]);
    const [bestPrice, setBestPrice] = useState(null);
    const [price, setPrice] = useState({
        from: '',
        to: '',
    });
    const debounceFrom = useDebounce(price.from, 500);
    const debounceTo = useDebounce(price.to, 500);

    const handleSelect = e => {
        const alreadyEl = selected.find(el => el === e.target.value);
        if (alreadyEl) setselected(prev => prev.filter(el => el !== e.target.value));
        else setselected(prev => [...prev, e.target.value]);
        handleSetActive(null);
    };

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response.products[0]?.price);
        }
    };

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of params) queries[i[0]] = i[1];
        queries.page = 1;
        if (selected.length > 0) {
            queries.color = selected.join(',');
        } else {
            delete queries.color;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [selected]);

    useEffect(() => {
        fetchBestPriceProduct();
    }, []);

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of params) queries[i[0]] = i[1];
        if (Number(price.from) > 0) queries.from = price.from;
        if (Number(price.to) > 0) queries.to = price.to;
        queries.page = 1;
        if (!price.from) {
            delete queries.from;
        }
        if (!price.to) {
            delete queries.to;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [debounceFrom, debounceTo]);

    return (
        <div
            onClick={() => handleSetActive(name)}
            className="p-4 cursor-pointer z-50 text-gray-500 text-xs relative border border-gray-400 flex justify-between items-center gap-6"
        >
            <span className="capitalize">{name}</span>
            <IoIosArrowDown size={14} />
            {activeClick === name && (
                <div
                    onClick={e => e.stopPropagation()}
                    className="absolute top-[calc(100%+4px)] left-0 w-fit p-4 bg-white border min-w-[150px]"
                >
                    {type === 'checkbox' && (
                        <div>
                            <div className="p-4 flex items-center justify-between gap-8 border-b">
                                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                                <span
                                    onClick={() => {
                                        setselected([]);
                                        handleSetActive(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                {colors.map(el => {
                                    return (
                                        <div key={el} className="flex items-center gap-4">
                                            <input
                                                id={el}
                                                type="checkbox"
                                                value={el}
                                                name={el}
                                                className="w-4 h-4 focus:ring-blue-500"
                                                onChange={handleSelect}
                                                checked={selected?.some(sl => sl === el)}
                                            />
                                            <label
                                                className="capitalize text-gray-700"
                                                htmlFor={el}
                                            >
                                                {el}
                                            </label>
                                        </div>
                                    );
                                })}
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
