import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import path from '../../utils/path';
import { SidebarAdmin } from '../../components';

const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);
    if (!isLoggedIn || current?.role !== 'admin') {
        return <Navigate to={`/${path.LOGIN}`} />;
    }
    return (
        <div className="flex w-full bg-gray-100 min-h-screen">
            <div className="flex-none fixed top-0 bottom-0">
                <SidebarAdmin />
            </div>
            <div className="w-64"></div>
            <div className="flex-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
