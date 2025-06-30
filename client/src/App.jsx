import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from 'react-toastify';
import { Modal, Cart } from './components';
import 'react-toastify/dist/ReactToastify.css';

import {
    Home,
    Public,
    Login,
    Products,
    DetailProd,
    Blogs,
    FAQ,
    Service,
    FinalRegister,
    ResetPassword,
} from './pages/public';
import {
    AdminLayout,
    CreateProduct,
    DashBoard,
    ManageOrder,
    ManageUser,
    ManageProduct,
    ManageCategory,
    CreateCategory,
} from './pages/private';
import { Persional, MemberLayout, History, MyCart, WishList, DetailCart } from './pages/member';
import path from './utils/path';
import { getCategories } from './redux/app/asyncAction';
import { showCart } from './redux/app/appSlice';

function App() {
    const { isShowModal, modalChildren, isShowCart } = useSelector(state => state.app);
    const [isClosing, setIsClosing] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    return (
        <div className="font-main relative">
            {isShowCart && (
                <div
                    onClick={() => {
                        setIsClosing(true);
                        setTimeout(() => {
                            dispatch(showCart());
                            setIsClosing(false);
                        }, 500);
                    }}
                    className="absolute inset-0 bg-transparent z-50 flex justify-end"
                >
                    <Cart isClosing={isClosing} setIsClosing={setIsClosing} />
                </div>
            )}
            {isShowModal && <Modal>{modalChildren}</Modal>}
            <ToastContainer
                position="top-right" // hoặc "bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="custom-toast"
                toastClassName="custom-toast-inner"
            />
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.DETAIL_PROD} element={<DetailProd />} />
                    <Route path={path.BLOGS} element={<Blogs />} />
                    <Route path={path.OUR_SERVICES} element={<Service />} />
                    <Route path={path.FAQ} element={<FAQ />} />
                    <Route path={path.RESETPASSWORD} element={<ResetPassword />} />
                    <Route path={path.PRODUCTS} element={<Products />} />
                    <Route path={path.CATEGORY} element={<Products />} />
                    <Route path={path.DETAIL_CART} element={<DetailCart />} />
                    <Route path={path.ALL} element={<Home />} />
                </Route>
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
                    <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />
                    <Route path={path.DASHBOARD} element={<DashBoard />} />
                    <Route path={path.MANAGE_ORDERS} element={<ManageOrder />} />
                    <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
                    <Route path={path.MANAGE_USERS} element={<ManageUser />} />
                    <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
                </Route>
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSIONAL} element={<Persional />} />
                    <Route path={path.MY_CART} element={<DetailCart />} />
                    <Route path={path.HISTORY} element={<History />} />
                    <Route path={path.WISHLIST} element={<WishList />} />
                </Route>
                <Route path={path.LOGIN} element={<Login />} />
                <Route path={path.FINALREGISTER} element={<FinalRegister />} />
            </Routes>
        </div>
    );
}

export default App;
