import axios from '../axios';

export const apiCreateOder = () =>
    axios({
        method: 'POST',
        url: '/order/create',
    });

export const apiGetOder = () =>
    axios({
        method: 'GET',
        url: '/order/',
    });

export const apiGetOders = query =>
    axios({
        method: 'GET',
        url: '/order/admin',
        params: query,
    });

export const apiUpdateStatus = (id, status) =>
    axios({
        method: 'PUT',
        url: '/order/status/' + id,
        data: { status },
    });

export const apiGetOderInMonth = query =>
    axios({
        method: 'GET',
        url: '/order/orderinmonth/',
        params: query,
    });
