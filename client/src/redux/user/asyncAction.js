import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCurrent = createAsyncThunk('user/current', async (data, { rejectWithValue }) => {
    // Sửa rejectWithValues thành rejectWithValue
    try {
        const response = await apis.apiGetCurrent();
        if (!response.success) {
            return rejectWithValue(response); // Sử dụng rejectWithValue
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Something went wrong' });
    }
});
