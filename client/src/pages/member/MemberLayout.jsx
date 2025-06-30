import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { MemberSideBar } from '../../components';
import path from '../../utils/path';

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);
    if (!isLoggedIn || !current) {
        return <Navigate to={`/${path.LOGIN}`} />;
    }
    return (
        <div className="flex w-full bg-white min-h-screen">
            <div className="hidden lg:block w-[327px] flex-none fixed top-0 bottom-0">
                <MemberSideBar />
            </div>
            <div className="w-[327px] hidden lg:block"></div>
            <div className="flex-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MemberLayout;
