import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "@/store/slices/globalSlice";
const store = configureStore({
  reducer: {
    auth: globalSlice,
  },
});
export default store;
