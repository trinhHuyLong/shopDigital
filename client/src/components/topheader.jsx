import { Link } from "react-router-dom"
import path from "../utils/path"

const TopHeader = () => {
    return <div className="w-full h-[38px] bg-main flex justify-center items-center text-white text-xs">
        <div className="w-main flex justify-between">
            <div>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            </div>
            <div>
                <Link to={path.LOGIN} className="hover:text-gray-800">Sign in or create an account</Link>
            </div>
        </div>
    </div>
}

export default TopHeader