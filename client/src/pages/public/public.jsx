import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header, Navigation, TopHeader,Footer} from '../../components'
function Public() {
  return (
    <div className='w-full flex flex-col items-center'>
      <TopHeader/>
      <Header/>
      <Navigation/>
      <div className='w-full flex justify-center'>
        <Outlet />
      </div>
      <Footer/>
    </div>
  );
}

export default Public;