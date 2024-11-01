import { configureStore } from "@reduxjs/toolkit";
import AS from '../redux/slices/authSlice'
export const store = configureStore({
  reducer: {
      auth : AS,
  }
})