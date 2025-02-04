import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatUser,
  setAllContactsPage,
} from "@/store/slices/authSlice";

function ChatLIstItem({ data, isContactPage = false }) {
  const { currentChatUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleContactClick = () => {
    // if (currentChatUser?.id === data?.id) {
    dispatch(setCurrentChatUser(data));
    dispatch(setAllContactsPage());
    // }
  };
  return (
    <div
      onClick={handleContactClick}
      className={`flex items-center cursor-pointer hover:bg-background-default-hover p-2 w-full min-h-16 rounded-xl transition-all duration-200`}
    >
      <div className="min-w-fit px-3 flex items-center h-full">
        <Avatar type={"sm"} image={data?.profilePicture} />
      </div>
      <div className="flex flex-col min-h-full border-b border-conversation-border w-full py-1">
        <span className="text-white">{data?.name}</span>
        <div className="flex items-center justify-between">
          <span className="text-secondary line-clamp-1 text-sm">
            {data?.about || "\u00A0"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
