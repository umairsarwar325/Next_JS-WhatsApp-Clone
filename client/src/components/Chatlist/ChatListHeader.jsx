import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { setAllContactsPage } from "@/store/slices/authSlice";

function ChatListHeader() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleAllContactsPage = () => {
    dispatch(setAllContactsPage());
  };

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
          onClick={handleAllContactsPage}
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
