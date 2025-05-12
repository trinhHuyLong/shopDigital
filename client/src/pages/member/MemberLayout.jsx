import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import path from '../../utils/path';

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);
    if (!isLoggedIn || !current) {
        return <Navigate to={`/${path.LOGIN}`} />;
    }
    return (
        <div>
            Member Layout
            <Outlet />
        </div>
    );
};

export default MemberLayout;
