import axios from '../axios';

export const apiCreateCategory = data =>
    axios({
        method: 'POST',
        url: '/productcategory/',
        data,
    });
export const apiDeleteCategory = id =>
    axios({
        method: 'DELETE',
        url: '/productcategory/' + id,
    });

export const apiUpdateCategory = (data, id) =>
    axios({
        method: 'PUT',
        url: '/productcategory/' + id,
        data,
    });
