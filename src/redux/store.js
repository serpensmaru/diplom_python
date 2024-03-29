import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import fileReducer from "./slices/fileSlice";
import adminReducer from "./slices/adminSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    admin: adminReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
