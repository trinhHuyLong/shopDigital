import { NavLink } from 'react-router-dom';

import { navigation } from '../utils/constants.jsx';

const Navigation = () => {
    return (
        <div className="w-main h-[48px] py-2 border-y text-sm flex items-center">
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
    );
};

export default Navigation;
