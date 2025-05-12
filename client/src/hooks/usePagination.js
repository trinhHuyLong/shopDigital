import { useMemo } from 'react';
import { generateRange } from '../utils/helper';

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const pageSize = 10;
        const paginationCount = Math.ceil(totalProductCount / pageSize);
        const totalPaginationItem = siblingCount + 5; // 2 on each side + current page + 2 at the end
        if (paginationCount <= totalPaginationItem) {
            return generateRange(1, paginationCount);
        }
        const isShowLeft = currentPage - siblingCount > 2;
        const isShowRight = currentPage + siblingCount < paginationCount - 2;
        if (isShowLeft && !isShowRight) {
            const rightCount = paginationCount - 4;
            const rightRange = generateRange(rightCount, paginationCount);
            return [1, '...', ...rightRange];
        }
        if (!isShowLeft && isShowRight) {
            const leftRange = generateRange(1, 5);
            return [...leftRange, '...', paginationCount];
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1);
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount);
        if (isShowLeft && isShowRight) {
            const middleRange = generateRange(siblingLeft, siblingRight);
            return [1, '...', ...middleRange, '...', paginationCount];
        }
    }, [totalProductCount, currentPage, siblingCount]);
    return paginationArray;
};

export default usePagination;
