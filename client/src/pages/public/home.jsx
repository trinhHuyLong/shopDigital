import React from 'react';

import { Sidebar, Banner, BestSeller} from '../../components'

function Home() {
    return (
    <>
    <div className='w-main flex'>
        <div className='flex flex-col gap-5 w-[20%] flex-auto'>
            <Sidebar/>
            <span>
                Deal daily
            </span>
        </div>
        <div className='flex flex-col gap-5 pl-5 w-[80%] flex-auto'>
            <Banner/>
            <BestSeller/>
        </div>
    </div>
    <div className='w-full h-[500px] bg-gray-200 mt-5'>
        <span className='text-center'>Footer</span>
    </div>
    </>)
}

export default Home;