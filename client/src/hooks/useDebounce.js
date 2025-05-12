import { useEffect, useState } from 'react';

const useDebounce = (value, ms) => {
    const [debounce, setDebounce] = useState('');
    useEffect(() => {
        const ids = setTimeout(() => {
            setDebounce(value);
        }, ms);

        return () => {
            clearTimeout(ids);
        };
    }, [value, ms]);

    return debounce;
};

export default useDebounce;
