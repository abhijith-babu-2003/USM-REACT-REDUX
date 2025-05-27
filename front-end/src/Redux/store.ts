import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../Redux/Slices/userSlice';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import adminReducer from '../Redux/Slices/adminSlice'

const persistConfig={
    key :'auth',
    storage
}
const adminPersistConfig={
    key:"admin",
    storage
}

const persistAuthReducer = persistReducer(persistConfig,authReducer);
const persistAdminReducer = persistReducer(adminPersistConfig,adminReducer);
export const store = configureStore({
    reducer:{
        auth:persistAuthReducer, 
        admin:persistAdminReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }),
})

export const persistor  =persistStore(store)

export type RootState =ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
