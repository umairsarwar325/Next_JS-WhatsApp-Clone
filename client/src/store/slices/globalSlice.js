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
    videoCall: undefined,
    voiceCall: undefined,
    incomingVideoCall: undefined,
    incomingVoiceCall: undefined,
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
    setExitChat: (state, action) => {
      state.currentChatUser = undefined;
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

    // Actions for Voice and vidoe call
    setVoiceCall: (state, action) => {
      state.voiceCall = action.payload;
    },
    setVideoCall: (state, action) => {
      state.videoCall = action.payload;
    },
    setIncomingVoiceCall: (state, action) => {
      state.incomingVoiceCall = action.payload;
    },
    setIncomingVideoCall: (state, action) => {
      state.incomingVideoCall = action.payload;
    },
    endCall: (state) => {
      state.voiceCall = undefined;
      state.videoCall = undefined;
      state.incomingVoiceCall = undefined;
      state.incomingVideoCall = undefined;
    },
  },
});
export const {
  setUserInfo,
  setNewUser,
  clearUser,
  setAllContactsPage,
  setCurrentChatUser,
  setExitChat,
  setMessages,
  setSocket,
  addMessage,
  setMessageSearch,
  setUserContacts,
  setOnlineUsers,
  setSearchedContacts,
  // For vidoe call
  setVoiceCall,
  setVideoCall,
  setIncomingVoiceCall,
  setIncomingVideoCall,
  endCall,
} = globalSlice.actions;
export default globalSlice.reducer;
