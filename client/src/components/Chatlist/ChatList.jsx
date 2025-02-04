import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
import ContactsList from "./ContactsList";

function ChatList() {
  const { contactsPage } = useSelector((state) => state.auth);
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);

  return (
    <div className="w-full h-full bg-panel-header-background z-20">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && (
        <>
        <ContactsList/>
        </>
      )}
    </div>
  );
}

export default ChatList;
