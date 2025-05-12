import React, { useEffect } from 'react';
import {
    useSearchParams,
    useNavigate,
    useParams,
    createSearchParams,
    useLocation,
} from 'react-router-dom';
import clsx from 'clsx';

const Pagitem = ({ item }) => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();
    const handlePagination = () => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of params) queries[i[0]] = i[1];
        if (Number(item)) {
            queries.page = item;
        }
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
    };
    return (
        <button
            onClick={handlePagination}
            className={clsx(
                'w-10 h-10 flex items-center justify-center ',
                Number(item) && 'hover:rounded-full hover:bg-gray-300 cursor-pointer',
                +params.get('page') === +item && 'bg-gray-300 rounded-full',
                !params.get('page') && item === 1 && 'bg-gray-300 rounded-full'
            )}
            disabled={!Number(item)}
        >
            {item}
        </button>
    );
};

export default Pagitem;
