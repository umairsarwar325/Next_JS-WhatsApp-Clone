import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    newUser: false,
    contactsPage: false,
  },
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
    setAllContactsPage: (state) => {
      state.contactsPage = !state.contactsPage;
    },
  },
});
export const { setUserInfo, setNewUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
