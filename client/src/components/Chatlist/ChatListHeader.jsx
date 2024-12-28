import React from "react";
import Avatar from "../common/Avatar";
import { useSelector } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";

function ChatListHeader() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar
          type="sm"
          image={userInfo?.profilePicture || "/default_avatar.png"}
        />
      </div>
      <div className="flex items-center gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
        />
      </div>
    </div>
  );
}

export default ChatListHeader;
