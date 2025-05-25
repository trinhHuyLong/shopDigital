import React from 'react';
import usePagination from '../hooks/usePagination';

import Pagitem from './Pagitem';

const Pagination = ({ totalCount, page }) => {
    const pagination = usePagination(totalCount, page);
    return (
        <div className="flex w-auto items-center">
            {pagination?.map((item, index) => {
                return <Pagitem key={index} item={item} />;
            })}
        </div>
    );
};

export default Pagination;
