import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis';

export const getCategories = createAsyncThunk(
    'app/categories',
    async (data, { rejectWithValue }) => { // Sửa rejectWithValues thành rejectWithValue
        try {
            const response = await apis.apiGetCategories();
            if (!response.success) {
                return rejectWithValue(response); // Sử dụng rejectWithValue
            }
            return response.prodCategory;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
        }
    }
);