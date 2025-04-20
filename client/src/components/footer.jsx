import { IoMdMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone, FaLinkedinIn } from "react-icons/fa6";
import { BiLogoFacebook } from "react-icons/bi";
import { FaTwitter, FaPinterest, FaTelegramPlane } from "react-icons/fa";
import { AiOutlineGooglePlus } from "react-icons/ai";

const Footer = () => {
    return <div className="w-full flex flex-col">
        <div className="h-[103px] bg-main w-full flex items-center justify-center">
            <div className="w-main flex justify-between">
                <div className="flex flex-col">
                    <span className="text-[20px] text-gray-100 uppercase">Sign up to Newsletter</span>
                    <small className="text-[13px] text-gray-300">Subscribe now and receive weekly newsletter</small>
                </div>
                <div className="w-[43%] flex items-center">
                    <input
                        type="text"
                        className="w-full rounded-l-full px-4 py-3 bg-[#F04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:opacity-50"
                        placeholder="Email address"
                    />
                    <div className="bg-[#F04646] rounded-r-full w-[50px] h-full flex justify-center items-center">
                        <IoMdMail size={18} color="white" />
                    </div>
                </div>
            </div>
        </div>
        <div className="h-[407px] bg-[#191919] w-full pt-10 text-gray-200">
            <div className="flex justify-center">
                <div className="w-main flex border-b-[1px] border-gray-500 mb-10 h-[215px]">
                    <div className="flex-2 text-[13px]">
                        <h3 className="font-semibold mb-[20px] text-[16px] font-medium border-l-2 border-main pl-[15px] uppercase">About us</h3>
                        <div className="mb-3 flex items-center">
                            <FaLocationDot size={14} />
                            <span className="mx-2">Address: </span>
                            <span className="opacity-70">474 Ontario St Toronto, ON M4X 1M7 Canada</span>
                        </div>
                        <div className="mb-3 flex items-center">
                            <FaPhone size={14} />
                            <span className="mx-2">Phone: </span>
                            <span className="opacity-70">(+1234)56789xxx</span>
                        </div>
                        <div className="mb-3 flex items-center">
                            <IoMdMail size={14} />
                            <span className="mx-2">Mail: </span>
                            <span className="opacity-70">tadathemes@gmail.com</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <BiLogoFacebook size={24} />
                            </span>
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <FaTwitter size={18} />
                            </span>
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <FaPinterest size={18} />
                            </span>
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <FaLinkedinIn size={18} />
                            </span>
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <AiOutlineGooglePlus size={24} />
                            </span>
                            <span className="w-[40px] rounded-[3px] h-[40px] flex justify-center items-center bg-[#ffffff1a]">
                                <FaTelegramPlane size={18} />
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 text-[13px]">
                        <h3 className="font-semibold mb-[20px] text-[16px] mb-4 font-medium border-l-2 border-main pl-[15px] uppercase">Information</h3>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Typography
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Gallery
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Store Location
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Today's Deals
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Contact
                        </div>
                    </div>
                    <div className="flex-1 text-[13px]">
                        <h3 className="font-semibold mb-[20px] text-[16px] mb-4 font-medium border-l-2 border-main pl-[15px] uppercase">Who we are</h3>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Help
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Free Shipping
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            FAQs
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Return & Exchange
                        </div>
                        <div className="mb-3 opacity-70 hover:opacity-100">
                            Testimonials
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-[20px] text-[16px] mb-4 font-medium border-l-2 border-main pl-[15px] uppercase">#DigitalWorldStore</h3>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-main">
                    <h3 className="font-semibold mb-[20px] text-[16px] mb-4 font-medium border-l-2 border-main pl-[15px] uppercase">Product Tags</h3>
                </div>
            </div>
        </div>
    </div>
}

export default Footer