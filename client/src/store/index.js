import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
export default store;
