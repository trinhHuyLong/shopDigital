import { MdLocalPhone } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

import path from "../utils/path";
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <div className="w-main flex justify-between w-main h-[110px] py-[35px]">
        <Link to={path.HOME}>
          <img src={logo} alt="logo" className="w-[234px] object-contain" />
        </Link>
        <div className='flex text-[13px]'>
          <div className="flex flex-col items-center px-6 border-r">
            <span className="flex gap-4 items-center">
              <MdLocalPhone color="red"/>
              <span className='font-semibold'>(+1800) 000 8808</span>
            </span>
            <span>
              Mon-Sat 9:00AM - 8:00PM
            </span>
          </div>
          <div className="flex flex-col items-center  px-6 border-r">
            <span className="flex gap-4 items-center">
              <TbMailFilled color="red"/>
              <span className='font-semibold'>support@tadathemes.com</span>
            </span>
            <span>
              Online Support 24/7
            </span>
          </div>
          <div className="flex  items-center justify-center gap-2 px-6 border-r">
            <GiShoppingBag color="red"/>
            <span>0 Item(s)</span>
          </div>
          <div className="flex  items-center justify-center px-6 border-r">
            <FaCircleUser size={24}/>
          </div>
        </div>
    </div>
  );
}

export default Header;