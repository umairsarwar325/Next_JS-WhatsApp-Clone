import { createSlice } from "@reduxjs/toolkit";
const globalSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    newUser: false,
    contactsPage: false,
    currentChatUser: null,
    messages: [],
    socket: undefined,
    messageSearch: false,
    userContacts: [],
    onlineUsers: [],
    filteredContacts: [],
    // Voice And Video Call states
    
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
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      console.log("ACTION>PAYLOAD: ", action.payload);
      state.messages = [...state.messages, action.payload];
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setMessageSearch: (state) => {
      state.messageSearch = !state.messageSearch;
    },
    setUserContacts: (state, action) => {
      state.userContacts = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSearchedContacts: (state, action) => {
      state.filteredContacts = state.userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});
export const {
  setUserInfo,
  setNewUser,
  clearUser,
  setAllContactsPage,
  setCurrentChatUser,
  setMessages,
  setSocket,
  addMessage,
  setMessageSearch,
  setUserContacts,
  setOnlineUsers,
  setSearchedContacts,
} = globalSlice.actions;
export default globalSlice.reducer;
