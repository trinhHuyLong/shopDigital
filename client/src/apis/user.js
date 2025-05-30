import axios from '../axios';

export const apiRegister = data =>
    axios({
        url: 'user/register',
        method: 'post',
        data,
    });

export const apiFinalRegister = token =>
    axios({
        url: 'user/finalregister/' + token,
        method: 'put',
    });

export const apiLogin = data =>
    axios({
        url: 'user/login',
        method: 'post',
        data,
    });

export const apiForgotPassword = data =>
    axios({
        url: 'user/forgot',
        method: 'post',
        data,
    });

export const apiCheckTokenResetPassword = data =>
    axios({
        url: 'user/checkToken',
        method: 'put',
        data,
    });

export const apiResetPassword = data =>
    axios({
        url: 'user/resetpassword',
        method: 'put',
        data,
    });

export const apiGetCurrent = () =>
    axios({
        url: 'user/current',
        method: 'get',
    });

export const apiGetAllUsers = params =>
    axios({
        url: 'user/',
        method: 'get',
        params,
    });

export const apiUpdateUser = (data, uid) =>
    axios({
        url: 'user/' + uid,
        method: 'put',
        data,
    });

export const apiDeleteUser = uid =>
    axios({
        url: 'user/' + uid,
        method: 'delete',
    });

export const apiUpdateCurrent = data =>
    axios({
        url: 'user/update',
        method: 'put',
        data,
    });

export const apiUpdateCart = data =>
    axios({
        url: 'user/updatecart',
        method: 'put',
        data,
    });
export const apiRemoveCart = pid =>
    axios({
        url: 'user/remove-cart/' + pid,
        method: 'delete',
    });
