import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: { userInfo: {
    name:"Test"
  }, newUser: false },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.newUser = false;
    },
  },
});
export const { setUserInfo, setNewUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
