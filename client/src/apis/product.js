import axios from '../axios'

export const apiGetProducts = async (params) => axios({
    method: 'GET',
    url: '/product',
    params
})