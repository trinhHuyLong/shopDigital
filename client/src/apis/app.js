import axios from "../axios";

export const apiGetCategories = () => axios({
    method: 'GET',
    url: '/productcategory/',
})