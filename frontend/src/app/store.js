import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "../features/todo/todoSlice";
import themSlice from '../features/them/themSlice';
import userSlice from "../features/users/userSlice";
import AuthSlice from "../features/authy/AuthSlice";

export const store = configureStore({
    reducer:{
        todos:todoSlice,
        them:themSlice,
        users:userSlice,
        user:AuthSlice
    }
})