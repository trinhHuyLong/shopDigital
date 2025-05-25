import { NavLink, useNavigate } from 'react-router-dom';

import { navigation } from '../utils/constants.jsx';
import { useState } from 'react';
import useDebounce from '../hooks/useDebounce.js';
import { useEffect } from 'react';

const Navigation = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const query = useDebounce(search, 800);

    useEffect(() => {
        if (search) navigate(`/products?title=${search.trim()}`);
    }, [query]);

    return (
        <div className="w-main h-[48px] py-2 border-y text-sm flex items-center justify-between">
            <div>
                {navigation.map(item => {
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? 'pr-12 text-main' : 'pr-12 hover:text-main'
                            }
                        >
                            {item.value}
                        </NavLink>
                    );
                })}
            </div>
            <input
                value={search}
                placeholder="Search something"
                className="outline-none w-[20%] px-2"
                onChange={e => setSearch(e.target.value)}
            />
        </div>
    );
};

export default Navigation;
