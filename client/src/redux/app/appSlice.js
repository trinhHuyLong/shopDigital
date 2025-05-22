import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncAction';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        errorMessage: null,
        isShowModal: false,
        isShowCart: false,
        modalChildren: null,
    },
    reducers: {
        logout: state => {
            state.isLoading = false;
        },
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal;
            state.modalChildren = action.payload.modalChildren;
        },

        showCart: (state, action) => {
            console.log(action);
            state.isShowCart = state.isShowCart ? false : true;
        },
    },
    extraReducers: builder => {
        builder.addCase(actions.getCategories.pending, state => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});

export const { logout, showModal, showCart } = appSlice.actions;
export default appSlice.reducer;
