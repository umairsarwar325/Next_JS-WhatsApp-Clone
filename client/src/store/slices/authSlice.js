import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    newUser: false,
    contactsPage: false,
    currentChatUser: null,
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
    setCurrentChatUser: (state, action) => {
      state.currentChatUser = action.payload;
    },
  },
});
export const {
  setUserInfo,
  setNewUser,
  clearUser,
  setAllContactsPage,
  setCurrentChatUser,
} = authSlice.actions;
export default authSlice.reducer;
