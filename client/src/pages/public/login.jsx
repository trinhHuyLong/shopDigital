import { useEffect, useState } from "react";
import swal from "sweetalert2"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"

import { apiRegister, apiLogin, apiForgotPassword } from '../../apis/user'
import path from '../../utils/path'
import {validate} from '../../utils/helper'
import { login } from '../../redux/user/userSlice'
import InputField from "../../components/inputfield"

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [invalidFields,setInvalideFiedls] = useState([])
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegister, setIsRegister] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        if (response.success) {
            toast.success(response.message, { theme: "colored" })
        } else {
            console.log(response)
            toast.info(response.message, { theme: "colored" })
        }
    }

    const resetData = () => {
        setEmail('')
        setName('')
        setPassword('')
    }

    useEffect(()=>{
        resetData()
    },[isRegister])

    const handleSubmit = async (e) => {
        const payload = isRegister?{name,email,password}:{email,password}

        const invalids = validate(payload,setInvalideFiedls)

        const data = { email, password }
        if(invalids == 0) {
            if (isRegister) {
                data.name = name
                const response = await apiRegister(data)
                if (response.success) {
                    swal.fire('Congratuation', response.mes, 'success')
                    setIsRegister(false)
                    resetData()
                } else {
                    swal.fire('Opps', response.message, 'error')
                }
    
                console.log(response)
            } else {
                const response = await apiLogin(data)
                if (response.success) {
                    dispatch(login({ isLoggedIn: true, token: response.accessToken, current: response.userData }))
                    navigate(`/${path.HOME}`)
                } else {
                    swal.fire('Opps', response.message, 'error')
                }
            }
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center relative">
            {
                isForgotPassword && (
                    <div className="animate-slide-right absolute top-0 right-0 left-0 bottom-0 bg-white z-50 flex flex-col py-8 items-center">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email">Enter your email</label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Vd: email@gmail.com"
                                className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
                            />
                            <div className="flex justify-end mt-4 gap-4">
                                <button className="text-gray-100 bg-main px-4 py-2 rounded-lg hover:opacity-90 hover:cursor-pointer" onClick={handleForgotPassword}>Submit</button>
                                <button className="text-gray-100 bg-blue-900 px-4 py-2 rounded-lg hover:opacity-90 hover:cursor-pointer" onClick={() => setIsForgotPassword(false)}>back</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20230718/pngtree-digital-retailing-illustration-laptop-keyboard-with-shopping-basket-and-e-commerce-image_3903657.jpg"
                className="w-full h-full object-cover"
            />
            <div className="min-w-[500px] rounded-md p-8 bg-white absolute flex flex-col shadow-md justify-center items-center ">
                <div className="flex flex-col justify-center items-center w-[400px]">
                    <h1 className="text-[30px] font-semibold text-main">{isRegister ? 'Register' : 'Login'}</h1>
                    <div className="w-full py-6">
                        {
                            isRegister && <div className="mb-3"><InputField
                                value={name}
                                setValue={setName}
                                nameKey={"Name"}
                                invalidFields={invalidFields}
                                setInvalideFiedls={setInvalideFiedls}
                            />
                            </div>
                        }
                        <div className="mb-3">
                            <InputField
                                value={email}
                                setValue={setEmail}
                                nameKey={"Email"}
                                invalidFields={invalidFields}
                                setInvalideFiedls={setInvalideFiedls}
                            />
                        </div>
                        <div className="mb-3">
                            <InputField
                                value={password}
                                setValue={setPassword}
                                nameKey={"Password"}
                                type="password"
                                invalidFields={invalidFields}
                                setInvalideFiedls={setInvalideFiedls}
                            />
                        </div>
                        <button onClick={handleSubmit} className="w-full bg-main text-white mt-5 py-2 rounded-md">{isRegister ? 'Create' : 'Login'}</button>
                    </div>
                    <div className="text-sm flex justify-between w-full">
                        {
                            !isRegister && <>
                                <span onClick={() => { setIsForgotPassword(true); setEmail('') }} className="text-main hover:underline hover:cursor-pointer">Forgot your account?</span>
                                <span onClick={() => setIsRegister(true)} className="text-main hover:underline hover:cursor-pointer">create an account</span>
                            </>
                        }
                        {
                            isRegister && <span onClick={() => setIsRegister(false)} className="w-full text-center text-main hover:underline hover:cursor-pointer">go login</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;