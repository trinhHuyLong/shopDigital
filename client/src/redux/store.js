import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import userSlice from './user/userSlice';
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const commonCofig = {
    key: 'shop/user',
    storage,
};

const userConfig = {
    ...commonCofig,
    whitelist: ['isLoggedIn', 'token', 'current'],
};

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: persistReducer(userConfig, userSlice),
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
