import { useEffect, useState } from 'react';

import b1 from '../assets/b1.avif'
import b2 from '../assets/b2.avif'
import { CustomSlider} from '../components'

const tabs = [
    { id: 0, name: 'Best Seller' },
    { id: 1, name: 'New Arrivals' }
]


const BestSeller = () => {
    const [activeTab, setActiveTab] = useState(0);

    
    return <div>
        <div className='flex text-[20px] pb-4 border-b-2 border-main'>
            <div className='ml-[-32px]'>
                {tabs.map((tab) => (
                    <span
                        key={tab.id}
                        className={`font-semibold px-8 cursor-pointer uppercase border-r text-gray-400 ${activeTab === tab.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >{tab.name}</span>
                ))}
            </div>
        </div>
        <div className='mt-4 mx-[-10px]'>  
            <CustomSlider activeTab={activeTab} />
        </div>
        <div className='w-full flex gap-4 mt-4'>
            <img src={b1} alt="" className='flex-1 object-contain'/>
            <img src={b2} alt="" className='flex-1 object-contain'/>
        </div>
    </div>
}

export default BestSeller;