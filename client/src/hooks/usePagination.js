import { useMemo } from 'react';

import { generateRange } from '../utils/helper';

const usePagination = (totalProductCount, currentPage, siblingCount = 2) => {
    const paginationArray = useMemo(() => {
        const pageSize = 12;
        const paginationCount = Math.ceil(totalProductCount / pageSize);
        const totalPaginationItem = 2 * siblingCount + 2;
        if (paginationCount <= totalPaginationItem) {
            let range = generateRange(1, paginationCount);
            if (currentPage != 1) range = ['left', ...range];
            if (currentPage != paginationCount) range = [...range, 'right'];
            return range;
        }
        const isShowLeft = +currentPage - siblingCount > 1;
        const isShowRight = +currentPage + siblingCount > paginationCount - 2;

        const siblingLeft = Math.max(+currentPage - siblingCount, 1);
        const siblingRight = Math.min(+currentPage + siblingCount, paginationCount);
        if (!isShowLeft) {
            const leftRange = generateRange(1, 4);
            if (currentPage != 1) return ['left', ...leftRange, '...', 'right'];
            return [...leftRange, '...', 'right'];
        }
        if (isShowLeft) {
            if (isShowRight) {
                console.log(1);
                const middleRange = generateRange(siblingLeft, siblingRight);
                if (currentPage == paginationCount) return ['left', 1, , ...middleRange];
                return ['left', 1, '...', ...middleRange, 'right'];
            }
            const middleRange = generateRange(siblingLeft, siblingRight);
            if (currentPage == paginationCount) return ['left', 1, '...', ...middleRange, '...'];
            return ['left', 1, '...', ...middleRange, '...', 'right'];
        }
    }, [totalProductCount, currentPage, siblingCount]);

    return paginationArray;
};

export default usePagination;
