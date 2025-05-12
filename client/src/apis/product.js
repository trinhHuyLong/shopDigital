import axios from '../axios';

export const apiGetProducts = async params =>
    axios({
        method: 'GET',
        url: '/product',
        params,
    });

export const apiGetProduct = async pid =>
    axios({
        method: 'GET',
        url: '/product/' + pid,
    });

export const apiRatingProduct = async data =>
    axios({
        method: 'PUT',
        url: '/product/rating',
        data,
    });

export const apiCreateProduct = async data =>
    axios({
        method: 'POST',
        url: '/product/',
        data,
    });
