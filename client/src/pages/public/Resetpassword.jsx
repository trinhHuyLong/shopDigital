import { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

import { apiResetPassword } from "../../apis/user"

const ResetPassword = () => {
    const {token} = useParams()
    const [password,setPassword] = useState('')
    const handleResetPassword = async() => {
        const response = await apiResetPassword({password,token})
        if(response.success) {
            toast.success(response.message,{theme:"colored"})
        }else {
            console.log(response)
            toast.info(response.message,{theme:"colored"})
        }
    }
    return (
        <div className="animate-slide-right absolute top-0 right-0 left-0 bottom-0 bg-white z-50 flex flex-col py-8 items-center">
            <div className="flex flex-col gap-4">
                <label htmlFor="email">Enter your password</label>
                <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
                />
                <div className="flex justify-end mt-4 gap-4">
                    <button className="text-gray-100 bg-main px-4 py-2 rounded-lg hover:opacity-90 hover:cursor-pointer" onClick={handleResetPassword}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword