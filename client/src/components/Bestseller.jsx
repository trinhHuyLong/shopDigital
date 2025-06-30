import { useState, memo } from 'react';

import b1 from '../assets/b1.avif';
import b2 from '../assets/b2.avif';
import { CustomSlider } from '.';

const tabs = [
    { id: 0, name: 'Best Seller' },
    { id: 1, name: 'New Arrivals' },
];

const BestSeller = ({ bestSeller, newProducts }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex text-[20px] pb-4 lg:border-b-2 lg:border-main">
                <div className="lg:ml-[-32px] w-full flex gap-3 flex-col lg:flex-row">
                    {tabs.map(tab => (
                        <span
                            key={tab.id}
                            className={`font-semibold lg:px-8 cursor-pointer uppercase border-b lg:border-r lg:border-b-0 text-gray-400 ${
                                activeTab === tab.id ? 'text-gray-900' : ''
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-4 mx-[-10px]">
                <CustomSlider
                    type={activeTab === 0 ? 'best' : 'new'}
                    products={activeTab === 0 ? bestSeller : newProducts}
                />
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-4 mt-4">
                <img src={b1} alt="" className="flex-1 object-contain" />
                <img src={b2} alt="" className="flex-1 object-contain" />
            </div>
        </div>
    );
};

export default memo(BestSeller);
