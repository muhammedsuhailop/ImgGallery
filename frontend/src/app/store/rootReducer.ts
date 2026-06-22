import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/authSlice";
import { imageReducer } from "@/features/images/store/imageSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  images: imageReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
