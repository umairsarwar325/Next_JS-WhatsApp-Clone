import React from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";

function ChatList() {
  return (
    <div className="w-full h-full bg-panel-header-background z-20">
      <>
        <ChatListHeader />
        <SearchBar />
        <List />
      </>
    </div>
  );
}

export default ChatList;
