import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiThMenu } from 'react-icons/ti';
import { FaStar } from 'react-icons/fa6';

import { apiDealDaily } from '../apis/product';
import { formatMoney } from '../utils/helper';
import { CountDown } from '../components/index';

const DealDaily = () => {
    const navigate = useNavigate();
    const [dealdaily, setDealDaily] = useState(null);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(10);

    const fetchDealDaily = async () => {
        const response = await apiDealDaily();
        if (response?.success) {
            setDealDaily(response?.product?.dealdaily);
            setHour(response?.product?.hour);
            setMinute(response?.product?.minutes);
            setSecond(response?.product?.second);
        }
    };

    const handleClick = () => {
        navigate(`/${dealdaily?.category?.toLowerCase()}/${dealdaily._id}/${dealdaily.title}`);
    };

    useEffect(() => {
        fetchDealDaily();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (second > 0) {
                setSecond(second - 1);
            } else if (minute > 0) {
                setSecond(59);
                setMinute(minute - 1);
            } else if (hour > 0) {
                setMinute(59);
                setSecond(59);
                setHour(hour - 1);
            } else {
                fetchDealDaily();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [hour, minute, second]);

    return (
        <div onClick={handleClick} className="border flex-auto">
            <div className="flex items-center justify-center p-4 w-full">
                <span className="flex-1 flex justify-center">
                    <FaStar color="#DD1111" size={20} />
                </span>
                <span className="flex-8 font-semibold text-gray-700 text-[20px] text-center">
                    DEAL DAILY
                </span>
                <span className="flex-1"></span>
            </div>
            <div className="flex flex-col items-center px-4 gap-2 pt-8 w-full">
                <img
                    src={
                        dealdaily?.thumb
                            ? dealdaily.thumb
                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt7ocNuUgQqYYlmgHTEZIhx5aXBPfybSqneA&s'
                    }
                    alt={dealdaily?.title}
                    className="w-full object-contain"
                />
                <span className="line-clamp-1">{dealdaily?.title}</span>
                <span>{`${formatMoney(dealdaily?.price)} VND`}</span>
            </div>
            <div className="px-4 mt-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <CountDown unit={'Hour'} number={hour} />
                    <CountDown unit={'Minute'} number={minute} />
                    <CountDown unit={'Second'} number={second} />
                </div>
                <button className="flex gap-2 items-center justify-center py-2 w-full bg-main hover:bg-gray-800 text-white font-medium">
                    <TiThMenu size={20} color="white" />
                    <span>Options</span>
                </button>
            </div>
        </div>
    );
};

export default DealDaily;
