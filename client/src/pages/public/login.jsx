import { useEffect, useState } from 'react';
import swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import {
    apiRegister,
    apiLogin,
    apiForgotPassword,
    apiFinalRegister,
    apiCheckTokenResetPassword,
    apiResetPassword,
} from '../../apis/user';
import path from '../../utils/path';
import { Loading } from '../../components';
import { validate } from '../../utils/helper';
import { login } from '../../redux/user/userSlice';
import InputField from '../../components/inputfield';
import { showModal } from '../../redux/app/appSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [invalidFields, setInvalideFiedls] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirm, setConfirm] = useState('');
    const [token, setToken] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isVeryfiEmail, setIsVeryfiEmail] = useState(false);
    const [isVeryfiNewPass, setIsVeryfiNewPass] = useState(false);
    const [isCreateNewPass, setIsCreateNewPass] = useState(false);

    const resetData = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirm('');
    };

    useEffect(() => {
        resetData();
    }, [isRegister]);

    const handleSubmit = async e => {
        const payload = isRegister ? { name, email, password, confirm } : { email, password };

        let invalids = validate(payload, setInvalideFiedls);

        if (isRegister && confirm !== password) {
            invalids++;
            setInvalideFiedls(prev => [
                ...prev,
                { name: 'confirm', mes: 'Confirm password incorrect' },
            ]);
        }

        const data = { email, password };
        if (invalids == 0) {
            if (isRegister) {
                data.name = name;
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
                const response = await apiRegister(data);
                dispatch(showModal({ isShowModal: false, modalChildren: null }));
                if (response.success) {
                    setIsVeryfiEmail(true);
                } else {
                    swal.fire('Opps', response.message, 'error');
                }
            } else {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
                const response = await apiLogin(data);
                dispatch(showModal({ isShowModal: false, modalChildren: null }));
                if (response.success) {
                    dispatch(
                        login({
                            isLoggedIn: true,
                            token: response.accessToken,
                            current: response.userData,
                        })
                    );
                    navigate(`/${path.HOME}`);
                } else {
                    swal.fire('Opps', response.message, 'error');
                }
            }
        }
    };

    const finalRegister = async () => {
        const response = await apiFinalRegister(token);
        if (response.success) {
            swal.fire('Congratuation', response.response, 'success');
            setIsRegister(false);
            resetData();
        } else swal.fire('Opps', response.response, 'error');
        setIsVeryfiEmail(false);
        setToken('');
    };

    const handleForgotPassword = async () => {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await apiForgotPassword({ email });
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
            setIsVeryfiNewPass(true);
        } else {
            swal.fire('Opps', response.message, 'error');
        }
    };

    const finalForgotPass = async () => {
        const response = await apiCheckTokenResetPassword({ token, email });
        if (response.success) {
            toast.success('valid token, please enter new password');
            setIsCreateNewPass(true);
        } else swal.fire('Opps', response.response, 'error');
        setIsVeryfiNewPass(false);
        setToken('');
    };

    const handleCreatePassword = async () => {
        const response = await apiResetPassword({ email, password });
        if (response.success) {
            toast.success('Change password success');
            setIsCreateNewPass(false);
            setIsForgotPassword(false);
            resetData();
        } else swal.fire('Opps', response.response, 'error');
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center relative">
            {isVeryfiEmail && (
                <div className="animate-slide-right absolute top-0 right-0 left-0 bottom-0 bg-transparent z-50 justify-center flex flex-col py-8 items-center">
                    <div className="bg-white w-[500px] rounded-md p-8">
                        <h3>
                            We send a code to your mail. Please check your mail and enter your code.
                        </h3>
                        <input
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            className="p-2 border rounded-md outline-none"
                        />
                        <button
                            onClick={finalRegister}
                            className="px-4 py-2 bg-blue-500 font-semibold text-gray-100 rounded-md ml-4"
                        >
                            Submitt
                        </button>
                    </div>
                </div>
            )}
            {isVeryfiNewPass && (
                <div className="animate-slide-right absolute top-0 right-0 left-0 bottom-0 bg-transparent z-50 justify-center flex flex-col py-8 items-center">
                    <div className="bg-white w-[500px] rounded-md p-8">
                        <h3>
                            We send a code to your mail. Please check your mail and enter your code.
                        </h3>
                        <input
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            className="p-2 border rounded-md outline-none mt-4 w-full"
                        />
                        <div className="py-4 flex justify-end">
                            <button
                                onClick={finalForgotPass}
                                className="px-4 py-2 bg-main font-semibold text-gray-100 rounded-md ml-4 cursor-pointer hover:opacity-80"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setIsVeryfiNewPass(false);
                                }}
                                className="px-4 py-2 bg-blue-500 font-semibold text-gray-100 rounded-md ml-4 cursor-pointer hover:opacity-80"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isForgotPassword && !isCreateNewPass && (
                <div className="min-w-[500px] rounded-md p-8 bg-white absolute flex flex-col shadow-md justify-center items-center ">
                    <div className="flex flex-col justify-center items-center w-[400px]">
                        <h1 className="text-[30px] font-semibold text-main">Reset password</h1>

                        <div className="w-full py-6">
                            <h4>Enter your email of your account:</h4>
                            <div className="my-3">
                                <InputField
                                    value={email}
                                    setValue={setEmail}
                                    nameKey={'Email'}
                                    invalidFields={invalidFields}
                                    setInvalideFiedls={setInvalideFiedls}
                                    placeholder="Vd: abc@gmail.com"
                                />
                            </div>
                            <div className="flex justify-end gap-5">
                                <button
                                    onClick={handleForgotPassword}
                                    className="w-[20%] bg-main cursor-pointer hover:opacity-80 text-white mt-5 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        resetData();
                                        setInvalideFiedls([]);
                                    }}
                                    className="w-[20%] bg-blue-600 cursor-pointer hover:opacity-80  text-white mt-5 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isForgotPassword && isCreateNewPass && (
                <div className="min-w-[500px] rounded-md p-8 bg-white absolute flex flex-col shadow-md justify-center items-center ">
                    <div className="flex flex-col justify-center items-center w-[400px]">
                        <h1 className="text-[30px] font-semibold text-main">Reset password</h1>

                        <div className="w-full py-6">
                            <h4>Enter your new password of your account:</h4>
                            <p>{email}</p>
                            <div className="my-3">
                                <InputField
                                    value={password}
                                    setValue={setPassword}
                                    nameKey={'Password'}
                                    invalidFields={invalidFields}
                                    setInvalideFiedls={setInvalideFiedls}
                                />
                            </div>
                            <div className="mb-3">
                                <InputField
                                    value={confirm}
                                    setValue={setConfirm}
                                    nameKey={'Confirm password'}
                                    invalidFields={invalidFields}
                                    setInvalideFiedls={setInvalideFiedls}
                                    type="password"
                                />
                            </div>
                            <div className="flex justify-end gap-5">
                                <button
                                    onClick={handleCreatePassword}
                                    className="w-[20%] bg-main cursor-pointer hover:opacity-80 text-white mt-5 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20230718/pngtree-digital-retailing-illustration-laptop-keyboard-with-shopping-basket-and-e-commerce-image_3903657.jpg"
                className="w-full h-full object-cover"
            />
            {!isForgotPassword && (
                <div className="min-w-[500px] rounded-md p-8 bg-white absolute flex flex-col shadow-md justify-center items-center ">
                    <div className="flex flex-col justify-center items-center w-[400px]">
                        <h1 className="text-[30px] font-semibold text-main">
                            {isRegister ? 'Register' : 'Login'}
                        </h1>
                        <div className="w-full py-6">
                            {isRegister && (
                                <div className="mb-3">
                                    <InputField
                                        value={name}
                                        setValue={setName}
                                        nameKey={'Name'}
                                        invalidFields={invalidFields}
                                        setInvalideFiedls={setInvalideFiedls}
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <InputField
                                    value={email}
                                    setValue={setEmail}
                                    nameKey={'Email'}
                                    invalidFields={invalidFields}
                                    setInvalideFiedls={setInvalideFiedls}
                                />
                            </div>
                            <div className="mb-3">
                                <InputField
                                    value={password}
                                    setValue={setPassword}
                                    nameKey={'Password'}
                                    type="password"
                                    invalidFields={invalidFields}
                                    setInvalideFiedls={setInvalideFiedls}
                                />
                            </div>
                            {isRegister && (
                                <div className="mb-3">
                                    <InputField
                                        value={confirm}
                                        setValue={setConfirm}
                                        nameKey={'Confirm password'}
                                        invalidFields={invalidFields}
                                        setInvalideFiedls={setInvalideFiedls}
                                        type="password"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="w-full  cursor-pointer hover:opacity-80  bg-main text-white mt-5 py-2 rounded-md"
                            >
                                {isRegister ? 'Create' : 'Login'}
                            </button>
                        </div>
                        <div className="text-sm flex justify-between w-full">
                            {!isRegister && (
                                <>
                                    <span
                                        onClick={() => {
                                            setIsForgotPassword(true);
                                            setEmail('');
                                            setInvalideFiedls([]);
                                        }}
                                        className="text-main hover:underline hover:cursor-pointer"
                                    >
                                        Forgot your account?
                                    </span>
                                    <span
                                        onClick={() => {
                                            setIsRegister(true);
                                            resetData();
                                            setInvalideFiedls([]);
                                        }}
                                        className="text-main hover:underline hover:cursor-pointer"
                                    >
                                        Create an account.
                                    </span>
                                </>
                            )}
                            {isRegister && (
                                <div className="flex justify-around w-full">
                                    <Link
                                        className="text-center text-main text-sm hover:underline hover:cursor-pointer"
                                        to={`/${path.HOME}`}
                                    >
                                        Go home.
                                    </Link>
                                    <span
                                        onClick={() => {
                                            setIsRegister(false);
                                            resetData();
                                            setInvalideFiedls([]);
                                        }}
                                        className="text-center text-main hover:underline hover:cursor-pointer"
                                    >
                                        Go login.
                                    </span>
                                </div>
                            )}
                        </div>
                        {!isRegister && (
                            <Link
                                className="text-center text-main text-sm hover:underline hover:cursor-pointer"
                                to={`/${path.HOME}`}
                            >
                                Go home.
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
