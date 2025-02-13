import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "@/store/slices/globalSlice";
const store = configureStore({
  reducer: {
    auth: globalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state check
    }),
});
export default store;
