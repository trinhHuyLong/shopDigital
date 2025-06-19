import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
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
    const handlePagination = item => {
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
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };
    return (
        <button
            onClick={() =>
                handlePagination(
                    item == 'left'
                        ? +params.get('page') - 1
                        : item === 'right'
                        ? +params.get('page') + 1
                        : item
                )
            }
            className={clsx(
                'w-8 h-8 mx-1 flex items-center justify-center border',
                'hover:bg-gray-300 hover:border-orange-400 cursor-pointer',
                +params.get('page') === +item && 'bg-gray-300 border-orange-400'
            )}
        >
            {item !== 'left' && item !== 'right' && item}
            {item === 'left' && <FaArrowLeft />}
            {item === 'right' && <FaArrowRight />}
        </button>
    );
};

export default Pagitem;
