import { NavLink } from 'react-router-dom';

import { createSlug } from '../utils/helper';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { categories } = useSelector(state => state.app);

    return (
        <div className="hidden lg:flex flex-col border">
            {categories?.map(el => (
                <NavLink
                    key={el._id}
                    to={createSlug(el.title)}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm'
                            : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
                    }
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;
