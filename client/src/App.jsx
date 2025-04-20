import React,{useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Home,Public,Login,Products,DetailProd,Blogs,FAQ,Service,FinalRegister,ResetPassword } from './pages/public'
import path from './utils/path';
import {getCategories} from './redux/app/asyncAction';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className='min-h-screen font-main'>
      <ToastContainer/>
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.DETAIL_PROD} element={<DetailProd />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.OUR_SERVICES} element={<Service />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.RESETPASSWORD} element={<ResetPassword />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FINALREGISTER} element={<FinalRegister />} />
      </Routes>

    </div>
  );
}

export default App;
