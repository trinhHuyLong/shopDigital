import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { Breadcrumbs, SearchItem, SelectElement, Pagination } from '../../components/index.js';
import { apiGetProducts } from '../../apis/product.js';
import { useCallback, useEffect, useState } from 'react';

import { Product } from '../../components/index.js';
import { sorts } from '../../utils/constants.jsx';

const Products = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [params] = useSearchParams();
    const [sort, setSort] = useState('-createdAt');
    const [products, setProducts] = useState(null);
    const [active, setActive] = useState(null);

    const fetchProductByCategory = async queries => {
        const response = await apiGetProducts(queries);
        setProducts(response);
    };

    const handleSetActive = name => {
        if (active === name) setActive(null);
        else setActive(name);
    };

    const changeSort = useCallback(
        value => {
            setSort(value);
        },
        [sort]
    );

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of params) queries[i[0]] = i[1];
        if (category) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ ...queries, sort }).toString(),
            });
        } else {
            navigate({
                pathname: `/products`,
                search: createSearchParams({ ...queries, sort }).toString(),
            });
        }
    }, [sort]);

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of params) queries[i[0]] = i[1];
        let priceQuery = {};
        if (queries.from && queries.to) {
            queries.price = { gte: queries.from };
            priceQuery = {
                $and: [{ price: { gte: queries.from } }, { price: { lte: queries.to } }],
            };
            delete queries.from;
            delete queries.to;
        } else if (queries.from) {
            queries.price = { gte: queries.from };
            delete queries.from;
        } else if (queries.to) {
            queries.price = { lte: queries.to };
            delete queries.to;
        }
        if (!category) {
            fetchProductByCategory({ ...priceQuery, ...queries, limit: 12 });
        } else {
            fetchProductByCategory({ ...priceQuery, ...queries, category, limit: 12 });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [params, category]);

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{!category ? 'products' : category}</h3>
                    <Breadcrumbs category={!category ? 'products' : category} />
                </div>
            </div>
            <div className="border w-main p-4 flex justify-between mt-8 m-auto">
                <div className="w-4/5 flex-auto">
                    <span className="font-semibold text-sm">Filter By</span>
                    <div className="flex gap-4 mt-2">
                        <SearchItem
                            name="price"
                            activeClick={active}
                            handleSetActive={handleSetActive}
                            type="input"
                        />
                        <SearchItem
                            name="category"
                            activeClick={active}
                            handleSetActive={handleSetActive}
                        />
                        {category && (
                            <SearchItem
                                name="brand"
                                activeClick={active}
                                handleSetActive={handleSetActive}
                            />
                        )}
                    </div>
                </div>
                <div className="w-1/5 flex-auto">
                    <span className="font-semibold text-sm">Sort By</span>
                    <div className="w-full flex mt-2">
                        <SelectElement value={sort} options={sorts} changeValue={changeSort} />
                    </div>
                </div>
            </div>
            <div className="my-8 w-main m-auto">
                <div className="grid grid-cols-4 gap-4 my-4 mx-[-10px]">
                    {products?.products?.map((item, index) => {
                        return <Product key={index} product={item} />;
                    })}
                </div>
            </div>
            {products?.counts / 10 > 1 && (
                <div className="w-main m-auto my-4 flex justify-center">
                    <Pagination totalCount={products?.counts} page={params.get('page')} />
                </div>
            )}
        </div>
    );
};

export default Products;
